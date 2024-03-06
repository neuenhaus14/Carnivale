/*
JEST methods like test, expect and describe are automatically imported when running jest

The testDB is seeded from testSeedData.js every time the test script runs. There is only a single user right now (Andrea Tester), with an id of 1
*/

import server from '../server/app';
import '@babel/polyfill';
import request from 'supertest';
import { Comment } from '../server/db';

describe('Pardi Gras', () => {
  describe('API Server', () => {
    test('it should return 200 and "Booyah" from api/test/getTest', async () => {
      const response = await request(server).get('/api/test/getTest');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Booyah');
    });
  });

  describe('User Comments API', () => {
    test('a user should be able to add a comment', async () => {
      const commentObj = {
        comment: 'I like turtles',
        ownerId: 1,
      };

      const response = await request(server)
        .post('/api/home/1')
        .send(commentObj);
      expect(response.status).toBe(201);
      const commentRecord: any = await Comment.findOne({ where: { ownerId: 1 } });
      expect(commentRecord.comment).toBe(commentObj.comment);
      expect(commentRecord.upvotes).toBe(0);
    });
  });
});

export default {};
