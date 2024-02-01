class UsersController < ApplicationController
  def create

    response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call
    if response["idToken"]

      user = User.create!(email: user_params[:email], name: user_params[:name], birthday: user_params[:birthday])

      render json: { token: response["idToken"], name: user.name

      }


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

  def update
    token = params[:token]

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        user = User.find_by(email: email)
        user.update!(user_params)
        render json: { success: 'Updated user', user: user.as_json },methods: :avatar_url


      else
        render json: { error: 'Update Error' }, status: :unprocessable_entity
      end

    end

  end
  def index
    render json: avatar.all,methods: :avatar_url
  end
  def avatar
    token = params[:token]
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]


      if email
        user = User.find_by(email: email)
        user.update!(user_params[:avatar])


            if avatar.present?
              user.avatar.attach(avatar_url)
              render json: { success: 'Updated profile image', user: user.as_json },methods: :avatar_url
            else
              render json: { error: 'Update Error' }, status: :unprocessable_entity
            end
          end

      end
    end




  private

  def user_params
    params.require(:user).permit(:email, :password, :name, :birthday, :spoken_language, :learning_language, :introduction,:avatar)
  end
end