import "dotenv/config";
import { fileURLToPath } from "node:url";
import app from "#src/app.js";
import { createLogger } from "#utils/logger.js";
import * as db from "#db/index.js";

const __filename = fileURLToPath(import.meta.url);
const logger = createLogger(__filename);
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    logger.info("Testing database connection...");
    await db.testConnection();

    app.listen(PORT, () => {
      logger.info(`Sudoku backend server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server due to database connection error", {
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? "Set (hidden)" : "Not set",
    });
    logger.error("Please check your DATABASE_URL environment variable");
    logger.error("Example format: postgres://user:password@host:port/database");
    process.exit(1);
  }
};

startServer();

