import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import config from "../config";

const HOST = "localhost";
const db = new Sequelize({
  host: HOST,
  dialect: "postgres",
  username: config.DATABASE_USERNAME,
  database: "carnivale",
  password: config.DATABASE_PASSWORD,
  logging: false,
});

db.authenticate()
  .then(() => {
    console.log("Database connection has been established");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

interface User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<number>;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  longitude: number;
  latitude: number;
}

const User = db.define(
  "user",
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
  },
  { timestamps: true }
);

interface Event
  extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  id: CreationOptional<number>;
  name: string;
  date: number;
  description: string;
  lastName: string;
  longitude: number;
  latitude: number;
  address: string;
  link: string;
  inviteCount: number;
  attendingCount: number;
  upvotes: number;
  ownerId: number;
}

const Event = db.define(
  "event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    time: DataTypes.DATE,
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
        key: "id",
      },
    },
  },
  { timestamps: true }
);

interface Pin
  extends Model<InferAttributes<Pin>, InferCreationAttributes<Pin>> {
  id: CreationOptional<number>;
  longitude: number;
  latitude: number;
  isToilet: boolean;
  isFood: boolean;
  isPersonal: boolean;
  isFree: boolean;
  upvotes: number;
  ownerId: number;
}

const Pin = db.define(
  "pin",
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
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

interface Comment
  extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  id: CreationOptional<number>;
  longitude: number;
  latitude: number;
  isToilet: boolean;
  isFood: boolean;
  isPersonal: boolean;
  isFree: boolean;
  upvotes: number;
  ownerId: number;
}

const Comment = db.define(
  "comment",
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: DataTypes.DECIMAL,
    latitude: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    photoURL: DataTypes.STRING,
    isCostume: DataTypes.BOOLEAN,
    isThrow: DataTypes.BOOLEAN,
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ownerId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participant_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invitee_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isConfirmed: DataTypes.BOOLEAN,
    requester_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    recipient_userId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Photo,
        key: "id",
      },
    },
    pinId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    commentId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    pinId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    isUpvoted: DataTypes.BOOLEAN,
    voter_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    photoId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    recipient_userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    shared_commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Comment,
        key: "id",
      },
    },
    shared_pinId: {
      type: DataTypes.INTEGER,
      references: {
        model: Pin,
        key: "id",
      },
    },
    shared_photoId: {
      type: DataTypes.INTEGER,
      references: {
        model: Photo,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export {
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
