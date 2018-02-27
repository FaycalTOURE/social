
// MODULES

const express = require('express'),
      app = express(),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      db = require('./modules/mongoUtil'),
      helper = require('./modules/helpersUtil'),
      session = require('express-session'),
      multer  = require('multer'),
      path = require('path'),
      mime = require('mime-types');

// DB URL

const URL = 'mongodb://127.0.0.1:27017/social';

// MIDDLEWARE

 app.use('/public', express.static(__dirname + '/public'))
    .use(express.static(path.join(__dirname, '/public')))
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
    .use(cookieParser())
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

 app.set('port', process.env.PORT || 8080);


// DATA

var storage = multer.diskStorage({
    destination: 'public/assets/user',
    filename: function (req, file, cb) {
        console.log(file);
        if( mime.extension(file.mimetype) === 'png' ||
            mime.extension(file.mimetype) === 'jpg') {
            cb(null, file.originalname.split('.')[file.originalname.split('.').length -1] + '.' + mime.extension(file.mimetype))
        }
    }
});

var upload = multer({ storage: storage });


// ROUTES, API

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('file'), function(req,res,next){
    console.log('Uploade Successful file =>', req.file, 'body =>', req.body);
    // in db
    var collection = db.get().collection('user');

    var id = req.file.originalname;
    collection.update(
        { _id : db.makeObjectId(id)},
        { $set: { 'admin.avatar' : req.file } }
    );
});


// CONNECTION

app.get('/connexion', function(req, res){

});

app.get('/disconnect', function(req, res){

});


// USER

app.get('/user', function(req, res){
    var collection = db.get().collection('user');

    collection.find({}).toArray(function(err, data) {
        res.json(data);
    });
});


app.get('/user/:id', function(req, res){
    var collection = db.get().collection('user');

    var id = req.params.id;

    collection.find({ _id : db.makeObjectId(id) }).toArray(function(err, data) {
        res.json(data);
    });
});

// Simple Quick Add (admin)

app.get('/user/:id/friends/add/:f_id', function(req, res){
    var collection = db.get().collection('user');

    var id = req.params.id,
        f_id = req.params.f_id;

    collection.update(
        { _id : db.makeObjectId(id)},
        { $addToSet: { 'friends.list' : f_id } }
    );
});

// add process

app.get('/user/:id/friends/addProcess/:f_id', function(req, res){
    var collection = db.get().collection('user');

    var id = req.params.id,
        f_id = req.params.f_id;

    collection.update(
        { _id : db.makeObjectId(id)},
        { $addToSet: { 'friends.addingProcess' : f_id } }
    );

    collection.update(
        { _id : db.makeObjectId(f_id)},
        { $addToSet: { 'friends.friendDemands' : id } }
    );
});

// add

app.get('/user/:id/friends/addFriend/:f_id', function(req, res){
    var collection = db.get().collection('user');

    var id = req.params.id,
        f_id = req.params.f_id;

    // Add Friends list

    collection.update(
        { _id : db.makeObjectId(id)},
        { $addToSet: { 'friends.list' : f_id } }
    );

    collection.update(
        { _id : db.makeObjectId(f_id)},
        { $addToSet: { 'friends.list' : id } }
    );

    // delete Process

    collection.update(
        { _id : db.makeObjectId(id)},
        { $pull : { 'friends.friendDemands' : f_id }}
    );

    collection.update(
        { _id : db.makeObjectId(f_id)},
        { $pull : { 'friends.addingProcess' : id }}
    );
});

app.get('/user/friend/:id', function(req, res){
});

app.get('/user/friends/add', function(req, res){

});

app.get('/user/friends/add/:id', function(req, res){

    var collection = db.get().collection('user');



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

app.post('/user/:id/publish/add', function(req, res){
    var collection = db.get().collection('publish');
    var currentPost = req.body.clientPost;
    var id = req.params.id;

    collection.insert(
        { publish :
            { title : currentPost.title,
              content : currentPost.content ,
              logs : {
                from : id,
                sendAt : new Date()
              }
            }
        });

    res.json({ status : 200});
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

app.get('/user/friends/:id/update', function(req, res){

});

app.get('/user/message/:id/update', function(req, res){

});
app.get('/user/publish/:id/update', function(req, res){

});

// DELETE

app.get('/user/:id/friends/delete/:f_id', function(req, res){
    var collection = db.get().collection('user');
    var id = req.params.id,
        f_id = req.params.f_id;

    collection.update(
        { _id : db.makeObjectId(id)},
        { $pull : { 'friends.list' : f_id }}
    );

});

app.get('/user/delete/:id', function(req, res){
    var collection = db.get().collection('user');
    var id = req.params.id;

    collection.remove(
        { _id : db.makeObjectId(id)}
    );
});

app.get('/user/publish/delete/:id', function(req, res){
    var collection = db.get().collection('publish');
    var id = req.params.id;
    collection.remove(
        { _id : db.makeObjectId(id)}
    );
});

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


// BOOTSTRAPING /  MONGO

var server;

db.connect(URL, function(err, db) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1)
    }else{
        server = app.listen(app.get('port'), function(){
            console.log('à l\'écoute sur le port :' + app.get('port'));
        });
    }
});