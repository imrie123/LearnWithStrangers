json.user do
  json.id @user.id
  json.name @user.name
  json.email @user.email
  json.birthday @user.birthday
  json.image @user.image
  json.spoken_language @user.spoken_language
  json.learning_language @user.learning_language
  json.residence @user.residence
  json.introduction @user.introduction
  json.created_at @user.created_at
  json.updated_at @user.updated_at
  json.avatar_url url_for(@user.avatar) if @user.avatar.attached?
end