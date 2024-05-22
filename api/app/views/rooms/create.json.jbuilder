json.room do
  json.id @room.id
  json.name @room.name
  json.created_at @room.created_at
  json.user_room @room.users do |user|
    json.id user.id
    json.name user.name
    json.custom_id user.custom_id
    json.email user.email
    json.birthday user.birthday
    json.spoken_language user.spoken_language
    json.learning_language user.learning_language
    json.residence user.residence
    json.introduction user.introduction
    json.created_at user.created_at
    json.updated_at user.updated_at
    json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end
  json.messages @room.messages do |message|
    json.id message.id
    json.content message.content
    json.created_at message.created_at
    json.user do
      json.id message.user.id
      json.name message.user.name
      json.avatar_url url_for(message.user.avatar) if message.user.avatar.attached?
    end
  end
end