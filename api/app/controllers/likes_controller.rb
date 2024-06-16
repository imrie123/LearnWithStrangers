class LikesController < ApplicationController
  before_action :verify_token
  before_action :set_post, only: [:create, :destroy, :toggle_like]

  def create
    @like = @current_user.likes.new(post_id: @post.id)
    if @like.save
      render "create", formats: :json, handlers: :jbuilder, status: :created
    else
      render json: { error: "Post not found" }, status: :not_found
    end
  end

  def destroy
    @like = @current_user.likes.find_by(post_id: @post.id)
    if @like
      @like.destroy
      head :no_content
    else
      render json: { error: "Like not found" }, status: :not_found
    end
  end

  def liked_posts
    user = User.find_by(custom_id: params[:custom_id])
    liked_posts = user.posts.joins(:likes)

    if liked_posts.empty?
      render json: { error: 'Liked posts not found' }, status: :not_found
    else
      render json: liked_posts, status: :ok
    end
  end

  def toggle_like
    like = @post.likes.find_by(user: @current_user)
    if like
      like.destroy
      render json: { liked: false }
    else
      @post.likes.create(user: @current_user)
      render json: { liked: true }
    end
  end

  def index
    @likes = @current_user.likes
    if @likes
      render "index", formats: :json, handlers: :jbuilder, status: :ok
    else
      render json: { error: "Likes not found" }, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end
end
