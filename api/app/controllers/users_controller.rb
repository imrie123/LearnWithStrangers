class UsersController < ApplicationController
  before_action :verify_token

  def create

    @response = FirebaseService::SignUp.new(user_params[:email], user_params[:password]).call
    if @response["idToken"]
      @user = User.new(user_params)
      if @user.save
        render json: { token: @response["idToken"], id: @user.id, name: @user.name, email: @user.email, birthday: @user.birthday, custom_id: @user.custom_id }, status: :created
      else
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      @error = @response["error"]["message"]
      render json: { error: @error }, status: :unauthorized
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
        if @user.present?
          render "me", formats: :json, handlers: :jbuilder, status: :ok
        else
          render json: { error: 'User not found' }, status: :not_found
        end
      else
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    else
      render json: { error: 'Token missing' }, status: :unauthorized
    end
  end

  def update
    @current_user.update(update_params)
    if @current_user.save
      render "update", formats: :json, handlers: :jbuilder, status: :ok
    else
      @error = "Update Error"
      render "error", status: :unprocessable_entity
    end
  end

  def avatar
    @current_user.update(update_params)
    avatar_url = @current_user.avatar.attached? ? url_for(@current_user.avatar) : nil
    @avatar_url = avatar_url
    if @current_user.save
      render "avatar", formats: :json, handlers: :jbuilder, status: :ok
    else
      render json: { error: 'Update Error: Email not found' }, status: :unprocessable_entity
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

    if query.blank?
      render json: { error: 'Query parameter is missing' }, status: :not_found and return
    end

    case criteria
    when 'name'
      @users = User.where('name LIKE ?', "%#{query}%")
    when 'custom_id'
      @users = User.where('custom_id LIKE ?', "%#{query}%")
    else
      render json: { error: 'Invalid search criteria' }, status: :bad_request and return
    end

    if @users.empty?
      render json: { error: 'No users found' }, status: :not_found
    else
      render :search, formats: :json, handlers: :jbuilder
    end
  end

  private

  def user_params
    params.require(:user).permit(:id, :email, :password, :name, :birthday, :spoken_language, :learning_language, :introduction, :avatar, :custom_id, :residence)
  end

  def update_params
    params.require(:user).permit(:name, :spoken_language, :learning_language, :introduction, :avatar, :residence)
  end

end