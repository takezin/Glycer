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
    online: String,
  },
  log: {
    server: String,
    voice: String,
    def: String,
    members: String,
    messages: String,
  },
});

const Glycer = mongoose.model('Glycer', glycerSchema);

module.exports = Glycer;
