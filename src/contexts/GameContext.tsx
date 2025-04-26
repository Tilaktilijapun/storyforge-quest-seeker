
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { generateStory } from '../utils/storyGenerator';

// Types
export interface Character {
  name: string;
  class: string;
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
  };
}

export interface GameState {
  character: Character;
  inventory: string[];
  location: string;
  story: string[];
  recentEvents: string[];
  isLoading: boolean;
  gameStarted: boolean;
  hasCharacter: boolean;
}

type GameAction = 
  | { type: 'SET_CHARACTER'; payload: Character }
  | { type: 'ADD_TO_INVENTORY'; payload: string }
  | { type: 'REMOVE_FROM_INVENTORY'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'ADD_TO_STORY'; payload: string }
  | { type: 'ADD_EVENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; payload: GameState };

interface GameContextType {
  state: GameState;
  sendAction: (action: string) => Promise<void>;
  createCharacter: (character: Character) => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const defaultCharacter: Character = {
  name: '',
  class: '',
  stats: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    charisma: 10,
  }
};

const initialState: GameState = {
  character: defaultCharacter,
  inventory: [],
  location: '',
  story: [],
  recentEvents: [],
  isLoading: false,
  gameStarted: false,
  hasCharacter: false
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_CHARACTER':
      return { ...state, character: action.payload, hasCharacter: true };
    case 'ADD_TO_INVENTORY':
      return { ...state, inventory: [...state.inventory, action.payload] };
    case 'REMOVE_FROM_INVENTORY':
      return { ...state, inventory: state.inventory.filter(item => item !== action.payload) };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'ADD_TO_STORY':
      return { ...state, story: [...state.story, action.payload] };
    case 'ADD_EVENT':
      const newEvents = [action.payload, ...state.recentEvents].slice(0, 5);
      return { ...state, recentEvents: newEvents };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'START_GAME':
      return { ...state, gameStarted: true };
    case 'RESET_GAME':
      return initialState;
    case 'LOAD_GAME':
      return action.payload;
    default:
      return state;
  }
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Function to send player actions to the AI
  const sendAction = async (action: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Add player action to story
      const playerAction = `> ${action}`;
      dispatch({ type: 'ADD_TO_STORY', payload: playerAction });
      
      // Context for AI includes recent story, character info, inventory, location
      const context = {
        recentStory: state.story.slice(-5), // Last 5 story segments
        character: state.character,
        inventory: state.inventory,
        location: state.location,
        recentEvents: state.recentEvents
      };
      
      // Get AI response
      const response = await generateStory(action, context);
      
      // Process response
      // (In a real implementation, we would parse the AI response to extract
      // game state changes like new items, locations, events, etc.)
      
      dispatch({ type: 'ADD_TO_STORY', payload: response.storyText });
      
      // Update game state based on response
      if (response.newLocation) {
        dispatch({ type: 'SET_LOCATION', payload: response.newLocation });
        dispatch({ type: 'ADD_EVENT', payload: `Traveled to ${response.newLocation}` });
      }
      
      if (response.newItems && response.newItems.length > 0) {
        response.newItems.forEach(item => {
          dispatch({ type: 'ADD_TO_INVENTORY', payload: item });
          dispatch({ type: 'ADD_EVENT', payload: `Found ${item}` });
        });
      }
      
      if (response.removedItems && response.removedItems.length > 0) {
        response.removedItems.forEach(item => {
          dispatch({ type: 'REMOVE_FROM_INVENTORY', payload: item });
          dispatch({ type: 'ADD_EVENT', payload: `Used ${item}` });
        });
      }
    } catch (error) {
      console.error("Error generating story:", error);
      dispatch({ type: 'ADD_TO_STORY', payload: "The narrator seems lost in thought. Try again..." });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Create character and start game
  const createCharacter = (character: Character) => {
    dispatch({ type: 'SET_CHARACTER', payload: character });
    
    // Set initial location based on character class
    let startingLocation = '';
    switch(character.class.toLowerCase()) {
      case 'warrior':
        startingLocation = 'Training Grounds';
        break;
      case 'mage':
        startingLocation = 'Mage Tower';
        break;
      case 'rogue':
        startingLocation = 'Shadowy Alley';
        break;
      default:
        startingLocation = 'Village Square';
    }
    
    dispatch({ type: 'SET_LOCATION', payload: startingLocation });
    dispatch({ type: 'START_GAME' });
    
    // Generate initial story based on character
    const initialStory = `Welcome, brave ${character.name} the ${character.class}. Your adventure begins in the ${startingLocation}. What would you like to do?`;
    dispatch({ type: 'ADD_TO_STORY', payload: initialStory });
  };

  // Reset game
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  // Save game to localStorage
  const saveGame = () => {
    localStorage.setItem('storyforge-quest-save', JSON.stringify(state));
  };

  // Load game from localStorage
  const loadGame = () => {
    const savedGame = localStorage.getItem('storyforge-quest-save');
    if (savedGame) {
      const gameState = JSON.parse(savedGame) as GameState;
      dispatch({ type: 'LOAD_GAME', payload: gameState });
    }
  };

  // Check for saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('storyforge-quest-save');
    if (savedGame) {
      // We don't auto-load, just note that a save exists
      console.log("Saved game found");
    }
  }, []);

  return (
    <GameContext.Provider value={{ state, sendAction, createCharacter, resetGame, saveGame, loadGame }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the GameContext
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
