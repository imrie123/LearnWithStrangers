class UsersController < ApplicationController
  def create
    response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call
    if response["idToken"]
      user = User.create!(email: user_params[:email], name: user_params[:name], birthday: user_params[:birthday])

      cookies[:user_id] = { value: response["idToken"], httponly: true, expires: 1.week.from_now, secure: true }
      console.log("Cookie set: #{cookies[:user_id]}")

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

  private

  def user_params
    params.require(:user).permit(:email, :password, :name, :birthday, :user_id)
  end
end