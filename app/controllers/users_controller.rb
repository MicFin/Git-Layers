class UsersController < ApplicationController

	# defines protocol for github api callback
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


	# loads user into databse or updates user if nonexistant or out of date
	def load
		github_user = Rails.cache.fetch("#{params['access_token']}", :expires_in => 9000.seconds) do 
			JSON.parse(RestClient.get("https://api.github.com/user", {params: {:access_token => params[:access_token]}}))
		end

		puts 'made the request'
		
		stored_user = User.where(github_id: github_user['id']).first
		if stored_user
			unless stored_user.updated_at == github_user['updated_at']
				stored_user.update_attributes(
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
					updated_at: github_user['updated_at'],
					email: github_user['email']
				)
			end
		else
			stored_user = User.create(
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
				updated_at: github_user['updated_at'],
				email: github_user['email']
			)
		end
		redirect_to create_session_path(id: stored_user.id, access_token: params[:access_token])
	end

	def profile

		if !current_user
			puts 'no user!'
			redirect_to '/'
		else
			user = User.find(current_user.id)
			token = session[:user_access_token]
			@user_repos = Rails.cache.fetch("user-repos-#{user.id}", expires_in: 9000.seconds) do 
				JSON.parse(RestClient.get(user.repos_url, {params: {access_token: token, page: 1, per_page: 100}}))
			end
			@user_repos.reject! do |repo|
				!repo['language']
			end
			@user_repos = @user_repos.to_json.html_safe
		end
		# @commits = []
		# @commit_dates = {}
		# @user_repos.each do |repo|
		# 	repo_commits = Rails.cache.fetch("repo-commits-#{user.id}-#{repo['name']}", expires_in: 9000.seconds) do
		# 		JSON.parse(RestClient.get(repo['commits_url'].split('{')[0], {params: {access_token: token}}))
		# 	end
		# 	@commits << repo_commits
		# end
		# @commits =  @commits.flatten
		# @commits.each do |commit|
		# 	date = commit['commit']['committer']['date'].split('T')[0].gsub('-','')
		# 	@commit_dates[date] ||= 0
		# 	@commit_dates[date] += 1
		# end
		# puts @commit_dates.keys.sort!
	end
end