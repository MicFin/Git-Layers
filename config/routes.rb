GitLayers::Application.routes.draw do
  root to: 'welcome#index'
  get 'sessions/create', to: 'sessions#create', as: 'create_session'
  get 'sessions/destroy', to: 'sessions#destroy', as: 'sessions_destroy'
  get 'users/load', to: 'users#load', as: 'load_user'
  get 'users/callback', to: 'users#callback'
end