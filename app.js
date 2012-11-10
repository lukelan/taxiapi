var express = require('express'),
    account = require('./routes/account');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/accounts', account.findAll);
app.get('/accounts/:id', account.findById);
app.post('/accounts', account.addWine);
app.put('/accounts/location/:id', account.updateLocation);
app.delete('/accountss/:id', account.deleteWine);

//app.listen(3001);
app.listen(process.env.VCAP_APP_PORT || 3001);
console.log('Listening on port 3001...');