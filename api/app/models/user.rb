class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :birthday, presence: true, format: { with: /\d{4}-\d{2}-\d{2}/, message: "must be in the following format: yyyy-mm-dd" }

end