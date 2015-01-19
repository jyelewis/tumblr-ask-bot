var querystring = require('querystring');
var http = require('http');


//export functions
exports.askQuestion = askQuestion;


function askQuestion(blog, post, cb){
	if(!cb){
		cb = function(){};
	}
	download('http://www.tumblr.com/ask_form/'+blog+'.tumblr.com/', function(data, res){
		//console.log(data);
		try {
			var jkt = /type="hidden" name="jkt" value="(.+)"/.exec(data)[1];
			var jkScript = /language="javascript" src=\"(\/submit_form_js\/[a-zA-Z0-9]+\/[A-Za-z0-9]+\/submit\.js)\"/.exec(data)[1]
			var form_key = /id="form_key" name="form_key" value="([!\|A-Za-z0-9]+)"/.exec(data)[1];
			var key = /name="key" value="([A-Za-z0-9]+)"/.exec(data)[1];
			var cookie = /tmgioct=([A-Za-z-0-9]+);/.exec(res.headers["set-cookie"])[1];
			download('http://www.tumblr.com'+jkScript, function(jkScriptData){
				var jk = /'([A-Za-z0-9]+)'/.exec(jkScriptData)[1];
				sendRequest(blog, post, jk, jkt, key, form_key, cookie, cb);
			});
		} catch(e) {
			console.log('error sending to '+ blog);
		}
		
	});
}

function sendRequest(blog, post, jk, jkt, key, form_key, cookie, cb){
	var query = querystring.stringify({
		comment_name: '',
		comment_url: '',
		comment_body: '',
		jk: jk,
		jkt: jkt,
		post_id: '0',
		redirect_to: '/ask_form/'+blog+'.tumblr.com',
		key: key,
		form_key: form_key,
		anonymous: '1',
//		cookies: 'tmgioct='+cookie
	});
	query = query + '&post%5Bone%5D='+encodeURIComponent(post);

	var options = {
		hostname: 'www.tumblr.com',
		port: 80,
		path: '/ask_form/'+blog+'.tumblr.com'
		,method:'POST',
		headers: {
			origin: 'http://www.tumblr.com',
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.77 Safari/537.36',
			'content-type': 'application/x-www-form-urlencoded',
			referer: 'http://www.tumblr.com/ask_form/blogname'
		}
	};
	

	var post_req = http.request(options, function(res) {
		res.setEncoding('utf8');
		//console.log('STATUS: ' + res.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			//console.log('Response: ' + chunk);
		});
		cb();
	});


	post_req.write(query);
	post_req.end();

}


//functions used
function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		//console.log("Headers: "+JSON.stringify(res.headers["set-cookie"]))
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data, res);
		});
	}).on("error", function() {
		callback(null);
	});
}