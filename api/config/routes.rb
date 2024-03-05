Rails.application.routes.draw do

  get "up" => "rails/health#show", as: :rails_health_check


  resources :users, only: [:create, :show, :index] do
    collection do
      post "sign_in"
      post "sign_out"
      post "update"
      post "avatar"
      get "me"
      get "random"
    end

    resources :posts, only: [:create, :index, :update, :destroy]
  end

  # Custom route for users identified by custom_id
  get 'users/custom/:custom_id', to: 'users#show_by_custom_id', as: 'user_by_custom_id'

  # Route for getting posts of a user identified by custom_id
  get '/users/posts/:custom_id', to: 'posts#other_user_posts', as: 'other_user_posts'


end
