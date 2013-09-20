// Global namespace for repo-rendering and repo-fetching functions
var Repo = {


	grid_block_size : 60,
	square_size: 50,
	columns: 15,
	canvas_width: 900,


	// checks for no-repos, otherwise calls display functions 
	// to put grid on page
	initRepoLayout: function(repos) {

		$(function() {
			Repo.noReposCheck(repos);
			Repo.repoGrid(repos);
			Repo.activeSortButtons();
		});
	},

	// displays alert on page if no repos are found for user
	noReposCheck: function(repos) {
		if(!repos) {
			$('#repo-name-wrapper').remove();
			$('#sort-button-wrapper').remove();
			$('#repo-container-back')
				.append('<h1> Oh Noes!</h1>')
				.append('<h3 id="repoless-message"> You Don\'t Have any Repos! </h3>');
				return false;
		}
		return true
	},

	// displays the repo grid on the page and sets event listeners for
	// individual squares
	repoGrid: function(repos) {
		
			h = parseInt((repos.length / Repo.columns) + 1) * Repo.grid_block_size;

		// creates svg canvas
		svg = Repo.repoCanvas(h);

		// uses repos as data to create grid rectangles
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
				return (i % Repo.columns) * Repo.grid_block_size;
			})
			.attr('y', function(d, i){
				return parseInt(i / Repo.columns) * Repo.grid_block_size;
			})

			
			.transition() // expands squares based randomly (within time limit)
			.delay(function() {
				return 500 + (Math.random() * (Math.random() + 2)) * 100;
			})
			.duration(function() {
				return 500 + (Math.random() * (Math.random() + 3)) * 300;
			})
			.attr('height', Repo.square_size)
			.attr('width', Repo.square_size)
			.each('end', function() {
				d3.select(this)
					.on('mouseenter', function() {
						d3.select(this)
						.transition()
						.duration(50)
						.style('fill', function(d, i){
							return Color.stringHover(d['language'].toString()); //changes square colors
						})
						.transition()
						.duration(500)
						.attr('rx', 15);
							Repo.displayRepoName($(this)[0]['__data__']['name'] + // displays repo name
								" (" + $(this)[0]['__data__']['language'] + ')'); // displays repo language (main)
					})

					.on('mouseleave', function() {
						d3.select(this)
						.transition()
						.duration(1000)
						.style('fill', function(d, i){
							return Color.stringColor(d['language'].toString()); // resets color
						})
						.transition()
						.duration(500)
						.attr('rx', 5);
					})
					.on('click', function() {
						window.open(this.__data__['html_url']); // opens github page on click
					});
			});
	},

	// sets height of container based on num repos and creates svg canvas
	// on top of back
	repoCanvas: function(h) {
		
		// sizes canvas
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

		// creates svg canvas
		var canvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('height', h)
			.attr('width', 900)
			.attr('id','repo-container-canvas');
		return canvas;
	},

	activeSortButtons: function() {
		$('.sort-button').click(function(e) {
			e.preventDefault();

			$('.default').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default');

			Repo.resortGrid($(this).attr('href').toString());

		});
	},

	resortGrid: function(sortType) {
			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type': sortType}
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