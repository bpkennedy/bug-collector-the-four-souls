'use client';

import React from 'react';
import { Bug } from '@/lib/types/game';
import { Card } from '@/components/ui/card';

interface BugCardProps {
  bug: Bug;
  onClick?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const BugCard: React.FC<BugCardProps> = ({ 
  bug, 
  onClick, 
  isSelected = false,
  showActions = false,
  size = 'md',
  showDetails = true
}) => {
  // Get type color for the card border
  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Fire': return 'from-red-500 to-orange-400';
      case 'Water': return 'from-blue-500 to-cyan-400';
      case 'Grass': return 'from-green-500 to-lime-400';
      case 'Rock': return 'from-stone-500 to-amber-400';
      case 'Snow': return 'from-sky-400 to-indigo-300';
      case 'Corruption': return 'from-purple-500 to-fuchsia-400';
      default: return 'from-gray-500 to-gray-400';
    }
  };
  
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

  // Get type icon for the energy symbol
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fire': return '🔥';
      case 'Water': return '💧';
      case 'Grass': return '🌿';
      case 'Rock': return '🪨';
      case 'Snow': return '❄️';
      case 'Corruption': return '☠️';
      default: return '⭐';
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-36 h-52',
    md: 'w-64 h-96',
    lg: 'w-80 h-112'
  };

  // Font size classes
  const fontSizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Image size classes
  const imageSizeClasses = {
    sm: 'w-24 h-24 text-3xl',
    md: 'w-48 h-48 text-6xl',
    lg: 'w-60 h-60 text-7xl'
  };

  return (
    <Card 
      className={`relative overflow-hidden ${sizeClasses[size]} ${isSelected ? 'ring-4 ring-yellow-400 transform scale-105' : ''} cursor-pointer transition-all`}
      onClick={onClick}
    >
      {/* Card background with type-based gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getTypeColor(bug.type)} opacity-20`}></div>
      
      {/* Card border */}
      <div className="absolute inset-0 border-8 border-gray-200 rounded-lg"></div>
      
      {/* Card content */}
      <div className="relative p-2 flex flex-col h-full">
        {/* Top section: Name, Type, HP */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <span className={`font-bold ${fontSizeClasses[size]}`}>{bug.name}</span>
            <span className={`ml-1 text-xs bg-gray-200 text-gray-700 px-1 rounded`}>BASIC</span>
          </div>
          <div className="flex items-center">
            <span className={`font-bold ${fontSizeClasses[size]}`}>HP {bug.hp}</span>
            <span className="ml-1">{getTypeIcon(bug.type)}</span>
          </div>
        </div>
        
        {/* Bug image */}
        <div className="bg-gray-100 rounded-md border border-gray-300 flex-grow flex items-center justify-center mb-2">
          <div className={`${imageSizeClasses[size]} flex items-center justify-center`}>
            <span>{getTypeEmoji(bug.type)}</span>
          </div>
        </div>
        
        {/* Bug info */}
        {showDetails && (
          <div className={`text-center text-gray-600 mb-1 ${fontSizeClasses[size] === 'text-xs' ? 'text-[8px]' : 'text-xs'}`}>
            No. {bug.id.slice(0, 4)} {bug.category} Bug • Level {bug.level} • {bug.type} Type
          </div>
        )}
        
        {/* Actions/Attacks */}
        {showActions && (
          <div className="space-y-1">
            {bug.actions.slice(0, 2).map((action) => (
              <div key={action.id} className="bg-gray-100 rounded-md p-1">
                <div className="flex items-center">
                  <span className="mr-1">{getTypeIcon(action.type)}</span>
                  <span className={`font-semibold ${fontSizeClasses[size]}`}>{action.name}</span>
                  {action.damage && (
                    <span className={`ml-auto font-bold ${fontSizeClasses[size]}`}>{action.damage}</span>
                  )}
                </div>
                {action.description && (
                  <p className={`text-xs text-gray-600 ${fontSizeClasses[size] === 'text-xs' ? 'text-[8px]' : ''}`}>
                    {action.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Stats at bottom */}
        {showDetails && (
          <div className="mt-auto">
            <div className="flex justify-between border-t border-gray-300 pt-1">
              <div className="flex items-center">
                <span className="text-red-500 mr-1">⚔️</span>
                <span className={`${fontSizeClasses[size] === 'text-xs' ? 'text-[8px]' : 'text-xs'}`}>
                  {bug.attack}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-1">🛡️</span>
                <span className={`${fontSizeClasses[size] === 'text-xs' ? 'text-[8px]' : 'text-xs'}`}>
                  {bug.defense}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-500 mr-1">✨</span>
                <span className={`${fontSizeClasses[size] === 'text-xs' ? 'text-[8px]' : 'text-xs'}`}>
                  {bug.special}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}; 