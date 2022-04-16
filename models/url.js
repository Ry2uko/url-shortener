const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortened: {
    type: String,
    required: true
  },
  original: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Url', urlSchema);