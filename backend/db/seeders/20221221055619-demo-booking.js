'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2022-01-30'),
        endDate: new Date('2022-01-31')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2022-02-10'),
        endDate: new Date('2022-02-15')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2022-03-30'),
        endDate: new Date('2022-03-31')
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings'
    await queryInterface.bulkDelete(options, null, {})
  }
};
