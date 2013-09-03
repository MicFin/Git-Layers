GitLayers::Application.routes.draw do
  root to: 'welcome#index'
  get 'sessions/callback', to: 'sessions#callback'
  post 'sessions/create', to: 'sessions#create'
  get 'sessions/destroy', to: 'sessions#destroy'
end