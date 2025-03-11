'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BugCard } from '@/components/game/bugs/BugCard';

export const BattleView: React.FC = () => {
  const { gameState, executeBattleAction, endBattle, switchBattleBug } = useGame();
  const [activePanel, setActivePanel] = useState<'none' | 'actions' | 'deck'>('none');
  const [selectedDeckBug, setSelectedDeckBug] = useState<string | null>(null);
  
  // Effect to handle opponent's turn automatically
  useEffect(() => {
    if (gameState.activeBattle && gameState.activeBattle.turn === 'opponent') {
      // The opponent's turn is now handled in the executeBattleAction function
      // This effect is kept for future enhancements
    }
  }, [gameState.activeBattle?.turn]);
  
  // If there's no active battle, show a message
  if (!gameState.activeBattle) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">No active battle</h2>
        <p className="text-gray-400">Return to the overworld to find bugs to battle.</p>
      </div>
    );
  }
  
  const { playerBug, opponentBug, turn, log } = gameState.activeBattle;
  
  // Get emoji based on bug type (temporary until we have actual sprites)
  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'Fire': return '🔥';
      case 'Water': return '💧';
      case 'Grass': return '🌿';
      case 'Rock': return '🪨';
      case 'Snow': return '❄️';
      case 'Corruption': return '☠️';
      default: return '🐛';
    }
  };
  
  // Calculate HP percentage
  const playerHpPercent = Math.floor((playerBug.hp / playerBug.maxHp) * 100);
  const opponentHpPercent = Math.floor((opponentBug.hp / opponentBug.maxHp) * 100);
  
  // Handle action selection
  const handleActionSelect = (actionId: string) => {
    executeBattleAction(actionId);
    setActivePanel('none'); // Close panel after selecting action
  };
  
  // Handle bug switch from deck
  const handleDealBug = () => {
    if (selectedDeckBug) {
      switchBattleBug(selectedDeckBug);
      setActivePanel('none');
      setSelectedDeckBug(null);
    }
  };
  
  // Handle battle outcome
  const handleEndBattle = (outcome: 'win' | 'lose' | 'flee' | 'capture') => {
    endBattle(outcome);
  };
  
  // Render the player's bug portrait with stats
  const renderPlayerBug = () => (
    <div className="flex items-end justify-between relative">
      <div className="w-36 text-sm">
        <div className="mb-1">
          <span className="font-bold">HP:</span>
          <Progress 
            value={playerHpPercent} 
            className={`h-2 mt-1 ${playerHpPercent > 50 ? "bg-green-500/20" : playerHpPercent > 20 ? "bg-yellow-500/20" : "bg-red-500/20"}`}
          />
          <span className="text-xs">{playerBug.hp}/{playerBug.maxHp}</span>
        </div>
        <div className="mb-1"><span className="font-bold">Type:</span> {playerBug.type}</div>
        <div><span className="font-bold">Category:</span> {playerBug.category}</div>
      </div>
      
      <div className="absolute bottom-0 right-0 mr-32 mb-6 text-center">
        <p className="text-lg font-bold">{playerBug.name}</p>
      </div>
      
      <div className="relative">
        <BugCard 
          bug={playerBug} 
          size="sm" 
          showActions={false} 
          showDetails={false}
        />
      </div>
    </div>
  );
  
  // Render the opponent's bug portrait with stats
  const renderOpponentBug = () => (
    <div className="flex items-start justify-between">
      <div className="w-36 text-sm">
        <p className="font-bold mb-1">{opponentBug.name}</p>
        <div className="mb-1">
          <span className="font-bold">HP:</span>
          <Progress 
            value={opponentHpPercent} 
            className={`h-2 mt-1 ${opponentHpPercent > 50 ? "bg-green-500/20" : opponentHpPercent > 20 ? "bg-yellow-500/20" : "bg-red-500/20"}`}
          />
          <span className="text-xs">{opponentBug.hp}/{opponentBug.maxHp}</span>
        </div>
      </div>
      
      <div className="relative">
        <BugCard 
          bug={opponentBug} 
          size="sm" 
          showActions={false} 
          showDetails={false}
        />
      </div>
    </div>
  );
  
  // Render battle controls (Actions and Deck buttons)
  const renderBattleControls = () => (
    <div className="flex flex-col gap-2 w-48">
      <Button 
        onClick={() => setActivePanel(activePanel === 'actions' ? 'none' : 'actions')}
        variant={activePanel === 'actions' ? "default" : "outline"}
        className="justify-center"
        disabled={turn !== 'player'}
      >
        Actions
      </Button>
      <Button 
        onClick={() => setActivePanel(activePanel === 'deck' ? 'none' : 'deck')}
        variant={activePanel === 'deck' ? "default" : "outline"}
        className="justify-center"
        disabled={turn !== 'player'}
      >
        Deck
      </Button>
      
      <div className="mt-auto flex gap-2">
        <Button 
          onClick={() => handleEndBattle('flee')}
          variant="outline"
          size="sm"
          className="flex-1 bg-red-900 hover:bg-red-800"
        >
          Flee
        </Button>
        <Button 
          onClick={() => handleEndBattle('capture')}
          variant="outline"
          size="sm"
          className="flex-1 bg-blue-900 hover:bg-blue-800"
          disabled={turn !== 'player'}
        >
          Capture
        </Button>
      </div>
    </div>
  );
  
  // Render the actions panel
  const renderActionsPanel = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-10">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-bold">{playerBug.name}&apos;s Actions</h3>
        <Button size="sm" onClick={() => setActivePanel('none')}>Close</Button>
      </div>
      
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
          <span className="text-5xl">{getTypeEmoji(playerBug.type)}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-2 flex-grow">
          {playerBug.actions.map(action => (
            <div 
              key={action.id}
              className={`bg-gray-100 rounded-md p-2 cursor-pointer hover:bg-gray-200 ${turn !== 'player' || (action.cooldown && action.currentCooldown ? action.currentCooldown > 0 : false) ? 'opacity-50' : ''}`}
              onClick={() => turn === 'player' && !(action.cooldown && action.currentCooldown ? action.currentCooldown > 0 : false) && handleActionSelect(action.id)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getTypeEmoji(action.type)}</span>
                <span className="font-bold">{action.name}</span>
                {action.damage && (
                  <span className="ml-auto font-bold">{action.damage}</span>
                )}
              </div>
              {action.description && (
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              )}
              {action.cooldown && action.currentCooldown && action.currentCooldown > 0 && (
                <p className="text-xs text-red-500 mt-1">Cooldown: {action.currentCooldown} turns</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Render the deck panel
  const renderDeckPanel = () => {
    // Get all the player's collected bugs (including the current battle bug)
    const deckBugs = gameState.bugs.filter(bug => 
      gameState.gameProgress.collectedBugs.includes(bug.id)
    );
    
    // If a bug is selected, show its details
    if (selectedDeckBug) {
      // Show details for selected bug
      const bug = gameState.bugs.find(b => b.id === selectedDeckBug);
      if (!bug) return null;
      
      // Determine if this is the current battle bug
      const isCurrentBattleBug = bug.id === playerBug.id;
      
      return (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-10">
          <div className="flex justify-between mb-2">
            <h3 className="text-lg font-bold">{bug.name}</h3>
            <Button size="sm" onClick={() => setSelectedDeckBug(null)}>Back</Button>
          </div>
          
          <div className="flex gap-4">
            <BugCard 
              bug={bug} 
              size="sm" 
              showActions={true}
              showDetails={true}
              isSelected={isCurrentBattleBug}
            />
            
            <div className="flex-grow flex flex-col justify-between">
              <div className="text-sm mb-4">
                <p className="mb-2">{bug.description || `A ${bug.type.toLowerCase()} type bug.`}</p>
                <p>Level: {bug.level} | XP: {bug.xp}/{bug.maxXp}</p>
                {isCurrentBattleBug && (
                  <p className="mt-2 text-yellow-400 font-bold">Currently in battle</p>
                )}
              </div>
              
              <Button 
                onClick={handleDealBug}
                className="w-full"
                disabled={turn !== 'player' || isCurrentBattleBug}
              >
                {isCurrentBattleBug ? 'Currently Active' : 'Deal'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-10">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold">Your Bug Collection</h3>
          <Button size="sm" onClick={() => setActivePanel('none')}>Close</Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {deckBugs.length > 0 ? deckBugs.map(bug => (
            <div 
              key={bug.id}
              className="cursor-pointer"
              onClick={() => setSelectedDeckBug(bug.id)}
            >
              <BugCard 
                bug={bug} 
                size="sm" 
                showActions={false}
                showDetails={false}
                isSelected={bug.id === playerBug.id}
              />
            </div>
          )) : (
            <p className="text-gray-400 col-span-full text-center">No bugs in your collection</p>
          )}
        </div>
      </div>
    );
  };
  
  // Render the battle log that shows the actions and damage
  const renderBattleLog = () => (
    <Card className="mb-6 flex-grow flex flex-col min-h-[200px] max-h-[300px]">
      <CardHeader className="py-2">
        <CardTitle className="text-base">Battle Log</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow py-2">
        <ul className="space-y-1">
          {log.length > 0 ? log.map((entry, index) => (
            <li key={index} className="text-sm">
              {entry}
            </li>
          )) : (
            <li className="text-sm text-gray-400">Battle has begun! Choose an action to attack.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">
      {/* Top section - Opponent bug */}
      <div className="mb-8">
        {renderOpponentBug()}
      </div>
      
      {/* Middle section - Battle log */}
      <div className="flex-grow mb-8">
        {renderBattleLog()}
      </div>
      
      {/* Bottom section - Player bug and controls */}
      <div className="flex gap-4">
        {renderPlayerBug()}
        {renderBattleControls()}
      </div>
      
      {/* Action/Deck panels that appear at the bottom */}
      {activePanel === 'actions' && renderActionsPanel()}
      {activePanel === 'deck' && renderDeckPanel()}
      
      {/* Turn indicator */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gray-800">
        {turn === 'player' ? 'Your Turn' : 'Opponent Turn'}
      </div>
    </div>
  );
}; 