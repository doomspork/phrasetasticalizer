var express    = require('express'),
    mongoose   = require('mongoose'),
    _          = require('underscore');

/**
*
* MongoDB + Mongoose Setup
*
*/
var db = {
  connect: function() {
    // Construct the MongoDB connection string
    var uristring = process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL  ||
      'mongodb://localhost/phrasetasticalizer';

    mongoose.set('debug', true);

    // Establish our connection to Mongo
    mongoose.connect(uristring, function (err, res) {
      if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
        console.log ('Successfully connected to: ' + uristring);
      }
    });
  }
};

// Define our model's schema
var phraseSchema = new mongoose.Schema({
  phrase:  { type: String,   trim: true },
  tags:    { type: [String], index: true }
});

// Set a collection index
phraseSchema.index({ tags: 1 });

// Create a model from our schema
var Phrase = mongoose.model('Phrase', phraseSchema);

// Connect to the database instance
db.connect();

/**
*
* Express Application Setup
*
*/
app = express();

// Configure middleware
//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.logger());

// Setup routing
app.get('/phrases', function(req, res) {
  var tags_param = req.query.tags;
  if (tags_param) {
    var tags  = _.map(tags_param.split(','), function(tag) { return tag.trim(); }),
        limit = req.query.limit || 10;
    Phrase.find({ tags: { '$in': tags }}).limit(limit).select('-_id -__v').exec(function(err, result) {
      res.send(result || []);
    });
  } else {
    res.send(400);
  }
});

app.post('/phrases', function(req, res) {
  var phrase = req.body.phrase,
      tags   = req.body.tags;
  Phrase.findOne({ phrase: phrase }).exec(function(err, result) {
    if (!err) {
      if (result) {
        var tags = _.union(result.tags, tags);
        obj      = result;
        obj.tags = tags;
      }

      obj.save(function(err, result) {
        if (!err) { phrase = result; }
      });
    }
  });
  res.send(200);
});

app.listen(process.env.PORT || 1337);
