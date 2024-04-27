json.array! @relationships do |relationship|
  json.extract! relationship, :id, :follower_id, :followed_id
  json.relationships_count relationship.relationships_count
end
