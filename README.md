# d3-leaderboards-api
Parses live Diablo 3 Leaderboards and returns them as json.  

Does not implement caching or throttling. Please do so in your wrapper to limit requests to Blizzard's servers.  

Types
==========
Classes: demon-hunter, barbarian, witch-doctor, wizard, monk, crusader  
Eras: 1, 2, 3, 4, 5  
Teams: 2, 3, 4  

Endpoints
==========
/season/:era/class/:class => http://us.battle.net/d3/en/rankings/season/:era/rift-:class  
Fetches the top 1000 seasonal characters of the specified class.

/era/:era/class/:class => http://us.battle.net/d3/en/rankings/era/:era/rift-:class  
Fetches the top 1000 non-seasonal characters of the specified class.

/season/:era/team/:team => http://us.battle.net/d3/en/rankings/season/:era/rift-team-:team  
Fetches the top 1000 seasonal characters of the specified team size.

/era/:era/team/:team => http://us.battle.net/d3/en/rankings/era/:era/rift-team-:team  
Fetches the top 1000 non-seasonal characters of the specified team size.

/season/hardcore/:era/class/:class => http://us.battle.net/d3/en/rankings/season/:era/rift-hardcore-:class  
Fetches the top 1000 seasonal hardcore characters of the specified class.

/era/hardcore/:era/class/:class => http://us.battle.net/d3/en/rankings/era/:era/rift-hardcore-:class  
Fetches the top 1000 non-seasonal hardcore characters of the specified class.

/season/hardcore/:era/team/:team => http://us.battle.net/d3/en/rankings/season/:era/rift-hardcore-team-:team  
Fetches the top 1000 seasonal hardcore characters of the specified team size.

/era/hardcore/:era/team/:team => http://us.battle.net/d3/en/rankings/era/:era/rift-hardcore-team-:team  
Fetches the top 1000 non-seasonal hardcore characters of the specified team size.
<br>
Dependencies
==========
cheerio  
request  
express
