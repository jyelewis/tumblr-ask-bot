var querystring = require('querystring');
var http = require('http');
var express = require('express');
var app = express();

var blog_to_spider = "thehilariousblog.tumblr.com";

app.use(express.bodyParser());
app.all('/', function(req, res){
	  res.send('hello world');
	  console.log(req.headers)
	  console.log(req.body)
	  
	  var query = querystring.stringify({
		comment_name: '',
		comment_url: '',
		comment_body: '',
		jk: req.body.jk,
		jkt: req.body.jkt,
		post_id: req.body.post_id,
		redirect_to: '/ask_form/' + blog_to_spider,
		key: req.body.key,
		post: req.body.post,
		form_key: req.body.form_key,
		anonymous: '1'
	});
	query = querystring.stringify(req.body);
	var options = req.body;
	options.hostname = 'www.tumblr.com';
	options.path = '/ask_form/' + blog_to_spider;
	options.method = 'POST';
	
	  var post_req = http.request(options, function(res) {
		res.setEncoding('utf8');
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
		//	console.log('Response: ' + chunk);
		});
	});


	post_req.write(query);
	post_req.end();
});


app.listen(3000);