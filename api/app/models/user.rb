class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  # バリデーション
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
  validates :name, presence: true
  validates :custom_id, presence: true, uniqueness: true
  validates :birthday, presence: true, format: { with: /\d{4}-\d{2}-\d{2}/, message: "must be in the following format: yyyy-mm-dd" }

  # アクティブストレージの関連付け
  has_one_attached :avatar

  # 関連付け
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_posts, through: :likes, source: :post
  has_many :messages, dependent: :destroy
  has_many :relationships, class_name: "Relationship", foreign_key: "follower_id", dependent: :destroy
  has_many :reverse_of_relationships, class_name: "Relationship", foreign_key: "followed_id", dependent: :destroy
  has_many :followings, through: :relationships, source: :followed
  has_many :followers, through: :reverse_of_relationships, source: :follower

  # フォロー関連
  def follow(user)
    relationships.create(followed_id: user.id)
  end

  def unfollow(user)
    relationships.find_by(followed_id: user.id, follower_id: id).destroy
  end

  def followed_by?(user)
    relationships.find_by(follower_id: id, followed_id: user.id).present?
  end

  def following_user_posts
    followed_user_ids = self.followings.pluck(:id)
    followings_user_posts = Post.where(user_id: followed_user_ids)
    followings_user_posts.order(created_at: :desc)
  end

  # パスワードのハッシュ化
  has_secure_password

  # アバターURLの取得
  def avatar_url
    if avatar.attached?
      rails_blob_url(avatar)
    else
      ActionController::Base.helpers.asset_path("default_avatar.png")
    end
  end

  # ランダムなユーザーを取得
  def self.random_users
    all.order(Arel.sql('RAND()'))
  end
end
