import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost:5432/sudoku_db";

console.log("Initializing database...");

try {
  // Read the migration file
  const migrationPath = path.join(
    __dirname,
    "..",
    "migrations",
    "001_create_games.sql",
  );

  // Execute the migration
  console.log("Running migration: 001_create_games.sql");
  execSync(`psql "${DATABASE_URL}" -f "${migrationPath}"`, {
    stdio: "inherit",
  });

  console.log("Database initialized successfully!");
} catch (error) {
  console.error("Failed to initialize database:", error.message);
  process.exit(1);
}

