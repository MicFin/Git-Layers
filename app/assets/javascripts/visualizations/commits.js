var Commits = {

	paddingLeft: 60,
	paddingRight: 60,
	paddingTop: 20,
	paddingBottom: 20,


	// makes ajax request to get commits for repoistory
	fetchCommits: function() {
		var i = 0, max;
		$.ajax({
			url: '/users/repos/commits',
			type: 'GET',
			data: {'commits_url': Repo.currentRepo["commits_url"].split("{")[0]}
		}).done(function(commits) {
			Commits.graphCommits(commits);
		});
	},

	// graphs commits based on the time that the repo
	// has been active (by days or by months)
	graphCommits: function(commits) {

		Page.addContentHeader('Hover a Bar')
		Commits.allCommits = commits;
		Commits.sortedCommits = Commits.sortCommitsByDate(commits);
		Commits.max = Commits.commitMax(Commits.sortedCommits);
		Commits.commitDomainDates = Commits.commitDomain(commits);
		Commits.graphWidth = $(window).width();
		Commits.graphHeight = $('#repo-container-back').height() - 55;
		Commits.dayDifference = Commits.numberOfDays(Commits.commitDomainDates);

		
		Commits.graphCanvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('id','commits-graph-canvas')
			.attr('height', Commits.graphHeight)
			.attr('width', Commits.graphWidth);

		Commits.graphByDays()
	},

	graphByMonths: function() {

	},


	// graphs commits as a function of days
	graphByDays: function()  {


		// sets up dimensions of the graph
		var barWidth = (Commits.graphWidth - Commits.paddingRight - Commits.paddingLeft)/Commits.dayDifference,
		barPadding = (0.1) * barWidth,
		barWidth = (0.9) * barWidth;

		if(Commits.sortedCommits.length === 1) {
			barWidth = Commits.graphWidth - Commits.paddingRight - Commits.paddingLeft;
			barPadding = 0;
		}

		// sets up a scaling function that takes in a number of commits and 
		// returns a height value with in the range of the graph height
		var barHeight = d3.scale.linear()
			.domain([0, Commits.max])
			.range([Commits.paddingBottom, Commits.graphHeight - Commits.paddingTop]);


		// sets up indexing scale for dates. Takes in a date within the given
		// domain and returns the index of the day from the day of the first
		// commit
		var barIndex = d3.time.scale()
			.domain(Commits.commitDomainDates)
			.range([0, Commits.dayDifference - 1]);


		// sets up scaling function to calculate teh x position of a bar based
		// on the number of days between the first and last commit and the index
		// of the bar calculated with the function above
		var barPosition = d3.scale.linear()
			.domain([0, Commits.dayDifference])
			.range([Commits.paddingLeft, Commits.graphWidth - Commits.paddingRight]);

		Commits.graphCanvas.selectAll('rect')
			.data(Commits.sortedCommits)
			.enter()
			.append('rect')
			.attr('x', function(d,i){

				// gets index from date-commitArray pair
				var index = barIndex(Commits.dateFromPair(d));
				
				// unpadded if it is first commit
				if(i === Commits.sortedCommits.length - 1) {
					return barPosition(index);
				}
				return barPosition(index) + barPadding;
			})
			.attr('y', Commits.graphHeight)
			.attr('height', 0)
			.attr('width', barWidth)
			.attr('fill', function() {return Color.stringColor(Repo.language);})
			.attr('stroke', function() {return Color.stringColor(Repo.language);})
			.attr('rx', 2)
			// starts transition in
			.transition()
			.delay(function(d,i) {
				return (Math.random() * (Math.random() + 2)) * 100;
			})
			.duration(1000)
			.attr('height', function(d,i) {
				var length;
				for(key in d){
					length = d[key].length;
				}
				return barHeight(length);
			})
			.attr('y', function(d,i) {
				var length;
					for(key in d){
						length = d[key].length;
					}
				return Commits.graphHeight - barHeight(length) + 2;
			})
			.each('end', function() {
				Commits.setBarMouseEnter(this);
				Commits.setBarMouseLeave(this);
			});
	},

	commitDomain: function(commits) {
		var i = 0, length = commits.length,
		first = commits[0].commit.committer.date,
		last = first;

		for(;i < length;) {
			date = commits[i].commit.committer.date;
			if(date < first) {
				first = date;
			} else if(date > last) {
				last = date;
			}
			i+=1;
		}
		return [Commits.formatDate(first), Commits.formatDate(last)];
	},

	formatDate: function(dateString) {
		var dateArray = dateString.split('T'),
			date = dateArray[0].split('-');

		return new Date(date[0], date[1], date[2]);
	},

	commitMax: function(sortedCommitsArray) {
		var i = 0, length = sortedCommitsArray.length,
			max = 0, commitsForDate = 0;
		for(;i < length;) {
			for(key in sortedCommitsArray[i]) {
				commitsForDate = sortedCommitsArray[i][key].length;
				if(commitsForDate > max) {
					max = commitsForDate
				}
			}
			i += 1;
		}
		return max;
	},

	sortCommitsByDate: function(commits) {
		var byDateObj = {}, i = 0, length = commits.length,
			max = 0, date, byDateArray = [];

		for(;i<length;) {
			date = Commits.formatDate(commits[i].commit.committer.date);
			byDateObj[date] = byDateObj[date] || [];
			byDateObj[date].push(commits[i]);
			i += 1;
		}

		for(var key in byDateObj) {
			dateObject = {}
			dateObject[key] = byDateObj[key];
			byDateArray.push(dateObject);
		}
		return byDateArray;
	},

	setBarMouseEnter: function(bar) {
		d3.select(bar)
			.on('mouseenter', function(d,i) {
				d3.select(this)
					.transition()
					.duration(50)
					.style('fill', function() {
						return Color.stringHover(Repo.language);
					});

			for(key in d) {
				Page.setContentHeader(Commits.formatDate(d[key][0].commit.committer.date).toDateString() + " | " + d[key].length + " Commits ");
			}
		});
	},

	setBarMouseLeave: function(bar) {
		d3.select(bar)
		.on('mouseleave', function() {
			d3.select(this)
					.transition()
					.duration(1000)
					.style('fill', function() {
						return Color.stringColor(Repo.language);
					});
			});
	},

	numberOfDays: function(minMaxArray) {
		var milliseconds = minMaxArray[1] - minMaxArray[0];
		return parseInt(milliseconds* 1.15741E-8, 10) + 1;
	},

	dateFromPair: function(datePair) {
		for(key in datePair) {
			return Commits.formatDate(datePair[key][0].commit.committer.date);
		}
	}

}