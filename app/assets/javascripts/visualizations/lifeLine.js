var LifeLine = {

	data: [],

	graph: function(repos, access_token) {
		var i=0, max=repos.length;
		for(i; i < max; i+=1) {
			$.ajax({
				type: 'GET',
				url: repos[i]['commits_url'].split('{')[0],
				dataType: 'json',
				params: {'access_token' : access_token},
				cache: true
			}).done(function(data) {
				LifeLine.data.push(data);
				console.log(LifeLine.data);
			});
		}
	},

	plot: function(commits) {
		var i=0, max=commits.length;
		for(i; i < max; i+=1) {
			$('#main').append('<p>' + commits[i]['commit']['message'] + '</p>');
		}
	}

	
};