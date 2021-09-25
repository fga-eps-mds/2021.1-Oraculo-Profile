"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const sections = [
			{
				name: "Seção de cadastramento biográfico de biométrico e emissão de FAC (SCBBE)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Seção de inovação em identificação humana (SIIH)",
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "Seção de capacitação técnica (SCT)",
				created_at: new Date(),
				updated_at: new Date(),
			},
		];

		await queryInterface.createTable("sections", {
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

		return queryInterface.bulkInsert("sections", sections);
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable("sections");
	},
};
