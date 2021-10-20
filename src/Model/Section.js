const { Model, Sequelize } = require("sequelize");

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
    try {
      return await Section.findOne({
        attributes: ["id", "name"],
        where: {
          name: "none",
        },
      });
    } catch (err) {
      console.error(`internal error => could not get sections: ${err}`);
      return null;
    }
  }
}

module.exports = { Section };
