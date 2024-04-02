json.array! @relationships do |relationship|
  json.extract! relationship, :id, :follower_id, :followed_id
end
