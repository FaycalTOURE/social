// VARIABLES

var MongoClient = require('mongodb').MongoClient,
    objectId = require('mongodb').ObjectID,
    state = {
        db: null
    };

// CONNECT

module.exports.connect = function(url, done) {
    if (state.db) {
        return done();
    }

    MongoClient.connect(url, function(err, db) {
        if (err) {
            return done(err);
        }
        state.db = db;
        done();
    });
};

// GET


module.exports.get = function() {
    return state.db;
};


// MAKE O ID

module.exports.makeObjectId = function(idGet) {
    idGet = new objectId(idGet);
    return idGet;
};


// CLOSE

module.exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            state.mode = null;
            if (err) {
                done(err);
            }
        });
    }
};

