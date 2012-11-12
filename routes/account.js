var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('login-testing', server);


var express = require("express");
var app = express();
//var mongo;

app.configure('development', function(){
    mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"trong",
        "password":"123456",
        "name":"",
        "db":"taxi"
    }
});
app.configure('production', function(){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
});
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}
var mongourl = generate_mongo_url(mongo);
var db;

require('mongodb').connect(mongourl, function(err, conn){
	db = conn;
});

exports.findAll = function(req, res)
{
	db.collection('accounts', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });	
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving account: ' + id);
    db.collection('accounts', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByType = function(req, res) {
    var id = req.params.type;
    console.log('Retrieving account: ' + id);
    db.collection('accounts', function(err, collection) {
        collection.find({'usertype':id}).toArray(function(err, items) {
            res.send(items);
        });
    });
}

exports.updateLocation = function(req, res) {
    var id = req.params.id;
    var Location = req.body;
    console.log('Updating Location: ' + id); 
    console.log(JSON.stringify(Location));
    db.collection('accounts', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, {$set: Location}, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating Location: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(Location);
            }
        });
    });
}

