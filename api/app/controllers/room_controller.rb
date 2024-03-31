class RoomController < ApplicationController
  before_action :verify_token

  def create
    user = User.find_by(custom_id: params[:custom_id])
    @room = Room.find_or_create_room(@current_user, user)
    render json: @room
  end

  def show
    @room = Room.find_by(id: params[:id])
    @messages = @room.messages.map do |message|
      {
        id: message.id,
        context: message.context,
        created_at: message.created_at.strftime("%Y-%m-%d"),
        user: {
          id: message.user.id,
          name: message.user.name,
          avatar_url: message.user.avatar_url
        }
      }
    end

    render json: { room: @room, messages: @messages }
  end

  def verify_token
    token = params[:token]
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      @current_user = User.find_by(email: email)

      raise "User not found" unless @current_user
    end
  end
end
