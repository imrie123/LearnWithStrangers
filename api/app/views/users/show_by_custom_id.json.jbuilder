json.user do
  # ユーザー情報
  json.id @user.id
  json.name @user.name
  json.custom_id @user.custom_id
  json.email @user.email
  json.birthday @user.birthday
  json.spoken_language @user.spoken_language
  json.learning_language @user.learning_language
  json.residence @user.residence
  json.introduction @user.introduction
  json.created_at @user.created_at
  json.updated_at @user.updated_at
  json.avatar_url url_for(@user.avatar) if @user.avatar.attached?
  json.followed_by_current_user @user.followed_by?(@current_user) if @current_user.present?
  # ユーザーの投稿情報
  json.posts @posts do |post|
    json.id post.id
    json.content post.content
    json.image_url post.image_url
    json.created_at post.created_at
    json.updated_at post.updated_at
    json.likes_count post.likes.count
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
    json.comments post.comments.map { |comment| { user_name: comment.user.name, content: comment.content, avatar: comment.user.avatar_url } }
  end
end