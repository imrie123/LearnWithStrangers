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

  private

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

