var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create a schema
var leaderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    abbr: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }, {
    timestamps: true
  }
);

// schema is useless so far
// need to create a model using it
var Leaders = mongoose.model('Leader', leaderSchema);

//make avail to Node app
module.exports = Leaders;
