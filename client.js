var cheerio = require('cheerio');
var moment = require('moment');
var request = require('request');
//var async = require('async');
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
		seasonHardcore: 'season/%era%/rift-hardcore',
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

	this.setURL = function(team, seasonal, hardcore, era, clas) {
		var url = this.baseURL;
		if (seasonal && hardcore) url += this.seasonURL.seasonHardcore;
		if (seasonal && !hardcore) url += this.seasonURL.season;
		if (!seasonal && hardcore) url += this.seasonURL.nonseasonHardcore;
		if (!seasonal && !hardcore) url += this.seasonURL.nonseason;

		url += '-' + this.teams[team];
		url = url.replace('%era%', this.eras[era]);
		this.requestOpts.url = url.replace('%class%', this.classes[clas]);
		console.log('requesting '+this.requestOpts.url);
	}

	this.parseHTML = function(html, cb) {
		$ = cheerio.load(html);
		var data = [];
		$('#ladders-table tbody tr').map(function(i, link) {
			var rank = parseInt(self.prettify($(link).find('.cell-Rank').attr('data-raw')));
			if (typeof rank === 'undefined' || isNaN(rank)) return;
			var j = {};
			j.rank = rank;
			j.battleTag = self.prettify($(link).find('.cell-BattleTag a').attr('href'));
			j.characterGender = $(link).find('.cell-BattleTag img').attr('src');
			j.characterGender = typeof j.characterGender === 'undefined' ? j.characterGender : j.characterGender.indexOf('female') > -1 ? 'f' : 'm'
			j.riftLevel = parseInt(self.prettify($(link).find('.cell-RiftLevel').text()));
			j.riftTime = parseInt(moment(self.prettify($(link).find('.cell-RiftTime').text()), "mm ss.SSS").format("x"));
			j.completedTime = parseInt(moment(self.prettify($(link).find('.cell-CompletedTime').text()), "MMMM D, YYYY h:m A").format("X"));
			data.push(j);
		});
		cb(data);
	}

	this.getPage = function(team, seasonal, hardcore, era, clas, cb) {
		var self = this;

		this.setURL(team, seasonal, hardcore, era, clas);
		request(this.requestOpts, function(err, resp, html) {
			if (err) {
				console.error(err);
				this.getPage(team, seasonal, hardcore, era, clas, cb);
			} else {
				self.parseHTML(html, function(json) {
					cb(err, json);
				});
			}
		});
	};

	this.prettify = function(str) {if (typeof str === 'undefined') {return str} else {str = str.replace('/d3/en/profile/', ''); return str.replace(/^\s+|\s+$|^\/|\/$/g, '');}}

	this.SeasonalBarbarian = function(era, cb) {this.getPage(1, true, false, era, 1, cb);}
	this.SeasonalMonk = function(era, cb) {this.getPage(1, true, false, era, 2, cb);}
	this.SeasonalDemonHunter = function(era, cb) {this.getPage(1, true, false, era, 3, cb);}
	this.SeasonalWitchDoctor = function(era, cb) {this.getPage(1, true, false, era, 4, cb);}
	this.SeasonalWizard = function(era, cb) {this.getPage(1, true, false, era, 5, cb);}
	this.SeasonalCrusader = function(era, cb) {this.getPage(1, true, false, era, 6, cb);}
	this.SeasonalTeam2s = function(era, cb) {this.getPage(2, true, false, era, undefined, cb);}
	this.SeasonalTeam3s = function(era, cb) {this.getPage(3, true, false, era, undefined, cb);}
	this.SeasonalTeam4s = function(era, cb) {this.getPage(4, true, false, era, undefined, cb);}
	this.SeasonalClass = function(era, clas, cb) {this.getPage(1, true, false, era, clas, cb);}
	this.SeasonalTeam = function(era, team, cb) {this.getPage(team, true, false, era, undefined, cb);}

	this.SeasonalHardcoreBarbarian = function(era, cb) {this.getPage(1, true, true, era, 1, cb);}
	this.SeasonalHardcoreMonk = function(era, cb) {this.getPage(1, true, true, era, 2, cb);}
	this.SeasonalHardcoreDemonHunter = function(era, cb) {this.getPage(1, true, true, era, 3, cb);}
	this.SeasonalHardcoreWitchDoctor = function(era, cb) {this.getPage(1, true, true, era, 4, cb);}
	this.SeasonalHardcoreWizard = function(era, cb) {this.getPage(1, true, true, era, 5, cb);}
	this.SeasonalHardcoreCrusader = function(era, cb) {this.getPage(1, true, true, era, 6, cb);}
	this.SeasonalHardcoreTeam2s = function(era, cb) {this.getPage(2, true, true, era, undefined, cb);}
	this.SeasonalHardcoreTeam3s = function(era, cb) {this.getPage(3, true, true, era, undefined, cb);}
	this.SeasonalHardcoreTeam4s = function(era, cb) {this.getPage(4, true, true, era, undefined, cb);}
	this.SeasonalHardcoreClass = function(era, clas, cb) {this.getPage(1, true, true, era, clas, cb);}
	this.SeasonalHardcoreTeam = function(era, team, cb) {this.getPage(team, true, true, era, undefined, cb);}

	this.Barbarian = function(era, cb) {this.getPage(1, false, false, era, 1, cb);}
	this.Monk = function(era, cb) {this.getPage(1, false, false, era, 2, cb);}
	this.DemonHunter = function(era, cb) {this.getPage(1, false, false, era, 3, cb);}
	this.WitchDoctor = function(era, cb) {this.getPage(1, false, false, era, 4, cb);}
	this.Wizard = function(cb) {this.getPage(1, false, false, era, 5, cb);}
	this.Crusader = function(era, cb) {this.getPage(1, false, false, era, 6, cb);}
	this.Team2s = function(era, cb) {this.getPage(2, false, false, era, undefined, cb);}
	this.Team3s = function(era, cb) {this.getPage(3, false, false, era, undefined, cb);}
	this.Team4s = function(era, cb) {this.getPage(4, false, false, era, undefined, cb);}
	this.Class = function(era, clas, cb) {this.getPage(1, false, false, era, clas, cb);}
	this.Team = function(era, team, cb) {this.getPage(team, false, false, era, undefined, cb);}

	this.HardcoreBarbarian = function(era, cb) {this.getPage(1, false, true, era, 1, cb);}
	this.HardcoreMonk = function(era, cb) {this.getPage(1, false, true, era, 2, cb);}
	this.HardcoreDemonHunter = function(era, cb) {this.getPage(1, false, true, era, 3, cb);}
	this.HardcoreWitchDoctor = function(era, cb) {this.getPage(1, false, true, era, 4, cb);}
	this.HardcoreWizard = function(era, cb) {this.getPage(1, false, true, era, 5, cb);}
	this.HardcoreCrusader = function(era, cb) {this.getPage(1, false, true, era, 6, cb);}
	this.HardcoreTeam2s = function(era, cb) {this.getPage(2, false, true, era, undefined, cb);}
	this.HardcoreTeam3s = function(era, cb) {this.getPage(3, false, true, era, undefined, cb);}
	this.HardcoreTeam4s = function(era, cb) {this.getPage(4, false, true, era, undefined, cb);}
	this.HardcoreClass = function(era, clas, cb) {this.getPage(1, false, true, era, clas, cb);}
	this.HardcoreTeam = function(era, team, cb) {this.getPage(team, false, true, era, undefined, cb);}
};

module.exports = new D3Leaderboards();