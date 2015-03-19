//run node server.js
var lb = require('./client.js');

lb.SeasonalBarbarian(2, function(err, data) {
	console.log(data);
})