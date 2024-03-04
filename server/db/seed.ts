import { db } from "./index";

(async () => {
  await db.sync();
  console.log("Database synced with NODE_ENV", process.env.NODE_ENV);
})();
