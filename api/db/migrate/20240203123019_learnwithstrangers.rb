class Learnwithstrangers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email, default: "", null: false
      t.date :birthday
      t.string :image, default: "default.jpg", null: false
      t.string :spoken_language, default: "English", null: false
      t.string :learning_language, default: "Japanese", null: false
      t.string :residence, default: "Japan", null: false
      t.string :introduction, default: "Hello,I'm new here!"
      t.string :user_id
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end
  end
end
