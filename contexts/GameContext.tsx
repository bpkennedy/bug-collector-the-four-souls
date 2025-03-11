'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GameState, Bug, Item, World, Soul, GameProgress,
  Action, StatusEffect
} from '../lib/types/game';

// Define the context interface
interface GameContextProps {
  gameState: GameState;
  initializeGame: (starterBug: Bug) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  updateGameState: (newState: Partial<GameState>) => void;
  // Bug management
  addBug: (bug: Bug) => void;
  removeBug: (bugId: string) => void;
  levelUpBug: (bugId: string) => void;
  evolveBug: (bugId: string, evolutionId: string) => Bug | null;
  healBug: (bugId: string, amount: number) => void;
  applyStatusEffect: (bugId: string, effect: StatusEffect, duration: number) => void;
  // Item management
  addItem: (itemId: string, count: number) => void;
  removeItem: (itemId: string, count: number) => void;
  useItem: (itemId: string, targetBugId: string) => void;
  // Battle management
  startBattle: (opponentBug: Bug) => void;
  endBattle: (outcome: 'win' | 'lose' | 'flee' | 'capture') => void;
  executeBattleAction: (actionId: string) => void;
  // World navigation
  movePlayer: (x: number, y: number) => void;
  changeWorld: (worldId: string) => void;
  changeBiome: (biomeId: string) => void;
  collectSoul: (soulId: string) => void;
  // View management
  setActiveView: (view: GameState['activeView']) => void;
  // Dialogue management
  startDialogue: (npcId: string) => void;
  advanceDialogue: () => void;
  endDialogue: () => void;
}

// Create context with a default undefined value
const GameContext = createContext<GameContextProps | undefined>(undefined);

