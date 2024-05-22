class Message < ApplicationRecord
  # 関連付け
  belongs_to :room
  belongs_to :user
  # バリデーション
  validates :content, presence: true

  # 作成日時を整形するメソッド
  def formatted_created_at
    created_at.to_date
  end
end
