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
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        id: 1,
        spotId: 1,
        userId: 1,
        review: 'really good I think',
        stars: 4
      },
      {
        id: 2,
        spotId: 2,
        userId: 2,
        review: 'absolutely terrible would not book again',
        stars: 1
      },
      {
        id: 3,
        spotId: 3,
        userId: 3,
        review: 'It was okay, but a little dirty',
        stars: 3
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
    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options, null, {})
  }
};
