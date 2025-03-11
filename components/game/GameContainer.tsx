'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { ThreeDOverworldView } from './overworld/ThreeDOverworldView';
import { BattleView } from './battle/BattleView';
import { Button } from '@/components/ui/button';
import { BugCard } from '@/components/game/bugs/BugCard';

// This component will be implemented in future updates
const InventoryView = () => {
  const { setActiveView } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <p className="text-gray-400 mb-6">This feature will be implemented in a future update.</p>
      <Button 
        onClick={() => setActiveView('overworld')}
        variant="default"
      >
        Return to Game
      </Button>
    </div>
  );
};

// Bug Collection View to display captured bugs
const BugCollectionView = () => {
  const { gameState, setActiveView } = useGame();
  
  // Get the collected bugs from the game state
  const collectedBugs = gameState.bugs.filter(bug => 
    gameState.gameProgress.collectedBugs.includes(bug.id)
  );
  
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bug Collection</h2>
        <Button 
          onClick={() => setActiveView('overworld')}
          variant="default"
        >
          Return to Game
        </Button>
      </div>
      
      {collectedBugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <p className="text-gray-400 mb-4">Your bug collection is empty.</p>
          <p className="text-gray-400">Capture bugs in battle to add them to your collection!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
          {collectedBugs.map(bug => (
            <div key={bug.id} className="flex justify-center">
              <BugCard 
                bug={bug} 
                size="sm" 
                showActions={true}
                showDetails={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// This component will be implemented in future updates
const DialogueView = () => {
  const { setActiveView } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Dialogue</h2>
      <p className="text-gray-400 mb-6">This feature will be implemented in a future update.</p>
      <Button 
        onClick={() => setActiveView('overworld')}
        variant="default"
      >
        Return to Game
      </Button>
    </div>
  );
};

export const GameContainer: React.FC = () => {
  const { gameState } = useGame();
  
  // Function to completely reset the game by clearing storage and reloading
  const handleResetGame = () => {
    // Clear all localStorage items related to the game
    localStorage.removeItem('bugCollector_gameState');
    
    // Reload the page to start fresh
    window.location.reload();
  };
  
  // Render the appropriate view based on the active view in game state
  const renderView = () => {
    switch (gameState.activeView) {
      case 'overworld':
        return <ThreeDOverworldView />;
      case 'battle':
        return <BattleView />;
      case 'inventory':
        return <InventoryView />;
      case 'bugCollection':
        return <BugCollectionView />;
      case 'dialogue':
        return <DialogueView />;
      default:
        return <ThreeDOverworldView />;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col">
      <header className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-400">Bug Collector: The Four Souls</h1>
        <Button 
          onClick={handleResetGame} 
          variant="destructive" 
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          Reset Game
        </Button>
      </header>
      
      <main className="flex-1 overflow-y-auto bg-gray-950">
        {renderView()}
      </main>
      
      <footer className="bg-gray-900 p-2 border-t border-gray-700 text-center text-xs text-gray-500">
        Use keyboard controls: Arrow keys to move, Z for actions, I for inventory, B for bug collection
        <div className="mt-1 text-yellow-500">v1.0.1 - Pokémon Card Style</div>
      </footer>
    </div>
  );
}; 