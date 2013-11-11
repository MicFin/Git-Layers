class Repo

	def self.fetch_repos(user, sort_type, access_token)
		user_repos = Rails.cache.fetch("user-repos-#{user['github_id']}-created", expires_in: 9000.seconds) do 
				JSON.parse(RestClient.get(user['repos_url'], {params: 
					{ access_token: access_token, 
						page: 1, 
						per_page: 100, 
						sort: sort_type}}))
			end
			user_repos.reject! do |repo|
				!repo['language']
			end
			return user_repos
	end

	def self.sort_repos_by_lang (repos)
		language_sorted = {}
		repos.each do |repo|
			language_sorted[repo['language']] ||= []
			language_sorted[repo['language']] << repo
		end
		return language_sorted.values.flatten
	end

	def self.split_by_forked(repos, user_login)
		repos.reject! do |repo|
			!repo['fork']
		end
	end

	def self.split_by_created(repos, user_login)
		repos.reject! do |repo|
			repo['fork']
		end
	
	end

	def self.generate_response(sort_type, split_type, token, user)
		
		user_repos = Repo.fetch_repos(user, sort_type, token)

		user_repos.reject! do |repo|
			!repo['language']
		end

		if sort_type == 'lang'
			user_repos = Repo.sort_repos_by_lang(user_repos)
		end

		if split_type == 'forked'
			user_repos = Repo.split_by_forked(user_repos, user['login'])
		elsif split_type == 'created'
			user_repos = Repo.split_by_created(user_repos, user['login'])
		end

		return user_repos 

	end

end