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
		this.belongsToMany(models.Level, {
			through: "level_users",
			as: "user_levels_association",
		});
	}
}

module.exports = Level;
