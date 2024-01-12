class UsersController < ApplicationController
  def create
    response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call
    if response["idToken"]
      user = User.create!(email: user_params[:email], name: user_params[:name], birthday: user_params[:birthday])

      render json: { token: response["idToken"], name: user.name }
    else
      render json: { error: response["error"]["message"] }, status: :bad_request
    end
  end

  def sign_in
    response = FirebaseService::SignIn.new(user_params[:email], user_params[:password]).call

    if response["idToken"]
      render json: { token: response["idToken"] }
    else
      # 失敗した場合、エラーメッセージを返す
      render json: { error: response["error"]["message"] }, status: :unauthorized
    end
  end

  def sign_out
    FirebaseService::SignOut.new(session[:token]).call
    render json: { message: "Signed out successfully" }
  end

  def show
    # localStorageからトークンを取得
    token = params[:token] # リクエストパラメータからトークンを取得する例

    if token.present?
      # トークンを検証
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email

        user = User.find_by(email: email)

        if user
          render json: { success: 'Valid token', user: user.as_json }
        else

          render json: { error: 'Token missing' }, status: :unprocessable_entity
        end
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :name, :birthday)
  end
end