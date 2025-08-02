const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.error || 'API request failed', response.status);
  }
  
  return data;
}

export const api = {
  async createGame(difficulty) {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty }),
    });
    
    return handleResponse(response);
  },

  async getGame(sessionId) {
    const response = await fetch(`${API_BASE_URL}/games/${sessionId}`);
    return handleResponse(response);
  },

  async updateGame(sessionId, currentGrid, timeElapsed) {
    const response = await fetch(`${API_BASE_URL}/games/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentGrid, timeElapsed }),
    });
    
    return handleResponse(response);
  }
};