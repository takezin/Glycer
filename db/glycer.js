const mongoose = require('mongoose');

const glycerSchema = new mongoose.Schema({
  serverid: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    category: String,
    members: String,
    users: String,
    bots: String,
  },
});

const Glycer = mongoose.model('Glycer', glycerSchema);

module.exports = Glycer;
