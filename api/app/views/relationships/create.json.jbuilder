json.array! @relationships do |relationship|
  json.id relationship.id
  json.follower_id relationship.follower_id
  json.followed_id relationship.followed_id
  json.created_at relationship.created_at
  json.updated_at relationship.updated_at
  json.follower do
    json.id relationship.follower.id
    json.custom_id relationship.follower.custom_id
    json.name relationship.follower.name
    json.email relationship.follower.email
    json.created_at relationship.follower.created_at
    json.updated_at relationship.follower.updated_at
  end
end
