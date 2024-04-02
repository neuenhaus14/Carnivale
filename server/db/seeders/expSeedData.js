// /** @type {import{'sequelize-cli'}.Migration} */

const models = require('../models/index');

const Pin = models.pin;
const Content = models.content;
const User = models.user;
const Photo = models.photo;
const Comment = models.comment;
const Plan = models.plan;
const Tag = models.tag;

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
    ]);

    // create Pin through Content to take advantage of all Content's associations
    await Pin.create(
      {
        pinType: 'EMT',
        photoURL: 'www.google.com',
        description: "There's an EMT over here",
        createdAt: new Date(),
        updatedAt: new Date(),
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
          // TODO: figure out including the tags in adding an object
          // tags: [{
          //   tag: 'Throws',
          // }],
        },
      },
      { include: [Content] }
    );
    await Photo.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: 'www.google2.com',
        description: 'Photo description',
      },
      { include: [Content] }
    );

    await Comment.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        description: 'This is the quintessential comment post',
      },
      { include: [Content] }
    );

    await Plan.create(
      {
        content: {
          latitude: 29.963864,
          longitude: -90.05213,
          upvotes: 0,
          placement: 'public',
          userId: 1,
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('');
  },
};
