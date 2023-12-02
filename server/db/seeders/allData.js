
/** @type {import{'sequelize-cli'}.Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'a@b.com',
        phone: '123-456-7890',
        firstName: 'Bob',
        lastName: 'Johnson',
        latitude: 29.963864,
        longitude: -90.052130,
      },
      {
        email: 'c@d.com',
        phone: '223-456-7890',
        firstName: 'John',
        lastName: 'Erikson',
        latitude: 29.974952,
        longitude: -90.052869,
      },
      {
        email: 'e@f.com',
        phone: '323-456-7890',
        firstName: 'Erik',
        lastName: 'Bobson',
        latitude: 29.971376,
        longitude: -90.056863,
      },
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('')
  }
}