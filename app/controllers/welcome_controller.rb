class WelcomeController < ApplicationController 

  # routes user to home page unless they are logged in
	def index
		if user_logged_in
			redirect_to user_profile_path
		end
	end

	def about

	end
end