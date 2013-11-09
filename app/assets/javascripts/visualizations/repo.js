// Global namespace for single repo rendering functions
var Repo = {

	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		Repo.renderRepoContainer();
		Repo.currentRepo = repo;
		Repo.language = Repo.currentRepo['language'];

	},

	renderRepoContainer: function() {

			var callback = function() {
				Page.addBackButton();
				Commits.fetchCommits();
			};

		Page.renderContentContainer($(window).width(), Repo.containerHeight(), callback);

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