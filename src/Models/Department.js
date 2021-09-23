const { Model, Sequelize } = require("sequelize");

class Department extends Model {
  static init(db) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.TEXT,
        },
      },
      {
        sequelize: db,
      }
    );
  }
}

module.exports = Department;
