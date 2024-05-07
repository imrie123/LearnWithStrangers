class CreateGroupsMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :groups_messages do |t|
      t.references :group, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
