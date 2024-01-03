require 'pry'
class UsersController < ApplicationController
  def create
    response = SignUp.new(user_params[:email], user_params[:password]).call
    if response["idToken"]
      user = User.create!(email: user_params[:email], name: user_params[:name], birthday: user_params[:birthday])
      render json: { token: response["idToken"], name: user.name }
    else
      render json: { error: response["error"]["message"] }, status: :bad_request
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :name, :birthday)
  end
end