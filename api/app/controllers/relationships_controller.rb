class RelationshipsController < ApplicationController
  before_action :verify_token, only: [:create, :destroy, :followings, :followers]

  def create
    user_to_follow = User.find_by(custom_id: params[:custom_id])

    if user_to_follow.nil?
      render json: { error: "User not found" }, status: :not_found
      return
    end

    if current_user.following?(user_to_follow)
      render json: { error: "Already following" }, status: :not_found
    else
      current_user.follow(user_to_follow)
      render json: { message: "Followed successfully" }, status: :created
    end
  end

  def destroy
    user_to_unfollow = User.find_by(custom_id: params[:custom_id])

    if user_to_unfollow.nil?
      render json: { error: "User not found" }, status: :not_found
      return
    end

    if current_user.following?(user_to_unfollow)
      current_user.unfollow(user_to_unfollow)
      render json: { message: "Unfollowed successfully" }, status: :ok
    else
      render json: { error: "Not following" }, status: :not_found
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

