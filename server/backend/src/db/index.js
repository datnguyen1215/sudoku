import pg from "pg";
import { fileURLToPath } from "node:url";
import { createLogger } from "#utils/logger.js";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const logger = createLogger(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", { error: err.message });
  process.exit(-1);
});

export const testConnection = async () => {
  try {
    const result = await pool.query("SELECT 1 as connected");
    logger.info("Database connection test successful");
    return true;
  } catch (error) {
    logger.error("Database connection test failed", {
      error: error.message,
      code: error.code,
      detail: error.detail,
    });
    throw error;
  }
};

export const query = (text, params) => pool.query(text, params);
export { pool };

