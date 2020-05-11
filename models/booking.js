const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true})
// timestamp : true -> mongo will automatically 
// add the createdAt & updatedAt fields

module.exports = mongoose.model('Booking', bookingSchema);