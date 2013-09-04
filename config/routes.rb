GitLayers::Application.routes.draw do
  root to: 'welcome#index'
  get 'sessions/callback', to: 'sessions#callback'
  get 'sessions/create', to: 'sessions#create', as: 'create_session'
  get 'sessions/destroy', to: 'sessions#destroy'
  get 'users/create', to: 'users#create', as: 'create_user'
  get 'users/callback', to: 'users#callback'
end