const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { Sequelize } = require("sequelize");
const env = require("dotenv");
const User = require("./Models/User");
const Users = require("./Models/User");

env.config();

const { DB_USER, DB_PASS, DB_HOSTNAME, DB_NAME, DB_PORT, APP_PORT } =
  process.env;

const app = express();
app.disable("x-powered-by");

const db = new Sequelize({
  username: `${DB_USER}`,
  password: `${DB_PASS}`,
  database: `${DB_NAME}`,
  port: `${DB_PORT}`,
  dialect: "postgres",
  host: Number.parseInt(`${DB_HOSTNAME}`),
  define: {
    timestamps: true,
    underscored: true,
  },
});

db.authenticate().catch((reason) => {
  console.error(`failed to authenticate: ${reason}`);
});

Users.init(db);

app.listen(APP_PORT);
app.use(cors({ origin: "localhost:8000" }));
app.use(express.json());
app.use(routes);

module.exports = app;
