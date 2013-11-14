GitLayers::Application.routes.draw do
  root to: 'welcome#index'

  # welcome controller routes
  get 'welcome/about', to: 'welcome#about'
  
  # session routes
  get 'sessions/create', to: 'sessions#create', as: 'create_session'
  get 'sessions/destroy', to: 'sessions#destroy', as: 'sessions_destroy'
  
  # users controller routes
  get 'users/login', to: 'users#login', as: 'login_user'
  get 'users/callback', to: 'users#callback'
  get 'profile', to: 'users#profile', as: 'user_profile'

  # repos controller routes
  get 'repos/commits', to: 'repos#repo_commits', as: 'repo_commits'
  get 'repos/user_repos', to: 'repos#user_repos', as: 'current_user_repos'

end