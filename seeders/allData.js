
/** @type {import{'sequelize-cli'}.Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: 'a@b.com',
        phone: '123-456-7890',
        firstName: 'Bob',
        lastName: 'Johnson',
        latitude: 29.963864,
        longitude: -90.052130,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        email: 'c@d.com',
        phone: '223-456-7890',
        firstName: 'John',
        lastName: 'Erikson',
        latitude: 29.974952,
        longitude: -90.052869,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        email: 'e@f.com',
        phone: '323-456-7890',
        firstName: 'Erik',
        lastName: 'Bobson',
        latitude: 29.971376,
        longitude: -90.056863,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert('events', [
      {
        name: 'Meetup at the Friendly Bar',
        time: new Date('2023-12-24T18:00'),
        description: 'Grabbing a pint for old time\'s sake',
        longitude: -90.05951,
        latitude: 29.963724,
        address: '2301 Chartes St., New Orleans LA 70117',
        link: null,
        system: false,
        attendingCount: 2,
        upvotes: 0,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'DJ set at PvF Marker',
        time: new Date('2023-12-24T21:00'),
        description: 'Hot tracks by the tracks',
        longitude: -90.048717,
        latitude: 29.964642,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        upvotes: 0,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Boil',
        time: new Date('2023-12-24T14:00'),
        description: 'Parade pregame',
        longitude: -90.052452,
        latitude: 29.964846,
        address: null,
        link: null,
        system: false,
        attendingCount: 3,
        upvotes: 0,
        ownerId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  
    
  
  
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('')
  }
}