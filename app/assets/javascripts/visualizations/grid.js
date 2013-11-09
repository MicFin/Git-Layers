// Global namespace for Grid rendering functions
var Grid = {
	
	// Default grid layout values
	GRID_BLOCK_SIZE : 60,
	SQUARE_SIZE: 50,
	COLUMNS: 15,
	CANVAS_WIDTH: 900,
	CANVAS_HEIGHT: 0,


	// checks for no-repos, otherwise calls display functions 
	// to put grid on page
	initGridLayout: function(repos) {

		$(function() {
			if(Grid.checkRepos(repos.length)) {
				Grid.setGridDimensions(repos.length);
				Page.addContentHeader('Hover a Repo')
				Grid.writeRepoGrid(repos);
				Grid.addGridButtons();
				$(window).resize(function() {
					Grid.horizontalResize();
				});
			}
		});
		
	},

	// sets the dimensions of the grid based on the number of repositories. 
	setGridDimensions: function(number_repos) {

		Grid.setGridColumns(number_repos);
		Grid.calcCanvasHeight(number_repos);

	},

	// sets number of columsn based on the number of repositories
	setGridColumns: function(number_repos) {

		if(number_repos < 9) { Grid.COLUMNS = number_repos;}
		else if(number_repos <= 30) { Grid.COLUMNS = 9; }
		else if(number_repos <= 40) { Grid.COLUMNS = 11; }
		else if(number_repos <= 50) { Grid.COLUMNS = 13; }
		else if(number_repos <= 60) { Grid.COLUMNS = 15;}
		else { Grid.COLUMNS = 17; }
		Grid.CANVAS_WIDTH = Grid.GRID_BLOCK_SIZE * Grid.COLUMNS

	},

	// Calculates the necessary height of the canvas based on the number of repos
	calcCanvasHeight: function(number_repos) {

		var adjustment = 1, COLUMNS = Grid.COLUMNS;
		if(number_repos % COLUMNS === 0) { adjustment = 0 }
		Grid.CANVAS_HEIGHT = parseInt((number_repos/ COLUMNS) + adjustment, 10) * Grid.GRID_BLOCK_SIZE;

	},

	// recalculates the padding on either side of the canvas to center it
	horizontalResize: function() {

		$('#repo-container-back')
			.css('padding-left', function() {
				return $(window).width()/2 - Grid.CANVAS_WIDTH/2;
			})
			.css('padding-right', function() {
				return $(window).width()/2 - Grid.CANVAS_WIDTH/2;
		});

	},

	// displays alert on page if no repos are found for user
	checkRepos: function(num_repos) {

		if(!num_repos) {
			$('#repo-name-wrapper').remove();
			$('#sort-button-wrapper').remove();
			$('#split-button-wrapper').remove();
			$('#repo-container-back')
				.append('<h1> Oh Noes!</h1>')
				.append('<h3 id="repoless-message">You Don\'t Have any Repos! Get to it!</h3>');
				return false;
		}
		return true;

	},

	// Adds buttons for grid view
	addGridButtons: function() {
		Page.addSortButtons();
		Page.addSplitButtons();
	},

	// displays the repo grid on the page and sets event listeners for
	// individual squares
	writeRepoGrid: function(repos) {

		// creates svg canvas
		svg = Grid.renderGridCanvas();
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
			return (i % Grid.COLUMNS) * Grid.GRID_BLOCK_SIZE;
		})
		.attr('y', function(d, i){
			return parseInt(i / Grid.COLUMNS, 10) * Grid.GRID_BLOCK_SIZE;
		})
		.transition() // expands squares based randomly (within time limit)
		.delay(function() {
			return 500 + (Math.random() * (Math.random() + 2)) * 100;
		})
		.duration(function() {
			return 500 + (Math.random() * (Math.random() + 3)) * 300;
		})
		.attr('height', Grid.SQUARE_SIZE)
		.attr('width', Grid.SQUARE_SIZE)
		.each('end', function() {
			Grid.setGridEvents(this);
		});

	},

	// generates svg canvas for the grid
	renderGridCanvas: function() {

		Page.renderContentContainer(Grid.CANVAS_WIDTH, Grid.CANVAS_HEIGHT);

		// removes old repo-canvas to prevent multiple 
		// canvases if buttons clicked in quick succession.
		$("#repo-container-canvas").remove();

		// creates svg canvas
		canvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('height', Grid.CANVAS_HEIGHT)
			.attr('width', Grid.CANVAS_WIDTH)
			.attr('id','repo-container-canvas');

		return canvas;
	},

	// calls controller to get repos sorted in specified way and renders them
	renderGrid: function(sortType, splitType) {
			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type': sortType, 'split_type': splitType}
			}).done(function(data) {
				Grid.clearCanvas();
				d3.select('#repo-container-canvas')
					.transition()
					.delay(500)
					.duration(10)
					.each('end', function() {	
						Grid.initGridLayout(data);
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

	closeGrid: function() {
		$('#repo-container-back').animate({
			'height': 0,
			'padding': 0,
			'opacity': 0
		},1000, function() {
			$(this).children().remove();
		});
		Page.removePageButtons();
	},

	// adds grid events to d3 square
	setGridEvents: function(repo) {
		Grid.setGridMouseEnter(repo);
		Grid.setGridMouseLeave(repo);
		Grid.setGridClicks(repo);
	},

	// adds mouse enter event for grid square
	setGridMouseEnter: function(repo) {
		d3.select(repo)
		.on('mouseenter', function() {
			d3.select(repo)
			.transition()
			.duration(50)
			.style('fill', function(d, i){
				return Color.stringHover(d['language'].toString()); //changes square colors
			})
			.transition()
			.duration(2000)
			.attr('rx', 15);
				Page.setContentHeader($(repo)[0]['__data__']['name'] + // displays repo name
					"(" + $(repo)[0]['__data__']['language'] + ')'); // displays repo language (main)
		})
	},

	// adds mouse leave event for grid square
	setGridMouseLeave: function(repo) {
		d3.select(repo)
		.on('mouseleave', function() {
			d3.select(repo)
			.transition()
			.duration(1000)
			.style('fill', function(d, i){
				return Color.stringColor(d['language'].toString()); // resets color
			})
			.attr('rx', 5);
		})
	},

	// adds click events for grid squares
	setGridClicks: function(repo) {
		d3.select(repo)
		.on('click', function(d, i) {
			// window.open(repo.__data__['html_url']); // opens github page on click
			Grid.clearCanvas();
			Grid.closeGrid();
			Repo.renderRepo(d);
		});
	}

};