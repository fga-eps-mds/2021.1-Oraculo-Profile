const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const env = require("dotenv");
const { initializeDatabase } = require("./Database");
const morgan = require("morgan");

env.config();

const { PORT, APP_PORT } = process.env;

const corsOptions = {
  origin: "https://oraculo-frontend.herokuapp.com",
};

const app = express();
app.disable("x-powered-by");

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("short"));
app.use(routes);

if (PORT === undefined) {
  app.listen(APP_PORT);
  console.log(`HTTP server started on port ${APP_PORT}`);
} else {
  app.listen(PORT);
  console.log(`HTTP server started on port ${PORT}`);
}

initializeDatabase();

module.exports = app;
