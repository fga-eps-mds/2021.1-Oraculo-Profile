const { Section } = require("../Model/Section");
const { Op } = require("sequelize");

async function editSection(req, res) {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).send({
      error: "lacks of information to update section",
    });
  }

  try {
    const sectionID = Number.parseInt(id);
    const section = await Section.findByPk(sectionID);
    if (!section) {
      return res.status(404).json({ error: "could not find section" });
    }

    section.name = name;

    const updatedSection = await section.save();
    return res.status(200).json(updatedSection);
  } catch (error) {
    console.log(`could not create section: ${error}`);
    return res.status(500).json({ error: "could not edit the specified section" });
  }
}

async function createSection(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({
      error: "lacks of information to create section",
    });
  }

  try {
    const newSection = await Section.create({ name, is_admin: false });
    return res.status(201).send(newSection);
  } catch (error) {
    console.log(`could not create section: ${error}`);
    return res.status(500).json({ error: "could not create section" });
  }
}

async function getAvailableSections(req, res) {
  Section.findAll({
    attributes: ["id", "name"],
    where: {
      name: {
        [Op.not]: "none",
      },
    },
  }).then((sections) => {
    return res.status(200).json(sections);
  });
}

module.exports = { createSection, editSection, getAvailableSections };
