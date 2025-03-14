'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// Only import the types we actually use
import { 
  GameState, Bug, StatusEffect
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
  switchBattleBug: (bugId: string) => void;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const evolveBug = (_bugId: string, _evolutionId: string): Bug | null => {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const useItem = (itemId: string, _targetBugId: string) => {
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
    setGameState(prevState => {
      if (!prevState.activeBattle) return prevState;
      
      const playerBug = prevState.activeBattle.playerBug;
      const opponentBug = prevState.activeBattle.opponentBug;
      const action = playerBug.actions.find(a => a.id === actionId);
      
      if (!action) return prevState;
      
      // Calculate damage based on action damage and bug stats
      const damage = action.damage ? Math.floor(action.damage * (playerBug.attack / 100 + 1)) : 0;
      
      // Apply damage to opponent
      const updatedOpponentBug = {
        ...opponentBug,
        hp: Math.max(0, opponentBug.hp - damage)
      };
      
      // Create log entry
      const newLog = [...prevState.activeBattle.log, `${playerBug.name} used ${action.name}!`];
      
      if (damage > 0) {
        newLog.push(`${opponentBug.name} took ${damage} damage!`);
      }
      
      // Check if opponent is defeated
      if (updatedOpponentBug.hp <= 0) {
        newLog.push(`${opponentBug.name} was defeated!`);
        newLog.push(`Capturing ${opponentBug.name}...`);
        
        // Auto-capture the opponent bug after a short delay
        setTimeout(() => endBattle('capture'), 2000);
        
        // Return updated state with opponent defeated
        return {
          ...prevState,
          activeBattle: {
            ...prevState.activeBattle,
            opponentBug: updatedOpponentBug,
            log: newLog,
            turn: 'player' // Keep player's turn for end battle actions
          }
        };
      }
      
      // Return updated state and switch to opponent's turn
      return {
        ...prevState,
        activeBattle: {
          ...prevState.activeBattle,
          opponentBug: updatedOpponentBug,
          log: newLog,
          turn: 'opponent'
        }
      };
    });
    
    // Handle opponent's turn after a short delay
    setTimeout(() => {
      setGameState(prevState => {
        // Make sure the battle is still active and it's the opponent's turn
        if (!prevState.activeBattle || prevState.activeBattle.turn !== 'opponent' || prevState.activeView !== 'battle') {
          return prevState;
        }
        
        const playerBug = prevState.activeBattle.playerBug;
        const opponentBug = prevState.activeBattle.opponentBug;
        
        // If opponent is defeated, don't take a turn
        if (opponentBug.hp <= 0) return prevState;
        
        // Select a random action from opponent's actions
        const availableActions = opponentBug.actions.filter(a => a.isBattle);
        if (availableActions.length === 0) return prevState;
        
        const randomAction = availableActions[Math.floor(Math.random() * availableActions.length)];
        
        // Calculate damage based on action damage and bug stats
        const damage = randomAction.damage ? Math.floor(randomAction.damage * (opponentBug.attack / 100 + 1)) : 0;
        
        // Apply damage to player
        const updatedPlayerBug = {
          ...playerBug,
          hp: Math.max(0, playerBug.hp - damage)
        };
        
        // Create log entry
        const newLog = [...prevState.activeBattle.log, `${opponentBug.name} used ${randomAction.name}!`];
        
        if (damage > 0) {
          newLog.push(`${playerBug.name} took ${damage} damage!`);
        }
        
        // Check if player is defeated
        if (updatedPlayerBug.hp <= 0) {
          newLog.push(`${playerBug.name} was defeated!`);
          
          // Auto-end battle with loss after a short delay
          setTimeout(() => {
            // Double-check that the battle is still active before ending it
            setGameState(checkState => {
              if (checkState.activeBattle && checkState.activeView === 'battle') {
                endBattle('lose');
              }
              return checkState;
            });
          }, 1500);
        }
        
        // Return updated state and switch back to player's turn
        return {
          ...prevState,
          activeBattle: {
            ...prevState.activeBattle,
            playerBug: updatedPlayerBug,
            log: newLog,
            turn: updatedPlayerBug.hp <= 0 ? 'opponent' : 'player' // Only switch to player if not defeated
          }
        };
      });
    }, 1000); // 1 second delay for opponent's turn
  };

  // Add the switchBattleBug function after the executeBattleAction function
  const switchBattleBug = (bugId: string) => {
    setGameState(prevState => {
      if (!prevState.activeBattle) return prevState;
      
      // Find the bug to switch to
      const newBug = prevState.bugs.find(bug => bug.id === bugId);
      if (!newBug) return prevState;
      
      // Create log entry
      const newLog = [
        ...prevState.activeBattle.log, 
        `${prevState.activeBattle.playerBug.name} was switched out!`,
        `Go, ${newBug.name}!`
      ];
      
      // Return updated state with new player bug
      return {
        ...prevState,
        activeBattle: {
          ...prevState.activeBattle,
          playerBug: newBug,
          log: newLog,
          turn: 'opponent' // Switching bugs uses up the player's turn
        }
      };
    });
    
    // Handle opponent's turn after a short delay (similar to executeBattleAction)
    setTimeout(() => {
      setGameState(prevState => {
        // Make sure the battle is still active and it's the opponent's turn
        if (!prevState.activeBattle || prevState.activeBattle.turn !== 'opponent' || prevState.activeView !== 'battle') {
          return prevState;
        }
        
        const playerBug = prevState.activeBattle.playerBug;
        const opponentBug = prevState.activeBattle.opponentBug;
        
        // If opponent is defeated, don't take a turn
        if (opponentBug.hp <= 0) return prevState;
        
        // Select a random action from opponent's actions
        const availableActions = opponentBug.actions.filter(a => a.isBattle);
        if (availableActions.length === 0) return prevState;
        
        const randomAction = availableActions[Math.floor(Math.random() * availableActions.length)];
        
        // Calculate damage based on action damage and bug stats
        const damage = randomAction.damage ? Math.floor(randomAction.damage * (opponentBug.attack / 100 + 1)) : 0;
        
        // Apply damage to player
        const updatedPlayerBug = {
          ...playerBug,
          hp: Math.max(0, playerBug.hp - damage)
        };
        
        // Create log entry
        const newLog = [...prevState.activeBattle.log, `${opponentBug.name} used ${randomAction.name}!`];
        
        if (damage > 0) {
          newLog.push(`${playerBug.name} took ${damage} damage!`);
        }
        
        // Check if player is defeated
        if (updatedPlayerBug.hp <= 0) {
          newLog.push(`${playerBug.name} was defeated!`);
          
          // Auto-end battle with loss after a short delay
          setTimeout(() => {
            // Double-check that the battle is still active before ending it
            setGameState(checkState => {
              if (checkState.activeBattle && checkState.activeView === 'battle') {
                endBattle('lose');
              }
              return checkState;
            });
          }, 1500);
        }
        
        // Return updated state and switch back to player's turn
        return {
          ...prevState,
          activeBattle: {
            ...prevState.activeBattle,
            playerBug: updatedPlayerBug,
            log: newLog,
            turn: updatedPlayerBug.hp <= 0 ? 'opponent' : 'player' // Only switch to player if not defeated
          }
        };
      });
    }, 1000); // 1 second delay for opponent's turn
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
      switchBattleBug,
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