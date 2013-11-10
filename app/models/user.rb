class User < ActiveRecord::Base

	def self.load(access_token, options={})

		if options[:username]
			url = "https://api.github.com/users/#{options[:username]}"
		else 
			url = "https://api.github.com/user"
		end

		github_user_data = Rails.cache.fetch("#{access_token}", :expires_in => 9000.seconds) do 
			JSON.parse(RestClient.get(url, {params: {:access_token => access_token}}))
		end

		stored_user = User.where(github_id: github_user_data['id']).first

		if stored_user
			stored_user = User.update_user stored_user, github_user_data
		else
			stored_user = User.create_user github_user_data
		end

		stored_user 

	end

	def self.update_user(stored_user, github_user_data)
		unless stored_user.updated_at == github_user_data['updated_at']
			stored_user.update_attributes(
				name: github_user_data['name'],
				login: github_user_data['login'],
				url: github_user_data['url'],
				html_url: github_user_data['html_url'],
				repos_url: github_user_data['repos_url'],
				gists_url: github_user_data['gists_url'],
				avatar_url: github_user_data['avatar_url'],
				public_repos: github_user_data['public_repos'],
				github_id: github_user_data['id'],
				followers: github_user_data['followers'],
				following: github_user_data['following'],
				created_at: github_user_data['created_at'],
				updated_at: github_user_data['updated_at'],
				email: github_user_data['email'])
		end
		stored_user
	end

	def self.create_user(github_user_data)
		stored_user = User.create(
			name: github_user_data['name'],
			login: github_user_data['login'],
			url: github_user_data['url'],
			html_url: github_user_data['html_url'],
			repos_url: github_user_data['repos_url'],
			gists_url: github_user_data['gists_url'],
			avatar_url: github_user_data['avatar_url'],
			public_repos: github_user_data['public_repos'],
			github_id: github_user_data['id'],
			followers: github_user_data['followers'],
			following: github_user_data['following'],
			created_at: github_user_data['created_at'],
			updated_at: github_user_data['updted_at'],
			email: github_user_data['email'])
	end


end