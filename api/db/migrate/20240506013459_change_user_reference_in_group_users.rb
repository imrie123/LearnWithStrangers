class ChangeUserReferenceInGroupUsers < ActiveRecord::Migration[7.1]
  def change
    rename_column :group_users, :user_id, :custom_id
  end
end
