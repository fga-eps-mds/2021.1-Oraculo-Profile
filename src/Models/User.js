const { Model, Sequelize } = require("sequelize");

class User extends Model {
	static init(db) {
		super.init(
			{
				id: { type: Sequelize.INTEGER, primaryKey: true },
				permission: { type: Sequelize.INTEGER },
				password: { type: Sequelize.TEXT },
				email: { type: Sequelize.TEXT },
				departmentID: { type: Sequelize.INTEGER },
				level: { type: Sequelize.INTEGER },
				sectionID: { type: Sequelize.INTEGER },
			},
			{
				sequelize: db,
			}
		);
	}

	static associate(models) {
		User.hasOne(models.Department);
		User.hasOne(models.userLevel);
	}
}

module.exports = User;
