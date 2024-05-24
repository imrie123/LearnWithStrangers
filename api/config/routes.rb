Rails.application.routes.draw do
  # ヘルスチェック用のルート
  get "up" => "rails/health#show", as: :rails_health_check

  # いいねに関するルート
  resources :likes, only: [] do
    get 'liked_posts', to: 'likes#liked_posts', on: :collection
  end

  # 投稿に関するルート
  resources :posts, only: [:create, :index, :update, :destroy] do
    resources :comments, only: [:create, :destroy]
  end

  # ユーザーに関するルート
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

  # ユーザーごとのルート
  scope 'users/:custom_id' do
    get '/', to: 'users#show_by_custom_id', as: 'user_by_custom_id'
    get '/posts', to: 'posts#other_user_posts', as: 'other_user_posts'

    resource :relationships, only: [:create, :destroy]
    get 'followings' => 'relationships#followings', as: 'followings'
    get 'followers' => 'relationships#followers', as: 'followers'

    # ユーザーのルームに関するルート
    resources :rooms, only: [:create, :index]

    # ユーザーの投稿に関するルート
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
  # ルームに関するルート
  resources :rooms, only: [:show] do
    resources :messages, only: [:create, :index]
  end

  # フォロー中のユーザーの投稿に関するルート
  get '/following_user_posts', to: 'posts#following_user_posts', as: 'following_user_posts'

  # 特定の投稿のいいねを表示するルート
  get '/posts/:id/show_likes', to: 'posts#show_likes', as: 'show_post_likes'

  # グループに関するルート
  resources :groups, only: [:new, :index, :show, :create, :edit, :update] do
    resources :groups_messages, only: [:create, :index]
  end
end
