'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWorldById, getBiomeById } from '@/lib/data/worlds';
import { commonBugs } from '@/lib/data/bugs';

export const OverworldView: React.FC = () => {
  const { gameState, movePlayer, startBattle, setActiveView } = useGame();
  const [encounterChance, setEncounterChance] = useState(0);
  const [isMovementEnabled, setIsMovementEnabled] = useState(true);
  
  // Use ref to track the current position without creating render dependencies
  const positionRef = useRef({ x: 0, y: 0 });
  
  // Update ref when position changes
  useEffect(() => {
    positionRef.current = gameState.gameProgress.playerPosition;
  }, [gameState.gameProgress.playerPosition]);
  
  const currentWorld = getWorldById(gameState.gameProgress.currentWorldId);
  const currentBiome = getBiomeById(gameState.gameProgress.currentBiomeId);
  
  // Handle movement with callback to prevent dependency issues
  const handleMovement = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isMovementEnabled) return;
    
    // Temporarily disable movement to prevent multiple moves
    setIsMovementEnabled(false);
    
    // Get current position from ref to avoid dependency on gameState
    let newX = positionRef.current.x;
    let newY = positionRef.current.y;
    
    // Calculate new position based on direction
    switch (direction) {
      case 'up':
        newY = Math.max(0, newY - 1);
        break;
      case 'down':
        newY = Math.min(9, newY + 1);
        break;
      case 'left':
        newX = Math.max(0, newX - 1);
        break;
      case 'right':
        newX = Math.min(9, newX + 1);
        break;
    }
    
    // Only move if position changed
    if (newX !== positionRef.current.x || newY !== positionRef.current.y) {
      // Move the player
      movePlayer(newX, newY);
      
      // Random encounter check
      const newEncounterChance = encounterChance + 5;
      setEncounterChance(newEncounterChance);
      
      if (Math.random() * 100 < newEncounterChance) {
        // Reset encounter chance
        setEncounterChance(0);
        
        // Start battle after a short delay
        setTimeout(() => {
          // Get a random bug from the common bugs
          const randomIndex = Math.floor(Math.random() * commonBugs.length);
          const randomBug = { ...commonBugs[randomIndex], id: `wild-${Date.now()}` };
          
          // Start a battle with the random bug
          startBattle(randomBug);
          
          // Re-enable movement
          setIsMovementEnabled(true);
        }, 500);
      } else {
        // Re-enable movement after a short delay
        setTimeout(() => {
          setIsMovementEnabled(true);
        }, 100);
      }
    } else {
      // Re-enable movement immediately if position didn't change
      setIsMovementEnabled(true);
    }
  }, [encounterChance, movePlayer, startBattle, isMovementEnabled]); // removed gameState dependency
  
  // Set up key listeners only once when component mounts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleMovement('up');
          break;
        case 'ArrowDown':
          handleMovement('down');
          break;
        case 'ArrowLeft':
          handleMovement('left');
          break;
        case 'ArrowRight':
          handleMovement('right');
          break;
        case 'i':
          setActiveView('inventory');
          break;
        case 'b':
          setActiveView('bugCollection');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMovement, setActiveView]);
  
  // Simple grid rendering for the overworld
  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < 10; y++) {
      const row = [];
      for (let x = 0; x < 10; x++) {
        const isPlayer = x === gameState.gameProgress.playerPosition.x && y === gameState.gameProgress.playerPosition.y;
        row.push(
          <div 
            key={`${x}-${y}`} 
            className={`w-8 h-8 border border-gray-700 flex items-center justify-center ${isPlayer ? 'bg-blue-600' : 'bg-gray-800'}`}
          >
            {isPlayer ? '👤' : ''}
          </div>
        );
      }
      grid.push(
        <div key={y} className="flex">
          {row}
        </div>
      );
    }
    return grid;
  };
  
  // On-screen movement controls for touch devices
  const renderDirectionControls = () => {
    return (
      <div className="grid grid-cols-3 gap-2 w-32 mt-4">
        <div></div>
        <Button 
          onClick={() => handleMovement('up')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled}
        >
          ↑
        </Button>
        <div></div>
        
        <Button 
          onClick={() => handleMovement('left')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled}
        >
          ←
        </Button>
        <div></div>
        <Button 
          onClick={() => handleMovement('right')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled}
        >
          →
        </Button>
        
        <div></div>
        <Button 
          onClick={() => handleMovement('down')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled}
        >
          ↓
        </Button>
        <div></div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{currentWorld?.name || 'Unknown World'}</h2>
          <p className="text-gray-400">{currentBiome?.name || 'Unknown Biome'}</p>
        </div>
        <div className="text-sm">
          <p>Position: ({gameState.gameProgress.playerPosition.x}, {gameState.gameProgress.playerPosition.y})</p>
          <p>Encounter: {encounterChance}%</p>
          <p className="text-xs text-gray-500">Movement: {isMovementEnabled ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <div className="border border-gray-600 p-2 bg-gray-900 rounded">
          {renderGrid()}
        </div>
        {renderDirectionControls()}
        <p className="mt-2 text-sm text-gray-400">Use arrow keys to move. Press I for inventory, B for bug collection.</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>World Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Type: {currentBiome?.type || 'Unknown'}</p>
          <p className="mb-2">Souls Collected: {gameState.gameProgress.collectedSouls.length} / 4</p>
          <p>Bugs in Collection: {gameState.gameProgress.collectedBugs.length}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <Button 
          onClick={() => setActiveView('inventory')}
          variant="outline"
        >
          Inventory
        </Button>
        <Button 
          onClick={() => setActiveView('bugCollection')}
          variant="outline"
        >
          Bug Collection
        </Button>
      </div>
    </div>
  );
}; 