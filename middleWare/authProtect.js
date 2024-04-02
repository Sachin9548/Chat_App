const jwt = require('jsonwebtoken');
const User = require('../Modals/UserModal.js');
const { jwt_key } = require("../key.js");
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //decode
      const decoded = jwt.verify(token, jwt_key);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json('not authorized,token invalid');
    }
  }

  if (!token) {
    res.status(401).json('not authorized,token not found');
  }
};

module.exports = { protect };
