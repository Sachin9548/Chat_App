const mongoose = require("mongoose");
const { mongo_url } = require('../key.js')

const ConnectDB = async () => {
  try {
    await mongoose.connect(
      mongo_url,{ useNewUrlParser: true }
    );
    console.log(`connected To DB`);
  } catch (error) {
    console.error(`not connected `);
    process.exit();
  }
};
module.exports = ConnectDB;
