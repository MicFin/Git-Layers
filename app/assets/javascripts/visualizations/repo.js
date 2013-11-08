// Global namespace for single repo rendering functions
var Repo = {

	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		Repo.renderRepoContainer();
		Repo.currentRepo = repo;


	},

	renderRepoContainer: function() {

		$('#repo-container-back')
			.animate({
				'opacity': 1,
				'height': Repo.containerHeight()	
			}, 1000, function() {
				Page.addBackButton();
				Commits.fetchCommits();
			});

	},

	repoContainerResize: function() {

		$(window).resize(function() {
			$('#repo-container-back')
				.animate({
					'opacity': 1,
					'height': Repo.containerHeight()	
				}, 50);
		})
	},

	containerHeight: function() {
		return 400;
	},

}