const jwt = require('jsonwebtoken');
const { jwt_key } = require('../key.js')
const generateToken = (id) => {
  return jwt.sign({ id },jwt_key);
};
module.exports = generateToken;
