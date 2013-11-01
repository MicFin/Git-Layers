// Global namespace for single repo rendering functions
var Repo = {


	renderRepo: function(repo) {
		$('.profile-section-header')
			.html('<h2>' + repo["name"] + '</h2>');
		Repo.renderRepoContainer();
		Repo.currentRepo = repo;
		Repo.commits();

	},

	renderRepoContainer: function() {

		$('#repo-container-back')
			.animate({
				'opacity': 1,
				'height': Repo.containerHeight()	
			}, 1000, function() {
				Page.addBackButton();
			});

	},

	repoContainerResize: function() {

		$(window).resize(function() {
			$('#repo-container-back')
				.animate({
					'opacity': 1,
					'height': Repo.containerHeight()	
				}, 50);
		})
	},

	containerHeight: function() {
		return 400;
	},

	commits: function() {
		var i = 0, max;
		$.ajax({
			url: '/users/repos/commits',
			type: 'GET',
			data: {'commits_url': Repo.currentRepo["commits_url"].split("{")[0]}
		}).done(function(commits) {
			Repo.graph(commits);
		});
	},

	graph: function(commits) {

		var dateDomain = Repo.commitDomain(commits),
		commitsByDate = Repo.sortCommits(commits),
		max = Repo.commitMax(commitsByDate),
		w = 1000,
		h = 300,
		x  = d3.scale.linear().domain(dateDomain).range([100, w-100]);
		y = d3.scale.linear().domain([0, max]).range([0, h - 50]);

		console.log(max);

		vis = d3.select('body')
			.append('svg:svg')
			.attr('width', w)
			.attr('height', h);

		vis.selectAll('path.line')
			.data([commitsByDate])
			.enter()
			.append('svg:path')
			.attr('d', d3.svg.line()
				.x(function(d,i) {
					var value = parseInt(Object.keys(d)[0].split('-').join(""), 10);
					return x(value);
				})
				.y(function(d,i) {
					return h - y(d[Object.keys(d)[0]].length);
				}));
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

		return [Repo.formatDate(first),Repo.formatDate(last)]
	},

	commitMax: function(sortedCommitsArray) {
		var i = 0, length = sortedCommitsArray.length,
			max = 0, commitsForDate = 0;
		for(;i < length;) {
			for(key in sortedCommitsArray[i]) {
				commitsForDate = sortedCommitsArray[i][key].length;
				console.log(commitsForDate);
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