var express = require('express');
var d3lb = require('./client');
var app = express();

app.param('team', function(req, res, next, id) {
	if (req.params.team != '2' && req.params.team != '3' && req.params.team != '4') {
		endReq(req, res, "invalid team");
	} else {
		next();
	}
});
app.param('era', function(req, res, next, id) {
	if (req.params.era != '1' && req.params.era != '2' && req.params.era != '3' && req.params.era != '4' && req.params.era != '5') {
		endReq(req, res, "invalid era");
	} else {
		next();
	}
});
app.param('class', function(req, res, next, id) {
	switch(req.params.class) {
		case 'barbarian':
			req.params.class = '1';
			next();
			break;
		case 'monk':
			req.params.class = '2';
			next();
			break;
		case 'demon-hunter':
			req.params.class = '3';
			next();
			break;
		case 'witch-doctor':
			req.params.class = '4';
			next();
			break;
		case 'wizard':
			req.params.class = '5';
			next();
			break;
		case 'crusader':
			req.params.class = '6';
			next();
			break;
		default:
			endReq(req, res, "invalid class");
	}
});

app.get('/season/:era/class/:class', function(req, res) {
	console.log('serving /season/'+req.params.era+"/class/"+req.params.class);
	d3lb.SeasonalClass(req.params.era, req.params.class, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/era/:era/class/:class', function(req, res) {
	console.log('serving /era/'+req.params.era+"/class/"+req.params.class);
	d3lb.Class(req.params.era, req.params.class, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/season/:era/team/:team', function(req, res) {
	console.log('serving /season/'+req.params.era+"/team/"+req.params.team);
	d3lb.SeasonalTeam(req.params.era, req.params.team, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/era/:era/team/:team', function(req, res) {
	console.log('serving /era/'+req.params.era+"/team/"+req.params.team);
	d3lb.Team(req.params.era, req.params.team, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/season/hardcore/:era/class/:class', function(req, res) {
	console.log('serving /season/hardcore/'+req.params.era+"/class/"+req.params.class);
	d3lb.SeasonalHardcoreClass(req.params.era, req.params.class, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/era/hardcore/:era/class/:class', function(req, res) {
	console.log('serving /era/hardcore/'+req.params.era+"/class/"+req.params.class);
	d3lb.HardcoreClass(req.params.era, req.params.class, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/season/hardcore/:era/team/:team', function(req, res) {
	console.log('serving /season/hardcore/'+req.params.era+"/team/"+req.params.team);
	d3lb.SeasonalHardcoreTeam(req.params.era, req.params.team, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

app.get('/era/hardcore/:era/team/:team', function(req, res) {
	console.log('serving /era/hardcore/'+req.params.era+"/team/"+req.params.team);
	d3lb.HardcoreTeam(req.params.era, req.params.team, function(err, json) {
		reqCallback(req, res, err, json);
	});
});

function reqCallback(req, res, err, json) {
	if (err) {
		endReq(req, res, err);
	} else {
		endReq(req, res, undefined, json);
	}
}

function endReq(req, res, err, json) {
	var ret = {};
	if (err) {
		ret.status = "error";
		ret.message = err;
	} else {
		console.log('success');
		ret.status = "ok";
		ret.message = "";
	}
	ret.data = json ? json : {};
	res.send(ret);
	res.end();
}

app.listen(1000);
console.log('listening on port 1000');