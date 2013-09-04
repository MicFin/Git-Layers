class User < ActiveRecord::Base
	attr_accessible :name, :url, :html_url, :repos_url, :gists_url, :avatar_url, :public_repos, :followers, :following, :github_id, :created_at, :updated_at, :email
end