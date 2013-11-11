class SessionsController < ApplicationController
  # defines the session id by the user currently on the site
  # redirects to index page
	def create
		session[:access_token] = params[:access_token]
		session[:logged_in_user] = params[:logged_in_user]
		session[:subject_user] = params[:subject_user]
		redirect_to root_url, notice: 'Logged In'
	end

  # logs out a user, removing the user id from session
  # redirects to index page
	def destroy
		session[:subject_user] = nil
		session[:access_token] = nil
		session[:logged_in_user] = nil
		redirect_to root_url, notice: 'Logged Out'
	end

end