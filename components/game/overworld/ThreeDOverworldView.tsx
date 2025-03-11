'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { getWorldById, getBiomeById } from '@/lib/data/worlds';
import { commonBugs } from '@/lib/data/bugs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vector3 } from 'three';
import { Terrain } from './ThreeDComponents/Terrain';
import { Player } from './ThreeDComponents/Player';
import { Trees } from './ThreeDComponents/Trees';
import { Bugs } from './ThreeDComponents/Bugs';

// Define the size of the game grid
const GRID_SIZE = 20;

export const ThreeDOverworldView: React.FC = () => {
  const { gameState, movePlayer, startBattle, setActiveView } = useGame();
  const [isMovementEnabled, setIsMovementEnabled] = useState(true);
  const [cameraPosition, setCameraPosition] = useState(new Vector3(5, 8, 5));
  const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 0, 0));
  
  // Interaction state
  const [interactionBugs, setInteractionBugs] = useState<Set<string>>(new Set());
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);
  const [interactionMenu, setInteractionMenu] = useState<{
    bugId: string;
    position: { x: number, y: number };
    open: boolean;
  } | null>(null);
  
  // Enemy cooldown to prevent rapid battles
  const [battleCooldown, setBattleCooldown] = useState(false);
  
  // Bug info storage
  const bugInfo = useRef<Map<string, { bugType: string, position: Vector3 }>>(new Map());
  
  // Use ref to track the current position without creating render dependencies
  const positionRef = useRef({ x: 0, y: 0 });
  
  // Update ref when position changes
  useEffect(() => {
    positionRef.current = gameState.gameProgress.playerPosition;
    // Update camera target to follow player
    setCameraTarget(new Vector3(
      gameState.gameProgress.playerPosition.x, 
      0, 
      gameState.gameProgress.playerPosition.y
    ));
    // Update camera position to be behind and above player
    setCameraPosition(new Vector3(
      gameState.gameProgress.playerPosition.x - 3, 
      5, 
      gameState.gameProgress.playerPosition.y + 5
    ));
  }, [gameState.gameProgress.playerPosition]);
  
  const currentWorld = getWorldById(gameState.gameProgress.currentWorldId);
  const currentBiome = getBiomeById(gameState.gameProgress.currentBiomeId);
  
  // Handle bug collision (aggressive bugs)
  const handleBugCollision = useCallback((bugId: string, isAggressive: boolean) => {
    if (battleCooldown || !isMovementEnabled) return;
    
    // Only aggressive bugs trigger immediate battles
    if (isAggressive) {
      // Set battle cooldown to prevent rapid battles
      setBattleCooldown(true);
      setIsMovementEnabled(false);
      
      // Get bug info if available
      const bug = bugInfo.current.get(bugId);
      const bugType = bug?.bugType || 'Unknown Bug';
      
      // Get a random bug from the common bugs list that matches the type if possible
      const matchingBugs = commonBugs.filter(b => b.name.includes(bugType));
      const randomBug = { 
        ...(matchingBugs.length > 0 
          ? matchingBugs[Math.floor(Math.random() * matchingBugs.length)] 
          : commonBugs[Math.floor(Math.random() * commonBugs.length)]),
        id: `wild-${Date.now()}`
      };
      
      // Start battle with delay for visual feedback
      setTimeout(() => {
        startBattle(randomBug);
        
        // Reset cooldown after a longer delay
        setTimeout(() => {
          setBattleCooldown(false);
          setIsMovementEnabled(true);
        }, 5000);
      }, 500);
    }
  }, [battleCooldown, isMovementEnabled, startBattle]);
  
  // Handle bug interaction distance for passive bugs
  const handleInteractionDistance = useCallback((bugId: string, inRange: boolean) => {
    setInteractionBugs(prevBugs => {
      const newBugs = new Set(prevBugs);
      if (inRange) {
        newBugs.add(bugId);
      } else {
        newBugs.delete(bugId);
      }
      return newBugs;
    });
  }, []);
  
  // Handle interaction menu for passive bugs
  const handleInteraction = useCallback(() => {
    // If menu is already open, close it
    if (interactionMenu?.open) {
      setInteractionMenu(null);
      setActiveInteraction(null);
      return;
    }
    
    // Get the nearest bug in interaction range
    if (interactionBugs.size > 0) {
      const bugId = Array.from(interactionBugs)[0]; // Just use the first bug in range for simplicity
      const bug = bugInfo.current.get(bugId);
      
      if (bug) {
        setActiveInteraction(bugId);
        setInteractionMenu({
          bugId,
          position: { x: bug.position.x, y: bug.position.z },
          open: true
        });
      }
    }
  }, [interactionBugs, interactionMenu]);
  
  // Handle movement with callback to prevent dependency issues
  const handleMovement = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isMovementEnabled || interactionMenu?.open) return;
    
    // Get current position from ref to avoid dependency on gameState
    let newX = positionRef.current.x;
    let newY = positionRef.current.y;
    
    // Calculate new position based on direction
    switch (direction) {
      case 'up':
        newY = Math.max(0, newY - 1);
        break;
      case 'down':
        newY = Math.min(GRID_SIZE - 1, newY + 1);
        break;
      case 'left':
        newX = Math.max(0, newX - 1);
        break;
      case 'right':
        newX = Math.min(GRID_SIZE - 1, newX + 1);
        break;
    }
    
    // Only move if position changed
    if (newX !== positionRef.current.x || newY !== positionRef.current.y) {
      // Move the player
      movePlayer(newX, newY);
    }
  }, [isMovementEnabled, interactionMenu, movePlayer]);
  
  // Handle battle initiation from interaction menu
  const handleStartBattle = useCallback(() => {
    if (!interactionMenu) return;
    
    const bug = bugInfo.current.get(interactionMenu.bugId);
    const bugType = bug?.bugType || 'Unknown Bug';
    
    // Get a random bug from the common bugs list that matches the type if possible
    const matchingBugs = commonBugs.filter(b => b.name.includes(bugType));
    const randomBug = { 
      ...(matchingBugs.length > 0 
        ? matchingBugs[Math.floor(Math.random() * matchingBugs.length)] 
        : commonBugs[Math.floor(Math.random() * commonBugs.length)]),
      id: `wild-${Date.now()}`
    };
    
    // Close menu and start battle
    setInteractionMenu(null);
    setActiveInteraction(null);
    startBattle(randomBug);
  }, [interactionMenu, startBattle]);
  
  // Handle talking to a bug
  const handleTalkToBug = useCallback(() => {
    if (!interactionMenu) return;
    
    const bug = bugInfo.current.get(interactionMenu.bugId);
    const bugType = bug?.bugType || 'Unknown Bug';
    
    // For now, just show an alert with bug information
    alert(`The ${bugType} chirps happily at you!`);
    
    // Close menu
    setInteractionMenu(null);
    setActiveInteraction(null);
  }, [interactionMenu]);
  
  // Set up key listeners for player movement and interactions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If interaction menu is open, handle menu navigation
      if (interactionMenu?.open) {
        switch (e.key) {
          case 'Escape':
            setInteractionMenu(null);
            setActiveInteraction(null);
            break;
          case '1':
          case 'b':
            handleStartBattle();
            break;
          case '2':
          case 't':
            handleTalkToBug();
            break;
        }
        return;
      }
      
      // Normal movement and interaction controls
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleMovement('up');
          break;
        case 'ArrowDown':
        case 's':
          handleMovement('down');
          break;
        case 'ArrowLeft':
        case 'a':
          handleMovement('left');
          break;
        case 'ArrowRight':
        case 'd':
          handleMovement('right');
          break;
        case 'i':
          setActiveView('inventory');
          break;
        case 'b':
          setActiveView('bugCollection');
          break;
        case 'f':
          handleInteraction();
          break;
        case 'z':
          // Open bug actions panel (to be implemented)
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMovement, setActiveView, handleInteraction, handleStartBattle, handleTalkToBug, interactionMenu]);
  
  // On-screen movement controls for touch devices
  const renderDirectionControls = () => {
    return (
      <div className="grid grid-cols-3 gap-2 w-32 mt-4">
        <div></div>
        <Button 
          onClick={() => handleMovement('up')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled || !!interactionMenu}
        >
          ↑
        </Button>
        <div></div>
        
        <Button 
          onClick={() => handleMovement('left')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled || !!interactionMenu}
        >
          ←
        </Button>
        <div></div>
        <Button 
          onClick={() => handleMovement('right')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled || !!interactionMenu}
        >
          →
        </Button>
        
        <div></div>
        <Button 
          onClick={() => handleMovement('down')} 
          variant="outline" 
          className="p-2" 
          disabled={!isMovementEnabled || !!interactionMenu}
        >
          ↓
        </Button>
        <div></div>
      </div>
    );
  };
  
  // Render the interaction menu for passive bugs
  const renderInteractionMenu = () => {
    if (!interactionMenu?.open) return null;
    
    const bug = bugInfo.current.get(interactionMenu.bugId);
    const bugType = bug?.bugType || 'Unknown Bug';
    
    // Convert world position to screen position (simplified)
    const screenX = interactionMenu.position.x * 10 + 40; // Rough conversion
    const screenY = interactionMenu.position.y * 10 + 40; // Rough conversion
    
    return (
      <div 
        className="absolute bg-gray-900 border border-gray-700 rounded p-2 z-50 w-64"
        style={{
          left: `${screenX}px`,
          top: `${screenY}px`,
        }}
      >
        <div className="text-yellow-400 font-bold mb-2">{bugType}</div>
        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={handleStartBattle}
            variant="destructive"
            className="w-full"
          >
            Battle (B)
          </Button>
          <Button 
            onClick={handleTalkToBug}
            variant="secondary"
            className="w-full"
          >
            Talk (T)
          </Button>
          <Button 
            onClick={() => { setInteractionMenu(null); setActiveInteraction(null); }}
            variant="outline"
            className="w-full"
          >
            Cancel (Esc)
          </Button>
        </div>
      </div>
    );
  };
  
  // Store bug info when encountered
  const storeBugInfo = useCallback((bugId: string, bugType: string, position: Vector3) => {
    bugInfo.current.set(bugId, { bugType, position });
  }, []);
  
  return (
    <div className="flex flex-col h-full">
      {/* Header section */}
      <div className="flex justify-between items-center mb-2 px-4 pt-2">
        <div>
          <h2 className="text-2xl font-bold">{currentWorld?.name || 'Unknown World'}</h2>
          <p className="text-gray-400">{currentBiome?.name || 'Unknown Biome'}</p>
        </div>
        <div className="text-sm">
          <p>Position: ({gameState.gameProgress.playerPosition.x}, {gameState.gameProgress.playerPosition.y})</p>
          <p className="text-xs text-gray-500">
            Movement: {isMovementEnabled ? (battleCooldown ? 'Cooldown' : 'Enabled') : 'Disabled'}
          </p>
          {interactionBugs.size > 0 && (
            <p className="text-xs text-yellow-400">Press F to interact with nearby bug</p>
          )}
        </div>
      </div>
      
      {/* 3D Canvas - Main part of the view */}
      <div className="flex-1 relative">
        <Canvas shadows>
          {/* Camera setup */}
          <PerspectiveCamera 
            makeDefault 
            position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]} 
            fov={50}
          />
          <OrbitControls 
            target={[cameraTarget.x, cameraTarget.y, cameraTarget.z]} 
            enableZoom={true}
            maxPolarAngle={Math.PI / 2 - 0.1} // Prevent camera from going below ground
          />
          
          {/* Scene lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          
          {/* Skybox / Background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          {/* World elements */}
          <Terrain 
            biomeType={currentBiome?.type || 'Grass'} 
            size={GRID_SIZE}
          />
          <Trees
            biomeType={currentBiome?.type || 'Grass'}
            size={GRID_SIZE}
          />
          <Bugs
            biomeType={currentBiome?.type || 'Grass'}
            playerPosition={gameState.gameProgress.playerPosition}
            size={GRID_SIZE}
            onBugCollision={handleBugCollision}
            activeInteraction={activeInteraction}
            onInteractionDistance={handleInteractionDistance}
            onBugUpdate={storeBugInfo}
          />
          
          {/* Player character */}
          <Player 
            position={[
              gameState.gameProgress.playerPosition.x, 
              0, 
              gameState.gameProgress.playerPosition.y
            ]} 
          />
        </Canvas>
        
        {/* Mini-map overlay in top-right corner */}
        <div className="absolute top-2 right-2 w-32 h-32 bg-black bg-opacity-50 border border-gray-700 rounded">
          {/* Mini-map implementation will go here */}
        </div>
        
        {/* Interaction menu overlay */}
        {renderInteractionMenu()}
      </div>
      
      {/* Controls section */}
      <div className="p-2 flex justify-between items-center">
        <div>
          {renderDirectionControls()}
        </div>
        <div>
          <Card className="w-64">
            <CardHeader className="py-1">
              <CardTitle className="text-sm">World Information</CardTitle>
            </CardHeader>
            <CardContent className="py-1">
              <p className="text-xs mb-1">Type: {currentBiome?.type || 'Unknown'}</p>
              <p className="text-xs mb-1">Souls: {gameState.gameProgress.collectedSouls.length} / 4</p>
              <p className="text-xs">Bugs: {gameState.gameProgress.collectedBugs.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Fixed bottom buttons */}
      <div className="grid grid-cols-3 gap-4 p-2">
        <Button 
          onClick={() => setActiveView('inventory')}
          variant="outline"
        >
          Inventory (I)
        </Button>
        <Button 
          onClick={() => setActiveView('bugCollection')}
          variant="outline"
        >
          Bug Collection (B)
        </Button>
        <Button 
          onClick={handleInteraction}
          variant="outline"
          disabled={interactionBugs.size === 0 || interactionMenu?.open}
        >
          Interact (F)
        </Button>
      </div>
    </div>
  );
}; 