# Sudoku Backend API

Minimal backend API for the Sudoku game using Express and PostgreSQL.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup PostgreSQL:**
   ```bash
   # Create database
   createdb sudoku_db
   
   # Run migrations
   npm run migrate
   ```

3. **Configure environment:**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env with your database credentials
   ```

4. **Start the server:**
   ```bash
   npm start
   # Server runs on http://localhost:3001
   ```

## API Endpoints

### Create Game
```
POST /api/games
Body: { "difficulty": "easy" }
Response: { "sessionId": "game-123", "puzzle": [...], "startTime": "..." }
```

### Get Game
```
GET /api/games/:sessionId
Response: { "sessionId": "game-123", "puzzle": [...], "currentGrid": [...], "timeElapsed": 300 }
```

### Update Game
```
PUT /api/games/:sessionId
Body: { "currentGrid": [...], "timeElapsed": 300 }
Response: { "success": true }
```

## Development

The backend uses a simple structure:
- `src/routes/` - API route handlers
- `src/services/` - Business logic
- `src/db/` - Database connection and queries
- `migrations/` - SQL migration files

## Testing

Test the API with curl:
```bash
# Create a game
curl -X POST http://localhost:3001/api/games \
  -H "Content-Type: application/json" \
  -d '{"difficulty": "easy"}'

# Get game (use sessionId from create response)
curl http://localhost:3001/api/games/game-123
```