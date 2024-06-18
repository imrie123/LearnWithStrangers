json.user do
  json.extract! @user, :id, :name, :email, :birthday, :custom_id, :spoken_language, :learning_language, :residence, :introduction, :created_at, :updated_at
  json.avatar_url url_for(@user.avatar) if @user.avatar.attached?
  json.followed_by_current_user @current_user.followed_by?(@user) if @user.present?
  json.following_count @user.followings.count
  json.follower_count @user.followers.count
  json.post_count @user.posts.count

  json.liked_posts @liked_posts do |post|
    json.extract! post, :id, :user_id, :image_url, :content, :created_at, :updated_at, :likes_count
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
    json.name post.user.name
    json.custom_id post.user.custom_id
    json.comments_count post.comments.count
    json.avatar_url url_for(post.user.avatar) if post.user.avatar.attached?
    json.comments post.comments do |comment|
      json.extract! comment, :id, :content, :created_at, :updated_at
      json.user_name comment.user.name
      json.custom_id comment.user.custom_id
      json.avatar_url url_for(comment.user.avatar) if comment.user.avatar.attached?
    end
  end

  json.user_posts @posts do |post|
    json.extract! post, :id, :user_id, :image_url, :content, :created_at, :updated_at, :likes_count
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
    json.comments post.comments do |comment|
      json.extract! comment, :id, :content, :created_at, :updated_at
      json.user_name comment.user.name
      json.custom_id comment.user.custom_id
      json.avatar_url url_for(comment.user.avatar) if comment.user.avatar.attached?
    end
  end

  json.following_user_posts @following_user_posts do |post|
    json.extract! post, :user_id, :id, :content, :created_at, :updated_at, :likes_count
    json.image_url post.image_url
    json.liked_by_current_user post.liked_by?(@current_user) if @current_user.present?
    json.custom_id post.user.custom_id
    json.name post.user.name
    json.avatar_url url_for(post.user.avatar) if post.user.avatar.attached?
    json.comments post.comments.map { |comment| { user_name: comment.user.name, content: comment.content, avatar: comment.user.avatar_url, custom_id: comment.user.custom_id } }
  end

  json.following_users @following_users do |user|
    json.extract! user, :id, :name, :custom_id, :avatar_url
    json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end

  json.followers @followers do |user|
    json.extract! user, :id, :name, :custom_id
    json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end

  json.user_rooms @user.rooms do |room|
    json.id room.id
    json.created_at room.created_at
    json.name room.name
    json.entries room.entries do |entry|
      json.id entry.id
      json.user do
        json.id entry.user.id
        json.name entry.user.name
        json.avatar_url url_for(entry.user.avatar) if entry.user.avatar.attached?
      end
    end
  end
end
