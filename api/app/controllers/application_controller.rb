class ApplicationController < ActionController::API
  include ActionController::Cookies
  require 'jwt'

  before_action :verify_token

  def current_user
    @current_user
  end

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @current_user = User.find_by(email: email)
        raise "User not found" unless @current_user
      end
    else
      @current_user = nil
    end
  end

  def verify_firebase_token(token)
    public_keys = FirebaseService::fetch_firebase_public_keys
    jwt_header = JWT.decode(token, nil, false)[1]
    kid = jwt_header['kid']
    public_key = OpenSSL::X509::Certificate.new(public_keys[kid]).public_key

    # トークンを検証
    JWT.decode(token, public_key, true, { algorithm: 'RS256' })
  rescue => e
    Rails.logger.error "JWT Verification Error: #{e.message}"
    render json: { error: 'Invalid token' }, status: :unauthorized
  end
end
