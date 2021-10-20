const { Model, Sequelize, Op } = require("sequelize");

class Section extends Model {
  static init(db) {
    super.init(
      {
        name: { type: Sequelize.TEXT },
      },
      {
        sequelize: db,
        tableName: "sections",
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      foreignKey: "section_id",
      through: "user_sections",
      as: "sections",
    });
  }

  static getEmpty() {
    return Section.findOne({
      attributes: ["id", "name"],
      where: {
        name: {
          [Op.eq]: "none",
        },
      },
    });
  }
}

module.exports = { Section };
