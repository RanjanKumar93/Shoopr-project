require("dotenv").config();
const postgres = require("postgres");

const connectionString = process.env.SECRET_KEY;
const sql = postgres(connectionString);

module.exports = sql;
