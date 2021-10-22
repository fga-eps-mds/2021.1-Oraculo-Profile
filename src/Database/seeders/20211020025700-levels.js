"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const levels = [
      { name: "admin", created_at: new Date(), updated_at: new Date() },
      { name: "common", created_at: new Date(), updated_at: new Date() },
    ];

    return queryInterface.bulkInsert("levels", levels);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("levels", null, {});
  },
};
