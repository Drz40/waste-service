var mongo = require('mongodb');
var BSON = mongo.BSONPure;
// get mongo client
var mongoClient = mongo.MongoClient;
var mongoDb;
mongoClient.connect("mongo ds123930.mlab.com:23930/bins_db -u Drz40 -p Oyindamola4", function(err, db) {
if(!err) {
  console.log("We are connected");
  mongoDb = db;
}
else
{
    console.log("Unable to connect to the db");
}
});

 // Connect to the db
    if (mongoDb){
      var collection = mongoDb.collection('bins');
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
    }
    else
    {
        console.log('No database object!');
    }

var datastore = require('./datastore');
var shortId = require('shortid');
// Get list of bins
exports.index = function(req, res) {
  return res.json(200, datastore.bins);
} ;
// Creates a new bin in datastore.
 var bin = req.body;
    console.log('Adding bin: ' + JSON.stringify(bin));
    if (mongoDb){
      var collection = mongoDb.collection('bins');
      collection.insert(bin, {w:1}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    }
  else
  {
    console.log('No database object!');
  }
  
exports.create = function(req, res) {
  var bin = {
     id: shortId.generate(),
     chipNumber: req.body.chipNumber,
     binCategory: req.body.binCategory,
     binSize: req.body.binSize,
     startDate: req.body.startDate,
     customerId: req.body.customerId 
  };
  datastore.bins.push(bin)
  return res.json(201, bin);
};

// Update an existing bin in datastore.
var id = req.params.id;
  var bin = req.body;
  console.log('Updating bin: ' + id);
  console.log(JSON.stringify(bin));
  var collection = mongoDb.collection('bins');
  collection.update({'_id':new BSON.ObjectID(id)}, bin, {safe:true}, function(err, result) {
          if (err) {
              console.log('Error updating bin: ' + err);
              res.send({'error':'An error has occurred'});
          } else {
              console.log('' + result + ' document(s) updated');
              res.send(bin);
          }
  });
exports.update = function(req, res) {
    var index = datastore.bins.map(function(x) {return x.id; }).indexOf(req.params.id);
    if (index != -1) {
       var bin = datastore.bins[index]
       bin.chipNumber =  req.body.chipNumber
       bin.binCategory = req.body.binCategory
       bin.binSize = req.body.binSize
	   bin.startDate = req.body.startDate
	   bin.customerId = req.body.customerId
	   
       return res.send(200, bin) 
    } else {
        return res.send(404)
    }
};
// delete an existing bin in datastore.
exports.delete = function(req, res) {
    var index = datastore.bins.map(function(x) {return x.id; }).indexOf(req.params.id);
    if (index != -1) {
       var bin = datastore.bins.splice(index,1);
       return res.send(200, bin) 
    } else {
        return res.send(404)
    }
};