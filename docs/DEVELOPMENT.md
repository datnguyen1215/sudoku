# Development Guide - Sudoku Multi-Platform

## 🏗️ Architecture Overview

The sudoku project has been restructured for multi-platform development:

```
/projects/sudoku/
├── server/frontend/          # SvelteKit web application (current)
├── mobile/android/           # Future React Native Android app  
├── mobile/ios/               # Future React Native iOS app
└── package.json              # Root workspace configuration
```

## 🚀 Development Server Management

### Using Tmux (Recommended)

Following the tmux development server rules for better session management:

```bash
# Start development server in tmux session
cd /projects/sudoku
tmux new-session -d -s sudoku-dev 'npm run dev'

# View server logs and status
tmux attach-session -t sudoku-dev

# Detach from session (keeps server running)
# Press: Ctrl+B, then D

# Check if server is running
tmux list-sessions

# Stop development server
tmux kill-session -t sudoku-dev
```

### Benefits of Tmux Development
- ✅ **Persistent Sessions**: Server keeps running when you detach
- ✅ **Clean Logs**: Isolated log output in dedicated session  
- ✅ **Easy Management**: Simple attach/detach workflow
- ✅ **No Orphaned Processes**: Clean session termination

### Current Server Status
- **Session**: `sudoku-dev`
- **URL**: http://localhost:5173/
- **Status**: ✅ Running
- **Framework**: Vite + SvelteKit

## 📁 Working with the New Structure

### Frontend Development
```bash
# All frontend work happens in server/frontend/
cd server/frontend/

# Install dependencies (first time)
npm install

# Development commands
npm run dev         # Start dev server
npm run build       # Build for production  
npm run test        # Run unit tests
npm run e2e         # Run end-to-end tests
npm run lint        # Check code quality
```

### Root Level Commands
```bash
# From project root, these proxy to server/frontend/
npm run dev         # Starts frontend dev server
npm run build       # Builds frontend  
npm run test        # Runs frontend tests
npm run setup       # Installs frontend dependencies
```

## 🎯 Development Workflow

### Current (Web Frontend)
1. **Start Development**: `tmux new -d -s sudoku-dev 'npm run dev'`
2. **Code Changes**: Work in `server/frontend/src/`
3. **View Changes**: http://localhost:5173/ (auto-reload)
4. **Run Tests**: `npm run test` in `server/frontend/`
5. **Stop Server**: `tmux kill-session -t sudoku-dev`

### Future (Mobile Development)
1. **Android**: Work in `mobile/android/` with React Native
2. **iOS**: Work in `mobile/ios/` with React Native
3. **Shared Logic**: Extract common code to shared package

## 🧪 Testing Strategy

### Current Test Structure
```bash
server/frontend/
├── src/lib/components/
│   ├── *.test.ts           # Component unit tests
└── tests/
    └── sudoku-game.spec.ts # E2E tests with Playwright
```

### Test Commands
```bash
# Unit tests (Vitest)
npm run test                # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage

# E2E tests (Playwright)  
npm run e2e                # Headless
npm run e2e:headed        # With browser UI
```

## 📦 Build and Deployment

### Frontend Build
```bash
cd server/frontend/
npm run build              # Creates .svelte-kit/output/

# Preview production build
npm run preview            # http://localhost:4173/
```

### Future Mobile Builds
```bash
# Android (future)
cd mobile/android/
npm run build:android

# iOS (future)  
cd mobile/ios/
npm run build:ios
```

## 🛠️ Key Files and Configurations

### Root Level
- `package.json` - Workspace configuration with proxy scripts
- `README.md` - Main project documentation
- `STRUCTURE.md` - Architecture documentation

### Frontend (`server/frontend/`)
- `package.json` - Frontend dependencies and scripts
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test configuration
- `src/` - Source code (components, routes, utils)

## 🔧 Development Tips

### Tmux Session Management
```bash
# Quick reference for sudoku development
alias sudoku-dev="tmux new -d -s sudoku-dev 'cd /projects/sudoku && npm run dev'"
alias sudoku-logs="tmux a -t sudoku-dev"  
alias sudoku-stop="tmux kill-session -t sudoku-dev"
```

### Hot Reload
- Vite provides instant hot module replacement
- Changes to `.svelte` files reload automatically
- TypeScript errors show in browser and terminal

### Debugging
- Browser DevTools for frontend debugging
- Vite dev server shows build errors clearly
- Tmux session preserves all console output

## 🎯 Next Steps for Mobile Development

### When Ready for Mobile
1. **Set up React Native** in `mobile/android/` and `mobile/ios/`
2. **Extract Game Engine** to shared package
3. **Create Mobile UI** components specific to touch interfaces
4. **Share Business Logic** between web and mobile platforms

### Shared Code Strategy
- Core game logic (`sudoku-engine.ts`) can be extracted
- Platform-specific UI components remain separate
- State management patterns can be shared with adaptations

## ✅ Current Status

- ✅ **Web Frontend**: Fully functional in `server/frontend/`
- ✅ **Development Server**: Running in tmux session `sudoku-dev`
- ✅ **Build System**: Working correctly with new structure
- ✅ **Tests**: All existing tests passing
- ✅ **Mobile Structure**: Directories ready for future development

The sudoku project is now properly architected for multi-platform development with excellent developer experience! 🚀