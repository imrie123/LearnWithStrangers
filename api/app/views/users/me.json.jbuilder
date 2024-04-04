json.user do
  json.id @user.id
  json.name @user.name
  json.email @user.email
  json.birthday @user.birthday
  json.custom_id @user.custom_id
  json.image @user.image
  json.spoken_language @user.spoken_language
  json.learning_language @user.learning_language
  json.residence @user.residence
  json.introduction @user.introduction
  json.created_at @user.created_at
  json.updated_at @user.updated_at
  json.avatar_url url_for(@user.avatar) if @user.avatar.attached?
  json.followed_by_current_user @current_user.followed_by?(@user) if @user.present?

  json.user_posts @user_posts do |post|
    json.id post.id
    json.user_id post.user_id
    json.name post.user.name
    json.content post.content
    json.image_url post.image_url
    json.created_at post.created_at
    json.updated_at post.updated_at
    json.likes_count post.likes.count
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
  end

  json.following_user_posts @following_user_posts do |post|
    json.id post.id
    json.user_id post.user_id
    json.content post.content
    json.image_url post.image_url
    json.created_at post.created_at
    json.updated_at post.updated_at
    json.likes_count post.likes.count
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
    json.custom_id post.user.custom_id
  end
end