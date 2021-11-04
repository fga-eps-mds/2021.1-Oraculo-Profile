const { Model, DataTypes, Op } = require("sequelize");

class Section extends Model {
  static init(db) {
    super.init(
      {
        name: { type: DataTypes.TEXT },
        is_admin: { type: DataTypes.BOOLEAN },
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
