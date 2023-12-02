const { Sequelize } = require("sequelize");

const config = require("../config.js");

const HOST = "localhost";
const db = new Sequelize({
  host: HOST,
  dialect: "postgres",
  username: config.DATABASE_USERNAME,
  database: "carnivale",
  password: config.DATABASE_PASSWORD,
});

db.authenticate()
  .then(() => {
    console.log("Database connection has been established");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: Sequelize.STRING,
    phone: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    longitude: Sequelize.DECIMAL,
    latitude: Sequelize.DECIMAL,
  },
  { timestamps: true }
);

const Event = db.define(
  "event",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    time: Sequelize.DATE,
    description: Sequelize.STRING,
    longitude: Sequelize.DECIMAL,
    latitude: Sequelize.DECIMAL,
    address: Sequelize.STRING,
    link: Sequelize.STRING,
    system: Sequelize.BOOLEAN,
    invitedCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    attendingCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Pin = db.define(
  "pin",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: Sequelize.DECIMAL,
    latitude: Sequelize.DECIMAL,
    isToilet: Sequelize.BOOLEAN,
    isFood: Sequelize.BOOLEAN,
    isPersonal: Sequelize.BOOLEAN,
    isFree: Sequelize.BOOLEAN,
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Comment = db.define(
  "comment",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: Sequelize.STRING,
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Photo = db.define(
  "photo",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: Sequelize.DECIMAL,
    latitude: Sequelize.DECIMAL,
    description: Sequelize.STRING,
    photoURL: Sequelize.STRING,
    isCostume: Sequelize.BOOLEAN,
    isThrow: Sequelize.BOOLEAN,
    upvotes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_event_participant = db.define(
  "join_event_participant",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participant_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: Sequelize.INTEGER,
      references: {
        model: Event,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_event_invitee = db.define(
  "join_event_invitee",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invitee_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: Sequelize.INTEGER,
      references: {
        model: Event,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

// may need to alter schema to indicate both that a request
// is pending/complete and that a request is confirmed/denied
const Join_friend = db.define(
  "join_friend",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isConfirmed: Sequelize.BOOLEAN,
    requester_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    recipient_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_pin_photo = db.define(
  "join_pin_photo",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    photoId: {
      type: Sequelize.INTEGER,
      references: {
        model: Photo,
        key: "id",
      },
    },
    pinId: {
      type: Sequelize.INTEGER,
      references: {
        model: Pin,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_comment_vote = db.define(
  "join_comment_vote",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: Sequelize.BOOLEAN,
    voter_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    commentId: {
      type: Sequelize.INTEGER,
      references: {
        model: Comment,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_pin_vote = db.define(
  "join_pin_vote",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: Sequelize.BOOLEAN,
    voter_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    pinId: {
      type: Sequelize.INTEGER,
      references: {
        model: Pin,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_photo_vote = db.define(
  "join_photo_vote",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: Sequelize.BOOLEAN,
    voter_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    photoId: {
      type: Sequelize.INTEGER,
      references: {
        model: Photo,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

const Join_shared_post = db.define(
  "join_shared_post",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    recipient_userId: {
      type: Sequelize.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    shared_commentId: {
      type: Sequelize.INTEGER,
      references: {
        model: Comment,
        key: "id",
      },
    },
    shared_pinId: {
      type: Sequelize.INTEGER,
      references: {
        model: Pin,
        key: "id",
      },
    },
    shared_photoId: {
      type: Sequelize.INTEGER,
      references: {
        model: Photo,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

module.exports = {
  db,
  User,
  Event,
  Pin,
  Comment,
  Photo,
  Join_event_participant,
  Join_event_invitee,
  Join_friend,
  Join_pin_photo,
  Join_comment_vote,
  Join_pin_vote,
  Join_photo_vote,
  Join_shared_post,
};
