export type BugType = 'Fire' | 'Water' | 'Grass' | 'Corruption' | 'Rock' | 'Snow';

export type BugCategory = 'Common' | 'Rare' | 'Legendary' | 'Mythical' | 'Boss' | 'Final Boss';

export type ItemCategory = 
  | 'Capture' 
  | 'Battle' 
  | 'Healing' 
  | 'Evolution' 
  | 'StatBoost' 
  | 'Collectible';

export type ActionType = 
  | 'Offensive' 
  | 'Defensive' 
  | 'Support' 
  | 'Fire' 
  | 'Water' 
  | 'Grass' 
  | 'Rock' 
  | 'Snow' 
  | 'Corruption' 
  | 'Legendary' 
  | 'Boss' 
  | 'Overworld';

export type StatusEffect = 
  | 'Burn' 
  | 'Poison' 
  | 'Sleep' 
  | 'Paralysis' 
  | 'Confusion' 
  | 'Frozen';

export type BiomeType = BugType;

export interface Evolution {
  id: string;
  name: string;
  requiredLevel?: number;
  requiredItem?: string;
  requiredSouls?: number;
}

export interface Action {
  id: string;
  name: string;
  type: ActionType;
  damage?: number;
  statusEffect?: StatusEffect;
  statusEffectChance?: number;
  description: string;
  isOverworld: boolean;
  isBattle: boolean;
  cooldown?: number;
  currentCooldown?: number;
}

export interface Bug {
  id: string;
  name: string;
  type: BugType;
  category: BugCategory;
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  defense: number;
  attack: number;
  special: number;
  soulPower: number;
  actions: Action[];
  evolution?: Evolution[];
  sprite: string;
  description?: string;
  isSelected?: boolean;
  status?: StatusEffect;
  statusDuration?: number;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  effect: (target: Bug) => void;
  count: number;
  sprite: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

export interface Biome {
  id: string;
  name: string;
  type: BiomeType;
  map: number[][];
  npcs?: NPC[];
  bugs?: {bug: Bug, spawnRate: number}[];
  items?: {item: Item, spawnRate: number}[];
  isBossArea: boolean;
}

export interface World {
  id: string;
  name: string;
  biomes: Biome[];
  boss: Bug;
  isCompleted: boolean;
  soul?: Soul;
}

export interface Soul {
  id: string;
  name: string;
  description: string;
  worldId: string;
  effect?: (bug: Bug) => void;
  sprite: string;
}

export interface NPC {
  id: string;
  name: string;
  sprite: string;
  dialogue: string[];
  position: {x: number, y: number};
  movementPattern?: 'static' | 'random' | 'path';
  path?: {x: number, y: number}[];
  items?: {item: Item, condition?: () => boolean}[];
}

export interface GameProgress {
  currentWorldId: string;
  currentBiomeId: string;
  playerPosition: {x: number, y: number};
  completedWorlds: string[];
  collectedSouls: string[];
  collectedBugs: string[];
  activeBugs: string[];
  inventory: {itemId: string, count: number}[];
}

export interface GameState {
  isInitialized: boolean;
  isLoading: boolean;
  gameProgress: GameProgress;
  worlds: World[];
  bugs: Bug[];
  inventory: {item: Item, count: number}[];
  activeView: 'overworld' | 'battle' | 'inventory' | 'bugCollection' | 'dialogue';
  activeBattle?: {
    playerBug: Bug;
    opponentBug: Bug;
    turn: 'player' | 'opponent';
    log: string[];
  };
  activeDialogue?: {
    npc: NPC;
    dialogueIndex: number;
  };
} 