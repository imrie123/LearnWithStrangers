json.array! @random_users do |user|
  json.id user.id
  json.name user.name
  json.email user.email
  json.custom_id user.custom_id
  json.birthday user.birthday
  json.image user.image
  json.spoken_language user.spoken_language
  json.learning_language user.learning_language
  json.residence user.residence
  json.introduction user.introduction
  json.created_at user.created_at
  json.updated_at user.updated_at
  json.avatar_url url_for(user.avatar) if user.avatar.attached?
  json.followed_by_current_user @current_user.followed_by?(user) if @current_user.present?
  json.following_count user.followings.count
  json.follower_count user.followers.count
  json.post_count user.posts.count
  json.following_users user.following_users do |following_user|
    json.id following_user.id
    json.name following_user.name
    json.custom_id following_user.custom_id
    json.avatar_url url_for(following_user.avatar) if following_user.avatar.attached?
  end
  json.followers user.followers do |follower|
    json.id follower.id
    json.name follower.name
    json.custom_id follower.custom_id
    json.avatar_url url_for(follower.avatar) if follower.avatar.attached?
  end
end