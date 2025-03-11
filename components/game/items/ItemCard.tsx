'use client';

import React from 'react';
import { Item } from '@/lib/types/game';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: Item;
  onUse?: () => void;
  isSelected?: boolean;
  showUseButton?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onUse, 
  isSelected = false,
  showUseButton = false
}) => {
  // Get emoji based on item category (temporary until we have actual sprites)
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Capture': return '🔮';
      case 'Battle': return '⚔️';
      case 'Healing': return '💊';
      case 'Evolution': return '✨';
      case 'StatBoost': return '💪';
      case 'Collectible': return '🏆';
      default: return '📦';
    }
  };

  // Get color based on item rarity
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-300';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <Card 
      className={`transition-all ${isSelected ? 'ring-4 ring-yellow-400 transform scale-105' : 'hover:bg-gray-800'}`}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className={`text-lg ${getRarityColor(item.rarity)}`}>{item.name}</CardTitle>
          <span className="text-sm px-2 py-1 bg-gray-700 rounded-full">x{item.count}</span>
        </div>
        <CardDescription>Category: {item.category}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">{getCategoryEmoji(item.category)}</span>
        </div>
        
        <p className="text-sm text-gray-300">{item.description}</p>
      </CardContent>
      
      {showUseButton && (
        <CardFooter className="flex justify-center">
          <Button 
            onClick={onUse} 
            variant="outline" 
            className="w-full"
            disabled={item.count <= 0}
          >
            Use Item
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}; 