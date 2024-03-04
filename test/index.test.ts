import { it, describe, before } from 'mocha';
import assert from 'assert'; // chai is weird w/ TS configuration, use native assert
import userPageTest from './userPage.test';

import server from '../server/app';

describe('Pardi Gras', function () {

  before(function () {
    console.log('BEFORE TESTS');

    // spin up server, which connects to test db as per environment variable set in test script. port is 4000, accounting for return url for Auth0 login.
    server.listen(4000, () => {
      console.log('Listening at port 4000');
    });
  });

  describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });

  describe('UserPage', function () {
    userPageTest()
  })

  after(()=> {
    server.close(()=>console.log('server closed'))
  })
});

export default {};
