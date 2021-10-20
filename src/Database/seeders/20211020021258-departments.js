"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Essa lista deverá estar em conformidade com a do microsserviço de profiles
    const departments = [
      {
        name: "Gerência de identificação",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Unidade de inteligência",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Gerência adjunta",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Divisão biométrica criminal",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Divisão de tecnologia, pesquisa e desenvolvimento",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Divisão administrativa",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Divisão biométrica civil",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return queryInterface.bulkInsert("departments", departments);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete("departments", null, {});
  },
};
