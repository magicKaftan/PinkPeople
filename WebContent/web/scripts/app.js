var twilio = require('twilio'),
    client = twilio('ACd0305429cf8a064adb462d5b0b8947e6', '02047be4d7e281400e99a712c9a2f35e'),
    cronJob = require('cron').CronJob;
 
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
 
/*var Firebase = require('firebase'),
    usersRef = new Firebase('https://pinkpeople-ce167.firebaseio.com/Users/');*/
 
var numbers = ['+16478348213'];
 
/*usersRef.on('child_added', function(snapshot) {
  numbers.push( snapshot.val() );
  console.log( 'Added number ' + snapshot.val() );
});*/
 
/*var textJob = new cronJob( '0 18 * * *', function(){
  for( var i = 0; i < numbers.length; i++ ) {
    client.sendMessage( { to:numbers[i], from:'+16474961096', body:'Hello! Hope you’re having a good day.'}, function( err, data ) {
      console.log( data.body );
    });
  }
},  null, true);*/
 
app.post('/', function (req, res) {
	  var resp = new twilio.TwimlResponse();
	  console.log('trying to post');
	  resp.message('Thanks for subscribing!');
	  res.writeHead(200, {
	    'Content-Type':'text/xml'
	  });
	  res.end(resp.toString());
	});
 
var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});