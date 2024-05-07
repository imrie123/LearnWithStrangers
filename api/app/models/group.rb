class Group < ApplicationRecord
  # 関連付け
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users,foreign_key: 'custom_id'
  has_many :groups_message, dependent: :destroy
  has_many :messages, class_name: 'GroupsMessage', foreign_key: 'group_id'

  # バリデーション
  validates :name, presence: true
  validates :introduction, presence: true

  # アクティブストレージの関連付け
  has_one_attached :group_image

  # グループのオーナー
  belongs_to :owner, class_name: "User"
  belongs_to :owner, class_name: "User"

  #誰がオーナーかを判定するメソッド
  def is_owned_by?(user)
    owner_id == user.id
  end
end
