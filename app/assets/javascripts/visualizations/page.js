var Page = {

	removePageButtons: function() {
		$('#back-button-wrapper, #sort-button-wrapper, #split-button-wrapper').animate({
			'opacity': 0
		},1000, function(){
			$(this).remove();
		})
	},

	addBackButton: function() {
		$('body').append(Page.generateBackButton())
			$('#back-button-wrapper').animate({
				'opacity':1
			},1000);
		Page.setBackButtonClick();
	},

	generateBackButton: function() {
		var wrapper = $( document.createElement('div'))
			.attr('id','back-button-wrapper')
			.css('opacity', '0'),
		button = $( document.createElement('div')).addClass('medium info btn rounded')
			.html('<a href="/profile" class="back-button">Back to the Grid</a>')
		return wrapper.append(button);
	},

	setBackButtonClick: function() {
		$('.back-button').click(function(e) {
			e.preventDefault();
			Page.removePageButtons();
			Repo.resetPageElements();
			$.ajax({
				url: '/users/repos',
				type: 'GET',
				data: {'sort_type': 'none', 'split_type': 'none'}
			}).done(function(data) {
				Grid.initGridLayout(data);
			});
		})
	},

}