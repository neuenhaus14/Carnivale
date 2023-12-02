const { db } = require("./index");

db.sync()
  .then(() => console.log("database synchronized"))
  .catch((err) => {
    console.error(err);
  });
