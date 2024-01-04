class UsersController < ApplicationController
  def create
    response = Firebase::SignUp.new(user_params[:email], user_params[:password]).call
    if response["idToken"]
      user = User.create!(email: user_params[:email], name: user_params[:name], birthday: user_params[:birthday])
      render json: { token: response["idToken"], name: user.name }
    else
      render json: { error: response["error"]["message"] }, status: :bad_request
    end
  end

  def sign_in
    response = Firebase::SignIn.new(user_params[:email], user_params[:password]).call
    if response["idToken"]
      # 成功した場合、idTokenと他の必要な情報を返す
      render json: { token: response["idToken"] }
    else
      # 失敗した場合、エラーメッセージを返す
      render json: { error: response["error"]["message"] }, status: :unauthorized
    end
  end

  def sign_out
    Firebase::SignOut.new(session[:token]).call
    render json: { message: "Signed out successfully" }
  end
  private

  def user_params
    params.require(:user).permit(:email, :password, :name, :birthday)
  end
end