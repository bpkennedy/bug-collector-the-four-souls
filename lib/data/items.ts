import { Item, Bug } from '../types/game';

// Create capture items
export const captureItems: Item[] = [
  {
    id: 'bug-card',
    name: 'Bug Card',
    category: 'Capture',
    description: 'A basic capture tool for common bugs. Has a 30% success rate.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // In the actual implementation, this would calculate capture success
      // based on the bug type, category, and HP
    },
    count: 10,
    sprite: '/assets/items/bug-card.png',
    rarity: 'Common',
  },
  {
    id: 'strong-card',
    name: 'Strong Card',
    category: 'Capture',
    description: 'An improved capture tool for rare bugs. Has a 50% success rate.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would be similar to bug card but with higher success rate
    },
    count: 5,
    sprite: '/assets/items/strong-card.png',
    rarity: 'Uncommon',
  },
  {
    id: 'golden-card',
    name: 'Golden Card',
    category: 'Capture',
    description: 'A premium capture tool for legendary bugs. Has a 70% success rate.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation for premium capture
    },
    count: 2,
    sprite: '/assets/items/golden-card.png',
    rarity: 'Rare',
  },
  {
    id: 'soul-card',
    name: 'Soul Card',
    category: 'Capture',
    description: 'A special capture tool that works better on evolved bugs. Has a 60% success rate.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation for soul-based capture
    },
    count: 1,
    sprite: '/assets/items/soul-card.png',
    rarity: 'Epic',
  },
];

// Create battle items
export const battleItems: Item[] = [
  {
    id: 'bug-repellent',
    name: 'Bug Repellent',
    category: 'Battle',
    description: 'Lowers opponent bug\'s stats for 3 turns.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would temporarily reduce target stats
    },
    count: 3,
    sprite: '/assets/items/bug-repellent.png',
    rarity: 'Common',
  },
  {
    id: 'paralysis-powder',
    name: 'Paralysis Powder',
    category: 'Battle',
    description: 'Has a chance to immobilize opponent for 1-2 turns.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would apply paralysis status
    },
    count: 2,
    sprite: '/assets/items/paralysis-powder.png',
    rarity: 'Uncommon',
  },
  {
    id: 'antidote',
    name: 'Antidote',
    category: 'Battle',
    description: 'Removes poison status effect.',
    effect: (target: Bug) => {
      // Implementation would remove poison status
      if (target.status === 'Poison') {
        target.status = undefined;
        target.statusDuration = 0;
      }
    },
    count: 3,
    sprite: '/assets/items/antidote.png',
    rarity: 'Common',
  },
  {
    id: 'spore-bomb',
    name: 'Spore Bomb',
    category: 'Battle',
    description: 'Deals damage and may cause sleep status.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would deal damage and potentially apply sleep status
    },
    count: 2,
    sprite: '/assets/items/spore-bomb.png',
    rarity: 'Uncommon',
  },
];

// Create healing items
export const healingItems: Item[] = [
  {
    id: 'bug-candy',
    name: 'Bug Candy',
    category: 'Healing',
    description: 'Restores 25% HP to a bug.',
    effect: (target: Bug) => {
      const healAmount = Math.floor(target.maxHp * 0.25);
      target.hp = Math.min(target.hp + healAmount, target.maxHp);
    },
    count: 5,
    sprite: '/assets/items/bug-candy.png',
    rarity: 'Common',
  },
  {
    id: 'bug-potion',
    name: 'Bug Potion',
    category: 'Healing',
    description: 'Restores 50% HP to a bug.',
    effect: (target: Bug) => {
      const healAmount = Math.floor(target.maxHp * 0.5);
      target.hp = Math.min(target.hp + healAmount, target.maxHp);
    },
    count: 3,
    sprite: '/assets/items/bug-potion.png',
    rarity: 'Uncommon',
  },
  {
    id: 'super-bug-potion',
    name: 'Super Bug Potion',
    category: 'Healing',
    description: 'Restores 100% HP to a bug.',
    effect: (target: Bug) => {
      target.hp = target.maxHp;
    },
    count: 1,
    sprite: '/assets/items/super-bug-potion.png',
    rarity: 'Rare',
  },
  {
    id: 'revival-nectar',
    name: 'Revival Nectar',
    category: 'Healing',
    description: 'Revives a fainted bug with 50% HP.',
    effect: (target: Bug) => {
      if (target.hp <= 0) {
        target.hp = Math.floor(target.maxHp * 0.5);
      }
    },
    count: 1,
    sprite: '/assets/items/revival-nectar.png',
    rarity: 'Epic',
  },
  {
    id: 'status-berry',
    name: 'Status Berry',
    category: 'Healing',
    description: 'Cures any negative status effects.',
    effect: (target: Bug) => {
      target.status = undefined;
      target.statusDuration = 0;
    },
    count: 2,
    sprite: '/assets/items/status-berry.png',
    rarity: 'Uncommon',
  },
];

