/**
 * Game session save strategies
 */
import { api } from '$lib/api/client.js';
import { createLogger } from '$lib/utils/logger.js';

const logger = createLogger('saveStrategies.js');

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
 * Saves a game session to localStorage with optional API sync
 * @param {Object} session - The session data to save
 */
export async function saveGameSession(session) {
  try {
    // Always save to localStorage immediately
    saveGameSessionLocally(session);

    // For offline games, also update via API (no-op for current offline-only implementation)
    if (!session.isOffline) {
      try {
        await api.updateGame(session.id, session.grid, session.timeElapsed);
        logger.debug('Game progress synced', { sessionId: session.id });
      } catch (apiError) {
        logger.warn('Failed to sync game progress, but localStorage save succeeded', {
          error: apiError.message
        });
      }
    }
  } catch (error) {
    logger.error('Failed to save game session', { error: error.message });
  }
}

