# app/views/likes/index.json.jbuilder

json.likes @likes do |like|
  json.id like.id
  json.post do
    json.id like.post.id
    json.title like.post.title
    json.content like.post.content
    json.image like.post.image
    json.created_at like.post.created_at
    json.image_url like.post.image_url
    json.likes_count like.post.likes_count
  end
end
