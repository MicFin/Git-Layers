class UsersController < ApplicationController

	def callback
		result = RestClient.post("https://github.com/login/oauth/access_token",
	    {client_id: ENV['CLIENT_ID'],
	     client_secret: ENV['CLIENT_SECRET'],
	     code: params[:code]
	    },{
	     :accept => :json
	    });
	redirect_to create_session_path(access_token: JSON.parse(result)['access_token'])
	end

	def create
		puts params[:access_token]
		redirect_to root_url
	end
end