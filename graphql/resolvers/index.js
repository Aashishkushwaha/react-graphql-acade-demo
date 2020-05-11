const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");
const authResolver = require("./auth");
const eventsResolver = require("./events");
const { bookings, bookEvent, cancelBooking } = require("./booking");

module.exports = {
  // rootValue will have all the resolvers
  // resolver names must be exactly same as the query
  ...eventsResolver,
  ...authResolver,
  bookEvent,
  bookings,
  cancelBooking,
};
