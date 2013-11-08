var Commits = {

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

	graphCommits: function(commits) {

		var dateDomain = Commits.commitDomain(commits),
		commitsByDate = Commits.sortCommits(commits),
		max = Commits.commitMax(commitsByDate),
		w = $(window).width(),
		h = $('#repo-container-back').height() * 0.85;
		x  = d3.scale.linear().domain(dateDomain).range([100, w-100]);
		y = d3.scale.linear().domain([0, max]).range([0, h - 50]);

		// $('#repo-container-back').append($(document.createElement('div')).attr('id','graph-container'));

		vis = d3.select('#repo-container-back')
						.append('svg:svg')
						.attr('id', 'commits-graph-canvas')
						.attr('width', w)
						.attr('height', h);

		vis.selectAll('path.line')
			.data([commitsByDate])
			.enter()
			.append('svg:path')
			.attr('id', 'commits-line')
			.attr('d', d3.svg.line()
				.x(0)
				.y(h/2))
			.attr('stroke-width', 4)
			.attr('stroke', function() {
				return Color.stringColor(Repo.currentRepo['language']);
			})
			.transition()
			.delay(100)
			.duration(1000)
			.attr('d', d3.svg.line()
				.x(function(d,i) {
					var value = parseInt(Object.keys(d)[0].split('-').join(""), 10);
					return x(value);
				})
				.y(h/2))
			.transition()
			.duration(1000)
			.attr('d', d3.svg.line()
				.x(function(d,i) {
					var value = parseInt(Object.keys(d)[0].split('-').join(""), 10);
					return x(value);
				})
				.y(function(d,i) {
					return h - y(d[Object.keys(d)[0]].length);
				})
			)
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

		return [Commits.formatDate(first),Commits.formatDate(last)]
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

	formatDate: function(date) {
		return parseInt(date.split('T')[0].split('-').join(""), 10);
	},

	sortCommits: function(commits)  {
		var i = 0, length = commits.length, sortedCommits={},
			sortedCommitsArray = [], dateCommitPair = {};

		// creates a sort of frequency hash for dates and commits
		for(;i<length;) {
			date = commits[i].commit.committer.date.split('T')[0];
			sortedCommits[date] = sortedCommits[date] || [];
			sortedCommits[date].push(commits[i]);
			i+=1;
		}

		// converts date-comment frequency hash to array of date:commit-array pairs
		for(date in sortedCommits) {
			dateCommitPair = {};
			dateCommitPair[date] = sortedCommits[date];
			sortedCommitsArray.push(dateCommitPair);
		}
		return sortedCommitsArray;
	}

}