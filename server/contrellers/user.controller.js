const User = require("../models/user.model");

exports.getAllLoggedUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.json(loggedUsers);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
