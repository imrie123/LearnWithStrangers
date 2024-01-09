


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
    user_id = decoded_token['user_id']
    cookies[:user_id] = { value: user_id,httponly: true, expires: 1.week.from_now, secure: true}


    render json: { success: 'Valid token', user_id: user_id}


    # ここでdecoded_tokenを使った処理

  rescue => e
      Rails.logger.error "JWT Verification Error: #{e.message}"
      render json: { error: 'Invalid token' }, status: :unauthorized
  end

  def cookie
    cookies[:user_id] = { value: response["firebase_uid"],httponly: true, expires: 1.week.from_now, secure: true}
  end


end
