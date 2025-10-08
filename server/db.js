// server/db.js
// Conexión MySQL (mysql2/promise)
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "crud-empleados.ch22cmyeq634.us-east-2.rds.amazonaws.com",
  user: process.env.DB_USER || "adminaws",
  password: process.env.DB_PASSWORD || "Adm!nAnalisis4",
  database: process.env.DB_NAME || "flotillas",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
  queueLimit: 0,
});

module.exports = pool.promise();
