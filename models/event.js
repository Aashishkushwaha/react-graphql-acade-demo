const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let eventSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    // default: Date.now().toString(),
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Event', eventSchema);