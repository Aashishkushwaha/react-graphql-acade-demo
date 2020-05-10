const User = require("../../models/user");
const Event = require("../../models/event");
const bcrypt = require("bcryptjs");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  // rootValue will have all the resolvers
  // resolver names must be exactly same as the query
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          // ...event._doc, _id: event._doc._id.toString()
          // ...event._doc, _id: event.id
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5eb856dfe7cb1315549c1cd5",
    });
    let createdEvent = null;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        date: new Date(result._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const foundUser = await User.findById("5eb856dfe7cb1315549c1cd5");
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
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        let user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        const result = await user.save();
        return {
          ...result._doc,
          password: null,
        };
      } else {
        throw new Error("User already exists.");
      }
    } catch (error) {
      throw error;
    }
  },
};

/* with promises

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
      });
    })
    .catch((error) => {
      throw error;
    });
};

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  // rootValue will have all the resolvers
  // resolver names must be exactly same as the query
  events: () => {
    return Event.find()
      .then((results) => {
        return results.map((event) => {
          return {
            // ...event._doc, _id: event._doc._id.toString()
            // ...event._doc, _id: event.id
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5eb82ba34059ef10871d9a14",
    });
    let createdEvent = null;
    return event
      .save()
      .then((event) => {
        createdEvent = {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
        return User.findById("5eb82ba34059ef10871d9a14");
      })
      .then((user) => {
        if (!user) {
          throw new Error("User doesn't exist");
        } else {
          user.createdEvents.push(event);
          return user.save();
        }
      })
      .then((result) => {
        return { ...createdEvent };
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (!user) {
          return bcrypt.hash(args.userInput.password, 12);
        } else {
          throw new Error("User already exists.");
        }
      })
      .then((hashedPassword) => {
        let user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((user) => ({
        ...user._doc,
        password: null,
      }))
      .catch((error) => {
        console.log(error);
        throw error;
      });
  },
};


*/
