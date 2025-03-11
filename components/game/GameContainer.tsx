'use client';

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { OverworldView } from './overworld/OverworldView';
import { BattleView } from './battle/BattleView';
import { Button } from '@/components/ui/button';

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

// This component will be implemented in future updates
const BugCollectionView = () => {
  const { setActiveView } = useGame();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Bug Collection</h2>
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
        return <OverworldView />;
      case 'battle':
        return <BattleView />;
      case 'inventory':
        return <InventoryView />;
      case 'bugCollection':
        return <BugCollectionView />;
      case 'dialogue':
        return <DialogueView />;
      default:
        return <OverworldView />;
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