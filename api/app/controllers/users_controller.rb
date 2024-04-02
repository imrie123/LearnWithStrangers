class UsersController < ApplicationController

  def create
    @response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call

    if @response["idToken"]
      if User.exists?(custom_id: user_params[:custom_id])
        @error = "Custom ID already exists"
        render "error", formats: :json, handlers: :jbuilder, status: :unauthorized
      else
        @user = User.create!(user_params)
        render json: { id: @user.id, name: @user.name, email: @user.email, birthday: @user.birthday, custom_id: @user.custom_id }, status: :created
      end
    else
      @error = @response["error"]["message"]
      render "error", formats: :json, handlers: :jbuilder, status: :unauthorized
    end
  end

  def sign_in
    @response = FirebaseService::SignIn.new(user_params[:email], user_params[:password]).call

    if @response["idToken"]
      @user = User.find_by(email: user_params[:email])
      render "sign_in", formats: :json, handlers: :jbuilder, status: :ok
    else
      @error = @response["error"]["message"]
      render "error", formats: :json, handlers: :jbuilder, status: :unauthorized
    end
  end

  def sign_out
    FirebaseService::SignOut.new(session[:token]).call
    render "sign_out", status: :ok
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  def show_room
    @user = User.find(params[:id])
    @current_user_entry = Entry.where(user_id: current_user.id)
    @user_entry = Entry.where(user_id: @user.id)
    if @user.id == @current_user.id
    else
      @current_user_entry.each do |cu|
        @user_entry.each do |u|
          if cu.room_id == u.room_id then
            @is_room = true
            @room_id = cu.room_id
          end
        end
      end
      unless @is_room
        @room = Room.new
        @entry = Entry.new
      end
    end

    render json: @room
  end

  def show_by_custom_id
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      @current_user = User.find_by(email: email)
    end
    @user = User.find_by(custom_id: params[:custom_id])
    if @user
      @posts = @user.posts
      render "show_by_custom_id", formats: :json, handlers: :jbuilder, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def me
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      if email
        @user = User.find_by(email: email)
        unless @user.present?
          @user = User.find_by(custom_id: params[:custom_id])
        end
        if @user.present?
          render "me", formats: :json, handlers: :jbuilder, status: :ok
        else
          @error = "User not found"
          render "error", status: :not_found
        end
      else
        @error = "Me Error"
        render "error", status: :unprocessable_entity
      end
    end
  end

  def update
    token = request.headers['Authorization']&.split(' ')&.last
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
    token = request.headers['Authorization']&.split(' ')&.last

    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @user = User.find_by(email: email)
        @user.update(avatar: params[:user][:avatar])
        avatar_url = @user.avatar.attached? ? url_for(@user.avatar) : nil

        @avatar_url = avatar_url

        render "avatar", formats: :json, handlers: :jbuilder, status: :ok
      else
        render json: { error: 'Update Error: Email not found' }, status: :unprocessable_entity
      end
    end
  end

  def random
    @random_users = User.all.sample(5)
    render "random", formats: :json, handlers: :jbuilder, status: :ok
  end

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      @current_user = User.find_by(email: email)

      raise "User not found" unless @current_user
    end
  end

  private

  def user_params
    params.require(:user).permit(:id, :email, :password, :name, :birthday, :spoken_language, :learning_language, :introduction, :avatar, :custom_id)
  end
end
