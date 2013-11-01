// Global namespace for single repo rendering functions
var Repo = {


	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		Repo.renderRepoContainer();
		Repo.currentRepo = repo;
		Repo.commits();

	},

	renderRepoContainer: function() {

		$('#repo-container-back')
			.animate({
				'opacity': 1,
				'height': Repo.containerHeight()	
			}, 1000, function() {
				Page.addBackButton();
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

	commits: function() {
		var i = 0, max;
		$.ajax({
			url: '/users/repos/commits',
			type: 'GET',
			data: {'commits_url': Repo.currentRepo["commits_url"].split("{")[0]}
		}).done(function(commits) {
			max = commits.length;
			for(; i < max;) {
				console.log(commits[i])
				i += 1;
			}
		});
	}



}