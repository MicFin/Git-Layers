class Repo

	def self.fetch_repos(username, sort_type, access_token)
		user_repos = Rails.cache.fetch("user-name-#{username}", expires_in: 9000.seconds) do 
				JSON.parse(RestClient.get("https://api.github.com/users/#{username}/repos", {params: 
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

	def self.generate_response(sort_type, split_type, token, username)
		
		puts username
		
		user_repos = Repo.fetch_repos(username, sort_type, token)

		user_repos.reject! do |repo|
			!repo['language']
		end

		if sort_type == 'lang'
			user_repos = Repo.sort_repos_by_lang(user_repos)
		end

		if split_type == 'forked'
			user_repos = Repo.split_by_forked(user_repos, username)
		elsif split_type == 'created'
			user_repos = Repo.split_by_created(user_repos, username)
		end

		return user_repos 

	end

	def self.fetch_repo_commits(commits_url, access_token)
		commits = Rails.cache.fetch("#{commits_url}", expires_in: 9000.seconds) do
			JSON.parse(RestClient.get(commits_url, {params:
				{ access_token: access_token,
					per_page: 100}}))
		end
		return commits
	end

end