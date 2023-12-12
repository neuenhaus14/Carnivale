/** @type {import{'sequelize-cli'}.Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("users", [
      {
        email: "a@b.com",
        phone: "123-456-7890",
        firstName: "Bob",
        lastName: "Johnson",
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "c@d.com",
        phone: "223-456-7890",
        firstName: "John",
        lastName: "Erikson",
        latitude: 29.974952,
        longitude: -90.052869,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "e@f.com",
        phone: "323-456-7890",
        firstName: "Erik",
        lastName: "Bobson",
        latitude: 29.971376,
        longitude: -90.056863,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "g@h.com",
        phone: "323-426-7890",
        firstName: "Lonely",
        lastName: "Joe",
        latitude: 29.971336,
        longitude: -90.056263,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "i@j.com",
        phone: "313-426-7390",
        firstName: "Federico",
        lastName: "Lasagna",
        latitude: 29.671336,
        longitude: -90.356263,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "j@k.com",
        phone: "323-426-7890",
        firstName: "Antonio",
        lastName: "Fettucini",
        latitude: 29.972336,
        longitude: -90.156263,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("events", [
      {
        name: "Meetup at the Friendly Bar",
        startTime: new Date("2023-12-24T18:00"),
        endTime: new Date("2023-12-24T19:00"),
        description: "Grabbing a pint for old time's sake",
        longitude: -90.05951,
        latitude: 29.963724,
        address: "2301 Chartes St., New Orleans LA 70117",
        link: null,
        system: false,
        attendingCount: 2,
        invitedCount: 1,
        upvotes: 0,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "DJ set at PvF Marker",
        startTime: new Date("2023-12-24T21:00"),
        endTime: new Date("2023-12-24T22:00"),
        description: "Hot tracks by the tracks",
        longitude: -90.048717,
        latitude: 29.964642,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        invitedCount: 0,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Boil",
        startTime: new Date("2023-12-24T14:00"),
        endTime: new Date("2023-12-24T15:00"),
        description: "Parade pregame",
        longitude: -90.052452,
        latitude: 29.964846,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        invitedCount: 0,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);


    await queryInterface.bulkInsert("join_user_events", [
      {
        eventId: 1,
        userId: 1,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 1,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 1,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 2,
        userId: 3,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 1,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 2,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 3,
        userId: 3,
        isAttending: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: 1,
        userId: 3,
        isAttending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert("join_event_participants", [
      {
        participant_userId: 1,
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 2,
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 2,
        eventId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 1,
        eventId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 3,
        eventId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 1,
        eventId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 2,
        eventId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        participant_userId: 3,
        eventId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_event_invitees", [
      {
        invitee_userId: 3,
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("pins", [
      {
        longitude: -90.0542,
        latitude: 29.9647,
        isToilet: true,
        isFood: false,
        isPersonal: false,
        isFree: true,
        upvotes: 1,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.0539,
        latitude: 29.9633,
        isToilet: true,
        isFood: false,
        isPersonal: false,
        isFree: false,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.0551,
        latitude: 29.9632,
        isToilet: false,
        isFood: true,
        isPersonal: false,
        isFree: null,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.0551,
        latitude: 29.9632,
        isToilet: false,
        isFood: false,
        isPersonal: true,
        isFree: null,
        upvotes: 0,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_pin_votes", [
      {
        isUpvoted: true,
        voter_userId: 2,
        pinId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("photos", [
      {
        longitude: -90.054261,
        latitude: 29.964735,
        description: "A free toilet!",
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/1920px-Toilet_photo.jpg",
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 1,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.053976,
        latitude: 29.963373,
        description: "An expensive toilet!",
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/1920px-Toilet_photo.jpg",
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.055103,
        latitude: 29.963286,
        description: "Delicious hotdogs at the food stall!",
        photoURL:
          "https://carolynquinn.files.wordpress.com/2014/08/michellekonderich.jpg",
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.055103,
        latitude: 29.963286,
        description: "There's a long line at the hotdogs!",
        photoURL:
          "https://carolynquinn.files.wordpress.com/2014/08/michellekonderich.jpg",
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 1,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.055187,
        latitude: 29.963212,
        description: "Left my keys in the bush",
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cytisus_scoparius2.jpg/1200px-Cytisus_scoparius2.jpg",
        isCostume: false,
        isThrow: false,
        isPin: true,
        upvotes: 0,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.055109,
        latitude: 29.963299,
        description: "Check out my costume",
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/4/46/Inflatable_costume.jpg",
        isCostume: true,
        isThrow: false,
        isPin: false,
        upvotes: 1,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        longitude: -90.055155,
        latitude: 29.963277,
        description: "Oh yeah! Thank you, Muses",
        photoURL:
          "https://upload.wikimedia.org/wikipedia/commons/4/45/Red_High_Heel_Pumps.jpg",
        isCostume: false,
        isThrow: true,
        isPin: false,
        upvotes: 1,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_photo_votes", [
      {
        isUpvoted: true,
        voter_userId: 2,
        photoId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        photoId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        photoId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 3,
        photoId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_pin_photos", [
      {
        photoId: 1,
        pinId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        photoId: 2,
        pinId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        photoId: 3,
        pinId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        photoId: 4,
        pinId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        photoId: 5,
        pinId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("comments", [
      {
        comment: "I'm having a good time",
        upvotes: 2,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: "Dead horse on the corner!",
        upvotes: -1,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: "The sun is shining!",
        upvotes: 1,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment:
          "Where should I get some food? Somebody friend request me and share a good pin!",
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_comment_votes", [
      {
        isUpvoted: true, // true is upvote, false is downvote
        voter_userId: 1,
        commentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        commentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 1,
        commentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 2,
        commentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: true,
        voter_userId: 1,
        commentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        isUpvoted: false,
        voter_userId: 3,
        commentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_friends", [
      {
        requester_userId: 1,
        recipient_userId: 2,
        isConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 1,
        recipient_userId: 3,
        isConfirmed: null, // null indicates the request is pending (may need to change this if null can't be fetched)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        requester_userId: 2,
        recipient_userId: 3,
        isConfirmed: false, // denied request
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert("join_shared_posts", [
      {
        sender_userId: 2,
        recipient_userId: 1,
        shared_commentId: null,
        shared_pinId: 3,
        shared_photoId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_userId: 2,
        recipient_userId: 1,
        shared_commentId: 3,
        shared_pinId: null,
        shared_photoId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_userId: 2,
        recipient_userId: 1,
        shared_commentId: null,
        shared_pinId: null,
        shared_photoId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sender_userId: 1,
        recipient_userId: 2,
        shared_commentId: null,
        shared_pinId: null,
        shared_photoId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("");
  },
};
