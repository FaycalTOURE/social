
// MODULES

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');


// PORT

var port = process.env.PORT || 8080;


// MIDDLE WARE

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


// ROUTES

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/index', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// APIS

// BOOTSTRAPING

var server = app.listen(port, function(){
    console.log('à l\'écoute sur le port :' + port);
});
