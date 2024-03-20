class RemoveLikesCountFromPosts < ActiveRecord::Migration[7.1]
  def up
    remove_column :posts, :likes_count
  end

  def down
    add_column :posts, :likes_count, :integer
  end
end
