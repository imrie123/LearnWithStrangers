class User < ApplicationRecord
  include Rails.application.routes.url_helpers
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :birthday, presence: true, format: { with: /\d{4}-\d{2}-\d{2}/, message: "must be in the following format: yyyy-mm-dd" }
  has_one_attached :avatar
  def avatar_url
    if avatar.attached?
      url_for(avatar)
    else
      nil
    end
  end

end