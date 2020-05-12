const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    if(!req.isAuth)
      throw new Error("Unauthenticated");
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvent = null;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const foundUser = await User.findById(req.userId);
      if (!foundUser) {
        throw new Error("User doesn't exist");
      } else {
        foundUser.createdEvents.push(event);
        await foundUser.save();
        return createdEvent;
      }
    } catch (error) {
      throw error;
    }
  },
};