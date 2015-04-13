/*
 Functions to access the database (see team-pinndit/database/setup to setup your db)
 */

var pg = require('pg');
var conString = 'postgres://postgres:pass@localhost/pinndit';

function addPinn(pinn, callback){ //WORKS
    var err = null;
    if(pinn.Latitude === null){err = "null latt"}
    else if(pinn.Longitude === null){err = "null long"}
    else if(pinn.Latitude === null){err = "null latt"}
    else if(pinn.EventName === null || pinn.EventName.length > 25){err =
        "Need EventName length more than 0, less than 25"}
    else if(pinn.SessionID === null){err = "null sessionID"}
    else if(pinn.Time === null){err = "null time"}
    else if(pinn.Description !== null && pinn.Description.length > 25){err = "Description too long"}

    if(err){callback(err); return;}

    var pinnArr = [pinn.Latitude, pinn.Longitude, pinn.EventName, pinn.SessionID, pinn.Time];

    var query = 'INSERT into "Pinns" values (DEFAULT , 1, $1, $2, $3, ';
    if(pinn.Description){query+= '$6, $4, 0, 0, $5);'; pinnArr.push(pinn.Description);}
    else{query+='NULL, $4, 0, 0, $5);';}

    pg.connect(conString,function(err, client, done){
        if(err){
            console.log(err);
            callback(err, error);
            return console.error('err',err);
        }
        client.query(query, pinnArr, function(err, results){
            done();
            if(err){
                callback(err);
                return;
            }
            pinn.PinnID = results.rows[0];
            callback(err, pinn);
        });
    });
    pg.end();
}

function addComment(comment, callback){ //WORKS
    var err = null;
    if(comment.PinnID === null){ err = "null PinnID"}
    else if(comment.Comment === null || comment.Comment.length > 25){err = "Comment length needs to be more than 0 and less than 25"}
    else if(comment.SessionID === null){err = "null sessionID"}
    else if(comment.Time === null){err = "null time"}

    if(err){callback(error); return;}

    var comArr = [comment.PinnID, comment.Comment, comment.SessionID, comment.Time];
    var query = "INSERT into \"Comments\" values (DEFAULT, $1, $2, 0, 0, $3, $4);";
    console.log(query);

    pg.connect(conString,function(err, client, done){
        if(err){
            console.log(err);
            callback(err, error);
            return console.error('err',err);
        }
        client.query(query, comArr, function(err, results){
            done();
            if(err){
                callback(error);
                return;
            }
            callback(err, "success");
        });
    });
    pg.end();
}

function getComments(PinnID, callback){ //WORKS
    var comArr = [PinnID];
    var query = "SELECT * FROM \"Comments\" WHERE \"PinnID\" = $1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, comArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows);
        });
    });
    pg.end();
}

//given sessionId returns pinns dropped
function getMyPinns(sessionID, callback){ //WORKS
    var pinnArr = [sessionID];
    var query = "SELECT * FROM \"Pinns\" WHERE \"SessionID\" = $1 AND \"Active\"=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, results.rows);
        });
    });
    pg.end();
}

//given area returns list of pinns
function getVisiblePinns(minLat, maxLat, minLong, maxLong, callback){
    console.log("GETVISIBLE");
    var pinnArr = [minLat, maxLat, minLong, maxLong];
    console.log("minLat: " + minLat + " maxLat: " + maxLat + " minLong: " + minLong);
    var query = "SELECT * FROM \"Pinns\" WHERE \"Latitude\" > $1 AND \"Latitude\" < $2 AND \"Longitude\" > $3 AND \"Longitude\" < $4 AND \"Active\" = 1";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(JSON.stringify(results));
            callback(err, results.rows);
        });
    });
    pg.end();
}

function upvotePinn(PinnID, callback){ //WORKS
    var pinnArr = [PinnID];
    var query = "UPDATE \"Pinns\" SET \"Up\" = \"Up\" + 1 WHERE \"PinnID\" = $1 AND \"Active\"=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, PinnID);
        });
    });
    pg.end();
}

