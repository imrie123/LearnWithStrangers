json.user do
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
end