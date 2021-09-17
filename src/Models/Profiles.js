const { Model, Sequelize } = require("sequelize");

class Profiles extends Model {
  static init(db) {
    super.init(
      {
        email: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        permission: {
          type: Sequelize.INTEGER,
        },
        id: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize: db,
      }
    );
  }
}

module.exports = Profiles;
