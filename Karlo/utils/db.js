// utils/db.js
const mysql = require("mysql2");

const dbConfig = {
  host: "",
  port: ,
  user: "",
  password: "",
  database: "",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
