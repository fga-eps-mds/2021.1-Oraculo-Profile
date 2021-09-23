const User = require("../Models/User");
const config = require("./config/database");
const { Sequelize } = require("sequelize");
const Department = require("../Models/Department");
const userLevel = require("../Models/Level");

async function initializeDatabase() {
	const db = new Sequelize(config);

	let auth = db.authenticate();

	return new Promise((resolve, reject) => {
		auth.then(
			() => {
				User.init(db);
				Department.init(db);
				userLevel.init(db);

				User.associate(db.models);
				Department.associate(db.models);
				userLevel.associate(db.models);

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
