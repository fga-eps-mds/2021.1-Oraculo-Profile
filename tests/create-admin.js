const { User } = require("../src/Model/User");
const { Department } = require("../src/Model/Department");
const { Level } = require("../src/Model/Level");
const { Section } = require("../src/Model/Section");
const { hashPassword } = require("../src/Utils/hash");
const { initializeDatabase } = require("../src/Database");
require("dotenv").config();

const adminUser = {
  name: "administrador do sistema",
  email: "admin@email.com",
  password: "admin1234",
  departmentID: 1,
  level: 1,
};

async function createAdminUser() {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error(`could not connect to database: ${err}`);
    process.exit(1);
  }

  console.log("connected to database");

  const department = await Department.findOne({
    where: { id: adminUser.departmentID },
  });

  const level = await Level.findOne({
    where: { id: adminUser.level },
  });

  const section = await Section.getEmpty();

  if (!department || !level || !section) {
    console.error(`invalid information: ${department}, ${level}, ${section}`);
    process.exit(1);
  }

  try {
    const newUser = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: await hashPassword(adminUser.password),
    });

    if (!newUser) {
      console.error("failed to create user");
      return;
    }

    await newUser.addDepartment(department);
    await newUser.addLevel(level);
    await newUser.addSection(section);

    console.log(`created user: ${JSON.stringify(newUser)}`);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

createAdminUser().then(
  () => {
    process.exit(0);
  },
  (rejected) => {
    console.error(`could not create user: ${rejected}`);
    process.exit(1);
  }
);
