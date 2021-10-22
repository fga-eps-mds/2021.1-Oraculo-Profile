const { User } = require("../Model/User");
const { Sequelize } = require("sequelize");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
const { Section } = require("../Model/Section");
require("dotenv").config();

const { PROD, DATABASE_URL } = process.env;

function loadEnvironment(testing) {
  let options;

  if (DATABASE_URL === undefined || DATABASE_URL === "" || testing === 1) {
    console.error("DATABASE_URL: empty required environment variable");
    return null;
  }

  // Checks if we are being deployed at production/homol environment
  if (PROD === "true" || testing === 2) {
    options = {
      dialect: "postgres",
      define: {
        timestamps: true,
        underscored: true,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    };
  } else {
    options = {
      dialect: "postgres",
      define: {
        timestamps: true,
        underscored: true,
      },
      logging: false,
    };
  }

  console.info(`production: ${PROD}`);
  console.info(`database url: ${DATABASE_URL}`);
  console.info(`database settings: ${JSON.stringify(options)}`);

  return options;
}

async function setupModels(db) {
  User.init(db);
  Department.init(db);
  Level.init(db);
  Section.init(db);

  User.associate(db.models);
  Department.associate(db.models);
  Level.associate(db.models);
  Section.associate(db.models);
}

async function setupSequelize() {
  console.info(`connecting to ${DATABASE_URL}`);
  return new Sequelize(DATABASE_URL, loadEnvironment());
}

async function configure(auth, db) {
  return new Promise((resolve, reject) => {
    auth.then(() => {
      setupModels(db);
      resolve(0);
    });
  });
}

async function initializeDatabase() {
  const db = await setupSequelize();
  const auth = db.authenticate();
  return configure(auth, db);
}

module.exports = {
  initializeDatabase,
  loadEnvironment,
};
