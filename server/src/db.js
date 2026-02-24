import mysql from "mysql2/promise";
import { config } from "./config.js";

export const pool = mysql.createPool(config.db);

export const pingDatabase = async () => {
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
};