// Create evolution items
export const evolutionItems: Item[] = [
  {
    id: 'metamorphosis-stone',
    name: 'Metamorphosis Stone',
    category: 'Evolution',
    description: 'Basic evolution catalyst for common bugs.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would trigger evolution if applicable
    },
    count: 1,
    sprite: '/assets/items/metamorphosis-stone.png',
    rarity: 'Uncommon',
  },
  {
    id: 'fire-crystal',
    name: 'Fire Crystal',
    category: 'Evolution',
    description: 'Type-specific evolution item for Fire bugs.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would trigger fire-type evolution if applicable
    },
    count: 1,
    sprite: '/assets/items/fire-crystal.png',
    rarity: 'Rare',
  },
  {
    id: 'water-crystal',
    name: 'Water Crystal',
    category: 'Evolution',
    description: 'Type-specific evolution item for Water bugs.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would trigger water-type evolution if applicable
    },
    count: 1,
    sprite: '/assets/items/water-crystal.png',
    rarity: 'Rare',
  },
  {
    id: 'grass-crystal',
    name: 'Grass Crystal',
    category: 'Evolution',
    description: 'Type-specific evolution item for Grass bugs.',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect: (_target: Bug) => {
      // Implementation would trigger grass-type evolution if applicable
    },
    count: 1,
    sprite: '/assets/items/grass-crystal.png',
    rarity: 'Rare',
  },
];

// Create stat boosting items
export const statBoostItems: Item[] = [
  {
    id: 'attack-nectar',
    name: 'Attack Nectar',
    category: 'StatBoost',
    description: 'Permanently increases a bug\'s Attack stat by 1.',
    effect: (target: Bug) => {
      target.attack += 1;
    },
    count: 1,
    sprite: '/assets/items/attack-nectar.png',
    rarity: 'Rare',
  },
  {
    id: 'defense-shell',
    name: 'Defense Shell',
    category: 'StatBoost',
    description: 'Permanently increases a bug\'s Defense stat by 1.',
    effect: (target: Bug) => {
      target.defense += 1;
    },
    count: 1,
    sprite: '/assets/items/defense-shell.png',
    rarity: 'Rare',
  },
  {
    id: 'special-pollen',
    name: 'Special Pollen',
    category: 'StatBoost',
    description: 'Permanently increases a bug\'s Special stat by 1.',
    effect: (target: Bug) => {
      target.special += 1;
    },
    count: 1,
    sprite: '/assets/items/special-pollen.png',
    rarity: 'Rare',
  },
  {
    id: 'vitality-seed',
    name: 'Vitality Seed',
    category: 'StatBoost',
    description: 'Permanently increases a bug\'s HP by 5.',
    effect: (target: Bug) => {
      target.maxHp += 5;
      target.hp += 5;
    },
    count: 1,
    sprite: '/assets/items/vitality-seed.png',
    rarity: 'Rare',
  },
];

// Combine all items into a single collection
export const allItems: Item[] = [
  ...captureItems,
  ...battleItems,
  ...healingItems,
  ...evolutionItems,
  ...statBoostItems,
];

// Helper function to get an item by ID
export const getItemById = (id: string): Item | undefined => {
  return allItems.find(item => item.id === id);
}; 