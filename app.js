
// MODULES

const express = require('express'),
      app = express(),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      db = require('./modules/mongoUtil'),
      helper = require('./modules/helpersUtil'),
      session = require('express-session');

// DB URL

const URL = 'mongodb://127.0.0.1:27017/jeumulti';

// MIDDLEWARE

 app.use('/public', express.static(__dirname + '/public'))
    .use('/bower_components', express.static(__dirname + '/bower_components'))
    .use('/vendor', express.static(__dirname + '/vendor'))
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use(session({
        secret:'123456789SECRET',
        saveUninitialized : false,
        resave: false
    }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser());


// ROUTES, API

app.get('/', function(req, res){

    var collection = db.get().collection('inscrits');

    collection.find().toArray(function(err, docs) {
        console.log(docs);
    });

    res.sendFile(__dirname + '/index.html');
});


// BOOTSTRAPING + MONGO

var port = process.env.PORT || 8080, server;

db.connect(URL, function(err, db) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    }else{
        server = app.listen(port, function(){
            console.log('à l\'écoute sur le port :' + port);
        });
    }
});