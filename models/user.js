const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event' // this will be the name of model we want the relationship with
    }
  ]
})

module.exports = mongoose.model('User', userSchema);