var Commits = {

	paddingLeft: 20,
	paddingRight: 20,
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
		Commits.max = Commits.commitMax(commits);
		Commits.commitDomain = Commits.commitDomain(commits);
		Commits.graphWidth = $(window).width();
		Commits.graphHeight = $('#repo-container-back').height() * 0.85 + Commits.paddingBottom + Commits.paddingTop;
		
		Commits.graphCanvas = d3.select('#repo-container-back')
			.append('svg')
			.attr('id','commits-graph-canvas')
			.attr('height', Commits.graphHeight)
			.attr('width', Commits.graphWidth);

		dayDifference = Commits.numberOfDays(Commits.commitDomain);

		if(dayDifference <= 60) {
			Commits.graphByDays(commits)
		}
		console.log(Commits.commitsByDate(commits));

	},

	graphByMonths: function(commits) {
		height = d3.scale.linear().domain()
	},

	graphByDays: function(commits)  {

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
				console.log(key);
				commitsForDate = sortedCommitsArray[i][key].length;
				if(commitsForDate > max) {
					max = commitsForDate
				}
			}
			i += 1;
		}
		return max;
	},

	commitsByDate: function(commits) {
		var byDate = {}, i = 0, length = commits.length,
			max = 0, date, byDateArray = [];

		for(;i<length;) {
			date = Commits.formatDate(commits[i].commit.committer.date);
			byDate[date] = byDate[date] || [];
			byDate[date].push(commits[i]);
			i += 1;
		}

		

		return byDate;

	},

	numberOfDays: function(minMaxArray) {
		var milliseconds = minMaxArray[1] - minMaxArray[0];
		return parseInt(milliseconds* 1.15741E-8, 10);
	}
}