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
    order: [["name", "ASC"]],
  });
  return res.status(200).json(departments);
}

async function getDepartmentByName(req, res) {
  try {
    // convert query string parameter to lowercase
    const name = String(req.query.name).toLowerCase();

    if (name == "undefined") {
      throw new Error("Error");
    }

    // checks for empty or null query string parameters
    if (name.length === 0) {
      return res.status(400).json({ error: "empty or missing parameter 'name'" });
    }

    const department = await Department.findOne({ where: { name } });
    if (!department) {
      return res.status(404).json({ error: `could not find department ${name}` });
    }

    return res.status(200).json(department);
  } catch (err) {
    console.log(`could not find department: ${err}`);
    return res
      .status(500)
      .json({ error: "internal server error during department search" });
  }
}

module.exports = {
  createDepartment,
  editDepartment,
  getAvailableDepartments,
  getDepartmentByName,
};
