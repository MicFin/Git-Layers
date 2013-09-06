var Repo = {

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
			.attr('fill', function(d, i) {
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
				return 500 + (Math.random() * (Math.random() + 1)) * 100;
			})
			.duration(700)
			.attr('height', 50)
			.attr('width', 50)
			.each('end', function() {
				d3.select(this)
					.on('mouseenter', function() {
						d3.select(this)
						.transition()
						.duration(50)
						.attr('fill', function(d, i){
							return Color.stringHover(d['language'].toString());
						})
						.transition()
						.duration(500)
						.attr('rx', 15);
					})
					.on('mouseleave', function() {
						d3.select(this)
						.transition()
						.duration(1000)
						.attr('fill', function(d, i){
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
		$('<div>')
			.css('height', h + 40)
			.css('padding-left', function() {
				return $(window).width()/2 - 450;
			})
			.css('padding-right', function() {
				return $(window).width()/2 - 450;
			})
			.attr('id', 'repos_container')
			.appendTo('#main');

		var svg = d3.select('#repos_container')
			.append('svg')
			.attr('height', h)
			.attr('width', 900);

		return svg;
	}

};