const mongoose = require("mongoose");


// user schema
const UserSchema = new mongoose.Schema({
  // firstname field
  firstname: {
    type: String,
    required: [true, 'Enter your Firstname'],
    unique: false
  },

  // lastname field
  lastname: {
    type: String,
    required: [true, 'Enter your Firstname'],
    unique: false
  },

  // email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },

  date: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String
  }
});

// export UserSchema
module.exports = mongoose.model("user", UserSchema);