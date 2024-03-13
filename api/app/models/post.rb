class Post < ApplicationRecord
  belongs_to :user
  has_one_attached :image
  validates :content, presence: true
  has_many :likes, counter_cache:true,dependent: :destroy


  def image_url
    if image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(image)
    else
      ActionController::Base.helpers.asset_path("default_image.png")
    end
  end

  def likes_count
    return likes.count
  end

  def liked_by?(user)
    likes.exists?(user_id: user.id)
  end
  def liked_by_id(user)
    like = likes.find_by(user_id: user.id)
    if like
      return like.id
    else
      return nil
    end
  end
end
