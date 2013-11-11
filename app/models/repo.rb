class Repo

	def self.fetch_repos(user, access_token)
		user_repos = Rails.cache.fetch("user-repos-#{user['github_id']}-created", expires_in: 9000.seconds) do 
				JSON.parse(RestClient.get(user['repos_url'], {params: 
					{ access_token: access_token, 
						page: 1, 
						per_page: 100, 
						sort: 'created'}}))
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
end