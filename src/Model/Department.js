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
      foreignKey: "department_id",
      through: "user_departments",
      as: "departments",
    });
  }

  static getEmpty() {
    try {
      return Department.findOne({
        attributes: ["id", "name"],
        where: {
          name: "none",
        },
      });
    } catch (err) {
      console.error(`internal error ==> could not get departments: ${err}`);
      return null;
    }
  }
}

module.exports = { Department };
