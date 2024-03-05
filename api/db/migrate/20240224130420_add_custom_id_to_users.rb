class AddCustomIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :custom_id, :string
    add_index :users, :custom_id, unique: true

  end
end
