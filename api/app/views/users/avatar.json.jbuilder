json.user do
  json.avatar_url @current_user.avatar.attached? ? url_for(@current_user.avatar) : nil
end