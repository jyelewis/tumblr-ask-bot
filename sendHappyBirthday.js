function chunkArray(array, chunkSize) {
    return [].concat.apply([],
        array.map(function(elem,i) {
            return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
        })
    );
}

var fs = require('fs');
var tumblr = require('./tumblr.js');
//tumblr.askQuestion('*blog name here*', 'Happy Birthday!');

var usersList = JSON.parse(fs.readFileSync('followees.json'));
//var usersList = ['*blog name here*', '*other blog name here*'];
usersList = chunkArray(usersList, 10);
curIndex = 0;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(){
	sendNext(usersList[curIndex]);
	curIndex++;
});

function sendNext(users){
	users.forEach(function(user){
		tumblr.askQuestion(user, 'Happy birthday!', function(err){
			if(err){
				console.log('error sending to '+user);
			} else {
				console.log('Sent message to '+user);
			}
		});
	});
}