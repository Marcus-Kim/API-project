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
    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      {
        id: 1,
        reviewId: 1,
        url: 'reviewImages url1',
      },
      {
        id: 2,
        reviewId: 2,
        url: 'reviewImages url2',
      },
      {
        id: 3,
        reviewId: 3,
        url: 'reviewImages url3',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages'
    await queryInterface.bulkDelete(options, null, {})
  }
};
