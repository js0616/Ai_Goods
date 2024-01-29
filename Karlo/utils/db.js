// utils/db.js
const mysql = require("mysql2");

const dbConfig = {
  host: "project-db-stu3.smhrd.com",
  port: 3307,
  user: "Insa4_JSA_hacksim_3",
  password: "aishcool3",
  database: "Insa4_JSA_hacksim_3",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
