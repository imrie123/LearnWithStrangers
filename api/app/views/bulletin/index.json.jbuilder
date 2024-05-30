json.array! @bulletins do |bulletin|
  json.id bulletin.id
  json.title bulletin.title
  json.content bulletin.content
  json.created_at bulletin.created_at
  json.updated_at bulletin.updated_at
  json.user do
    json.id bulletin.user.id
    json.name bulletin.user.name
    json.email bulletin.user.email
    json.avatar bulletin.user.avatar_url
    json.created_at bulletin.user.created_at
    json.updated_at bulletin.user.updated_at
    json.custom_id bulletin.user.custom_id
  end
end
