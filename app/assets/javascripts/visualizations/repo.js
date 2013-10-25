// Global namespace for repo-rendering and repo-fetching functions
var Repo = {
	
	grid_block_size : 60,
	square_size: 50,
	columns: 15,
	canvas_width: 900,
	canvas_height: 0,

	demensionate: function(number_repos) {
		if(number_repos <= 30) {
			Repo.columns = 11;
			Repo.canvas_width = 660
		}
		else if(number_repos <= 50) {
			Repo.columns = 13;
			Repo.canvas_width = 780;
		}
		else {
			Repo.columns = 15;
			Repo.canvas_width = 900;
		}
	},

	calcCanvasHeight: function(repos) {
		var adjustment = 1, columns = Repo.columns, number_repos = repos.length
		if(number_repos % columns === 0) { adjustment = 0 }
		Repo.canvas_height = parseInt((number_repos/ columns) + adjustment, 10) * Repo.grid_block_size;
	},

	// checks for no-repos, otherwise calls display functions 
	// to put grid on page
	initRepoLayout: function(repos) {

		$(function() {
			
			if(Repo.anyRepos(repos)) {
				Repo.calcCanvasHeight(repos);
				Repo.repoGrid(repos);
				Repo.activateButtons();
				$(window).resize(function() {
					Repo.horizontalResize();
				});
			}
		});
		
	},

	// displays alert on page if no repos are found for user
	anyRepos: function(repos) {
		if(!repos) {
			$('#repo-name-wrapper').remove();
			$('#sort-button-wrapper').remove();
			$('#repo-container-back')
				.append('<h1> Oh Noes!</h1>')
				.append('<h3 id="repoless-message"> You Don\'t Have any Repos! </h3>');
				return false;
		}
		return true;
	},

	// displays the repo grid on the page and sets event listeners for
	// individual squares
	repoGrid: function(repos) {

		// creates svg canvas
		svg = Repo.repoCanvas();

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
				return parseInt(i / Repo.columns, 10) * Repo.grid_block_size;
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
						.duration(2000)
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
						.attr('rx', 5);
					})
					.on('click', function() {
						window.open(this.__data__['html_url']); // opens github page on click
					});
			});

	},


	// sets height of container based on num repos and creates svg canvas
	// on top of back
	repoCanvas: function() {
		
		// sizes canvas
		$('#repo-container-back')
			.css('height', Repo.canvas_height + 105)
			.css('padding-left', function() {
				return $(window).width()/2 - Repo.canvas_width/2;
			})
			.css('padding-right', function() {
				return $(window).width()/2 - Repo.canvas_width/2;
			})
			.animate({
				'opacity': 1
			}, 500);

		// creates svg canvas
		var canvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('height', Repo.canvas_height)
			.attr('width', Repo.canvas_width)
			.attr('id','repo-container-canvas');

		return canvas;
	},

	// sets event listeners for sort buttons
	activateButtons: function() {

		$('.sort-button').click(function(e) {
			e.preventDefault();
			$('.selected-sort-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-sort-button');
			$('.selected-sort').removeClass('selected-sort');
			$(this).addClass('selected-sort');
			Repo.resortGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());

		});

		$('.split-button').click(function(e) {
			e.preventDefault();
			$('.selected-split-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-split-button');
			$('.selected-split').removeClass('selected-split');
			$(this).addClass('selected-split');
			Repo.resortGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());

		});
	},

	// calls the backend to get repos sorted in specified way and displays them on grid
	resortGrid: function(sortType, splitType) {
			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type': sortType, 'split_type': splitType}
			}).done(function(data) {
				Repo.clearCanvas();
				d3.select('#repo-container-canvas')
					.transition()
					.delay(500)
					.duration(10)
					.each('end', function() {
						
						Repo.demensionate(data.length);
						Repo.horizontalResize();
						Repo.calcCanvasHeight(data);
						Repo.repoGrid(data);
					})
					.remove();
			});
		},

	// clears the canvas of all repos 
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

	// changes the #repo-name tag to the input name
	displayRepoName: function(name) {
		$('#repo-name').html(name);
	},


	// recalculates the padding on either side of the canvas to center it
	horizontalResize: function() {

		$('#repo-container-back')
			.css('padding-left', function() {
				return $(window).width()/2 - Repo.canvas_width/2;
			})
			.css('padding-right', function() {
				return $(window).width()/2 - Repo.canvas_width/2;
			});

	}
};