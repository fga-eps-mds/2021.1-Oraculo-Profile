const { Model, Sequelize } = require("sequelize");

class Level extends Model {
	static init(db) {
		super.init(
			{
				name: { type: Sequelize.TEXT },
			},
			{
				sequelize: db,
				tableName: "levels",
			}
		);
	}

	static associate(models) {
		this.belongsToMany(models.User, {
			foreignKey: "level_id",
			through: "user_levels",
			as: "levels",
		});
	}
}

module.exports = { Level };
