json.posts @posts do |post|
  json.id post.user.id
  json.post_id post.id
  json.content post.content
  json.image post.image
  json.created_at post.created_at
  json.image_url post.image_url
end
