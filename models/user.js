var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: Number,
  password: String,
  OauthId: String,
  OauthToken: String,
  email: {
    type: String,
    default: ''
  },
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

User.methods.getName = function() {
  return (this.firstname + ' ' + this.lastName);
};
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
