
import { GameState } from '../contexts/GameContext';

// Save game state to localStorage
export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem('storyforge-quest-save', JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem('storyforge-quest-save');
    if (savedState) {
      return JSON.parse(savedState) as GameState;
    }
  } catch (error) {
    console.error("Failed to load game state:", error);
  }
  return null;
};

// Check if a saved game exists
export const hasSavedGame = (): boolean => {
  return localStorage.getItem('storyforge-quest-save') !== null;
};

// Clear saved game
export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem('storyforge-quest-save');
  } catch (error) {
    console.error("Failed to clear saved game:", error);
  }
};
