class UsersController < ApplicationController
	respond_to :json
	# defines protocol for github api callback
	def callback
		result = RestClient.post("https://github.com/login/oauth/access_token",
	    {client_id: ENV['CLIENT_ID'],
	     client_secret: ENV['CLIENT_SECRET'],
	     code: params[:code]
	    },{
	     :accept => :json
	    })
		redirect_to load_user_path(access_token: JSON.parse(result)['access_token'])
	end


	# loads user into databse or updates user if nonexistant or out of date
	def load
		
		if params[:username]
			stored_user = User.load(params[:access_token], params[:username])
		else
			stored_user = User.load(params[:access_token])
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
		split_type = params[:split_type]

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

		if split_type == 'forked'
			@user_repos = Repo.split_by_forked(@user_repos, current_user['login'])
		elsif split_type == 'created'
			@user_repos = Repo.split_by_created(@user_repos, current_user['login'])
		end

		respond_with @user_repos.to_json.html_safe
	end

	def repo_commits 
		@commits = Rails.cache.fetch("#{params['commits_url']}", expires_in: 9000.seconds) do
			JSON.parse(RestClient.get(params['commits_url'], {params:
				{ access_token: session[:user_access_token],
					per_page: 100}}))
		end

		respond_with @commits.to_json.html_safe
	end

end