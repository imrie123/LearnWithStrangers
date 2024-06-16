json.posts @posts do |post|
  json.id post.id
  json.user_id post.user.id
  json.content post.content
  json.image_url post.image_url
  json.created_at post.created_at
  json.avatar_url post.user.avatar_url
  json.likes_count post.likes.count
end