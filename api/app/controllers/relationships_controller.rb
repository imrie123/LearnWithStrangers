class RelationshipsController < ApplicationController
  before_action :verify_token, only: [:create, :destroy, :followings, :followers]

  def create
    @current_user.follow(User.find_by(custom_id: params[:custom_id]))
    @relationships = Relationship.all
    render "create", formats: :json, handlers: :jbuilder, status: :created
  end

  def destroy
    user = User.find_by(custom_id: params[:custom_id])
    @current_user.unfollow(user)
    render json: { status: 'ok' }
  end

  def followings
    user = User.find(params[:custom_id])
    @users = user.followings
  end

  def followers
    user = User.find(params[:custom_id])
    @users = user.followers
  end

end

