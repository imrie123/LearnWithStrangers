class MessagesController < ApplicationController
  before_action :verify_token
  before_action :set_room

  def create

    @message = @room.messages.build(message_params)
    @message.user = @current_user

    if @message.save
      render 'create', formats: :json, handlers: :jbuilder, status: :created
    else
      # エラーを出力する
      Rails.logger.error(@message.errors.full_messages.to_sentence)
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  private

  def set_room
    @room = Room.find(params[:room_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Room not found' }, status: :not_found
  end

  def message_params
    params.require(:message).permit(:content)
  end
end