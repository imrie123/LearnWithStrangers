json.posts @posts do |post|
  json.id post.user.id
  json.post_id post.id
  json.content post.content
  json.image post.image
  json.created_at post.created_at
  json.image_url post.image_url
  json.likes_count post.likes_count
  json.liked_by_current_user post.liked_by?(@current_user)
  json.avatar_url post.user.avatar_url
end