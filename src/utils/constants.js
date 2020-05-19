const dotenv = require('dotenv');

dotenv.config();

// ENV Variables
const { TELEGRAM_TOKEN } = process.env;
const { DB_NAME } = process.env;
const { DB_PORT } = process.env;
const { LEETCODE_URL } = process.env;
const { MONGO_URL } = process.env;

// Static variables
const welcomeMessage = `Welcome! This is Leetcode Rating bot Elite Boys.
<b><i>/rating</i></b> - Overall rating
<b><i>/refresh</i></b>  - Manual refresh of database.
<b><i>/add username1 username2</i></b>  ... - adding users`;

module.exports = {
  TELEGRAM_TOKEN,
  MONGO_URL,
  DB_NAME,
  DB_PORT,
  LEETCODE_URL,
  welcomeMessage,
};
