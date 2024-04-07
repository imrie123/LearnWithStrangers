Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :likes, only: [] do
    get 'liked_posts', to: 'likes#liked_posts', on: :collection
  end

  resources :users, only: [:create, :index] do
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

  scope 'users/:custom_id' do
    get '/', to: 'users#show_by_custom_id', as: 'user_by_custom_id'
    get '/posts', to: 'posts#other_user_posts', as: 'other_user_posts'
    resource :relationships, only: [:create, :destroy]
    get 'followings' => 'relationships#followings', as: 'followings'
    get 'followers' => 'relationships#followers', as: 'followers'
    resources :room, only: [:create, :show] do
      resources :message, only: [:create, :index]
    end

    resources :posts, only: [] do
      resources :likes, only: [:create, :destroy], controller: 'likes' do
        post :custom_likes, on: :collection
        delete :custom_likes, on: :collection
        get :show_likes, on: :member
        post :toggle_like, on: :collection
        get :index, on: :collection
        get :following_user_posts, on: :collection
      end

      get 'show_likes', to: 'posts#show_likes', on: :member
      post 'toggle_like', to: 'likes#toggle_like'
    end
  end
  get '/following_user_posts', to: 'posts#following_user_posts', as: 'following_user_posts'
  get '/posts/:id/show_likes', to: 'posts#show_likes', as: 'show_post_likes'
end
