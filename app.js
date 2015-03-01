var d3lb = require('./DiabloLeaderboards');

d3lb.seasonalBarbarian(100, function(err, json) {
	if (err) console.log(err);
	//console.dir(json);
	if (json && !err) console.log('success');
});