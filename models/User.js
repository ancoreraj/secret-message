const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  inboxSecret: {
    type: String,
    required: true
  },
  messageSecret: {
    type: String,
    required: true
  },
  messages: [{
    type: String
  }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
