class UsersController < ApplicationController
	respond_to :json

	# defines protocol for github api callback using gihub gem to authorize
	def callback
		
		session[:github] = Github.new do |config|
			config.client_id = ENV['CLIENT_ID']
			config.client_secret = ENV['CLIENT_SECRET']
			config.oauth_token =  JSON.parse(RestClient.post("https://github.com/login/oauth/access_token",
		    {client_id: ENV['CLIENT_ID'],
		  	 client_secret: ENV['CLIENT_SECRET'],
		     code: params[:code]
		    },{
		    	:accept => :json
		  	}))["access_token"];
		end
		redirect_to load_user_path
	end


	# loads user into databse or updates user if nonexistant or out of date
	def load
		binding.pry
		github_user = Rails.cache.fetch("#{params['access_token']}", :expires_in => 9000.seconds) do 
			JSON.parse(RestClient.get("https://api.github.com/user", {params: {:access_token => @@github.oauth_token}}))
		end

		stored_user = User.where(github_id: github_user['id']).first
		if stored_user
			unless stored_user.updated_at == github_user['updated_at']
				stored_user.update_attributes(
					name: github_user['name'],
					url: github_user['url'],
					html_url: github_user['html_url'],
					repos_url: github_user['repos_url'],
					gists_url: github_user['gists_url'],
					avatar_url: github_user['avatar_url'],
					public_repos: github_user['public_repos'],
					github_id: github_user['id'],
					followers: github_user['followers'],
					following: github_user['following'],
					created_at: github_user['created_at'],
					updated_at: github_user['updated_at'],
					email: github_user['email']
				)
			end
		else
			stored_user = User.create(
				name: github_user['name'],
				url: github_user['url'],
				html_url: github_user['html_url'],
				repos_url: github_user['repos_url'],
				gists_url: github_user['gists_url'],
				avatar_url: github_user['avatar_url'],
				public_repos: github_user['public_repos'],
				github_id: github_user['id'],
				followers: github_user['followers'],
				following: github_user['following'],
				created_at: github_user['created_at'],
				updated_at: github_user['updated_at'],
				email: github_user['email']
			)
		end
		redirect_to create_session_path(id: stored_user.id, access_token: params[:access_token])
	end

	def profile
		if !current_user
			redirect_to '/'
		else 
			user = User.find(current_user.id)
			token = session[:user_access_token]
			@user_repos = Rails.cache.fetch("user-repos-#{user.id}-created", expires_in: 9000.seconds) do 
				JSON.parse(RestClient.get(user.repos_url, {params: 
					{ access_token: token, 
						page: 1, 
						per_page: 100, 
						sort: 'created'}}))
			end
			@user_repos.reject! do |repo|
				!repo['language']
			end
			@user_repos = @user_repos.to_json.html_safe
		end
	end

	def repos

		sort_type = params[:sort_type] || 'created'
		user = User.find(current_user.id)

		@user_repos = Rails.cache.fetch("user-repos-#{user.id}-#{sort_type}", expires_in: 9000.seconds) do 
			JSON.parse(RestClient.get(user.repos_url, {params: 
				{ access_token: session[:user_access_token], 
					page: 1, 
					per_page: 100, 
					sort: sort_type}}))
		end
		@user_repos.reject! do |repo|
			!repo['language']
		end
		if sort_type == 'lang'
			@user_repos = Repo.sort_repos_by_lang(@user_repos)
		end
		respond_with @user_repos.to_json.html_safe

	end

end