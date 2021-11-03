const { Model, Sequelize, Op } = require("sequelize");

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
    this.hasMany(models.Section, { foreignKey: "department_id", as: "sections" });
    this.belongsToMany(models.User, {
      foreignKey: "department_id",
      through: "user_departments",
      as: "departments",
    });
  }

  static getEmpty() {
    return Department.findOne({
      attributes: ["id", "name"],
      where: {
        name: {
          [Op.eq]: "none",
        },
      },
    });
  }
}

module.exports = { Department };
