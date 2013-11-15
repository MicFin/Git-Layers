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
		redirect_to login_user_path(access_token: JSON.parse(result)['access_token'])
	end
	
	# extracts desired user information from github response and creates session
	def login
		user = User.extract_remote_params(User.load_api_data(params[:access_token]))
		redirect_to create_session_path(logged_in_user: user, access_token: params[:access_token])
	end

	# uses logged in user's information to render user profile
	def user_profile
		if !user_logged_in
			redirect_to '/'
		else
			user = User.load_api_data(session[:access_token], {username: params[:username]})
			@username_string = user['login']
			@user_repos = Repo.fetch_repos(@username_string, 'created', session[:access_token]).to_json.html_safe
			@username = @username_string.to_json.html_safe
			@name_string = user['name']
			@name = @name_string.to_json.html_safe
		end
	end
end