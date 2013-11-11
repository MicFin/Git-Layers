class WelcomeController < ApplicationController 
	def index
		if user_logged_in
			redirect_to user_profile_path
		end
	end

	def about

	end
end