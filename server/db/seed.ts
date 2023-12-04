const { db } = require("./index.ts");

db.sync()
  .then(() => console.log("database synchronized"))
  .catch((err) => {
    console.error(err);
  });
