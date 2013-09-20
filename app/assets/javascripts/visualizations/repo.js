var Repo = {

	initRepoLayout: function(repos) {
		$(function() {
			Repo.noReposCheck(repos);
			Repo.repoGrid(repos);
			Repo.activeSortButtons();
		});
	},


	noReposCheck: function(repos) {
		if(!repos) {
			$('#repo-name-wrapper').remove();
			$('#sort-button-wrapper').remove();
			$('#repo-container-back')
				.append('<h1> Oh Noes!</h1>')
				.append('<h3 id="repoless-message"> You Don\'t Have any Repos! </h3>');
		}
	},

	displayRepos: function() {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: '/users/repos'
		}).done(function(data) {
			Repo.repoGrid(data);
		});
	},

	repoGrid: function(repos) {
		
		var square_size = 60,
			h = parseInt((repos.length / 15) + 1) * square_size;

		svg = Repo.repoCanvas(h);
		rects = svg.selectAll('rect')
			.data(repos)
			.enter()
			.append('rect')
			.attr('rx', 5)
			.attr('height', 0)
			.attr('width', 0)
			.attr('opacity', 1)
			.attr('class', 'repo')
			.style('stroke',  function(d, i){
				return Color.stringColor(d['language'].toString());
			})
			.style('stroke-width', 1)
			.style('fill', function(d, i) {
				return Color.stringColor(d['language'].toString());
			})
			.attr('x', function(d, i){
				return (i % 15) * square_size;
			})
			.attr('y', function(d, i){
				return parseInt(i / 15) * square_size;
			})

			.transition()
			.delay(function() {
				return 500 + (Math.random() * (Math.random() + 2)) * 100;
			})
			.duration(function() {
				return 500 + (Math.random() * (Math.random() + 3)) * 300;
			})
			.attr('height', 50)
			.attr('width', 50)
			.each('end', function() {
				d3.select(this)
					.on('mouseenter', function() {
						d3.select(this)
						.transition()
						.duration(50)
						.style('fill', function(d, i){
							return Color.stringHover(d['language'].toString());
						})
						.transition()
						.duration(500)
						.attr('rx', 15);

							Repo.displayRepoName($(this)[0]['__data__']['name'] + " (" + $(this)[0]['__data__']['language'] + ')');
					})

					.on('mouseleave', function() {
						d3.select(this)
						.transition()
						.duration(1000)
						.style('fill', function(d, i){
							return Color.stringColor(d['language'].toString());
						})
						.transition()
						.duration(500)
						.attr('rx', 5);
					})
					.on('click', function() {
						window.open(this.__data__['html_url']);
					});
			});
	},

	repoCanvas: function(h) {
		
		$('#repo-container-back')
			.css('height', h + 105)
			.css('padding-left', function() {
				return $(window).width()/2 - 450;
			})
			.css('padding-right', function() {
				return $(window).width()/2 - 450;
			})
			.animate({
				'opacity': 1
			}, 500);

		var new_canvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('height', h)
			.attr('width', 900)
			.attr('id','repo-container-canvas');
		return new_canvas;
	},

	activeSortButtons: function() {
		$('.sort-button').click(function(e) {
			e.preventDefault();

			$('.default').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default');

			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type':$(this).attr('href').toString()}
			}).done(function(data) {
				Repo.clearCanvas();
				d3.select('#repo-container-canvas')
					.transition()
					.delay(500)
					.duration(10)
					.each('end', function() {
						Repo.repoGrid(data);
					})
					.remove();
			});
		});
	},

	clearCanvas: function() {
			d3.selectAll('rect.repo')
				.transition()
				.duration(function() {
					return (Math.random() * (Math.random() + 1)) * 300;
				})
				.attr('height', 0)
				.attr('width', 0)
				.remove();
	},

	displayRepoName: function(name) {
		$('#repo-name').html(name);
	}
};