// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var routes = require('./routes/index');
var users = require('./routes/users');
var profile= require('./routes/profile');
var querys= require('./routes/querys');
var searchtool= require('./routes/searchtool');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');



 var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
var db = mongoose.connection;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./config/passport')(passport);
app.use('/', routes);
app.use('./users', users);
app.use('./profile', profile);
app.use('./querys',querys);
/*app.use('./searchtool',searchtool);*/




app.get('/searchtool', function(req, res){
    /*var experiments=["ciao", "come va?", "yeaaaaaa"];*/
    var experiments=[];

        mongoose.connection.db.listCollections().toArray(function(err, names) {
            if (err) {
                console.log(err);
            };
            names.forEach(function(e,i,a) {
                if(e.name!="users") {
                    experiments.push(e.name);
                }
            })
            res.json(experiments);
        })
});

app.get('/searchtooltumorname', function(req, res){
    var names=[];
    var collection= req.body.queryarray;
    console.log(collection);
    console.log(req.body);
    console.log(queryarray);




})

// mongoose


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