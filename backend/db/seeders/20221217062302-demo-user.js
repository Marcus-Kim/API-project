'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
        firstName: 'demoguy1',
        lastName: 'demolast1',
        email: 'demoUser1@gmail.com',
        username: 'DemoUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 2,
        firstName: 'demoguy2',
        lastName: 'demolast2',
        email: 'demoUser2@gmail.com',
        username: 'DemoUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        id: 3,
        firstName: 'demoguy3',
        lastName: 'demolast3',
        email: 'demoUser3@gmail.com',
        username: 'DemoUser3',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['DemoUser1', 'DemoUser2', 'DemoUser3'] }
    }, {});
  }
};
