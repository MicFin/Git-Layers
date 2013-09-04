class CreateUsersTable < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	
    	t.string :name
    	t.string :url
    	t.string :html_url
    	t.string :repos_url
    	t.string :gists_url
    	t.string :avatar_url
    	t.integer :public_repos
    	t.integer :followers
    	t.integer :following
    	t.integer :github_id
    	t.string :created_at
    	t.string :updated_at
    	t.string :email

    	t.timestamps

    end
  end
end
