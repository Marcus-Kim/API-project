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
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://images.beazer.com/e616c1c0-3536-4c3c-98dd-3a1954b21a2c-c',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://www.mydomaine.com/thmb/dke2LC6lH21Pvqwd2lI6AIutnDY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SuCasaDesign-Modern-9335be77ca0446c7883c5cf8d974e47c.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://dlqxt4mfnxo6k.cloudfront.net/beracahhomes.com/aHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2J1aWxkZXJjbG91ZC9jMTMyOWUzNTRlZDNjNmI1ZjZmMDI5ZmRhMjdhMjc0Yi5qcGVn/2000/2000',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://architecturesstyle.com/wp-content/uploads/2020/02/modern-mansions19.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://static3.mansionglobal.com/production/media/listing_images/7caacb3dc8df3d2a28daa2e98c85c518/xlarge_2fd0eca03446d30908ce117d9e5fa2.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://loveincorporated.blob.core.windows.net/contentimages/gallery/69c5efd9-ca20-4db1-b974-3fde61fd9c87-massive-secrets-calabasas-mansion-ext.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://static.onecms.io/wp-content/uploads/sites/34/2021/05/17/the-breakers-mansion-alt-getty-0521-2000.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://robbreport.com/wp-content/uploads/2022/08/LewinLane_Mansions.jpg?w=1000',
        preview: true
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
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};
