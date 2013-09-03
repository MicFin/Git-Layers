class SessionsController < ApplicationController

	def callback
		result = RestClient.post("https://github.com/login/oauth/access_token",
	    {client_id: ENV['CLIENT_ID'],
	     client_secret: ENV['CLIENT_SECRET'],
	     code: params[:code]
	    },{
	     :accept => :json
	    });
  	puts(JSON.parse(result)['access_token'])
	end
  # defines the session id by the user currently on the site
  # redirects to index page
	def create
		user = User.find(params[:id])
		session[:user_id] = user.id
		redirect_to root_url, notice: 'Logged In'
	end

  # logs out a user, removing the user id from session
  # redirects to index page
	def destroy
		session[:user_id] = nil
		redirect_to root_url, notice: 'Logged Out'
	end
	
end