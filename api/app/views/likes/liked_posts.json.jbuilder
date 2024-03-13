json.array! @liked_posts do |post|
  json.id post.id
  json.name post.user.name
  json.custom_id post.user.custom_id
  json.custom_id post.user.custom_id
  json.content post.content
  json.image post.image
  json.created_at post.created_at
  json.image_url post.image_url
  json.likes_count post.likes_count
  json.liked_by_current_user post.liked_by?(@current_user)
end
