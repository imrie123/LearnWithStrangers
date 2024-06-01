class RelationshipsController < ApplicationController
  before_action :verify_token, only: [:create, :destroy, :followings, :followers]

  def create
    user_to_follow = User.find_by(custom_id: params[:custom_id])
    if user_to_follow && !@current_user.following?(user_to_follow)
    @current_user.follow(user_to_follow)
    @relationships = Relationship.all
    render "create", formats: :json, handlers: :jbuilder, status: :created
    else
      render json: { error: 'Already following this user or user not found' }, status: :not_found
    end
  end

  def destroy
    user = User.find_by(custom_id: params[:custom_id])
    if user && @current_user.following?(user)
    @current_user.unfollow(user)
    render json: { status: 'ok' }
    else
      render json: { error: 'Not following this user or user not found' }, status: :not_found
    end
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

