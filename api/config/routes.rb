Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :likes, only: [] do
    get 'liked_posts', to: 'likes#liked_posts', on: :collection
  end

  resources :posts, only: [:create, :index, :destroy, :show] do
    resources :comments, only: [:create, :destroy]
  end

  resources :users, only: [:create] do
    collection do
      post "sign_in"
      post "sign_out"
      post "update"
      post "avatar"
      get "me"
      get "random"
      get 'search'
    end
  end

  scope 'users/:custom_id' do
    get '/', to: 'users#show_by_custom_id', as: 'user_by_custom_id'
    get '/posts', to: 'posts#other_user_posts', as: 'other_user_posts'

    resource :relationships, only: [:create, :destroy]
    get 'followings', to: 'relationships#followings', as: 'followings'
    get 'followers', to: 'relationships#followers', as: 'followers'

    resources :rooms, only: [:create, :index]

    resources :posts, only: [] do
      resources :likes, only: [:create, :destroy] do
        collection do
          post :custom_likes
          delete :custom_likes
          post :toggle_like
          get :index
          get :following_user_posts
        end
        member do
          get :show_likes
        end
      end
      post 'toggle_like', to: 'likes#toggle_like', as: 'toggle_like_post'
    end
  end

  resources :rooms, only: [:show] do
    resources :messages, only: [:create, :index]
  end

  resources :bulletin, only: [:create, :index, :show] do
    resources :replies, only: [:create]
  end

  get '/following_user_posts', to: 'posts#following_user_posts', as: 'following_user_posts'
  get '/posts/:id/show_likes', to: 'posts#show_likes', as: 'show_post_likes'

  resources :groups, only: [:new, :index, :show, :create, :edit, :update] do
    resources :groups_messages, only: [:create, :index]
  end
end
