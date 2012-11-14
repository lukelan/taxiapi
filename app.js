var express = require('express'),
    account = require('./routes/account');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

// USER
app.get('/accounts', account.findAll);
app.get('/accounts/:id', account.findById);
app.get('/accounts/type/:type', account.findByType);
app.put('/accounts/location/:id', account.updateLocation);

//LOCATION
app.get('/locations/distance', account.findByDistance2);
app.get('/locations/distance/:id', account.findByDistanceWithAccountID);

//app.listen(3001);
app.listen(process.env.VCAP_APP_PORT || 3001);
console.log('Listening on port 3001...');