class CommentsController < ApplicationController
  before_action :verify_token

  def create
    @comment = @current_user.comments.build(comment_params)
    if @comment.save
      render json: @comment, status: :created
    else
      puts @comment.errors.full_messages
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content, :post_id)
  end

end
