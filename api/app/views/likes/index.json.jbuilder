json.likes @likes do |like|
  json.id like.id
  json.post do
    post = like.post
    json.extract! post, :id, :title, :content, :image, :created_at, :image_url, :likes_count
    json.comments post.comments.map { |comment| {user_name: comment.user.name, content: comment.content, avatar: comment.user.avatar_url}}
  end
end
