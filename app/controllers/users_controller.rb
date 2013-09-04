class UsersController < ApplicationController

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

	def load
		user = Rails.cache.fetch("#{params[:access_token]}", expires_in: 1.hour) do
			return JSON.parse(RestClient.get("https://api.github.com/user", {params: {:access_token => params['access_token'].to_s}}))
		end
		puts JSON.pretty_generate(user)
		redirect_to root_url
	end

end