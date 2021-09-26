const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const env = require("dotenv");
const { initializeDatabase } = require("./Database");

env.config();

const { APP_PORT } = process.env;

const app = express();
app.disable("x-powered-by");

app.use(cors({ origin: "localhost:8000" }));
app.use(express.json());
app.use(routes);

app.listen(APP_PORT);
console.info(`Serving HTTP at: http://localhost:${APP_PORT}`);

initializeDatabase().then(
	() => {
		console.info(`connected to database`);
	},
	() => {
		console.error(`could not connect to database`);
	}
);

module.exports = app;
