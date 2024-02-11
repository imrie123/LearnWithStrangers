

if user.persisted?
  json.token response["idToken"]
  json.name user.name
else
  json.error response["error"]["message"]
end

if response["idToken"]
  json.token response["idToken"]
else
  json.error response["error"]["message"]
end

json.message "Signed out successfully"

if user
  json.success 'Valid token'
  json.user user.as_json(except: [:avatar])
else
  json.error 'Token missing'
end

if user
  json.success "Valid token"
  json.user do
    json.extract! user,  :id, :name, :email, :birthday, :image, :spoken_language, :learning_language, :residence, :introduction, :created_at, :updated_at
    json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end
end

if user.errors.any?
  json.error "Update Error"
  json.details user.errors.full_messages
else
  json.success "Updated user"
  json.user do
    json.extract! user, :id, :name, :email, :birthday, :image, :spoken_language, :learning_language, :residence, :introduction, :created_at, :updated_at
    json.avatar_url url_for(user.avatar) if user.avatar.attached?
  end
end