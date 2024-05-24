class UsersController < ApplicationController
  before_action :verify_token, only: [:search]

  def create
    @response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call
    if @response["idToken"]
      @user = User.create!(user_params)
      render json: { token: @response["idToken"], id: @user.id, name: @user.name, email: @user.email, birthday: @user.birthday, custom_id: @user.custom_id }, status: :created
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
    head :ok
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
          @current_user = User.find_by(email: email)
          @user_posts = @user.posts
          @liked_posts = @user.liked_posts
          @following_user_posts = @user.following_user_posts
          @all_posts = @user_posts + @following_user_posts
          @following_users = @user.followings
          @followers = @user.followers
          @user_rooms = @user.rooms.includes(:entries, :messages)
          render "me", formats: :json, handlers: :jbuilder, status: :ok
        else
          render "error", status: :unauthorized
        end
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
    @random_users = User.all
    render "random", formats: :json, handlers: :jbuilder, status: :ok
  end

  def show
    @user = User.find(params[:id])
    @current_entry = Entry.find_by(user_id: @current_user.id)
    @another_entry = Entry.find_by(user_id: @user.id)
    unless @user.id === @current_user.id
      @current_entry.each do |current|
        @another_entry.each do |another|
          if current.room_id === another.room_id
            @is_room = true
            @room_id = current.room_id
          end
        end
      end
      unless @is_room
        @room = Room.new
        @entry = Entry.new
      end
    end
  end

  def search
    query = params[:query]
    criteria = params[:criteria]
    case criteria
    when "name"
      @users = User.where('name LIKE ?', "%#{query}%")
    when "residence"
      @users = User.where('residence LIKE ?', "%#{query}%")
    when "learning_language"
      @users = User.where('learning_language LIKE ?', "%#{query}%")
    when "spoken_language"
      @users = User.where('spoken_language LIKE ?', "%#{query}%")
    else
      @users = User.where('custom_id LIKE ?', "%#{query}%")
    end

    if @users.present?
      render 'search', formats: :json, handlers: :jbuilder, status: :ok
    else
      render json: { error: 'not found' }, status: :not_found
    end
  end

  private

  def user_params
    params.require(:user).permit(:id, :email, :password, :name, :birthday, :spoken_language, :learning_language, :introduction, :avatar, :custom_id)
  end
end