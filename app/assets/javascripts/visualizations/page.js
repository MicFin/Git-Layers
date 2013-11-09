var Page = {

	// removes all buttons from page
	removePageButtons: function() {

		$('#back-button-wrapper, #sort-button-wrapper, #split-button-wrapper').animate({
			'opacity': 0
		},1000, function(){
			$(this).remove();
		})

	},

	// adds a back button to the page
	addBackButton: function() {

		$('body').append(Page.generateBackButton())
			$('#back-button-wrapper').animate({
				'opacity':1
			},1000);
		Page.setBackButtonClick();

	},

	// generates back button wrapper with button
	generateBackButton: function() {

		var wrapper = $( document.createElement('div'))
			.attr('id','back-button-wrapper')
			.css('opacity', '0'),
		button = $( document.createElement('div')).addClass('medium info btn rounded')
			.html('<a href="/profile" class="back-button">Back to the Grid</a>')
		return wrapper.append(button);

	},

	// sets click event on back button
	setBackButtonClick: function() {

		$('.back-button').click(function(e) {
			e.preventDefault();
			Page.removePageButtons();
			Page.resetPageElements('Repositories');
			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type': 'none', 'split_type': 'none'}
			}).done(function(data) {
				Grid.initGridLayout(data);
			});
		})

	},

	// adds four sort buttons to page
	addSortButtons: function() {

		$('body').append(Page.generateSortButtons())
			$('#sort-button-wrapper').animate({
				'opacity':1
			},1000);
			Page.setSortButtonsClicks();

	},

	// generates the four sort buttons
	generateSortButtons: function() {

		var wrapper = $( document.createElement('div'))
			.attr('id','sort-button-wrapper')
			.css('opacity', '0'),
		button_one = $( document.createElement('div'))
			.addClass('medium default btn rounded selected-sort-button')
			.html('<a href="created" class="sort-button selected-sort">Created</a>'),
		button_two = $( document.createElement('div'))
			.addClass('medium info btn rounded')
			.html('<a href="updated" class="sort-button">Recent</a>'),
		button_three = $( document.createElement('div'))
			.addClass('medium info btn rounded')
			.html('<a href="full_name" class="sort-button">Alphabetical</a>'),
		button_four = $( document.createElement('div'))
			.addClass('medium info btn rounded')
			.html('<a href="lang" class="sort-button">Language</a>');

		return wrapper.append(button_one).append(button_two).append(button_three).append(button_four);

	},

	// sets click events on four sort buttons
	setSortButtonsClicks: function() {

		$('.sort-button').click(function(e) {
			e.preventDefault();
			$('.selected-sort-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-sort-button');
			$('.selected-sort').removeClass('selected-sort');
			$(this).addClass('selected-sort');
			Grid.renderGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());
		});

	},

	// adds three split buttons
	addSplitButtons: function() {

		$('body').append(Page.generateSplitButtons())
			$('#split-button-wrapper').animate({
				'opacity':1
			},1000);
			Page.setSplitButtonsClicks();

	},

	// generates three split-button types
	generateSplitButtons: function() {

		var wrapper = $( document.createElement('div'))
			.attr('id','split-button-wrapper')
			.css('opacity', '0'),
		button_one = $( document.createElement('div')).addClass('medium default btn rounded selected-split-button')
			.html('<a href="all" class="split-button selected-split">All</a>'),
		button_two = $( document.createElement('div')).addClass('medium info btn rounded')
			.html('<a href="forked" class="split-button">Forked</a>'),
		button_three = $( document.createElement('div')).addClass('medium info btn rounded')
			.html('<a href="created" class="split-button">Created</a>');
		return wrapper.append(button_one).append(button_two).append(button_three);

	},

	// sets click evenets on all three split buttons
	setSplitButtonsClicks: function() {

		$('.split-button').click(function(e) {
			e.preventDefault();
			$('.selected-split-button').removeClass('default').addClass('info');
			$(this).parent().removeClass('info').addClass('default selected-split-button');
			$('.selected-split').removeClass('selected-split');
			$(this).addClass('selected-split');
			Grid.renderGrid($('.selected-sort').attr('href').toString(), $('.selected-split').attr('href').toString());
		});

	},

	resetPageElements: function(header) {

		$('.profile-section-header')
			.html("<h2>" + header + " </h2>");

		if('#commits-graph-canvas') {
			Commits.unGraphCommits
		}
		$("#repo-container-back")
			.animate({
				'height': 0,
				'opacity': 0
			}, 1000, function() {
				$('#repo-container-back #commits-graph-canvas').remove();
			});

	},

}