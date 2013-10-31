// Global namespace for Grid rendering functions
var Grid = {
	
	GRID_BLOCK_SIZE : 60,
	SQUARE_SIZE: 50,
	COLUMNS: 15,
	CANVAS_WIDTH: 900,
	CANVAS_HEIGHT: 0,

	setGridDimensions: function(number_repos) {
		if(number_repos < 9) { Grid.COLUMNS = number_repos; }
		else if(number_repos <= 30) { Grid.COLUMNS = 9; }
		else if(number_repos <= 40) { Grid.COLUMNS = 11; }
		else if(number_repos <= 50) { Grid.COLUMNS = 13; }
		else if(number_repos <= 60) { Grid.COLUMNS = 15;}
		else { Grid.COLUMNS = 17; }
		Grid.CANVAS_WIDTH = Grid.GRID_BLOCK_SIZE * Grid.COLUMNS
	},

	calcCanvasHeight: function(repos) {
		var adjustment = 1, COLUMNS = Grid.COLUMNS, number_repos = repos.length
		if(number_repos % COLUMNS === 0) { adjustment = 0 }
		Grid.CANVAS_HEIGHT = parseInt((number_repos/ COLUMNS) + adjustment, 10) * Grid.GRID_BLOCK_SIZE;
	},

	// checks for no-repos, otherwise calls display functions 
	// to put grid on page
	initGridLayout: function(repos) {

		$(function() {
			
			if(Grid.anyRepos(repos)) {
				Grid.setGridDimensions(repos.length);
				Grid.calcCanvasHeight(repos);
				Grid.addRepoName();
				Grid.writeRepoGrid(repos);
				Grid.activateButtons();
				$(window).resize(function() {
					Grid.horizontalResize();
				});
			}
		});
		
	},



	// displays alert on page if no repos are found for user
	anyRepos: function(repos) {
		if(!repos) {
			$('#repo-name-wrapper').remove();
			$('#sort-button-wrapper').remove();
			$('#split-button-wrapper').remove();
			$('#repo-container-back')
				.append('<h1> Oh Noes!</h1>')
				.append('<h3 id="repoless-message"> You Don\'t Have any Repos! </h3>');
				return false;
		}
		return true;
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
							Grid.displayRepoName($(this)[0]['__data__']['name'] + // displays repo name
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
					.on('click', function(d, i) {
						// window.open(this.__data__['html_url']); // opens github page on click
						Grid.clearCanvas();
						Grid.closeGrid();
						Repo.renderRepo(d);
					});
			});
	},


	// sets height of container based on num repos and creates svg canvas
	// on top of back
	renderGridCanvas: function() {
		// sizes canvas
		var padding = $(window).width()/2 - Grid.CANVAS_WIDTH/2;
		$('#repo-container-back')
			.animate({
				'height': Grid.CANVAS_HEIGHT + 105,
				'padding-left':  padding,
				'padding-right': padding,
				'padding-top': '20px',
				'opacity': 1
			}, 1000);

		// removes old repo-canvas to prevent multiple canvases
		// if buttons are clicked in quick succession. 
		$("#repo-container-canvas").remove();

		// creates svg canvas
		var canvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('height', Grid.CANVAS_HEIGHT)
			.attr('width', Grid.CANVAS_WIDTH)
			.attr('id','repo-container-canvas');

		return canvas;
	},

	// sets event listeners for sort and split buttons
	activateButtons: function() {

		$('.sort-button').click(function(e) {
			e.preventDefault();
			$('.selected-sort-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-sort-button');
			$('.selected-sort').removeClass('selected-sort');
			$(this).addClass('selected-sort');
			Grid.renderGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());
		});


		$('.split-button').click(function(e) {
			e.preventDefault();
			$('.selected-split-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-split-button');
			$('.selected-split').removeClass('selected-split');
			$(this).addClass('selected-split');
			Grid.renderGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());

		});
	},

	// calls the backend to get repos sorted in specified way and displays them on grid
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
						Grid.setGridDimensions(data.length);
						Grid.horizontalResize();
						Grid.calcCanvasHeight(data);
						Grid.writeRepoGrid(data);
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

	// changes the #repo-name tag to the input name
	displayRepoName: function(name) {
		$('#repo-name').html(name);
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

	addRepoName: function() {
		$('#repo-container-back')
			.append("	<div id='repo-name-wrapper'><p id='repo-name'>Hover A Repo</p></div>");
	}
};