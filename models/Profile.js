const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  institution: {
    type: String,
    required: true,
  },
  institutionType: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)
