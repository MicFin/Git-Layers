GitLayers::Application.routes.draw do
  root to: 'welcome#index'
  get 'welcome/about', to: 'welcome#about'
  get 'sessions/create', to: 'sessions#create', as: 'create_session'
  get 'sessions/destroy', to: 'sessions#destroy', as: 'sessions_destroy'
  get 'users/load', to: 'users#load', as: 'load_user'
  get 'users/callback', to: 'users#callback'
  get 'users/profile', to: 'users#profile', as: 'user_profile'
  get 'users/repos', to: 'users#repos', as: 'user_repos'

end