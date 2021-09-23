const { Model, Sequelize } = require("sequelize");

class Department extends Model {
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
		Department.hasOne(models.User);
	}
}

module.exports = Department;
