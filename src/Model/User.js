const { Model, Sequelize } = require("sequelize");

class User extends Model {
	static init(db) {
		super.init(
			{
				password: { type: Sequelize.TEXT },
				email: { type: Sequelize.TEXT },
			},
			{
				sequelize: db,
				tableName: "users",
			}
		);
	}

	static associate(models) {
		User.hasOne(models.Department);
		User.hasOne(models.Level);
	}
}

module.exports = User;
