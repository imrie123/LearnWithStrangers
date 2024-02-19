class User < ApplicationRecord
  include Rails.application.routes.url_helpers
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :birthday, presence: true, format: { with: /\d{4}-\d{2}-\d{2}/, message: "must be in the following format: yyyy-mm-dd" }
  has_one_attached :avatar
  has_many :posts
  def avatar_url
    if avatar.attached?
      Rails.application.routes.url_helpers.rails_blob_url(avatar)
    else
      ActionController::Base.helpers.asset_path("default_avatar.png")
    end
  end

end