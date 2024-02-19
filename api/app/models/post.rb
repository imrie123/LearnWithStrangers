class Post < ApplicationRecord
  belongs_to :user
  has_one_attached :image
  validates :content, presence: true

  def image_url
    if image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(image)
    else
      ActionController::Base.helpers.asset_path("default_image.png")
    end
  end

  end


