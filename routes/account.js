var mongo = require('mongodb');

var Server = mongo.Server,
    BSON = mongo.BSONPure;

//var server = new Server('localhost', 27017, {auto_reconnect: true});
//db = new Db('login-testing', server);


var express = require("express");
var app = express();
//var mongo;

/*
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

// default database of appfog
app.configure('production', function(){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
});
*/
//mongodb://<dbuser>:<dbpassword>@ds037827.mongolab.com:37827/taxivn
//https://mongolab.com/databases/taxivn#users
app.configure('production', function(){
    mongo = {
        "hostname":"ds037827.mongolab.com",
        "port":37827,
        "username":"trong",
        "password":"123456",
        "name":"",
        "db":"taxivn"
    }
});
app.configure('development', function(){
    mongo = {
        "hostname":"ds037827.mongolab.com",
        "port":37827,
        "username":"trong",
        "password":"123456",
        "name":"",
        "db":"taxivn"
    }
});
var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
    	console.log("mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db);
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
    	console.log("mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db);
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

exports.findByDistance = function(req, res) {
    var Location = req.body;
    //var obj = JSON.parse(Location);
    console.log('Retrieving accounts by distance: ' + req.body);
    var point = [];
    point = req.body.loc
    console.log('Retrieving accounts by distance: ' + req.body.loc);
    db.collection('accounts', function(err, collection) {
        collection.find({'loc': {$near: point}}).toArray(function(err, items) {
            res.send(items);
        });
    });
}

exports.findByDistance2 = function(req, res) {
    var Location = req.body;
    //var obj = JSON.parse(Location);
    console.log('Retrieving accounts by distance: ' + req.body);
    var point = [];
    point = req.body.loc
    console.log('Retrieving accounts by distance: ' + req.body.loc);

    db.command({geoNear: 'accounts', near: req.body.loc, distanceMultiplier: 3963, spherical: true, num: 10}, function(e, reply) {
		if (e) { 
			res.send("" + e); 
		}
		else {
			//console.log('Retrieving accounts by distance: ' + reply);
			res.send(reply);
		}
    });
}


exports.findByDistanceWithAccountID = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving accounts by distance: ' + id);
    db.collection('accounts', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, user) {
    		var point = user.loc;
    		console.log('Retrieving accounts by distance: ' + point);
    		db.command({geoNear: 'accounts', near: user.loc, distanceMultiplier: 3963, spherical: true, num: 10}, function(e, reply) {
				if (e) { 
					res.send("" + e); 
				}
				else {
					//console.log('Retrieving accounts by distance: ' + reply);
					res.send(reply);
				}
			});
            // collection.find({'loc': {$near: point}}).toArray(function(err, items) {
//             	res.send(items);
//         	});
        });
    });
}
