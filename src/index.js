const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const env = require("dotenv");
const { initializeDatabase } = require("./Database");
const morgan = require("morgan");

env.config();

const { PORT } = process.env;

const app = express();
app.disable("x-powered-by");

app.use(cors({ origin: "https://oraculo-frontend.herokuapp.com/" }));
app.use(express.json());
app.use(morgan("short"));
app.use(routes);

app.listen(PORT);
console.info(`Serving HTTP at: http://localhost:${PORT}`);

initializeDatabase().then(
  () => {
    console.info(`connected to database`);
  },
  () => {
    console.error(`could not connect to database`);
    process.exit(1);
  }
);

module.exports = app;
