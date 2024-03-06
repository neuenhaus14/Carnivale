import { NODE_ENV } from '../config';
import { db } from './index';

(async () => {
  await db.sync();
  if (NODE_ENV !== 'test') {
    console.log('Database synced with NODE_ENV', process.env.NODE_ENV);
  }
})();
