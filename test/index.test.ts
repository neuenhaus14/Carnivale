import { it, describe, before } from 'mocha';
import assert from 'assert'; // chai is weird w/ TS configuration, use native assert
import userPageTest from './userPage.test';

import server from '../server/app';

describe('Pardi Gras', function () {

  before(async function () {
    console.log('BEFORE TESTS');

    // spin up server, which connects to test db as per environment variable set in test script
    server.listen(4001, () => {
      console.log('Listening at port 4001');
    });
  });

  describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert?.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });

  describe('UserPage', function () {
    userPageTest();
  })

});

export default {};
