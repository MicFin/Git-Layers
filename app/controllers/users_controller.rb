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
		github_user = Rails.cache.fetch("#{params[:access_token]}", expires_in: 1.hour) do
			return JSON.parse(RestClient.get("https://api.github.com/user", {params: {:access_token => params['access_token'].to_s}}))
		end
		
		stored_user = User.where(github_id: github_user['id']).first
		if stored_user
			unless stored_user.updated_at == github_user['updated_at']
				User.update_attributes(
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
					updated_at: github_user['updated_at']
				)
			end
		else
			User.create(
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
				updated_at: github_user['updated_at']
			)
		end
		puts User.last
		redirect_to root_url
	end

end