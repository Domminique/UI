var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: true
  }
);

// create a schema
var dishSchema = new Schema(
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
    category: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: '',
      required: false
    },
    price: {
      type: Currency,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    comments:[commentSchema] //heh
  }, {
    timestamps: true
  }
);

// schema is useless so far
// need to create a model using it
var Brags = mongoose.model('Brag', dishSchema);

//make avail to Node app
module.exports = Brags;
