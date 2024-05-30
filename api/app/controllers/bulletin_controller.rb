class BulletinController < ApplicationController
  before_action :verify_token, only: [:create, :index, :show]

  def create
    @bulletin = @current_user.bulletins.new(bulletin_params)
    if @bulletin.save
      render json: @bulletin, status: :ok
    else
      render json: @bulletin.errors, status: :unprocessable_entity
    end
  end

  def index
    @bulletins = Bulletin.all
    render "index", formats: :json, handlers: :jbuilder, status: :ok
  end

  def show
    @bulletin = Bulletin.find(params[:id])
    render 'show', formats: :json, handlers: :jbuilder, status: :ok
  end

  private

  def bulletin_params
    params.require(:bulletin).permit(:content, :title)
  end

end
