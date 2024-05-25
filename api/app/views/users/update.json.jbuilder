json.user do
  json.name @current_user.name
  json.email @current_user.email
  json.birthday @current_user.birthday
  json.image @current_user.image
  json.spoken_language @current_user.spoken_language
  json.learning_language @current_user.learning_language
  json.residence @current_user.residence
  json.introduction @current_user.introduction
  json.created_at @current_user.created_at
  json.updated_at @current_user.updated_at
  json.avatar_url url_for(@current_user.avatar) if @current_user.avatar.attached?
end