


class ApplicationController < ActionController::API
  include ActionController::Cookies

  require 'jwt'

  def verify_firebase_token(token)
    public_keys = FirebaseService::fetch_firebase_public_keys
    # HeaderからキーIDを取得し、対応する公開鍵を見つけます
    header = JWT.decode(token, nil, false)[1]
    kid = header['kid']
    public_key = OpenSSL::X509::Certificate.new(public_keys[kid]).public_key
        # トークンを検証
    decoded_token = JWT.decode(token, public_key, true, { algorithm: 'RS256' })
    console.log(decoded_token)
    # ここでdecoded_tokenを使った処理
  rescue => e
      Rails.logger.error "JWT Verification Error: #{e.message}"
      render json: { error: 'Invalid token' }, status: :unauthorized
  end


end
