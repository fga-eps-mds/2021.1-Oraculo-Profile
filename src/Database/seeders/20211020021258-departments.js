"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Essa lista deverá estar em conformidade com a do microsserviço de profiles
    const departments = [
      {
        name: "Divisão Administrativa",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Divisão Biométrica Civil",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Divisão Biométrica Criminal",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Divisão de Tecnologia, Pesquisa e Desenvolvimento",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Gerência Adjunta",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Gerência de Identificação",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: true,
      },
      {
        name: "Unidade de Inteligência",
        created_at: new Date(),
        updated_at: new Date(),
        is_admin: false,
      },
      {
        name: "none",
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
