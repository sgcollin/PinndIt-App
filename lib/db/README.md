dbFunc Usage Notes
=============

	var db = require('../lib/db');



	db.addPinn(Pinn, function(error, result){
		if(error) return console.log(error);
		console.log("Event Name: " + result.EventName + " added, ID: " + result.PinnID );
	});

see the js file for other functions including:

* getVisiblePinns(minLat, maxLat, minLong, maxLong, callback)
* addPinn (pinn, callback) //takes object
* getMyPinns (sessionID, callback)
* getComments (pinnID, callback)
* addComment (comment, callback) // takes object
* upvotePinn (pinnID, callback)
* downvotePinn (pinnID, callback)
* upvoteComment (commentID, callback)
* downvoteComment (commentID, callback)
* editPinn (pinn, callback) // takes object (edits event name or desc)