class AddNameToRooms < ActiveRecord::Migration[7.1]
  def change
    add_column :rooms, :name, :string
  end
end
