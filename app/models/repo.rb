class Repo

	def self.sort_repos_by_lang (repos)
		language_sorted = {}
		repos.each do |repo|
			language_sorted[repo['language']] ||= []
			language_sorted[repo['language']] << repo
		end
		return language_sorted.values.flatten
	end

	def self.split_by_contributed(repos, user_login)
		repos.reject! do |repo|
			!repo['fork']
		end
		return repos
	end
end