class GroupsController < ApplicationController
  before_action :verify_token

  def create
    @group = Group.new(group_params)
    @group.owner = @current_user

    if @group.save
      add_user_to_group
      render json: @group
    else
      render json: @group.errors, status: :unprocessable_entity
    end
  end

  def index
    @groups = @current_user.groups
    render json: @groups
  end

  def show
    @group = Group.find_by(id: params[:id])
    if @group
      render json: format_group_data(@group), status: :ok
    else
      render json: { error: 'Group not found' }, status: :not_found
    end
  end

  private

  def group_params
    params.require(:group).permit(:name, :introduction, :group_image, users: [])
  end

  def add_user_to_group
    params[:users].each do |custom_id|
      user = User.find_by(custom_id: custom_id)
      @group.users << user if user.present?
    end
  end

  def format_group_data(group)
    {
      id: group.id,
      name: group.name,
      introduction: group.introduction,
      group_image: group.group_image,
      owner: format_user_data(group.owner),
      users: group.users.map { |user| format_user_data(user) },
      messages: group.messages.map { |message| format_message_data(message) }
    }
  end

  def format_user_data(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      image: user.avatar_url,
      spoken_language: user.spoken_language,
      learning_language: user.learning_language,
      residence: user.residence,
      introduction: user.introduction,
      custom_id: user.custom_id
    }
  end

  def format_message_data(message)
    {
      id: message.id,
      content: message.content,
      created_at: message.created_at.strftime('%Y-%m-%d'),
      user: format_user_data(message.user)
    }
  end
end
