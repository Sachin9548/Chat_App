const express = require("express");
const { protect } = require("../middleWare/authProtect.js");

const { sendMessage,allMessage } = require("../controllers/messageController.js");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessage);
module.exports = router;

