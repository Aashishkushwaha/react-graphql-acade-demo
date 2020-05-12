const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformEvent, transformBooking } = require("./merge");

const bookings = async (args, req) => {
  if (!req.isAuth) throw new Error("Unauthenticated");
  try {
    const bookings = await Booking.find();
    return bookings.map((booking) => {
      return transformBooking(booking);
    });
  } catch (error) {
    throw error;
  }
};

const bookEvent = async (args, req) => {
  if (!req.isAuth) throw new Error("Unauthenticated");
  const fetchedId = await Event.findOne({ _id: args.eventId });
  const booking = new Booking({
    user: req.userId,
    event: fetchedId,
  });
  const result = await booking.save();
  return transformBooking(result);
};

const cancelBooking = async (args, req) => {
  if (!req.isAuth) throw new Error("Unauthenticated");
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
