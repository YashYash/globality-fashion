var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs'),
  SALT_WORK_FACTOR = 10;

var Card = new Schema({
  title: {
    type: String,
    trim: true
  },
  blurb: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  modified: Date
});

module.exports = mongoose.model('Card', Card);
