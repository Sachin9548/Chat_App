const express = require('express');
const {
  registerUserController,
  loginUserController,
  allUser,
} = require('../controllers/userControllers');
const { protect } = require('../middleWare/authProtect.js');


const router = express.Router();

router.post('/', registerUserController);
router.post('/login', loginUserController);
router.get('/', protect , allUser);

module.exports = router;
