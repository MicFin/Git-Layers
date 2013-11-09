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

		max = Commits.commitMax(commits),
		commitDomain = Commits.commitDomain(commits),
		w = $(window).width(),
		h = $('#repo-container-back').height() * 0.85;

		console.log(commitDomain);

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
		domain = [Commits.formatDate(first), Commits.formatDate(last)];
		console.log(Commits.numberOfDays(domain));
		return domain;
	},

	formatDate: function(dateString) {
		var dateArray = dateString.split('T'),
			date = dateArray[0].split('-'),
			time = dateArray[1].split(':');

		time[2] = time[2].split('Z')[0];

		$(time).each(function(value, index) {
			time[index] = parseInt(value, 10);
		});

		return new Date(date[0], date[1], date[2], time[0], time[1], time[2]);
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

	numberOfDays: function(minMaxArray) {
		var milliseconds = minMaxArray[1] - minMaxArray[0];
		return milliseconds* 1.15741E-8
	}
}