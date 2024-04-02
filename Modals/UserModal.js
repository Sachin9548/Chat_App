const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      requires: true,
      unique: true,
    },
    password: {
      type: String,
      requires: true,
    },
    pic: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsoEAMYKHiwI5JH_IlxayW3-9UurHlASFy9A&usqp=CAU',
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
module.exports = User;
