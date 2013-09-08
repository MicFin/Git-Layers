class WelcomeController < ApplicationController 
	def index
		if current_user
			redirect_to user_profile_path
		end
	end

	def about

	end
end