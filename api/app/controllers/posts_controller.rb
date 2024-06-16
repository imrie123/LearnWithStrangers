class PostsController < ApplicationController
  before_action :verify_token, only: [:create, :destroy, :index, :other_user_posts]
  skip_before_action :verify_token, only: [:show]

  def create
    unless @current_user
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end

    @post = @current_user.posts.build(post_params)
    if @post.save
      @post.image.attach(post_params[:image]) if post_params[:image].present?
      avatar_url = @current_user.avatar.attached? ? url_for(@current_user.avatar) : nil
      @avatar_url = avatar_url
      render json: {
        id: @post.user.id,
        post_id: @post.id,
        content: @post.content,
        image: @post.image,
        created_at: @post.created_at,
        image_url: @post.image_url
      }, status: :ok
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show_likes
    @post = Post.find_by(params[:id])
    if @post.present?
      @likes_count = @post.likes.count
      render "show_likes", formats: :json, handler: :jbuilder, status: :ok
    end
  end

  def index
    if @current_user.nil?
      render json: { error: 'Unauthorized' }, status: :unauthorized and return
    end
    @posts = @current_user.posts
    render "index", formats: :json, handlers: :jbuilder, status: :ok
  end

  def destroy
    if @current_user.nil?
      render json: { error: 'Unauthorized' }, status: :unauthorized and return
    end
    @post = @current_user.posts.find_by(id: params[:id])
    if @post
      @post.destroy
      render json: { message: 'Post deleted' }, status: :ok
    else
      render json: { error: 'Post not found' }, status: :not_found
    end
  end

  def other_user_posts
    @user = User.find_by(custom_id: params[:custom_id])
    if @user
      @posts = @user.posts
      render "other_user_posts", formats: :json, handlers: :jbuilder, status: :ok
    else
      render json: { error: "User not found" }, status: :not_found
    end
  end

  def show
    @post = Post.find(params[:id])
    render 'show', formats: :json, handlers: :jbuilder, status: :ok
  end

  private

  def post_params
    params.require(:post).permit(:content, :image)
  end

end
