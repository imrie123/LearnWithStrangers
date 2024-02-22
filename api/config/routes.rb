Rails.application.routes.draw do

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get '/users/:user_id/posts/:id', to: 'posts#index', as: 'user_post'
  resources :users, only: [:create, :show] do
    collection do
      post "sign_in"
      post "sign_out"
      post "update"
      post "avatar"
      get "me"
    end

    resources :posts, only: [:create, :index, :update,:destroy]

  end

  # Defines the root path route ("/")
  # root "posts#index"
end
