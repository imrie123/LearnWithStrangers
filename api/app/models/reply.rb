class Reply < ApplicationRecord
  belongs_to :user
  belongs_to :bulletin

  validates :content, presence: true
end
