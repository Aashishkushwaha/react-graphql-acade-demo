const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  login: async ({ email, password }) => {
    try {
      let user = await User.findOne({ email });
      if (!user) throw new Error("User doesn't exist");
      let isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) throw new Error("Invalid password.");
      let token = await jwt.sign(
        { userId: user.id, email: user.email },
        "jwt@secret",
        { expiresIn: "1h" }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};
