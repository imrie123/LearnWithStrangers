class UsersController < ApplicationController
  def create

    @response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call

    if @response["idToken"]

      @user = User.create!(user_params)

      render "create", status: :created

    else
      @error = @response["error"]["message"]
      render "create", status: :bad_request
    end
  end

  def sign_in
    @response = FirebaseService::SignIn.new(user_params[:email], user_params[:password]).call
    @user = User.find_by(email: user_params[:email])

    if @response["idToken"]
      @user = User.find_by(email: user_params[:email])
      render "sign_in", formats: :json, handlers: :jbuilder, status: :ok

    else
      # 失敗した場合、エラーメッセージを返す
      @error = @response["error"]["message"]
      render "error", formats: :json, handlers: :jbuilder, status: :unauthorized
    end
  end

  def sign_out
    FirebaseService::SignOut.new(session[:token]).call
    render "sign_out", status: :ok
  end

  def show
    # localStorageからトークンを取得
    token = params[:token] # リクエストパラメータからトークンを取得する例

    if token.present?
      # トークンを検証
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email

        @user = User.find_by(email: email)

        if @user
          render "show", formats: :json, handlers: :jbuilder, status: :ok

        else

          render "error", status: :unprocessable_entity
        end
      end
    end
  end

  def me
    token = params[:token]

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @user = User.find_by(email: email)
        render "me", formats: :json, handlers: :jbuilder, status: :ok
      else
        @error = "Me Error"
        render "error", status: :unprocessable_entity
      end
    end
  end

  def update
    token = params[:token]

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email

        @user = User.find_by(email: email)
        @user.avatar.attach(params[:avatar])
        @user.update!(user_params)

        render "update", formats: :json, handlers: :jbuilder, status: :ok
      else
        @error = "Update Error"
        render "error", status: :unprocessable_entity
      end
    end
  end

  def index
    @users = User.all
    render "index", formats: :json, handlers: :jbuilder, status: :ok
  end

  def avatar
    token = params[:token]

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email

        @user = User.find_by(email: email)

        @user.update(avatar: params[:user][:avatar]) # user_params を使用して avatar を更新
        avatar_url = @user.avatar.attached? ? url_for(@user.avatar) : nil

        @avatar_url = avatar_url




        render "avatar", formats: :json, handlers: :jbuilder, status: :ok
      else
        render json: { error: 'Update Error: Email not found' }, status: :unprocessable_entity
      end
    end
  end

  private

  def user_params
    params.require(:user).permit(:id, :email, :password, :name, :birthday, :spoken_language, :learning_language, :introduction, :avatar)
  end
end