class User < ActiveRecord::Base

	def self.load_api_data(access_token, options={})

		if options[:username]
			url = "https://api.github.com/users/#{options[:username]}"
		else 
			url = "https://api.github.com/user"
		end

		github_user_data = Rails.cache.fetch("#{access_token}", :expires_in => 9000.seconds) do 
			JSON.parse(RestClient.get(url, {params: {:access_token => access_token}}))
		end

		return github_user_data

	end

	def self.extract_remote_params(github_user_data)
		params = {}
		params[:name] = github_user_data['name']
		params[:login] = github_user_data['login']
		params[:url] = github_user_data['url']
		params[:html_url] = github_user_data['html_url']
		params[:repos_url] = github_user_data['repos_url']
		params[:gists_url] = github_user_data['gists_url']
		params[:avatar_url] = github_user_data['avatar_url']
		params[:public_repos] = github_user_data['public_repos']
		params[:github_id] = github_user_data['id']
		params[:followers] = github_user_data['followers']
		params[:following] = github_user_data['following']
		params[:created_at] = github_user_data['created_at']
		params[:updated_at] = github_user_data['updated_at']
		params[:email] = github_user_data['email']
		return params
	end

end