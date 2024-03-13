class LikesController < ApplicationController
  before_action :verify_token, only: [:create, :destroy, :toggle_like, :index, :liked_posts]
  before_action :set_post, only: [:create, :destroy, :toggle_like]

  def create

    @like = @current_user.likes.new(post_id: @post.id)
    if @like.save
      render "create", formats: :json, handlers: :jbuilder, status: :created
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  def destroy

    @like = @current_user.likes.find_by(user_id: @current_user.id, post_id: @post.id)
    if @like
      @like.destroy
      head :no_content
    else
      render json: { error: "Like not found" }, status: :not_found
    end
  end

  def liked_posts

    @liked_posts = @current_user.liked_posts
    render "liked_posts", formats: :json, handlers: :jbuilder, status: :ok
  end

  def toggle_like
    like = Like.find_by(user_id: params[:user_id], post_id: params[:post_id])
    if like
      like.destroy
      render json: { liked: false }
    else
      Like.create(user_id: params[:user_id], post_id: params[:post_id])
      render json: { liked: true }
    end
  end

  def index
    @likes = @user.likes
    render "index", formats: :json, handlers: :jbuilder, status: :ok

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

  def set_post
    @post = Post.find(params[:post_id])
  end
end
