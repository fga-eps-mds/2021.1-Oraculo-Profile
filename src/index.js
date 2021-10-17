const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const env = require("dotenv");
const { initializeDatabase } = require("./Database");
const morgan = require("morgan");

env.config();

const { PORT } = process.env;

let corsOptions = {
  origin: "https://oraculo-frontend.herokuapp.com",
};

const app = express();
app.disable("x-powered-by");

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("short"));
app.use(routes);
app.listen(PORT);
console.info(`Serving HTTP at: http://localhost:${PORT}`);
initializeDatabase();

module.exports = app;
