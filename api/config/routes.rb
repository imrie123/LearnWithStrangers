Rails.application.routes.draw do

  get "up" => "rails/health#show", as: :rails_health_check
  resources :likes, only: [] do
    get 'liked_posts', to: 'likes#liked_posts', on: :collection
  end

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

  scope 'users/custom/:custom_id' do
    get '/', to: 'users#show_by_custom_id', as: 'user_by_custom_id'
    get '/posts', to: 'posts#other_user_posts', as: 'other_user_posts'



    resources :posts, only: [] do
      resources :likes, only: [:create, :destroy], controller: 'likes' do
        post :custom_likes, on: :collection  # いいねのためのカスタムエンドポイントを定義
        delete :custom_likes, on: :collection  # いいねのためのカスタムエンドポイントを定義
        get :show_likes, on: :member  # いいねのためのカスタムエンドポイントを定義
        post :toggle_like, on: :collection
        get :index, on: :collection

      end
      get 'show_likes', to: 'posts#show_likes', on: :member
      post 'toggle_like', to: 'likes#toggle_like'

    end
  end
  get '/posts/:id/show_likes', to: 'posts#show_likes', as: 'show_post_likes'




end
