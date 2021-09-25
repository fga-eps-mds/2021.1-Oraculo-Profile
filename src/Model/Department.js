const { Model, Sequelize } = require("sequelize");

class Department extends Model {
	static init(db) {
		super.init(
			{
				name: { type: Sequelize.TEXT },
			},
			{
				sequelize: db,
				tableName: "departments",
			}
		);
	}

	static associate(models) {
		this.belongsToMany(models.User, {
			through: "department_users",
			as: "user_departments_association",
		});
	}
}

module.exports = Department;
