import { World, Biome, Soul } from '../types/game';
import { bossBugs } from './bugs';

// Define the souls for each world
const souls: Soul[] = [
  {
    id: 'fire-soul',
    name: 'Fire Soul',
    description: 'A fiery soul that enhances fire-type abilities and provides resistance to ice.',
    worldId: 'world1',
    sprite: '/assets/souls/fire-soul.png',
    effect: (bug) => {
      if (bug.type === 'Fire') {
        bug.attack += 5;
        bug.special += 5;
      }
    },
  },
  {
    id: 'corruption-soul',
    name: 'Corruption Soul',
    description: 'A dark soul that empowers corruption-type abilities and enables toxic attacks.',
    worldId: 'world2',
    sprite: '/assets/souls/corruption-soul.png',
    effect: (bug) => {
      if (bug.type === 'Corruption') {
        bug.attack += 3;
        bug.special += 7;
      }
    },
  },
  {
    id: 'rock-soul',
    name: 'Rock Soul',
    description: 'A strong soul that enhances defense and grants resistance to physical attacks.',
    worldId: 'world3',
    sprite: '/assets/souls/rock-soul.png',
    effect: (bug) => {
      if (bug.type === 'Rock') {
        bug.defense += 8;
        bug.maxHp += 10;
        bug.hp += 10;
      }
    },
  },
  {
    id: 'water-soul',
    name: 'Water Soul',
    description: 'A fluid soul that increases water abilities and allows survival in harsh environments.',
    worldId: 'world4',
    sprite: '/assets/souls/water-soul.png',
    effect: (bug) => {
      if (bug.type === 'Water') {
        bug.special += 8;
        bug.defense += 3;
      }
    },
  },
];

// Define sample biomes for each world
const createBiomes = (worldId: string, worldIndex: number): Biome[] => {
  const biomeTypes = ['Fire', 'Water', 'Grass', 'Corruption', 'Rock', 'Snow'] as const;
  
  // Create 4 regular biomes and 1 boss biome
  return [
    {
      id: `${worldId}-biome1`,
      name: `${biomeTypes[0]} Plains`,
      type: 'Fire',
      map: [], // Would contain actual map data in full implementation
      isBossArea: false,
    },
    {
      id: `${worldId}-biome2`,
      name: `${biomeTypes[1]} Lake`,
      type: 'Water',
      map: [],
      isBossArea: false,
    },
    {
      id: `${worldId}-biome3`,
      name: `${biomeTypes[2]} Forest`,
      type: 'Grass',
      map: [],
      isBossArea: false,
    },
    {
      id: `${worldId}-biome4`,
      name: `${biomeTypes[worldIndex % 3 + 3]} Valley`,
      type: worldIndex % 3 === 0 ? 'Corruption' : worldIndex % 3 === 1 ? 'Rock' : 'Snow',
      map: [],
      isBossArea: false,
    },
    {
      id: `${worldId}-boss`,
      name: `Boss Domain`,
      type: bossBugs[worldIndex]?.type || 'Fire',
      map: [],
      isBossArea: true,
    },
  ];
};

// Define the worlds
export const worlds: World[] = [
  {
    id: 'world1',
    name: 'Ember Island',
    biomes: createBiomes('world1', 0),
    boss: bossBugs[0],
    isCompleted: false,
    soul: souls[0],
  },
  {
    id: 'world2',
    name: 'Shadow Caverns',
    biomes: createBiomes('world2', 1),
    boss: bossBugs[1],
    isCompleted: false,
    soul: souls[1],
  },
  {
    id: 'world3',
    name: 'Stone Peak',
    biomes: createBiomes('world3', 2),
    boss: bossBugs[2],
    isCompleted: false,
    soul: souls[2],
  },
  {
    id: 'world4',
    name: 'Aqua Depths',
    biomes: createBiomes('world4', 3),
    boss: bossBugs[3],
    isCompleted: false,
    soul: souls[3],
  },
  {
    id: 'world5',
    name: 'Earth',
    biomes: [
      {
        id: 'world5-final',
        name: 'Final Showdown',
        type: 'Water',
        map: [],
        isBossArea: true,
      },
    ],
    boss: bossBugs[4],
    isCompleted: false,
  },
];

// Helper function to get a world by ID
export const getWorldById = (id: string): World | undefined => {
  return worlds.find(world => world.id === id);
};

// Helper function to get a biome by ID
export const getBiomeById = (id: string): Biome | undefined => {
  for (const world of worlds) {
    const biome = world.biomes.find(biome => biome.id === id);
    if (biome) return biome;
  }
  return undefined;
};

// Helper function to get a soul by ID
export const getSoulById = (id: string): Soul | undefined => {
  return souls.find(soul => soul.id === id);
}; 