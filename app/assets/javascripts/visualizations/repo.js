// Global namespace for single repo rendering functions
var Repo = {

	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		
		Repo.renderRepoContainer();
		Repo.renderSquare();

	},

	renderRepoContainer: function() {

		$('#repo-container-back')
			.animate({
				'opacity': 1,
				'height': 400
			}, 1000);
	},

}