function downvotePinn(PinnID, callback){ //WORKS
    var pinnArr = [PinnID];
    var query = "UPDATE \"Pinns\" SET \"Down\" = \"Down\" + 1 WHERE \"PinnID\" = $1 AND \"Active\"=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, PinnID);
        });
    });
    pg.end();
}

function upvoteComment(commentID, callback){ //WORKS
    var commArr = [commentID];
    var query = "UPDATE \"Comments\" SET \"Up\" = \"Up\" + 1 WHERE \"CommentID\" = $1";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, commArr, function(err, results){
            done();
            console.log(results);
            callback(err, commentID);
        });
    });
    pg.end();
}

function downvoteComment(commentID, callback){ //WORKS
    var commArr = [commentID];
    var query = "UPDATE \"Comments\" SET \"Down\" = \"Down\" + 1 WHERE \"CommentID\" = $1";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, commArr, function(err, results){
            done();
            console.log(results);
            callback(err, commentID);
        });
    });
    pg.end();
}

//use to edit event names and/or descriptions
function editPinn(pinn, callback){
    console.log("editPinn: " + pinn.PinnID);
    var err = null;
    if(pinn.PinnID === null){err = "null PinnID"}
    else if(pinn.SessionID === null){err = "null sessionID"}
    else if(pinn.Description === null && pinn.EventName === null){err = "Need new event name or desc"}

    if(err){callback(err); return;}

    var pinnArr = [pinn.PinnID, pinn.SessionID];
    var query = "UPDATE \"Pinns\" SET ";
    if (pinn.EventName !== null && pinn.Description !== null){
        query+= "\"EventName\" = $3, \"Description\" = $4 ";
        pinnArr.push(pinn.EventName);
        pinnArr.push(pinn.Description);
    }else if(pinn.EventName !== null){
        query+= "\"EventName\" = $3 ";
        pinnArr.push(pinn.EventName);
    }else if(pinn.Description !== null){
        query+= "\"Description\" = $3 ";
        pinnArr.push(pinn.Description);
    }
    query += "WHERE \"PinnID\" = $1 AND \"SessionID\" = $2 AND \"Active\"=1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            pinn.PinnID = results.rows[0];
            callback(err, pinn);
        });
    });
    pg.end();
}

function markInactive(PinnID, callback){
    console.log("markInactive: " + PinnID);
    var pinnArr = [PinnID];
    var query = "UPDATE \"Pinns\" SET \"Active\" = 0 WHERE \"PinnID\" = $1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log(results);
            callback(err, PinnID);
        });
    });
    pg.end();
}

function getID(pinn, callback){ //not functioning (long and lat too precise)
    console.log("pinARR:" + pinn);
    var query = "Select \"PinnID\" FROM  \"Pinns\" WHERE ABS(\"Longitude\"" +
        "- $1) < .00000001 AND ABS(\"Latitude\" - $2) < .000000001 LIMIT 1;";

    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinn, function(err, results){
            console.log(results.rows[0]);
            if(err){callback(err);return;}
            callback(err, results.rows[0]);
            done();
        });
    });
    pg.end();
}

function getPinn(PinnID, callback){ //not functioning (long and lat too precise)
    console.log("getPinn: " + PinnID);
    var err = null;
    if(PinnID === null){err = "null pinnID"}

    if(err){callback(err); return;}

    var pinnArr = [PinnID];
    var query = "Select * FROM  \"Pinns\"  WHERE \"PinnID\" = $1 LIMIT 1;";
    pg.connect(conString, function(err, client, done){
        if(err) {console.log(err); return;}
        client.query(query, pinnArr, function(err, results){
            done();
            console.log("got Pinn: " + results.rows[0].PinnID);
            callback(err, results.rows[0]);
        });
    });
    pg.end();
}

exports.getPinn = getPinn;
exports.getID = getID;
exports.markInactive = markInactive;
exports.getVisiblePinns = getVisiblePinns;
exports.addPinn = addPinn;
exports.getMyPinns = getMyPinns;
exports.getComments = getComments;
exports.addComment = addComment;
exports.addPinn = addPinn;
exports.upvotePinn = upvotePinn;
exports.downvotePinn = downvotePinn;
exports.upvoteComment = upvoteComment;
exports.downvoteComment = downvoteComment;
exports.editPinn = editPinn;