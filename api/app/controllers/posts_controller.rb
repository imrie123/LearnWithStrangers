class PostsController < ApplicationController

  def create
    token = params[:token] # リクエストパラメータからトークンを取得する例

    if token
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]
      if email

        @user = User.find_by(email: email)


        @post = @user.posts.build(post_params)





        if  @user.save

          @post.image.attach(post_params[:image]) if post_params[:image].present?
          avatar_url = @user.avatar.attached? ? url_for(@user.avatar) : nil

          @avatar_url = avatar_url

          render "create",  formats: :json, handlers: :jbuilder, status: :ok
        else
          render json: @post.errors, status: :unprocessable_entity
        end
      end
    end
  end

  def index
    token = params[:token]

    if token
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @user = User.find_by(email: email)
        @posts = @user.posts
        render "index",  formats: :json, handlers: :jbuilder, status: :ok
      else
        render json: { error: "Invalid email in token" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Token is missing" }, status: :unprocessable_entity
    end
  end

  def update
    token = params[:token]

    if token
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @user = User.find_by(email: email)
        @post = @user.posts.find_by(id: params[:id])

        if @post
          if @post.update(post_params)
            render "index", formats: :json, handlers: :jbuilder, status: :ok
          else
            render json: @post.errors, status: :unprocessable_entity
          end
        else
          render json: { error: "Post not found" }, status: :not_found
        end
      else
        render json: { error: "Invalid email in token" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Token is missing" }, status: :unprocessable_entity
    end
  end

  def destroy
    token = params[:token]

    if token
      decoded_token = verify_firebase_token(token)
      email = decoded_token[0]["email"]

      if email
        @user = User.find_by(email: email)
        @post = @user.posts.find_by(id: params[:id])

        if @post
          @post.destroy
          render json: { message: "Post deleted" }, status: :ok
        else
          render json: { error: "Post not found" }, status: :not_found
        end
      else
        render json: { error: "Invalid email in token" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Token is missing" }, status: :unprocessable_entity
    end
  end


  private


  def post_params
    params.require(:post).permit(:content, :image)
  end
end