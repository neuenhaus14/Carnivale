import { db } from "./index";

(async () => {
  await db.sync();
  console.log("development database synced");
})();
