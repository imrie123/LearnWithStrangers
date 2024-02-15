json.user do
  json.avatar @user.avatar
  json.email @user.email
  json.id @user.id
  json.avatar_url @user.avatar_url
  json.name @user.name
  json.birthday @user.birthday
  json.spoken_language @user.spoken_language
  json.learning_language @user.learning_language
  json.introduction @user.introduction

  json.created_at @user.created_at
end