const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  DATABASE_PASSWORD : process.env.DATABASE_PASSWORD,
  DATABASE_USERNAME : process.env.DATABASE_USERNAME
}