var restarted = 0;
var express     = require('express');


// ADDITION:
// Requiring session library:
var session     = require('express-session');
//var session     = require('cookie-session');


// ADDITION:
// Requiring flash library:
var flash       = require('connect-flash');

// These are the regular express built-in middleware:
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

// Our user-defined routes/middleware:
var routes = require('./routes/index');
var users = require('./routes/users');

// Create the express application:
var app         = express();

// Setup the view engine:
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add favicon support:
app.use(favicon(__dirname + '/public/favicon-32x32.png'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

// ADDITION:
// Added session support
/*
app.use(session({ secret : 'octocat',
                  saveUninitialized : true,
                  resave : true }));

*/
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();

app.set('trust proxy', 1)

app.use(session({
 
 keys: 'key1',
 user: undefined,
 secret: 'secret',
  resave: false,
  saveUninitialized: true
 

}));



app.use(function (req, res, next) {
  console.log(restarted ? "NOT RESTARTED" : "RESTARTED!!");
  if(restarted == 0){
    if(req.cookies.uid)
    res.clearCookie('uid');
    if(req.cookies.droppedPin){
    
    res.clearCookie('droppedPin');
}
    restarted = 1;
}
  

  if(!req.cookies.uid)
  res.cookie('uid', guid());
  if(req.cookies.uid)
    console.log("UID = " + req.cookies.uid);

  
  //console.log("id " + req.session.genid);
  next();
  
});


// ADDITION:
// Added flash support:
app.use(flash());


app.use('/', routes);
app.use('/users', users);




//app.use(sessions({  secret: 'tim richards'}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
