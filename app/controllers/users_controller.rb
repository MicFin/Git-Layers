class UsersController < ApplicationController

	# defines protocol for github api callback, logs user in
	def callback
		result = RestClient.post("https://github.com/login/oauth/access_token",
	    {client_id: ENV['CLIENT_ID'],
	     client_secret: ENV['CLIENT_SECRET'],
	     code: params[:code]
	    },{
	     :accept => :json
	    })
		puts JSON.parse(result)['access_token']
		redirect_to login_user_path(access_token: JSON.parse(result)['access_token'])
	end
	
	# extracts desired user information from github response and creates session
	def login
		user = User.extract_remote_params(User.load_api_data(params[:access_token]))
		redirect_to create_session_path(logged_in_user: user, access_token: params[:access_token])
	end

	# uses logged in user's information to render user profile
	def profile
		if !user_logged_in
			redirect_to '/'
		else
			user = session[:logged_in_user]
			@user_repos = Repo.fetch_repos(user, 'created', session[:access_token]).to_json.html_safe
		end
	end
end