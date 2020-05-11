const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
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
