# Database Migrations

## Running Migrations

1. Create the database:

   ```bash
   createdb sudoku_db
   ```

2. Run the migration:
   ```bash
   psql sudoku_db < migrations/001_create_games.sql
   ```

Or use the migration script:

```bash
npm run migrate
```

## Migration Files

- `001_create_games.sql` - Creates the games table with JSONB columns for grid storage

## Future Migrations

Add new migration files with incrementing numbers:

- `002_create_users.sql`
- `003_add_user_id_to_games.sql`
- etc.
