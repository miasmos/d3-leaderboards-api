var d3lb = require('./DiabloLeaderboards');

d3lb.SeasonalBarbarian(100, function(err, json) {
	if (err) console.log(err);
	console.dir(json['1']);
	if (json && !err) console.log('success');
});

d3lb.Barbarian(100, function(err, json) {
	if (err) console.log(err);
	console.dir(json['1']);
	if (json && !err) console.log('success');
});