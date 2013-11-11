class UsersController < ApplicationController

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
			@user_repos = Repo.fetch_repos(user, 'created', session[:access_token]).to_json.html_safe
		end
	end

	def repos

		sort_type = params[:sort_type] || 'created'
		
		user_repos = Repo.generate_response(sort_type, params[:split_type], session[:access_token], session[:logged_in_user])

		respond_to do |format|
			format.json { render json: user_repos } 
		end

	end

	def repo_commits 
		commits = Rails.cache.fetch("#{params['commits_url']}", expires_in: 9000.seconds) do
			JSON.parse(RestClient.get(params['commits_url'], {params:
				{ access_token: session[:access_token],
					per_page: 100}}))
		end

		respond_to do |format|
			format.json { render json: commits }
		end
	end

end