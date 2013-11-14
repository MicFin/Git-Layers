class ReposController < ApplicationController
  # fetches commits for the passed commits url
  def repo_commits
    commits = Repo.fetch_repo_commits(params["commits_url"], session[:access_token])
    respond_to do |format|
      format.json { render json: commits }
    end
  end

  # fetches repositories of the user who is currently logged in
  def user_repos
    sort_type = params[:sort_type] || 'created'
    user_repos = Repo.generate_response(sort_type, params[:split_type], session[:access_token], session[:logged_in_user])

    respond_to do |format|
      format.json { render json: user_repos } 
    end

  end



end