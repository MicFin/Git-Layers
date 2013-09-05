var Color = {
	stringColor: function(string) {
		if (string.length < 6) {
			while(string.length < 6) {
				string += 'ax';
			}
		}
		var r = Math.abs(string[0].charCodeAt(0) - string[1].charCodeAt(0)) * 5;
		var g = Math.abs(string[2].charCodeAt(0) - string[3].charCodeAt(0)) * 5;
		var b = Math.abs(string[4].charCodeAt(0) - string[5].charCodeAt(0)) * 5;
		colors = [r,g,b];
		colors = _.map(colors, function(value) {
			if(value > 200) {
				return 200;
			} else
			if (value < 10) {
				return 75;
			}
			return value;
		});
		return "rgb(" + colors[0] + ',' + colors[1] + ',' + colors[2] + ')';
	},

	stringHover: function(string) {
		if (string.length < 6) {
			while(string.length < 6) {
				string += 'ax';
			}
		}
		var r = Math.abs(string[0].charCodeAt(0) - string[1].charCodeAt(0)) * 7;
		var g = Math.abs(string[2].charCodeAt(0) - string[3].charCodeAt(0)) * 7;
		var b = Math.abs(string[4].charCodeAt(0) - string[5].charCodeAt(0)) * 7;
		colors = [r,g,b];
		colors = _.map(colors, function(value) {
			if(value > 200) {
				return 200;
			} else if (value < 10) {
				return 75;
			}
			return value;
		});
		return "rgb(" + colors[0] + ',' + colors[1] + ',' + colors[2] + ')';
	}
};