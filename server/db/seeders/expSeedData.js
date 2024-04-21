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

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'Bob@Johnson.com',
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
    ]);

    // TAG id: 1
    await Tag.create({
      tag: 'throws',
    });

    // CREATE CONTENT through contentables to take advantage of associations

    // id: 1
    await Pin.create(
      {
        pinType: 'EMT',
        photoURL: 'www.google.com',
        description: "There's an EMT over here",
        createdAt: new Date(),
        updatedAt: new Date(),
        parentId: null,
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
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
        photoURL: 'www.google2.com',
        description: 'This photo is about the EMT pin',
      },
      { include: [Content] }
    );

    // Adding tags to content
    await Content_tag.create({
      tagId: 1,
      contentId: 1,
    });

    await Content_tag.create({
      tagId: 1,
      contentId: 2,
    });

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
          upvotes: 0,
          placement: 'public',
          userId: 1,
          parentId: null,
        },
        name: 'Opening Party',
        description: 'Fire Breathing Dragons',
        address: '54 S. South Long Lake Rd, Traverse City, MI, 49685',
        startTime: '2024-04-01T18:00',
        endTime: '2024-04-01T18:00',
        inviteCount: 0,
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


    // SHARING CONTENT id: 1 (the pin)
    await Shared_content.create({
      contentId: 1,
      senderId: 1,
      recipientId: 2,
    });

    // sharing the photo
    await Shared_content.create({
      contentId: 3,
      senderId: 1,
      recipientId: 2,
    });

    // marking if content is archived
    await Shared_content_status.create({
      contentId: 1,
      userId: 2,
      isArchived: false,
    })

    await Shared_content_status.create({
      contentId: 4,
      userId: 2,
      isArchived: true,
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('');
  },
};
