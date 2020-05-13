const DataLoader = require("dataloader");
const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const transformEvent = (event) => ({
  ...event._doc,
  date: dateToString(event._doc.date),
  creator: user.bind(this, event.creator),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const singleEvent = async (eventId) => {
  try {
    let event = await eventLoader.load(eventId.toString());
    return event;
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: eventLoader.load.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
