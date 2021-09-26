const { Model, Sequelize } = require("sequelize");

class User extends Model {
	static init(db) {
		super.init(
			{
				email: { type: Sequelize.TEXT },
				password: { type: Sequelize.TEXT },
			},
			{
				sequelize: db,
				tableName: "users",
			}
		);
	}

	static associate(models) {
		this.belongsToMany(models.Department, {
			foreignKey: "user_id",
			through: "user_departments",
			as: "departments",
		});
		this.belongsToMany(models.Level, {
			foreignKey: "user_id",
			through: "user_levels",
			as: "levels",
		});
		this.belongsToMany(models.Section, {
			foreignKey: "user_id",
			through: "user_sections",
			as: "sections",
		});
	}
}

module.exports = { User };
