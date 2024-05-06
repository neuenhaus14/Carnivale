import { NODE_ENV } from '../config';
// pull in db from models folder
import db from './models/index';

(async () => {

  await db.sequelize.sync({ force: true }).then(()=> {
    console.log('Experimental database synced');
  });
})();
