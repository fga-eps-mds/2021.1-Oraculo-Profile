const { User } = require("../Model/User");
const config = require("./config/database");
const { Sequelize } = require("sequelize");
const { Department } = require("../Model/Department");
const { Level } = require("../Model/Level");
const { Section } = require("../Model/Section");

async function initializeDatabase() {
	const db = new Sequelize(config);

	const auth = db.authenticate();

	return new Promise((resolve, reject) => {
		auth.then(
			() => {
				User.init(db);
				Department.init(db);
				Level.init(db);
				Section.init(db);

				User.associate(db.models);
				Department.associate(db.models);
				Level.associate(db.models);
				Section.associate(db.models);

				resolve(0);
			},
			(rejected) => {
				console.error(`failed to authenticate: ${rejected}`);
				reject(1);
			}
		);
	});
}

module.exports = {
	initializeDatabase,
};
