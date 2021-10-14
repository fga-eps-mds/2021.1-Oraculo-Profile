require("dotenv").config();

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

console.log(`environment: ${DB_NAME}, ${DB_USER}, ${DB_HOST}`);

module.exports = {
	username: `${DB_USER}`,
	password: `${DB_PASS}`,
	database: `${DB_NAME}`,
	port: `${DB_PORT}`,
	dialect: "postgres",
	host: `${DB_HOST}`, //Number.parseInt(`${DB_HOST}`),
	define: {
		timestamps: true,
		underscored: true,
	},
	ssl: true,
};
