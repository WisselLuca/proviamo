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


var dnaseq = require('./model/tumorExperiment/dnaseq');



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
    var collection= findCollection(req.query.queryarray[0]);
    /*console.log(collection);*/
    collection.find().distinct('tumor', function(err, tumors) {
        if (err) {
            throw err;
        } else
            res.json(tumors);
    });
});


app.get('/searchtoolGenomicFieldsName', function(req, res){
    var fields=[];
    var collection= findCollection(req.query.queryarray[0]);

    collection.schema.eachPath(function(path) {
        if(path.indexOf("information")>-1 ||path.indexOf("__v")>-1 || path.indexOf("_id")>-1 || path.indexOf("tumor")>-1) {
        }else if(path.indexOf("fields")>-1){
            collection.schema.paths.fields.schema.eachPath(function(stamp){
                if(stamp.indexOf("__v")>-1 || stamp.indexOf("_id")>-1){

                }else {
                    fields.push(stamp)
                }
            });
        }else{
            fields.push(path);
        }
    });
    res.json(fields);
});

app.get('/searchtoolGenomicFieldsData', function(req, res){
    var collection= findCollection(req.query.queryarray[0]);

        if(req.query.genomicqueryarray[0].indexOf("aliquote")>-1 || req.query.genomicqueryarray[0].indexOf("person")>-1 || req.query.genomicqueryarray[0].indexOf("tissue")>-1) {

            collection.find({'tumor': req.query.queryarray[1]}).distinct(req.query.genomicqueryarray[req.query.genomicqueryarray.length-1], function (err, item) {
                if (err) {
                    throw err
                }else {
                    console.log(item);
                    res.json(item);
                }
            });
        }else{
            collection.find({'tumor': req.query.queryarray[1]}).distinct('fields.'+req.query.genomicqueryarray[req.query.genomicqueryarray.length-1], function (err, item) {
                if (err) {
                    throw err
                }else {
                    console.log(item);
                    res.json(item);
                }
            });
        };
});


app.get('/searchtoolClinicNameFields', function(req, res){

    var collection= findCollection(req.query.queryarray[0]);
    console.log(req.query.queryarray[1]);

    collection.find({'tumor': req.query.queryarray[1]}).distinct('information.name' , function(err, item){
        if(err){
            throw err;
        }else{
            if(item.indexOf("")>-1) {
                res.json(item);
            }
        }
    })
});


app.get('/searchtoolClinicDataFields', function(req, res){
    var collection= findCollection(req.query.queryarray[0]);
    var fieldsana=[];

    var query =collection.find({'tumor':req.query.queryarray[1]} ,{_id: 0, information: {$elemMatch: {name: req.query.clinicqueryarray[req.query.clinicqueryarray.length-1]}}});
    query.select(" information.data information.name ");
    query.exec(function(err, docs){
        if (err){
            console.log(err)
        }else {


            docs.forEach(function (elem){
                if(fieldsana.indexOf(elem.information[0].data)>-1){

                }else{
                    fieldsana.push(elem.information[0].data);
                }
            })
            if (typeof cb !== "undefined"){
                cb(docs);
            }
            res.json(fieldsana);
        }
    });
    
});




function findCollection(experimentName) {
    if(experimentName.indexOf("dnaseq")>-1){
        return dnaseq;
    }else if(experimentName.indexOf("cnv")>-1){
        return cnv;
    }else if(experimentName.indexOf("dnamethylation")>-1){
        return dnamethylation;
    }
};

app.post('/find', function (req, res){

    for(var i=0; i<req.body.clinicName.length; i++){
        console.log(req.body.clinicName[i]);
        console.log(req.body.clinicData[i]);
    }
    var finalString="";
    var stringClinicInformation="{'fields': {'$elemMatch': {";
    for(var i=0; i<req.body.genomicName.length; i++) {
        if (i < req.body.genomicName.length) {
           finalString =finalString+stringClinicInformation+ "'"+ req.body.genomicName[i] +"'  : '" + req.body.genomicData[i] + "'}}},";
        }else if(i=req.body.genomicName.length-1){
            finalString = finalString + stringClinicInformation + "'"+ req.body.genomicName[i] +"'  : '" + req.body.genomicData[i] + "'}}}";
        }
    }
    console.log(finalString);
    var a=[];
    var collection= findCollection(req.body.experiment);
    var query= collection.find({'tumor': req.body.tumorNames},{_id:0});
    query.select("aliquote");
    query.exec(function(err, docs){
        if (err){
            console.log(err)
        }else {
            docs.forEach(function (elem){
                a.push(elem);
                console.log("\n");
            })
            if (typeof cb !== "undefined"){
                cb(docs);
            }
            res.send("hello"+a);
        }
    });
    /*res.send("hello");*/


});


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