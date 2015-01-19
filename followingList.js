var fs = require('fs');
var cheerio = require('cheerio');

process.stdin.resume();
process.stdin.setEncoding('utf8');
 

allUsersDic = {}; //prevent double ups
processUsers(fs.readFileSync('users.html'));

function processUsers(code){
	$ = cheerio.load(code);
	$(".follower .info .name a").each(function(){
		allUsersDic[this.text()] = this.text();
	});
}

allUsers = [];
for (key in allUsersDic){
	allUsers.push(key);
}

fs.writeFile('followees.json', JSON.stringify(allUsers));