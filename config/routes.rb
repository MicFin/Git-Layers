GitLayers::Application.routes.draw do
  root to: 'welcome#index'
  get 'welcome/about', to: 'welcome#about'
  get 'sessions/create', to: 'sessions#create', as: 'create_session'
  get 'sessions/destroy', to: 'sessions#destroy', as: 'sessions_destroy'
  get 'users/login', to: 'users#login', as: 'login_user'
  get 'users/callback', to: 'users#callback'
  get 'profile', to: 'users#profile', as: 'user_profile'
  get 'users/repos', to: 'users#repos', as: 'user_repos'
  get '/users/repos/commits', to: 'users#repo_commits', as: 'repo_commits'
  get 'users/create', to: 'users#create', as: 'create_user'

end