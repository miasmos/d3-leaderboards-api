var cheerio = require('cheerio');
var moment = require('moment');
var request = require('request');
var D3Leaderboards = function() {
	var self = this;
	this.defaultTop = 100;
	this.requestOpts = {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36'
		}
	};

	this.baseURL = 'http://us.battle.net/d3/en/rankings/';
	this.seasonURL = {
		season: 'season/%era%/rift', 
		nonseason: 'era/%era%/rift', 
		seasonHardcore: 'season/%era/rift-hardcore',
		nonseasonHardcore: 'era/%era%/rift-hardcore',

	};
	this.eras = {1:'1', 2:'2'};
	this.classes = {
		1: 'barbarian', 
		2: 'monk', 
		3: 'dh', 
		4: 'wd', 
		5: 'wizard', 
		6: 'crusader'
	};
	this.teams = {
		1: '%class%',
		2: 'team-2',
		3: 'team-3',
		4: 'team-4'
	}

	this.setURL = function(team, seasonal, hardcore, era, clas, page) {
		var url = this.baseURL;
		if (seasonal && hardcore) url += this.seasonURL.seasonHardcore;
		if (seasonal && !hardcore) url += this.seasonURL.season;
		if (!seasonal && hardcore) url += this.seasonURL.nonseasonHardcore;
		if (!seasonal && !hardcore) url += this.seasonURL.nonseason;

		url += '-' + this.teams[team];
		url = url.replace('%era%', this.eras[era]);
		url = url.replace('%class%', this.classes[clas]);
		this.requestOpts.url = url + '#page=' + page;
		console.log('requesting '+this.requestOpts.url);
	}

	this.parseHTML = function(html, cb) {
		$ = cheerio.load(html);
		var json = {};
		$('#ladders-table tbody tr').map(function(i, link) {
			var rank = parseInt(self.prettify($(link).find('.cell-Rank').attr('data-raw')));
			if (typeof rank === 'undefined' || isNaN(rank)) return;
			json[rank] = {};
			json[rank].rank = rank;
			json[rank].battleTag = self.prettify($(link).find('.cell-BattleTag a').attr('href'));
			json[rank].characterGender = $(link).find('.cell-BattleTag img').attr('src');
			json[rank].characterGender = typeof json[rank].characterGender === 'undefined' ? json[rank].characterGender : json[rank].characterGender.indexOf('male') > -1 ? 'm' : 'f'
			json[rank].riftLevel = parseInt(self.prettify($(link).find('.cell-RiftLevel').text()));
			json[rank].riftTime = moment(self.prettify($(link).find('.cell-RiftTime').text()), "mm ss.SSS").format("x");
			json[rank].completedTime = moment(self.prettify($(link).find('.cell-CompletedTime').text()), "MMMM D, YYYY h:m A").format("X");
		});
		cb(json);
	}

	this.getPage = function(top, team, seasonal, hardcore, era, clas, cb) {
		var self = this;

		if (typeof top === 'undefined') top = this.defaultTop;
		var pages = Math.floor(top/100);
		var resps = 0;
		var errs = 0;
		var json = [];
		for (var i = 1; i <= pages; i++) {
			this.setURL(team, seasonal, hardcore, era, clas, i);
			request(this.requestOpts, function(err, resp, html) {
				if (err) {
					console.error(err);
					this.getPage(top, team, seasonal, hardcore, era, clas, cb);
				} else {
					self.parseHTML(html, function(json) {
						json[i] = this.json;
						resps++;
						if (err && !errs) errs = {};
						if (err) errs[i] = err;
						if (resps == pages) cb(errs, json);
					});
				}
			});
		}
	};

	this.prettify = function(str) {if (typeof str === 'undefined') {return str} else {str = str.replace('/d3/en/profile/', ''); return str.replace(/^\s+|\s+$|^\/|\/$/g, '');}}
};

D3Leaderboards.prototype.seasonalBarbarian = function(top, cb) {
	this.getPage(top, 1, true, false, 2, 1, cb);
}

module.exports = new D3Leaderboards();