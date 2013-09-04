class SessionsController < ApplicationController
  # defines the session id by the user currently on the site
  # redirects to index page
	def create
		user = User.find(params[:id])
		session[:user_access_token] = user.id
		redirect_to root_url, notice: 'Logged In'
	end

  # logs out a user, removing the user id from session
  # redirects to index page
	def destroy
		session[:user_id] = nil
		redirect_to root_url, notice: 'Logged Out'
	end

end