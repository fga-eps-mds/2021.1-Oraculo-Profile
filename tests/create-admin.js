const { User } = require("../src/Model/User");
const { Department } = require("../src/Model/Department");
const { Level } = require("../src/Model/Level");
const { Section } = require("../src/Model/Section");
const { Sequelize } = require("sequelize");
const { hashPassword } = require("../src/Utils/hash");
require("dotenv").config();

const adminUser = {
    email: "admin@email.com",
    password: "admin1234",
    departmentID: 1,
    level: 1,
    sectionID: 2,
};

function getDatabaseConfig() {
    const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
    process.env.DB_HOST = "localhost";

    console.log(`environment: ${DB_HOST},${DB_PASS},${DB_NAME},${DB_PORT},${DB_USER}`);

    const config = {
        username: `${DB_USER}`,
        password: `${DB_PASS}`,
        database: `${DB_NAME}`,
        port: `${DB_PORT}`,
        dialect: "postgres",
        host: `${DB_HOST}`,
        define: {
            timestamps: true,
            underscored: true,
        },
        logging: false,
    };

    console.log(`config: ${JSON.stringify(config)}`);

    return config;
}

async function setupSequelize(config) {
    return new Sequelize(config);
}

async function configure(auth, db) {
    return new Promise((resolve) => {
        auth.then(() => {
            setupModels(db);
            resolve(0);
        });
    });
}

async function initializeDatabaseWithConfig(cfg) {
    const db = await setupSequelize(cfg);
    const auth = db.authenticate();
    return configure(auth, db);
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

async function createAdminUser() {
    try {
        await initializeDatabaseWithConfig(getDatabaseConfig());
        console.log("admin user created");
    } catch (err) {
        console.error(`could not connect to database: ${err}`);
    }

    console.log("connected to database");

    const department = await Department.findOne({
        where: { id: adminUser.departmentID },
    });

    const level = await Level.findOne({
        where: { id: adminUser.level },
    });

    const section = await Section.findOne({
        where: { id: adminUser.sectionID },
    });

    if (!department || !level || !section) {
        console.error(`invalid information: ${department}, ${level}, ${section}`);
        process.exit(1);
    }

    try {
        const newUser = await User.create({
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
    } catch (err) {
        console.log(`could not create user: ${err}`);
    }
}

try {
    createAdminUser().then(
        () => {
            process.exit(0);
        },
        () => {
            process.exit(1);
        }
    );
} catch (err) {
    console.error(`error: ${err}`);
    process.exit(1);
}
