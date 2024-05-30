json.id @bulletin.id
json.title @bulletin.title
json.content @bulletin.content
json.created_at @bulletin.created_at
json.updated_at @bulletin.updated_at
json.user do
  json.id @bulletin.user.id
  json.name @bulletin.user.name
end
json.replies do
  json.array! @bulletin.replies do |reply|
    json.id reply.id
    json.content reply.content
    json.created_at reply.created_at
    json.updated_at reply.updated_at
    json.user do
      json.id reply.user.id
      json.name reply.user.name
      json.avatar reply.user.avatar_url
      json.created_at reply.user.created_at
      json.updated_at reply.user.updated_at
      json.custom_id reply.user.custom_id
    end
  end
end