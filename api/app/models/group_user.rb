class GroupUser < ApplicationRecord
  # 関連付け
  belongs_to :group
  belongs_to :user, foreign_key: 'custom_id'
end
