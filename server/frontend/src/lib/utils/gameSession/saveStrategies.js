/**
 * Game session save strategies
 */
import { api } from '$lib/api/client.js';
import { createLogger } from '$lib/utils/logger.js';

const logger = createLogger('saveStrategies.js');

// Debounced backend save to reduce API calls
let backendSaveTimeout = null;
const BACKEND_SAVE_DELAY = 2000; // 2 seconds

/**
 * Converts session notes from Sets to arrays for JSON serialization
 * @param {Object} session - The session with notes as Sets
 * @returns {Object} Session with notes as arrays
 */
function prepareSessionForStorage(session) {
  return {
    ...session,
    notes: session.notes ? Object.fromEntries(
      Object.entries(session.notes).map(([key, value]) => [key, Array.from(value || [])])
    ) : {}
  };
}

/**
 * Saves a game session to localStorage only (for frequent timer updates)
 * @param {Object} session - The session data to save
 */
export function saveGameSessionLocally(session) {
  try {
    const sessionToStore = prepareSessionForStorage(session);
    localStorage.setItem(`sudoku_session_${session.id}`, JSON.stringify(sessionToStore));
  } catch (error) {
    logger.error('Failed to save game session locally', { error: error.message });
  }
}

/**
 * Saves a game session to both localStorage and backend (debounced)
 * @param {Object} session - The session data to save
 * @param {boolean} immediate - Whether to save immediately or use debouncing
 */
export async function saveGameSession(session, immediate = false) {
  try {
    // Always save to localStorage immediately
    saveGameSessionLocally(session);

    // If not an offline session, also save to backend
    if (!session.isOffline) {
      if (immediate) {
        // Clear any pending debounced save
        if (backendSaveTimeout) {
          clearTimeout(backendSaveTimeout);
          backendSaveTimeout = null;
        }

        try {
          await api.updateGame(session.id, session.grid, session.timeElapsed);
          logger.debug('Game saved to backend immediately', { sessionId: session.id });
        } catch (apiError) {
          logger.warn('Failed to save to backend immediately, but localStorage save succeeded', {
            error: apiError.message
          });
        }
      } else {
        // Debounced backend save
        if (backendSaveTimeout) {
          clearTimeout(backendSaveTimeout);
        }

        backendSaveTimeout = setTimeout(async () => {
          try {
            await api.updateGame(session.id, session.grid, session.timeElapsed);
            logger.debug('Game saved to backend (debounced)', { sessionId: session.id });
          } catch (apiError) {
            logger.warn('Failed to save to backend (debounced), but localStorage save succeeded', {
              error: apiError.message
            });
          }
          backendSaveTimeout = null;
        }, BACKEND_SAVE_DELAY);
      }
    }
  } catch (error) {
    logger.error('Failed to save game session', { error: error.message });
  }
}

/**
 * Forces immediate backend save (for cleanup/critical saves)
 * @param {Object} session - The session data to save
 */
export async function forceBackendSave(session) {
  if (!session || session.isOffline) return;

  // Clear any pending debounced save
  if (backendSaveTimeout) {
    clearTimeout(backendSaveTimeout);
    backendSaveTimeout = null;
  }

  try {
    await api.updateGame(session.id, session.grid, session.timeElapsed);
    logger.debug('Game force saved to backend', { sessionId: session.id });
  } catch (apiError) {
    logger.error('Failed to force save to backend', {
      error: apiError.message,
      sessionId: session.id
    });
  }
}