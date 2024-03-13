class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
  validates :name, presence: true
  validates :custom_id, presence: true, uniqueness: true
  validates :birthday, presence: true, format: { with: /\d{4}-\d{2}-\d{2}/, message: "must be in the following format: yyyy-mm-dd" }

  has_one_attached :avatar
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post


  has_secure_password

  def avatar_url
    if avatar.attached?
      rails_blob_url(avatar)
    else
      ActionController::Base.helpers.asset_path("default_avatar.png")
    end
  end

  def self.random_users(number)
    order(Arel.sql('RAND()')).limit(number)
  end
end
