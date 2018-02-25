
// MODULES

const express = require('express'),
      app = express(),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      db = require('./modules/mongoUtil'),
      helper = require('./modules/helpersUtil'),
      session = require('express-session');

// DB URL

const URL = 'mongodb://127.0.0.1:27017/social';

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
    res.sendFile(__dirname + '/index.html');
});


// CONNECTION

app.get('/connexion', function(req, res){

});

app.get('/disconnect', function(req, res){

});


// USER

app.get('/user/:id', function(req, res){
    var collection = db.get().collection('user');
    var id = req.params.id;

    collection.find({ _id : db.makeObjectId(id) }).toArray(function(err, data) {
        res.json(data);
    });
});

app.get('/user/friends', function(req, res){

});

app.get('/user/friend/:id', function(req, res){

});

app.get('/user/friends/add', function(req, res){

});

app.get('/user/friends/add/:id', function(req, res){

});

app.get('/user/friends/added', function(req, res){

});

app.get('/user/friends/adding_process', function(req, res){

});

// MESSAGES

app.get('/user/messages', function(req, res){

});

app.get('/user/message/:id', function(req, res){
    var collection = db.get().collection('message');
    var id = req.params.id;

    collection.find({ $or:[
        {"message.logs.to" : { $eq : id }},
        {"message.logs.from" : { $eq : id }}
    ]}).toArray(function(err, data) {
        res.json(data);
    });
});

app.get('/user/messages/sended', function(req, res){

});

app.get('/user/messages/received', function(req, res){

});

app.get('/user/message/deleted', function(req, res){

});

// PUBLISH

app.get('/user/publish/', function(req, res){
    // db.school.aggregate([
    //     { $unwind :'$students'},
    //     { $project : { _id:0, rollNo : '$students.rollNo', name : '$students.name', score : '$students.score' } }
    // ]);
});

app.get('/user/publish/:id', function(req, res){
    var collection = db.get().collection('publish');
    var id = req.params.id;

    collection.find({"publish.logs.from" : { $eq : id } }).toArray(function(err, data) {
        res.json(data);
    });
});

// RECOMMANDATION

app.get('/user/recommandation/:id', function(req, res){
    var collection = db.get().collection('recommandation');
    var id = req.params.id;

    collection.find({ "recommandation.logs.to" : { $eq : id } }).toArray(function(err, data) {
        res.json(data);
    });
});

// NOTIFICATIONS

app.get('/user/emails/sended', function(req, res){

});

app.get('/user/emailsf/received', function(req, res){

});

// UPDATE

app.get('/user/:id/update', function(req, res){

});
app.get('/user/message/:id/update', function(req, res){

});
app.get('/user/publish/:id/update', function(req, res){

});

// DELETE

app.get('user/delete/message/:id', function(req, res){

});

app.get('user/delete/friend/:id', function(req, res){

});

app.get('user/delete/recommandation/:id', function(req, res){

});

app.get('user/delete/adding_process/:id', function(req, res){

});

app.get('user/delete/publish/:id', function(req, res){

});

// AUTHER

app.get('/user/recommandation', function(req, res){

});

app.get('/user/stats/all', function(req, res){

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