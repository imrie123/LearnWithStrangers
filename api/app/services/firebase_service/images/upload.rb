class PostsController < ApplicationController
  def index
    render json; Post.all
  end

  def create
    post = Post.new(post_params)
    if post.save
      render json: post
    else
      render json: post.errors, status: 422
    end
  end

  private
  def post_params
    params.require(:post).permit(:title, :content)
  end
end