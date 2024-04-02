const User = require('../Modals/UserModal.js');
const generateToken = require('../config/generateToken.js');
const bcrypt = require('bcryptjs');

const registerUserController = async (req, res) => {
  const { name, email, password , pic } = req.body;
   if (!name || !email || !password) {
      return res.status(400).json('please fill all details');
    }
  const salt = await bcrypt.genSalt(10); 
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    name, 
    password: hashedPassword,
    email,
    pic,
  }); 
  try {
    await newUser.save();
     return res.status(200).json(newUser);
  } catch (error) {
     return res.status(500).json(error);
  }
}

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const token = await generateToken(user._id);
        console.log(token);
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          token:token,
        });
      } else {
        return res.status(400).json('invalid email & password');
      }
    } else {
      return res.status(400).json('user not found');
    }
  } catch (error) {
    return res.status(500).json(`invalid requist ${error}`);
  }
};

//api/user?search-sachin
const allUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log(users);
  res.send(users)
};

module.exports = { registerUserController, loginUserController ,allUser};
