class GroupsMessagesController < ApplicationController
  before_action :verify_token
  before_action :set_group

  def create
    message = @group.messages.build(message_params)
    message.user = @current_user
    if message.save
      render json: message.as_json(include: {
        user: { only: [:id, :name, :avatar_url] }
      })
    else
      render json: message.errors, status: :unprocessable_entity
    end
  end

  private

  def message_params
    params.require(:groups_messages).permit(:content)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

end
