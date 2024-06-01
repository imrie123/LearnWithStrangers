class Relationship < ApplicationRecord
  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"

  validates :follower_id, presence: true, uniqueness: { scope: :followed_id }

  def relationships_count
    return relationships.count
  end
end
