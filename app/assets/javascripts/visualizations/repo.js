// Global namespace for single repo rendering functions
var Repo = {

	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		
		Repo.renderRepoContainer();

	},

	renderRepoContainer: function() {

		$('#repo-container-back')
			.animate({
				'opacity': 1,
				'height': 400
			}, 1000, function() {
				Page.addBackButton();
			});

	},

	resetPageElements: function() {
		$('.profile-section-header')
			.html("<h2> Repositories </h2>");
		$("#repo-container-back")
			.animate({
				'height': 0,
				'opacity': 0
			}, 1000);
	}

}