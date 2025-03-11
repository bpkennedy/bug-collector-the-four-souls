'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BiomeType } from '@/lib/types/game';
import { Vector3, Group, MathUtils } from 'three';
import { ModelLoader } from './ModelLoader';

interface BugsProps {
  biomeType: BiomeType;
  playerPosition: { x: number, y: number };
  size: number;
  onBugCollision?: (bugId: string, isAggressive: boolean) => void;
  activeInteraction?: string | null;
  onInteractionDistance?: (bugId: string, inRange: boolean) => void;
  onBugUpdate?: (bugId: string, bugType: string, position: Vector3) => void;
}

interface WanderingBug {
  id: string;
  position: Vector3;
  targetPosition: Vector3;
  speed: number;
  size: number;
  color: string;
  isAggressive: boolean;
  lastChangeTime: number;
  changeInterval: number;
  bugType: string;
}

export const Bugs: React.FC<BugsProps> = ({ 
  biomeType, 
  playerPosition, 
  size, 
  onBugCollision,
  activeInteraction,
  onInteractionDistance,
  onBugUpdate
}) => {
  // Group ref for all bugs
  const groupRef = useRef<Group>(null);
  
  // Function to create a random position within the world bounds
  const getRandomPosition = (size: number) => {
    return new Vector3(
      Math.random() * size,
      0,
      Math.random() * size
    );
  };
  
  // Determine bug count and colors based on biome type
  const getBugSettings = (type: BiomeType, size: number) => {
    // Calculate base count (fewer bugs than trees)
    const baseCount = Math.floor(size * size * 0.03); // 3% coverage
    
    let count, colors, aggressiveRatio;
    
    switch (type) {
      case 'Fire':
        count = baseCount * 0.6;
        colors = ['#ff4500', '#ff7f50', '#ff8c00'];
        aggressiveRatio = 0.6; // 60% aggressive bugs in fire biomes
        break;
      case 'Water':
        count = baseCount * 1.2;
        colors = ['#00bfff', '#1e90ff', '#4169e1'];
        aggressiveRatio = 0.3; // 30% aggressive bugs in water biomes
        break;
      case 'Grass':
        count = baseCount * 1.5;
        colors = ['#32cd32', '#228b22', '#006400'];
        aggressiveRatio = 0.4; // 40% aggressive bugs in grass biomes
        break;
      case 'Corruption':
        count = baseCount * 0.9;
        colors = ['#9932cc', '#8b008b', '#800080'];
        aggressiveRatio = 0.8; // 80% aggressive bugs in corruption biomes
        break;
      case 'Rock':
        count = baseCount * 0.7;
        colors = ['#a9a9a9', '#778899', '#708090'];
        aggressiveRatio = 0.5; // 50% aggressive bugs in rock biomes
        break;
      case 'Snow':
        count = baseCount * 0.8;
        colors = ['#e0ffff', '#b0e0e6', '#afeeee'];
        aggressiveRatio = 0.2; // 20% aggressive bugs in snow biomes
        break;
      default:
        count = baseCount;
        colors = ['#32cd32', '#228b22', '#006400'];
        aggressiveRatio = 0.4;
    }
    
    return { count, colors, aggressiveRatio };
  };
  
  // Get a random bug type based on biome
  const getBugType = (type: BiomeType) => {
    const biomeSpecificBugs: Record<BiomeType, string[]> = {
      'Fire': ['Bout Ham', 'Gnat Bot', 'Tiger Beatle', 'Tiger Hopper', 'Fire Mite'],
      'Water': ['Bleach Leach', 'Insectapus', 'Otterbug', 'Ponand', 'Floweb'],
      'Grass': ['Bug Ive', 'Leaferfly', 'Milk Weederfly', 'Soft Worm', 'Fly Hopper'],
      'Corruption': ['Black Web', 'Disco Web', 'Web Beatle', 'Web Hopper', 'Psy Bug'],
      'Rock': ['Pach Ben', 'Shard Bug', 'Stone Burner', 'Robeatle', 'Cori Beatle'],
      'Snow': ['Flufer', 'Wind Hopper', 'Cloud Mite', 'Waffen SS Bug']
    };
    
    const bugList = biomeSpecificBugs[type] || biomeSpecificBugs['Grass'];
    return bugList[Math.floor(Math.random() * bugList.length)];
  };
  
  // Get model path for a bug based on type
  const getBugModel = (bugType: string, isAggressive: boolean, biomeType: BiomeType) => {
    // Map bug types to model files
    // In a real implementation, you might have specific models for each bug type
    // For now, we'll just use biome-specific models
    if (isAggressive) {
      return `/models/bug_${biomeType.toLowerCase()}_aggressive.glb`;
    } else {
      return `/models/bug_${biomeType.toLowerCase()}.glb`;
    }
  };
  
  // Get animation for a bug based on state
  const getBugAnimation = (isAggressive: boolean, inInteractionRange: boolean) => {
    if (inInteractionRange) {
      return 'interact';
    } else if (isAggressive) {
      return 'aggressive';
    } else {
      return 'idle';
    }
  };
  
  // Generate wandering bugs using memo to avoid recreation on every render
  const wanderingBugs = useMemo(() => {
    const { count, colors, aggressiveRatio } = getBugSettings(biomeType, size);
    const bugs: WanderingBug[] = [];
    
    for (let i = 0; i < count; i++) {
      const position = getRandomPosition(size);
      const targetPosition = getRandomPosition(size);
      const isAggressive = Math.random() < aggressiveRatio;
      
      bugs.push({
        id: `bug-${i}-${Date.now().toString(36)}`,
        position,
        targetPosition,
        speed: isAggressive ? 0.3 + Math.random() * 0.4 : 0.1 + Math.random() * 0.2, // Aggressive bugs move faster
        size: 0.2 + Math.random() * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        isAggressive,
        lastChangeTime: 0,
        changeInterval: isAggressive ? 1500 + Math.random() * 2000 : 3000 + Math.random() * 4000, // Aggressive bugs change direction more frequently
        bugType: getBugType(biomeType)
      });
    }
    
    return bugs;
  }, [biomeType, size]);
  
  // Track bugs in interaction range
  const bugsInRange = useRef(new Set<string>());
  
  // Update bug positions on each frame
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const now = Date.now();
    const playerPos = new Vector3(playerPosition.x, 0, playerPosition.y);
    
    wanderingBugs.forEach((bug, index) => {
      // Check if it's time to change direction
      if (now - bug.lastChangeTime > bug.changeInterval) {
        if (bug.isAggressive) {
          // Aggressive bugs might target the player
          const targetPlayer = Math.random() < 0.4; // 40% chance to target player
          if (targetPlayer) {
            bug.targetPosition = new Vector3(playerPos.x, 0, playerPos.z);
          } else {
            bug.targetPosition = getRandomPosition(size);
          }
        } else {
          // Passive bugs just wander randomly
          bug.targetPosition = getRandomPosition(size);
        }
        bug.lastChangeTime = now;
      }
      
      // Calculate distance to player
      const distanceToPlayer = bug.position.distanceTo(playerPos);
      
      // Update bug info for parent component
      onBugUpdate?.(bug.id, bug.bugType, bug.position);
      
      // Handle interaction range notifications
      if (distanceToPlayer < 1.5 && !bug.isAggressive) {
        if (!bugsInRange.current.has(bug.id)) {
          bugsInRange.current.add(bug.id);
          onInteractionDistance?.(bug.id, true);
        }
      } else if (bugsInRange.current.has(bug.id)) {
        bugsInRange.current.delete(bug.id);
        onInteractionDistance?.(bug.id, false);
      }
      
      // Handle collisions for aggressive bugs
      if (distanceToPlayer < 0.8 && bug.isAggressive) {
        onBugCollision?.(bug.id, true);
      }
      
      // For passive bugs, if not being interacted with, move away if player is too close
      if (!bug.isAggressive && distanceToPlayer < 1.0 && activeInteraction !== bug.id) {
        const awayFromPlayer = new Vector3().subVectors(bug.position, playerPos).normalize();
        const escapePoint = new Vector3().addVectors(
          bug.position,
          awayFromPlayer.multiplyScalar(1.5)
        );
        bug.targetPosition = escapePoint;
      }
      
      // Move bug towards target
      bug.position.lerp(bug.targetPosition, delta * bug.speed);
      
      // Get the child mesh for this bug (if it exists)
      const bugMesh = groupRef.current?.children[index];
      if (bugMesh) {
        // Update position
        bugMesh.position.copy(bug.position);
        
        // Update rotation to face movement direction
        const direction = new Vector3().subVectors(bug.targetPosition, bug.position);
        if (direction.length() > 0.1) {
          const angle = Math.atan2(direction.x, direction.z);
          bugMesh.rotation.y = MathUtils.lerp(
            bugMesh.rotation.y,
            angle,
            delta * 2
          );
        }
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {wanderingBugs.map((bug, index) => {
        const inInteractionRange = bugsInRange.current.has(bug.id);
        const isInteracting = activeInteraction === bug.id;
        const modelPath = getBugModel(bug.bugType, bug.isAggressive, biomeType);
        const animation = getBugAnimation(bug.isAggressive, inInteractionRange);
        
        return (
          <group key={index} position={[bug.position.x, 0, bug.position.z]}>
            {/* 3D Model for the bug */}
            <ModelLoader
              modelPath={modelPath}
              position={[0, bug.isAggressive ? 0.4 : 0.2, 0]} // Raised position for better visibility
              scale={bug.size * 4} // Increased scale for downloaded models
              color={bug.color}
              animation={animation}
              animationSpeed={bug.isAggressive ? 1.5 : 1.0}
              fallbackType={bug.isAggressive ? 'aggressiveBug' : 'bug'}
            />
            
            {/* Visual indicator for passive bugs (only when in interaction range) */}
            {!bug.isAggressive && inInteractionRange && !isInteracting && (
              <mesh position={[0, bug.size * 1.5, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            )}
            
            {/* Visual indicator for bugs being interacted with */}
            {isInteracting && (
              <mesh position={[0, bug.size * 1.5, 0]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color="#ffff00" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}; 