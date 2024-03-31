class MessageController < ApplicationController
  before_action :verify_token
  before_action :find_room

  def create
    message = @room.messages.build(message_params)
    message.user = @current_user
    if message.save
      render json: message.as_json(include: {
        user: { only: [:id, :name, :avatar_url] }
      }, methods: [:formatted_created_at])
    else
      render json: message.errors, status: :unprocessable_entity
    end
  end

  def index
    messages = @room.users.map do |user|
      user.messages.map do |message|
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
    end.flatten

    render json: messages
  end

  private
  def find_room
    @room = Room.find(params[:room_id])
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

  def message_params
    params.require(:message).permit(:context)
  end
end
