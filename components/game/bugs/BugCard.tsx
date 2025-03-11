'use client';

import React from 'react';
import { Bug } from '@/lib/types/game';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BugCardProps {
  bug: Bug;
  onClick?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const BugCard: React.FC<BugCardProps> = ({ 
  bug, 
  onClick, 
  isSelected = false,
  showActions = false
}) => {
  // Calculate HP percentage
  const hpPercentage = Math.floor((bug.hp / bug.maxHp) * 100);
  
  // Calculate XP percentage
  const xpPercentage = Math.floor((bug.xp / bug.maxXp) * 100);
  
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

  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-4 ring-yellow-400 transform scale-105' : 'hover:bg-gray-800'}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{bug.name}</CardTitle>
          <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">Lv.{bug.level}</span>
        </div>
        <CardDescription>Type: {bug.type} | {bug.category}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">{getTypeEmoji(bug.type)}</span>
        </div>
        
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>HP: {bug.hp}/{bug.maxHp}</span>
            <span>{hpPercentage}%</span>
          </div>
          <Progress value={hpPercentage} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span>XP: {bug.xp}/{bug.maxXp}</span>
            <span>{xpPercentage}%</span>
          </div>
          <Progress value={xpPercentage} className="h-2" />
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <div className="grid grid-cols-3 gap-2 w-full text-sm mb-2">
          <div>ATK: {bug.attack}</div>
          <div>DEF: {bug.defense}</div>
          <div>SP: {bug.special}</div>
        </div>
        
        {showActions && (
          <div className="mt-2 w-full">
            <h4 className="text-sm font-semibold mb-1">Actions:</h4>
            <div className="text-xs text-gray-400">
              {bug.actions.slice(0, 3).map(action => action.name).join(', ')}
              {bug.actions.length > 3 ? ` +${bug.actions.length - 3} more` : ''}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}; 