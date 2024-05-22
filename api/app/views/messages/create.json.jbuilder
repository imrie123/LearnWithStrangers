json.id @message.id
json.content @message.content
json.created_at @message.formatted_created_at
json.user do
  json.id @message.user.id
  json.name @message.user.name
  json.avatar_url url_for(@message.user.avatar) if @message.user.avatar.attached?
end