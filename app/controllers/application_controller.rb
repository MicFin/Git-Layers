class ApplicationController < ActionController::Base

  protect_from_forgery

  # defines current user by the session currently in progress
  helper_method :user_logged_in
  
  def user_logged_in
  		session[:access_token] != nil
  end

end
