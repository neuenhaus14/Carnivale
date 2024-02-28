import { db } from "./index";

(async () => {
  await db.sync();
  console.log("Development database synced");
})();
