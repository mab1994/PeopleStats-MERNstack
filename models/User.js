const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('user', UserSchema)
