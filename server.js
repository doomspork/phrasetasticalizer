var Percolator = require('percolator').Percolator,
    mongoose   = require('mongoose');

var server = new Percolator({
  protocol:  'http',
  port:      process.env.PORT || 1337,
  autoLink:  false
});

var Phrase = mongoose.model('Phrase', new mongoose.Schema({
  phrase:  { type: String, trim: true },
  tags:    [String]
}));

service.route('/phrases', {
  GET: function(req, res) {
    /**
    * Base on the `tags` request parameter find a random phrase and return it!
    */
  }
});

// Start listening to requests
server.listen(function(err) {
  console.log('');
});
