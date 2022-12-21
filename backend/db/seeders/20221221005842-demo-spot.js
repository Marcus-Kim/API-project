'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
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
    options.tableName = 'Spots'

    let data = [
      {
        id: 1,
        ownerId: 1,
        address: '1 W. First Spot Way',
        city: 'City1',
        state: 'State1',
        country: 'Country1',
        lat: 1.1,
        lng: 1.1,
        name: 'spot 1',
        description: 'this is spot number 1',
        price: 1.11
      },
      {
        id: 2,
        ownerId: 2,
        address: '2 W. Second Spot Way',
        city: 'City2',
        state: 'State2',
        country: 'Country2',
        lat: 2.2,
        lng: 2.2,
        name: 'spot 2',
        description: 'this is spot number 2',
        price: 2.22
      },
      {
        id: 3,
        ownerId: 3,
        address: '3 W. Third Spot Way',
        city: 'City3',
        state: 'State3',
        country: 'Country3',
        lat: 3.3,
        lng: 3.3,
        name: 'spot 3',
        description: 'this is spot number 3',
        price: 3.33
      },
    ];
    await queryInterface.bulkInsert(options, data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots'
    await queryInterface.bulkDelete(options, null, {})
  }
};
