const { Department } = require("../Model/Department");
const { Op } = require("sequelize");

async function createDepartment(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({
      error: "lacks of information to register department",
    });
  }

  try {
    const newDepartment = await Department.create({ name, is_admin: true });
    return res.status(200).send(newDepartment);
  } catch (error) {
    console.log(`could not create department: ${error}`);
    return res.status(500).json({ error: "internal error during department creation" });
  }
}

async function editDepartment(req, res) {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).send({
      error: "lacks of information to update department",
    });
  }

  try {
    const departmentID = Number.parseInt(id);
    const department = await Department.findByPk(departmentID);
    if (!department) {
      return res.status(404).json({ error: "department not found" });
    }

    department.name = name;
    const updatedDepartment = await department.save();
    return res.status(200).json(updatedDepartment);
  } catch (error) {
    console.log(`could not create department: ${error}`);
    return res.status(500).json({ error: "internal error during department edit" });
  }
}

async function getAvailableDepartments(req, res) {
  const departments = await Department.findAll({
    attributes: ["id", "name"],
    order: [['name', 'ASC']]
  });
  return res.status(200).json(departments);
}

module.exports = { createDepartment, editDepartment, getAvailableDepartments };
