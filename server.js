var express = require('express');

var server = express();

var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');

// Beállítjuk a JSON API serializer-t
var store  = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{ type: jsonapi }]    
});

// Express middleware
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

server.use(fortune.net.http(store));

// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz    

store.defineType('recipe', {
    name: {type: String},
    type: {type: String},
    base: {type: String},
    recipe: {type: String},
});

store.defineType('comment', {
    date: {type: Date},
    user: {type: String},
    text: {type: String},
    recipe: {type: Number, min: 0, max: 100},
});


var port = process.env.PORT || 8080;
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});