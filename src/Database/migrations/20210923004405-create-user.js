"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable("users", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			permission: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			password: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			email: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			department_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			level: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			section_id: {
				type: Sequelize.INTEGER,
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
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable("users");
	},
};
