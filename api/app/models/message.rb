class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :context, presence: true

  def formatted_created_at
    created_at.to_date
  end
end
