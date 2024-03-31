class Room < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :user_rooms, dependent: :destroy
  has_many :users, through: :user_rooms

  def self.find_or_create_room(user1, user2)
    # メンバーの組み合わせで既存のルームを検索する
    existing_room = Room.joins(:users)
                        .where(users: { id: [user1.id, user2.id] })
                        .group(:id)
                        .having('COUNT(users.id) = 2')
                        .first

    if existing_room
      existing_room
    else
      room = Room.create(name: generate_room_name(user1, user2))
      UserRoom.create(user: user1, room: room)
      UserRoom.create(user: user2, room: room)
      room
    end
  end

  def self.generate_room_name(user1, user2)
    "#{user1.name}と#{user2.name}のチャットルーム"
  end
end
