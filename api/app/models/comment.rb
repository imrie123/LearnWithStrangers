class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  def comments_count
    return comments.count
  end
end
