const { Sequelize } = require('sequelize');

const config = require('../config.js');

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
    name: Sequelize.STRING,
    phone: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    longitude: Sequelize.INTEGER,
    latitude: Sequelize.INTEGER,
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
      longitude: Sequelize.INTEGER,
      latitude: Sequelize.INTEGER,
      address: Sequelize.STRING,
      link: Sequelize.STRING,
      system: Sequelize.BOOLEAN,
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
    longitude: Sequelize.INTEGER,
    latitude: Sequelize.INTEGER,
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
        longitude: Sequelize.INTEGER,
        latitude: Sequelize.INTEGER,
        description: Sequelize.STRING,
        photoURL: Sequelize.STRING,
        isCostume: Sequelize.BOOLEAN,
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
      
      const join_event_participants = db.define(
        "join event partcipants",
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
  
  const join_event_invitees = db.define(
    "join event invitees",
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
    
    const join_friends = db.define(
      "join friends",
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
      
      const join_pin_photos = db.define(
        "join pin photos",
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
  
  const join_comment_votes = db.define(
    "join comment votes",
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
    
    const join_pin_votes = db.define(
      "join pin votes",
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
      
      const join_photo_votes = db.define(
        "join photo votes",
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
        
        const join_shared_posts = db.define(
          "join shared posts",
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
  
  db.sync()
    .then(()=> console.log('database synchronized'))
    .catch((err) => {
      console.error(err);
    });

  module.exports = {
    db,
    User,
    Event,
    Pin,
    Comment,
    Photo,
    join_event_participants,
    join_event_invitees,
    join_friends,
    join_pin_photos,
    join_comment_votes,
    join_pin_votes,
    join_photo_votes,
    join_shared_posts,
  };
  