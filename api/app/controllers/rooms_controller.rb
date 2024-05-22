class RoomsController < ApplicationController
  before_action :verify_token, only: [:create, :index]
  before_action :set_room, only: [:show]

  def create
    @user = User.find_by(custom_id: params[:custom_id])
    return render json: { error: 'User not found' }, status: :not_found unless @user
    existing_room = @current_user.common_room_with(@user)
    if existing_room
      render json: existing_room, status: :ok
    else
      create_new_room(@user)
    end
  end

  def index
    @rooms = @current_user.rooms
    render 'index', formats: :json, handlers: :jbuilder, status: :ok
  end

  def show
      render 'show', formats: :json, handlers: :jbuilder, status: :ok
  end

  private

  def create_new_room(user)
    room_name = "#{@current_user.name}と#{user.name} のチャットルーム"
    room = Room.new(name: room_name)

    if room.save
      if create_entries(room, user)
        render json: room, status: :created
      else
        room.destroy
        render json: { error: 'Entry creation failed' }, status: :unprocessable_entity
      end
    else
      render json: room.errors, status: :unprocessable_entity
    end
  end

  def create_entries(room, user)
    @current_entry = Entry.create(user_id: @current_user.id, room_id: room.id)
    @another_entry = Entry.create(user_id: user.id, room_id: room.id)
    @current_entry.persisted? && @another_entry.persisted?
  end

  def set_room
    @room = Room.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Room not found' }, status: :not_found
  end

  def room_params
    params.require(:room).permit(:name)
  end
end
