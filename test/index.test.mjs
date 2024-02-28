import { it, describe, before } from 'mocha';
import { assert } from 'chai';
import { Sequelize, DataTypes } from 'sequelize';
import userPageTests from './userPage.test.mjs';
import * as fs from 'fs';

const dbConfig = JSON.parse(
  fs.readFileSync('server/db/config/postgresConfig.json', 'utf8')
);

const testDbConfig = dbConfig.test;

const testDb = new Sequelize({
  ...testDbConfig,
  logging: false,
});

const User = testDb.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    longitude: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    shareLoc: DataTypes.BOOLEAN,
  },
  { timestamps: true }
);

const Event = testDb.define(
  'event',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageUrl: DataTypes.STRING,
    name: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    description: DataTypes.STRING,
    longitude: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    address: DataTypes.STRING,
    link: DataTypes.STRING,
    system: DataTypes.BOOLEAN,
    invitedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    attendingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Pin = testDb.define(
  'pin',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    isToilet: DataTypes.BOOLEAN,
    isFood: DataTypes.BOOLEAN,
    isPersonal: DataTypes.BOOLEAN,
    isFree: DataTypes.BOOLEAN,
    isPhoneCharger: DataTypes.BOOLEAN,
    isPoliceStation: DataTypes.BOOLEAN,
    isEMTStation: DataTypes.BOOLEAN,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Comment = testDb.define(
  'comment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: DataTypes.STRING,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Photo = testDb.define(
  'photo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    photoURL: DataTypes.STRING(1000),
    isCostume: DataTypes.BOOLEAN,
    isThrow: DataTypes.BOOLEAN,
    isPin: DataTypes.BOOLEAN,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_user_event = testDb.define(
  'join_user_event',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      references: {
        model: Event,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    isAttending: {
      type: DataTypes.BOOLEAN,
    },
  },
  { timestamps: true }
);

const Join_friend = testDb.define(
  'join_friend',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isConfirmed: DataTypes.BOOLEAN,
    requester_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    recipient_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_pin_photo = testDb.define(
  'join_pin_photo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Photo,
        key: 'id',
      },
    },
    pinId: {
      type: DataTypes.INTEGER,
      references: {
        model: Pin,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_comment_vote = testDb.define(
  'join_comment_vote',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Comment,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_pin_vote = testDb.define(
  'join_pin_vote',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    pinId: {
      type: DataTypes.INTEGER,
      references: {
        model: Pin,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_photo_vote = testDb.define(
  'join_photo_vote',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Photo,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

const Join_shared_post = testDb.define(
  'join_shared_post',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    recipient_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    shared_commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Comment,
        key: 'id',
      },
    },
    shared_pinId: {
      type: DataTypes.INTEGER,
      references: {
        model: Pin,
        key: 'id',
      },
    },
    shared_photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Photo,
        key: 'id',
      },
    },
  },
  { timestamps: true }
);

before(function () {
  testDb
    .authenticate()
    .then(() => {
      console.log('Test database connection has been established');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

  (async () => {
    await testDb.sync();
    console.log('Test database synced');
  })();


});

describe('Pardi Gras', function () {
  describe('User Page', function () {
    userPageTests();
  });
});

export {
  testDb,
  User,
  Event,
  Pin,
  Comment,
  Photo,
  Join_friend,
  Join_pin_photo,
  Join_comment_vote,
  Join_pin_vote,
  Join_photo_vote,
  Join_shared_post,
  Join_user_event,
};
