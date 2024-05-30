class Bulletin < ApplicationRecord
  belongs_to :user
  validates :content, presence: true
  has_many :replies, dependent: :destroy


end
