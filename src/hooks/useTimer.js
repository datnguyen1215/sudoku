/**
 * Timer hook for tracking game time
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing a timer
 * @returns {Object} Timer state and controls
 */
export const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  /**
   * Start the timer
   */
  const start = () => {
    setIsRunning(true);
  };

  /**
   * Stop/pause the timer
   */
  const stop = () => {
    setIsRunning(false);
  };

  /**
   * Reset the timer to 00:00
   */
  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  /**
   * Format seconds to MM:SS string
   * @param {number} totalSeconds - Total seconds
   * @returns {string} Formatted time string
   */
  const formatTime = totalSeconds => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Handle timer updates
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount or when isRunning changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    seconds,
    formattedTime: formatTime(seconds),
    isRunning,
    start,
    stop,
    reset,
  };
};
