const { Model, Sequelize } = require("sequelize");

class userLevel extends Model {
  static init(db) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
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

module.exports = userLevel;
