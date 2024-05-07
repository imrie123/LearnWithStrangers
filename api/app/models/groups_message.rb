class GroupsMessage < ApplicationRecord
  # 関連付け
  belongs_to :group
  belongs_to :user
end
