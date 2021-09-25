"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */

		const departments = [
			{
				name: "Gerência de identificação (GI)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Unidade de inteligência (UI)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Gerência adjunta (GA)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Divisão Biométria Criminal (DICRIM)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Divisão de Tecnologia, Pesquisa e Desenvolvimento (DITEC)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Divisão Administrativa (DIADM)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Divisão Biométrica Civil (DICIV)",
				created_at: new Date(),
				updated_at: new Date(),
			},
		];

		await queryInterface.createTable("departments", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});

		return queryInterface.bulkInsert("departments", departments);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */

		return queryInterface.dropTable("departments");
	},
};
