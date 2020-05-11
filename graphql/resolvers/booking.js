const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformEvent, transformBooking } = require("./merge");

const bookings = async () => {
  try {
    const bookings = await Booking.find();
    return bookings.map((booking) => {
      return transformBooking(booking);
    });
  } catch (error) {
    throw error;
  }
};

const bookEvent = async (args) => {
  const fetchedId = await Event.findOne({ _id: args.eventId });
  const booking = new Booking({
    user: "5eb856dfe7cb1315549c1cd5",
    event: fetchedId,
  });
  const result = await booking.save();
  return transformBooking(result);
};

const cancelBooking = async (args) => {
  try {
    const booking = await Booking.findById(args.bookingId).populate("event");
    const event = transformEvent(booking.event);
    await Booking.deleteOne({ _id: args.bookingId });
    return event;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  bookings,
  bookEvent,
  cancelBooking,
};
