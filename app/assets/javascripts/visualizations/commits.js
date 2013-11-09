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

		Commits.allCommits = commits;
		Commits.sortedCommits = Commits.sortCommitsByDate(commits);
		Commits.max = Commits.commitMax(Commits.sortedCommits);
		Commits.commitDomain = Commits.commitDomain(commits);
		Commits.graphWidth = $(window).width();
		Commits.graphHeight = $('#repo-container-back').height();
		Commits.dayDifference = Commits.numberOfDays(Commits.commitDomain);
		
		Commits.graphCanvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('id','commits-graph-canvas')
			.attr('height', Commits.graphHeight)
			.attr('width', Commits.graphWidth);

	
		if(Commits.dayDifference <= 60) {
			Commits.graphByDays()
		}

	},

	graphByMonths: function() {

	},

	graphByDays: function()  {

		var barHeight = d3.scale.linear()
			.domain([0, Commits.max])
			.range([Commits.paddingBottom, Commits.graphHeight - Commits.paddingTop]);

		var barIndex = d3.time.scale()
			.domain(Commits.commitDomain)
			.range([0, Commits.dayDifference - 1]);

		var barPosition = d3.scale.linear()
			.domain([0, Commits.dayDifference -1])
			.range([Commits.paddingLeft, Commits.graphWidth - Commits.paddingRight]);

		barWidth = Commits.graphWidth/Commits.dayDifference;

		var currentBarHeight = 0;

		Commits.graphCanvas.selectAll('rect')
			.data(Commits.sortedCommits)
			.enter()
			.append('rect')
			.attr('x', function(d,i){
				var index;
				for(key in d) {
					index = barIndex(Commits.formatDate(d[key][0].commit.committer.date));
				}
				return barPosition(index);
			})
			.attr('height',0)
			.attr('y', Commits.graphHeight)
			.attr('fill', function() {
				return Color.stringColor(Repo.currentRepo['language']);
			})
			.attr('rx', 2)
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
			.attr('width', barWidth - 5);

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

	numberOfDays: function(minMaxArray) {
		var milliseconds = minMaxArray[1] - minMaxArray[0];
		return parseInt(milliseconds* 1.15741E-8, 10);
	}
}