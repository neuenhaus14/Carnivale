import assert from 'assert';
import { describe, it } from 'mocha';

const userPageTest = () => {
  describe('UserPage', () => {
    it('tests equivalence of 1', function () {
      assert.equal(1, 1);
    });
  });
};

export default userPageTest;
