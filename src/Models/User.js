const { Model, Sequelize } = require("sequelize");

class Users extends Model {
  static init(db) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        permission: {
          type: Sequelize.INTEGER,
        },
        password: {
          type: Sequelize.TEXT,
        },
        email: {
          type: Sequelize.TEXT,
        },
        departmentID: {
          type: Sequelize.INTEGER,
        },
        level: {
          type: Sequelize.INTEGER,
        },
        sectionID: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize: db,
      }
    );
  }
}

module.exports = Users;
