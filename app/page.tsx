'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { starterBugs } from '@/lib/data/bugs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GameContainer } from '@/components/game/GameContainer';

export default function Home() {
  const { gameState, initializeGame, loadGame } = useGame();
  const [gameLoaded, setGameLoaded] = useState(false);
  const [selectedBugIndex, setSelectedBugIndex] = useState<number | null>(null);
  const [shouldCheckSavedGame, setShouldCheckSavedGame] = useState(false);

  console.log("Home component rendering, gameState.isInitialized:", gameState.isInitialized);

  // Don't automatically load the game, just check if it exists
  useEffect(() => {
    console.log("Checking if saved game exists...");
    try {
      // Just check if localStorage has the game data without loading it
      const savedGameExists = !!localStorage.getItem('bugCollector_gameState');
      console.log("Saved game exists:", savedGameExists);
      setGameLoaded(savedGameExists);
    } catch (error) {
      console.error("Error checking for saved game:", error);
    }
  }, []);

  // Only load the game when the user clicks the continue button
  const handleContinueGame = () => {
    console.log("Continuing saved game...");
    try {
      const success = loadGame();
      console.log("Game loaded successfully:", success);
    } catch (error) {
      console.error("Error loading saved game:", error);
      setGameLoaded(false);
    }
  };

  // Start a new game with the selected starter bug
  const handleStartGame = () => {
    if (selectedBugIndex !== null) {
      console.log("Starting new game with bug:", starterBugs[selectedBugIndex].name);
      initializeGame(starterBugs[selectedBugIndex]);
    }
  };

  // Force clear all storage and reset
  const handleForceReset = () => {
    console.log("Forcing complete reset...");
    try {
      localStorage.removeItem('bugCollector_gameState');
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error during force reset:", error);
    }
  };

  // If the game is initialized from a saved state, show the game view
  if (gameState.isInitialized) {
    console.log("Game is initialized, showing GameContainer");
    return <GameContainer />;
  }

  // Show the title screen with a new game button or continue button
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-2 text-yellow-400">Bug Collector</h1>
        <h2 className="text-3xl font-semibold text-yellow-300">The Four Souls</h2>
        <p className="mt-4 text-gray-300 max-w-md mx-auto">
          Collect bugs, battle your way through different worlds, and gather the four souls to save Earth!
        </p>
      </div>

      {gameLoaded ? (
        <Button 
          onClick={handleContinueGame}
          className="px-8 py-6 text-xl bg-green-600 hover:bg-green-700 rounded-lg mb-4"
        >
          Continue Game
        </Button>
      ) : null}

      {!gameLoaded && selectedBugIndex === null ? (
        <Button 
          onClick={() => setSelectedBugIndex(0)}
          className="px-8 py-6 text-xl bg-blue-600 hover:bg-blue-700 rounded-lg mb-4"
        >
          New Game
        </Button>
      ) : null}

      {!gameLoaded && selectedBugIndex !== null ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose your starter bug:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {starterBugs.map((bug, index) => (
              <Card 
                key={bug.id} 
                className={`cursor-pointer transition-all ${selectedBugIndex === index ? 'ring-4 ring-yellow-400 transform scale-105' : 'hover:bg-gray-800'}`}
                onClick={() => setSelectedBugIndex(index)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{bug.name}</CardTitle>
                  <CardDescription>Type: {bug.type}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    {/* In a real implementation, this would be the actual bug sprite */}
                    <span className="text-4xl">{bug.type === 'Fire' ? '🔥' : bug.type === 'Water' ? '💧' : '🌿'}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <p className="text-sm mb-2">HP: {bug.hp} | Attack: {bug.attack} | Defense: {bug.defense}</p>
                  <p className="text-sm text-gray-400">{bug.description}</p>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleStartGame}
              className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 rounded-lg"
              disabled={selectedBugIndex === null}
            >
              Start Adventure
            </Button>
          </div>
        </div>
      ) : null}

      {/* Emergency Reset Button */}
      <div className="mt-8">
        <Button 
          onClick={handleForceReset} 
          variant="destructive" 
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-xs"
        >
          Force Reset Game
        </Button>
      </div>

      {/* Game credits */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Created with Next.js, TypeScript, and TailwindCSS</p>
        <p className="mt-1">Bug Collector: The Four Souls © 2023</p>
      </div>
    </div>
  );
}
