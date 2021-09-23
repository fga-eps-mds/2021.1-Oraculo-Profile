const { Model, Sequelize } = require("sequelize");

class Level extends Model {
	static init(db) {
		super.init(
			{
				id: { type: Sequelize.INTEGER, primaryKey: true },
				name: { type: Sequelize.TEXT },
			},
			{
				sequelize: db,
			}
		);
	}

	static associate(models) {
		userLevel.hasOne(models.User);
	}
}

module.exports = userLevel;
