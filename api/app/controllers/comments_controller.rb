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

  def destroy
    @comment = @current_user.comments.find_by(id: params[:id])
    if @comment.destroy
      head :no_content
    else
      render json: { error: "Comment not found" }, status: :not_found
    end
  end





  private
  def comment_params
    params.require(:comment).permit(:content, :post_id)
  end

  def verify_token
    token = request.headers['Authorization']&.split(' ')&.last
    if token.present?
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      @current_user = User.find_by(email: email)

      raise "User not found" unless @current_user
    end
    end
end
