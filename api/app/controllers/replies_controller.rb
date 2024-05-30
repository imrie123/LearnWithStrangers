class RepliesController < ApplicationController
  before_action :verify_token, only: [:create]

  def create
    @bulletin = Bulletin.find(params[:bulletin_id])
    @reply = @bulletin.replies.new(reply_params)
    @reply.user_id = @current_user.id
    if @reply.save
      render json: @reply, status: :ok
    else
      render json: @reply.errors, status: :unprocessable_entity
    end
  end

  private

  def reply_params
    params.require(:reply).permit(:content, :bulletin_id)
  end

end
