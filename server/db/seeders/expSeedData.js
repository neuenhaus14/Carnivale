// /** @type {import{'sequelize-cli'}.Migration} */

const models = require('../models/index');

const Pin = models.pin;
const Content = models.content;
const User = models.user;
const Photo = models.photo;
const Comment = models.comment;
const Plan = models.plan;
const Tag = models.tag;
const Content_tag = models.content_tag;
const Shared_content = models.shared_content;
const Shared_content_status = models.shared_content_status;
const User_vote = models.user_vote;
const User_friend = models.user_friend;
const User_plan = models.user_plan;


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'a@b.com',
        phone: '123-456-7890',
        firstName: 'Bob',
        lastName: 'Johnson',
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'Marta@Smith.com',
        phone: '321-654-0987',
        firstName: 'Marta',
        lastName: 'Smith',
        latitude: 29.963864,
        longitude: -90.05213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'Helene@gmail.com',
        phone: '531-994-0987',
        firstName: 'Helene',
        lastName: 'Van Damme',
        latitude: 29.923864,
        longitude: -90.01213,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'PeterLF@gmail.com',
        phone: '531-994-0987',
        firstName: 'Peter',
        lastName: 'LeFleur',
        latitude: 29.9423864,
        longitude: -90.06253,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'AbbyDooby@gmail.com',
        phone: '534-995-0987',
        firstName: 'Abby',
        lastName: 'Graham',
        latitude: 29.7823864,
        longitude: -90.09853,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'mPants@gmail.com',
        phone: '124-995-0987',
        firstName: 'Michael',
        lastName: 'Pants',
        latitude: 29.7563864,
        longitude: -90.06753,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'debrahands@gmail.com',
        phone: '176-995-0987',
        firstName: 'Debra',
        lastName: 'Hands',
        latitude: 29.7873864,
        longitude: -90.09853,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
      {
        email: 'donny@gmail.com',
        phone: '176-995-0987',
        firstName: 'Donny',
        lastName: 'Moore',
        latitude: 29.7823864,
        longitude: -90.05353,
        createdAt: new Date(),
        updatedAt: new Date(),
        shareLoc: true,
      },
    ]);

    // TAG id: 1
    await Tag.create({
      tag: 'throws',
    });
    // TAG id: 2
    await Tag.create({
      tag: 'costumes',
    });
    // TAG id: 3
    await Tag.create({
      tag: 'food',
    });

    // CREATE CONTENT through contentables to take advantage of associations

    // id: 1
    await Pin.create(
      {
        pinType: 'EMT',
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/oh8ugtya4ykz6d0ysl32.jpg',
        description: "There's an EMT over here",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.963864,
        longitude: -90.05213,
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 1,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // id: 2, belongs to content id 1 (above)
    await Photo.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: 'https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/oh8ugtya4ykz6d0ysl32.jpg',
        description: 'This photo is about the EMT pin',
      },
      { include: [Content] }
    );

    // id: 3
    await Comment.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 2,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'This is a nested comment about a photo about a pin',
      },
      { include: [Content] }
    );

    // id: 4
    await Plan.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 3,
          placement: 'public',
          userId: 2,
          parentId: null,
        },
        title: 'Lunch',
        description: 'Paladar Lunch Special',
        address: '511 Marigny St, New Orleans, LA 70117',
        latitude: 29.963114361199445,
        longitude: -90.05487604824603,
        startTime: '2024-07-02T18:00',
        endTime: '2024-07-02T18:30',
        inviteCount: 1,
        attendingCount: 0,
        link: 'www.link.com',
      },
      {
        include: [Content],
      }
    );

    // content id 5
    await Comment.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'This comment is about an EMT pin',
      },
      { include: [Content] }
    );

    // content id 6
    await Photo.create(
      {
        content: {
          latitude: 29.343864,
          longitude: -90.55213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_limit,w_601,h_600/v1710963574/Carnivale/IMG_6107_gnrtou.jpg',
        description: 'Go Saints',
      },
      { include: [Content] }
    );
    // photo of parade is tagged throws
    await Content_tag.create({
      tagId: 1,
      contentId: 6,
    });

    // content id 7
    await Photo.create(
      {
        content: {
          latitude: 29.243864,
          longitude: -90.85213,
          upvotes: 0,
          placement: 'public',
          userId: 3,
          parentId: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL:
          'https://res.cloudinary.com/dj5uxv8tg/image/upload/c_auto,h_800,w_450/v1711477556/Easter_Sunday_in_New_Orleans_French_Quarter_2018_10_fywoy8.jpg',
        description: 'My costume!',
      },
      { include: [Content] }
    );

    // photo of woman in costume gets costume tag
    await Content_tag.create({
      tagId: 2,
      contentId: 7,
    });

    // content id 8
    await Comment.create(
      {
        content: {
          latitude: 29.864864,
          longitude: -90.05713,
          upvotes: 0,
          placement: 'public',
          userId: 4,
          parentId: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'Where are the oysters?',
      },
      { include: [Content] }
    );

    await Content_tag.create({
      tagId: 3,
      contentId: 8,
    });

    // content id 9
    await Photo.create(
      {
        content: {
          latitude: 29.346864,
          longitude: -90.55283,
          upvotes: 0,
          placement: 'public',
          userId: 4,
          parentId: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL:
          'https://upload.wikimedia.org/wikipedia/commons/c/c1/Oak_Street_Po-Boy_Fest_New_Orleans_2016_41.jpg',
        description: 'Wild Boar Poboy, yum!',
      },
      { include: [Content] }
    );

    // content id 10
    await Plan.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'private',
          userId: 1,
          parentId: null,
        },
        title: 'Opening Party',
        description: 'Private! Pregame at Hotel Peter & Paul',
        address: '2317 Burgundy St, New Orleans, LA 70117',
        latitude: 29.967083194747136,
        longitude: -90.05516562054513,
        startTime: '2024-07-03T19:00',
        endTime: '2024-07-03T19:30',
        inviteCount: 0,
        attendingCount: 0,
        link: 'www.link2.com',
      },
      {
        include: [Content],
      }
    );

    // A BUNCH OF PINS
    // Content id 11
    await Pin.create(
      {
        pinType: 'Free_Toilet',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/yfpo9qrachrpizrgkt47.jpg",
        description: "A free toilet",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.962828,
        longitude: -90.053271,
        content: {
          latitude: 29.962828,
          longitude: -90.053271,
          upvotes: 0,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 12
    await Pin.create(
      {
        pinType: 'Charge_Toilet',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/ebsvvw2yy75mgdszogzl.jpg",
        description: "$3 to use!",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.963333,
        longitude: -90.051899,
        content: {
          latitude: 29.963333,
          longitude:-90.051899,
          upvotes: 0,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 13
    await Pin.create(
      {
        pinType: 'Food',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/ktpl4konvtsxeuy3mgi8.jpg",
        description: "Hot sausage in the house... $10 ftw.",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.9636123,
        longitude: -90.050777,
        content: {
          latitude: 29.9636123,
          longitude:-90.050777,
          upvotes: 0,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 14
    await Pin.create(
      {
        pinType: 'Charging_Station',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/dubvno2a2fr1ncbzeazk.jpg",
        description: "Phone charger if you're outta juice.",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.9669162,
        longitude: -90.051982,
        content: {
          latitude: 29.9669162,
          longitude:-90.051982,
          upvotes: 0,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 15
    await Pin.create(
      {
        pinType: 'Police',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/u3vgjan0n7ufckqbh7tt.jpg",
        description: "Hot fuzz, 6 o'clock (that means they're behind you).",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.963603,
        longitude: -90.056241,
        content: {
          latitude: 29.963603,
          longitude:-90.056241,
          upvotes: 0,
          placement: 'public',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 15: private pin for user 2
    await Pin.create(
      {
        pinType: 'Personal',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/yrzmn9ssn6ysrnripdue.jpg",
        description: "Marta: Left my bike here!",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.961779,
        longitude: -90.056035,
        content: {
          latitude: 29.961779,
          longitude:-90.056035,
          upvotes: 0,
          placement: 'private',
          userId: 2,
        },
      },
      { include: [Content] }
    );

    // Content id 16: private pin for user 1
    await Pin.create(
      {
        pinType: 'Personal',
        photoURL:
        "https://res.cloudinary.com/dj5uxv8tg/image/upload/v1706028911/Carnivale/yrzmn9ssn6ysrnripdue.jpg",
        description: "Bob: Left my bike here!",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        latitude: 29.961723,
        longitude: -90.056143,
        content: {
          latitude: 29.961723,
          longitude:-90.056143,
          upvotes: 0,
          placement: 'private',
          userId: 1,
        },
      },
      { include: [Content] }
    );

    // photo of poboy is tagged food
    await Content_tag.create({
      tagId: 3,
      contentId: 9,
    });

    // SHARING CONTENT id: 1 (the pin)
    await Shared_content.create({
      contentId: 1,
      senderId: 2,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 1,
      senderId: 3,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 1,
      senderId: 4,
      recipientId: 1,
    });

    // sharing the plan
    await Shared_content.create({
      contentId: 4,
      senderId: 2,
      recipientId: 1,
    });

    await Shared_content.create({
      contentId: 4,
      senderId: 3,
      recipientId: 1,
    });

    // two users shared event with user 1, but no answer yet
    await User_plan.create({
      status: 'pending',
      contentId: 4,
      userId: 1,
    })

    // user 1 is automatically goes to their own event
    await User_plan.create({
      status: 'accepted',
      contentId: 10,
      userId: 1,
    })

    // marking if shared content is archived for user 1
    // the pin is NOT archived
    await Shared_content_status.create({
      contentId: 1,
      userId: 1,
      isArchived: false,
    });

    // the plan is archived
    await Shared_content_status.create({
      contentId: 4,
      userId: 1,
      isArchived: true,
    });

    // up/downvotes from user 1
    await User_vote.create({
      vote: 'up',
      userId: 1,
      contentId: 4,
    });
    await User_vote.create({
      vote: 'down',
      userId: 1,
      contentId: 1,
    });

    // up/downvotes from user 2
    await User_vote.create({
      vote: 'up',
      userId: 2,
      contentId: 4,
    });
    await User_vote.create({
      vote: 'up',
      userId: 2,
      contentId: 1,
    });

    // up/downvotes from user 3
    await User_vote.create({
      vote: 'up',
      userId: 3,
      contentId: 4,
    });
    await User_vote.create({
      vote: 'up',
      userId: 3,
      contentId: 1,
    });


    // Adding friends
    await User_friend.create({
      status: 'accepted',
      requesterId: 1,
      recipientId: 2,
    });
    await User_friend.create({
      status: 'accepted',
      requesterId: 1,
      recipientId: 3,
    });
    await User_friend.create({
      status: 'accepted',
      requesterId: 4,
      recipientId: 1,
    });
    await User_friend.create({
      status: 'pending',
      requesterId: 1,
      recipientId: 5,
    })
    await User_friend.create({
      status: 'pending',
      requesterId: 6,
      recipientId: 1,
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('');
  },
};