// Initial game state
const initialGameState: GameState = {
  isInitialized: false,
  isLoading: false,
  gameProgress: {
    currentWorldId: '',
    currentBiomeId: '',
    playerPosition: { x: 0, y: 0 },
    completedWorlds: [],
    collectedSouls: [],
    collectedBugs: [],
    activeBugs: [],
    inventory: [],
  },
  worlds: [],
  bugs: [],
  inventory: [],
  activeView: 'overworld',
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Load game from local storage on mount if available
  useEffect(() => {
    // Only try to load if not initialized yet
    if (!gameState.isInitialized) {
      loadGame();
    }
  }, [gameState.isInitialized]);

  // Save game state to local storage when it changes
  useEffect(() => {
    if (gameState.isInitialized) {
      try {
        localStorage.setItem('bugCollector_gameState', JSON.stringify(gameState));
        console.log('Game saved to local storage');
      } catch (error) {
        console.error('Error saving game to local storage:', error);
      }
    }
  }, [gameState]);

  // Initialize a new game with the chosen starter bug
  const initializeGame = (starterBug: Bug) => {
    try {
      // Clear any existing game data first
      localStorage.removeItem('bugCollector_gameState');
      
      // Default worlds, items, etc. would be loaded here
      // For now, we'll just set up a basic game state
      setGameState({
        ...initialGameState,
        isInitialized: true,
        bugs: [starterBug],
        gameProgress: {
          ...initialGameState.gameProgress,
          currentWorldId: 'world1',
          currentBiomeId: 'biome1',
          collectedBugs: [starterBug.id],
          activeBugs: [starterBug.id],
        },
      });
      
      console.log('New game initialized with starter bug:', starterBug.name);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  // Save game to local storage
  const saveGame = () => {
    try {
      localStorage.setItem('bugCollector_gameState', JSON.stringify(gameState));
      console.log('Game manually saved to local storage');
      return true;
    } catch (error) {
      console.error('Error manually saving game:', error);
      return false;
    }
  };

  // Load game from local storage
  const loadGame = (): boolean => {
    try {
      const savedGame = localStorage.getItem('bugCollector_gameState');
      if (savedGame) {
        const parsedState = JSON.parse(savedGame);
        setGameState(parsedState);
        console.log('Game loaded from local storage');
        return true;
      }
    } catch (error) {
      console.error('Error loading game from local storage:', error);
      // If there's an error, clear the storage to prevent future issues
      localStorage.removeItem('bugCollector_gameState');
    }
    return false;
  };

  // Update game state with partial changes
  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prevState => ({ ...prevState, ...newState }));
  };

  // Bug management functions
  const addBug = (bug: Bug) => {
    setGameState(prevState => ({
      ...prevState,
      bugs: [...prevState.bugs, bug],
      gameProgress: {
        ...prevState.gameProgress,
        collectedBugs: [...prevState.gameProgress.collectedBugs, bug.id],
      },
    }));
  };

  const removeBug = (bugId: string) => {
    setGameState(prevState => ({
      ...prevState,
      bugs: prevState.bugs.filter(bug => bug.id !== bugId),
      gameProgress: {
        ...prevState.gameProgress,
        collectedBugs: prevState.gameProgress.collectedBugs.filter(id => id !== bugId),
        activeBugs: prevState.gameProgress.activeBugs.filter(id => id !== bugId),
      },
    }));
  };

  const levelUpBug = (bugId: string) => {
    setGameState(prevState => ({
      ...prevState,
      bugs: prevState.bugs.map(bug => 
        bug.id === bugId 
          ? { 
              ...bug, 
              level: bug.level + 1, 
              maxHp: Math.floor(bug.maxHp * 1.1),
              hp: Math.floor(bug.maxHp * 1.1), 
              attack: Math.floor(bug.attack * 1.05),
              defense: Math.floor(bug.defense * 1.05),
              special: Math.floor(bug.special * 1.05),
              xp: 0,
              maxXp: Math.floor(bug.maxXp * 1.2)
            } 
          : bug
      ),
    }));
  };

  const evolveBug = (bugId: string, evolutionId: string): Bug | null => {
    // This would typically load the evolved bug data from our database
    // For now, we'll just return null
    return null;
  };

  const healBug = (bugId: string, amount: number) => {
    setGameState(prevState => ({
      ...prevState,
      bugs: prevState.bugs.map(bug => 
        bug.id === bugId 
          ? { 
              ...bug, 
              hp: Math.min(bug.hp + amount, bug.maxHp)
            } 
          : bug
      ),
    }));
  };

  const applyStatusEffect = (bugId: string, effect: StatusEffect, duration: number) => {
    setGameState(prevState => ({
      ...prevState,
      bugs: prevState.bugs.map(bug => 
        bug.id === bugId 
          ? { 
              ...bug, 
              status: effect,
              statusDuration: duration
            } 
          : bug
      ),
    }));
  };

  // Item management functions
  const addItem = (itemId: string, count: number) => {
    setGameState(prevState => {
      const existingItemIndex = prevState.gameProgress.inventory.findIndex(i => i.itemId === itemId);
      
      if (existingItemIndex >= 0) {
        // Update existing item count
        const updatedInventory = [...prevState.gameProgress.inventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          count: updatedInventory[existingItemIndex].count + count
        };
        
        return {
          ...prevState,
          gameProgress: {
            ...prevState.gameProgress,
            inventory: updatedInventory
          }
        };
      } else {
        // Add new item to inventory
        return {
          ...prevState,
          gameProgress: {
            ...prevState.gameProgress,
            inventory: [...prevState.gameProgress.inventory, { itemId, count }]
          }
        };
      }
    });
  };

  const removeItem = (itemId: string, count: number) => {
    setGameState(prevState => {
      const existingItemIndex = prevState.gameProgress.inventory.findIndex(i => i.itemId === itemId);
      
      if (existingItemIndex >= 0) {
        const updatedInventory = [...prevState.gameProgress.inventory];
        const newCount = updatedInventory[existingItemIndex].count - count;
        
        if (newCount <= 0) {
          // Remove the item entirely if count is <= 0
          updatedInventory.splice(existingItemIndex, 1);
        } else {
          // Update the count
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            count: newCount
          };
        }
        
        return {
          ...prevState,
          gameProgress: {
            ...prevState.gameProgress,
            inventory: updatedInventory
          }
        };
      }
      
      // If item doesn't exist, return state unchanged
      return prevState;
    });
  };

  const useItem = (itemId: string, targetBugId: string) => {
    // This would typically use the item effect on the target bug
    // For now, we'll just remove one of the item
    removeItem(itemId, 1);
  };

  // Battle management functions
  const startBattle = (opponentBug: Bug) => {
    const playerBug = gameState.bugs.find(bug => bug.id === gameState.gameProgress.activeBugs[0]) || gameState.bugs[0];
    
    setGameState(prevState => ({
      ...prevState,
      activeView: 'battle',
      activeBattle: {
        playerBug,
        opponentBug,
        turn: 'player',
        log: [`A wild ${opponentBug.name} appeared!`]
      }
    }));
  };

  const endBattle = (outcome: 'win' | 'lose' | 'flee' | 'capture') => {
    setGameState(prevState => {
      if (!prevState.activeBattle) return prevState;
      
      // Create properly typed updated state object
      const updatedState: GameState = {
        ...prevState,
        activeView: 'overworld',
        activeBattle: undefined
      };
      
      if (outcome === 'win') {
        // Award XP to player bug
        const playerBug = prevState.activeBattle.playerBug;
        const xpGain = Math.floor(prevState.activeBattle.opponentBug.level * 10);
        
        updatedState.bugs = prevState.bugs.map(bug => 
          bug.id === playerBug.id 
            ? { 
                ...bug, 
                xp: bug.xp + xpGain 
              } 
            : bug
        );
      } else if (outcome === 'capture') {
        // Add the opponent bug to player's collection
        updatedState.bugs = [...prevState.bugs, prevState.activeBattle.opponentBug];
        updatedState.gameProgress = {
          ...prevState.gameProgress,
          collectedBugs: [...prevState.gameProgress.collectedBugs, prevState.activeBattle.opponentBug.id]
        };
      }
      
      return updatedState;
    });
  };

  const executeBattleAction = (actionId: string) => {
    // This would calculate damage and apply effects based on the action
    // For now, we'll just add a log entry
    setGameState(prevState => {
      if (!prevState.activeBattle) return prevState;
      
      const playerBug = prevState.activeBattle.playerBug;
      const action = playerBug.actions.find(a => a.id === actionId);
      
      if (!action) return prevState;
      
      const newLog = [...prevState.activeBattle.log, `${playerBug.name} used ${action.name}!`];
      
      return {
        ...prevState,
        activeBattle: {
          ...prevState.activeBattle,
          log: newLog,
          turn: 'opponent'
        }
      };
    });
    
    // TODO: Implement opponent turn logic
  };

  // World navigation functions
  const movePlayer = (x: number, y: number) => {
    setGameState(prevState => ({
      ...prevState,
      gameProgress: {
        ...prevState.gameProgress,
        playerPosition: { x, y }
      }
    }));
  };

  const changeWorld = (worldId: string) => {
    setGameState(prevState => ({
      ...prevState,
      gameProgress: {
        ...prevState.gameProgress,
        currentWorldId: worldId,
        // Reset biome and position when changing worlds
        currentBiomeId: prevState.worlds.find(w => w.id === worldId)?.biomes[0]?.id || '',
        playerPosition: { x: 0, y: 0 }
      }
    }));
  };

  const changeBiome = (biomeId: string) => {
    setGameState(prevState => ({
      ...prevState,
      gameProgress: {
        ...prevState.gameProgress,
        currentBiomeId: biomeId,
        // Reset position when changing biomes
        playerPosition: { x: 0, y: 0 }
      }
    }));
  };

  const collectSoul = (soulId: string) => {
    setGameState(prevState => ({
      ...prevState,
      gameProgress: {
        ...prevState.gameProgress,
        collectedSouls: [...prevState.gameProgress.collectedSouls, soulId]
      }
    }));
  };

  // View management
  const setActiveView = (view: GameState['activeView']) => {
    setGameState(prevState => ({
      ...prevState,
      activeView: view
    }));
  };

  // Dialogue management
  const startDialogue = (npcId: string) => {
    // Find the NPC in the current biome
    const currentWorld = gameState.worlds.find(w => w.id === gameState.gameProgress.currentWorldId);
    const currentBiome = currentWorld?.biomes.find(b => b.id === gameState.gameProgress.currentBiomeId);
    const npc = currentBiome?.npcs?.find(n => n.id === npcId);
    
    if (npc) {
      setGameState(prevState => ({
        ...prevState,
        activeView: 'dialogue',
        activeDialogue: {
          npc,
          dialogueIndex: 0
        }
      }));
    }
  };

  const advanceDialogue = () => {
    setGameState(prevState => {
      if (!prevState.activeDialogue) return prevState;
      
      const newIndex = prevState.activeDialogue.dialogueIndex + 1;
      
      if (newIndex >= prevState.activeDialogue.npc.dialogue.length) {
        // End dialogue if we've reached the end
        return {
          ...prevState,
          activeView: 'overworld',
          activeDialogue: undefined
        };
      }
      
      return {
        ...prevState,
        activeDialogue: {
          ...prevState.activeDialogue,
          dialogueIndex: newIndex
        }
      };
    });
  };

  const endDialogue = () => {
    setGameState(prevState => ({
      ...prevState,
      activeView: 'overworld',
      activeDialogue: undefined
    }));
  };

  return (
    <GameContext.Provider value={{
      gameState,
      initializeGame,
      saveGame,
      loadGame,
      updateGameState,
      // Bug management
      addBug,
      removeBug,
      levelUpBug,
      evolveBug,
      healBug,
      applyStatusEffect,
      // Item management
      addItem,
      removeItem,
      useItem,
      // Battle management
      startBattle,
      endBattle,
      executeBattleAction,
      // World navigation
      movePlayer,
      changeWorld,
      changeBiome,
      collectSoul,
      // View management
      setActiveView,
      // Dialogue management
      startDialogue,
      advanceDialogue,
      endDialogue
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the GameContext
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 