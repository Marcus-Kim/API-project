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
    await queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1 W. First Spot Way',
        city: 'Glendale',
        state: 'Arizona',
        country: 'United States',
        lat: 1.1,
        lng: 1.1,
        name: 'Desert Ridge',
        description: 'An amazing desert getaway',
        price: 259.00
      },
      {
        ownerId: 2,
        address: '2 W. Second Spot Way',
        city: 'Canon Beach',
        state: 'Oregon',
        country: 'United States',
        lat: 2.2,
        lng: 2.2,
        name: 'Beach Oasis',
        description: 'My friend Jamie lives here',
        price: 450.00
      },
      {
        ownerId: 3,
        address: '3 W. Third Spot Way',
        city: 'Peoria',
        state: 'Illinois',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Grass House',
        description: 'So much grass here that you could grow grass',
        price: 89.00
      },
      {
        ownerId: 1,
        address: '4 E. Fourth Spot Way',
        city: 'Austin',
        state: 'Texas',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Ranch Hills House',
        description: 'Ranch everywhere',
        price: 333.33
      },
      {
        ownerId: 2,
        address: '5 W. Fifth Spot Way',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Super Cool Place',
        description: 'this is Super Cool!',
        price: 90.33
      },
      {
        ownerId: 3,
        address: '6 W. Sixth Spot Way',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Awesome House',
        description: 'this is an awesome house!',
        price: 700.00
      },
      {
        ownerId: 1,
        address: '7 W. Seventh Spot Way',
        city: 'Seattle',
        state: 'Washington',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Crazy Place',
        description: 'this is a crazy place!',
        price: 900.00
      },
      {
        ownerId: 2,
        address: '8 W. Eigth Spot Way',
        city: 'Denver',
        state: 'Colorado',
        country: 'United States',
        lat: 3.3,
        lng: 3.3,
        name: 'Cole House',
        description: 'Cole lives here',
        price: 45.00
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
    options.tableName = 'Spots'
    await queryInterface.bulkDelete(options, null, {})
  }
};
