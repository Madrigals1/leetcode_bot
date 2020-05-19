const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  link: String,
  solved: Number,
  all: Number,
});

module.exports = mongoose.model('User', userSchema);
