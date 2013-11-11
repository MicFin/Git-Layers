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
		redirect_to login_user_path(access_token: JSON.parse(result)['access_token'])
	end


	# loads user into databse or updates user if nonexistant or out of date
	def login

		@@logged_in_user = User.extract_remote_params(User.load_api_data(params[:access_token]))
		redirect_to create_session_path(logged_in_user: @@logged_in_user, access_token: params[:access_token])

	end

	def profile
		if !user_logged_in
			redirect_to '/'
		else
			user = session[:logged_in_user]
			@user_repos = Repo.fetch_repos(user, session[:access_token]).to_json.html_safe
		end
	end

	def repos

		sort_type = params[:sort_type] || 'created'
		split_type = params[:split_type]

		user_repos = Rails.cache.fetch("user-repos-#{user.id}-#{sort_type}", expires_in: 9000.seconds) do 
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

	# def repo_commits 
	# 	@commits = Rails.cache.fetch("#{params['commits_url']}", expires_in: 9000.seconds) do
	# 		JSON.parse(RestClient.get(params['commits_url'], {params:
	# 			{ access_token: session[:user_access_token],
	# 				per_page: 100}}))
	# 	end

	# 	respond_with @commits.to_json.html_safe
	# end

	# private

	# def user_params
	# 	params.require(:user).permit(:name,:login,:url,:html_url,:repos_url,:gists_url,:avatar_url,:public_repos,:github_id,:followers,:following,:created_at,:updated_at,:email)
	# end

end