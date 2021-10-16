const mongoose = require("mongoose");
const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },

  img: {
    type: String,
    default: null,
  },
  email: {
    type: String,
  },
});
var User = mongoose.model("AuthUsers", user);
module.exports = User;
