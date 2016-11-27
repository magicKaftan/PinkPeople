var uid="meme";
var uid="username";
var uid="picture";
var uid="title";
var uid="body";

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

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyCmJ66G-AN3Xxa6ptvnkMdredk7hSzEj3U",
    authDomain: "pinkpeople-89a46.firebaseapp.com",
    databaseURL: "https://pinkpeople-89a46.firebaseio.com",
    storageBucket: "pinkpeople-89a46.appspot.com",
    messagingSenderId: "593447716759"
  };
  firebase.initializeApp(config);
  
 var distance = require("google-distance");
 distance.apiKey='AIzaSyCnxSCssoIxwYacvpX3bIauI3GDihbb-Ns';
 
app.post('/', function (req, res) {
	  var resp = new twilio.TwimlResponse();
	  var msgParts = req.body.Body.trim().toLowerCase().split(',');
	  var isVictim = 0;
	  var isHelper = 0;
	  var addr = msgParts[1];
	  var ref = firebase.database().ref().child('PinkPeople');
	  var village = msgParts[2];
	  
	  if (msgParts[0].trim().toLowerCase() === 'help'){
			isVictim = 1;
			 
			var queryRef = ref.orderByChild("village").equalTo(village).limitToLast(2);
			queryRef.on("value", function(querySnapshot) {
			    if (querySnapshot.numChildren()>0) {
			      // Data is ordered by increasing height, so we want the first entry
			      querySnapshot.forEach(function(address) {
				  console.log(address.val().village);
				  console.log(msgParts[1]);
			    	  distance.get(
			    			  {
			    			    origin: address.val().addr,
			    			    destination: msgParts[1]								
			    			  },
			    			  function(err, data) {
			    			    if (err) return console.log(err);
			    			    console.log(data);
			    			});
			    	  console.log(distance);
			        // Returning true means that we will only loop through the forEach() one time
			        return true;
			      });
			    } else {
			      console.log("No helpers found");
			    }
			  });
			
	  }
	  else if (msgParts[0].trim().toLowerCase() === 'join'){
			isHelper = 1;
	  }

	  if (msgParts.length > 1){
		addr=msgParts[1];
	  }
	 
	  writeNewPost( req.body.From ,isVictim,isHelper,req.body.Body.trim().toLowerCase(),addr,village);
	  resp.message('Help is on its way');
	  res.writeHead(200, {
	    'Content-Type':'text/xml'
	  });
	  res.end(resp.toString());
	}); 



function writeNewPost(uid, victim, helper, title, addr, village) {
  // A post entry.
  var postData = {
    author: uid,
    victim: victim,
    addr: addr,
    title: title,    
    helper: helper,
	village: village
  };

  var newPostKey = firebase.database().ref().child('PinkPeople').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/PinkPeople/' + newPostKey] = postData;
  return firebase.database().ref().update(updates);
}



var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
