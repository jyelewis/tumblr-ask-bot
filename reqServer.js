var express = require('express');
var app = express();
app.use(express.bodyParser());
app.all('/', function(req, res){
	  res.send('hello world');
	  console.log(req.headers)
	  console.log(req.body)
});

app.listen(3000);
