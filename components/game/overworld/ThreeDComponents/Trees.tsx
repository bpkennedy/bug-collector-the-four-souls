'use client';

import React, { useMemo } from 'react';
import { BiomeType } from '@/lib/types/game';
import { MeshStandardMaterial, Vector3 } from 'three';

interface TreesProps {
  biomeType: BiomeType;
  size: number;
}

export const Trees: React.FC<TreesProps> = ({ biomeType, size }) => {
  // Generate tree positions using a seeded random function
  const getTreePositions = (size: number, count: number) => {
    const positions: Vector3[] = [];
    const occupied = new Set<string>();
    
    // Create a seeded random number generator
    const seededRandom = (x: number, y: number) => {
      const dot = x * 12.9898 + y * 78.233;
      return Math.abs(Math.sin(dot) * 43758.5453) % 1;
    };
    
    // Generate random tree positions based on biome type
    let attempts = 0;
    while (positions.length < count && attempts < count * 3) {
      attempts++;
      const x = Math.floor(seededRandom(attempts, size) * size);
      const z = Math.floor(seededRandom(size, attempts) * size);
      
      // Ensure trees don't overlap
      const key = `${x},${z}`;
      if (!occupied.has(key)) {
        occupied.add(key);
        
        // Add some randomization to the position
        const jitterX = (seededRandom(x, z) - 0.5) * 0.5;
        const jitterZ = (seededRandom(z, x) - 0.5) * 0.5;
        
        positions.push(new Vector3(x + jitterX, 0, z + jitterZ));
      }
    }
    
    return positions;
  };
  
  // Determine tree count based on biome type
  const getTreeCount = (type: BiomeType, size: number) => {
    const baseCount = Math.floor(size * size * 0.1); // 10% coverage
    
    switch (type) {
      case 'Grass': return baseCount * 1.5; // Dense forests
      case 'Fire': return baseCount * 0.5;  // Sparse trees in fire biomes
      case 'Water': return baseCount * 0.3; // Few trees in water biomes
      case 'Corruption': return baseCount * 0.8; // Moderate in corruption
      case 'Rock': return baseCount * 0.4; // Few trees in rocky areas
      case 'Snow': return baseCount * 0.7; // Moderate in snow biomes
      default: return baseCount;
    }
  };
  
  // Get tree colors based on biome type
  const getTreeColors = (type: BiomeType) => {
    switch (type) {
      case 'Fire':
        return {
          trunk: '#5c3c28',
          leaves: '#ff6600'
        };
      case 'Water':
        return {
          trunk: '#3a5e63',
          leaves: '#6fc3df'
        };
      case 'Grass':
        return {
          trunk: '#4d3319',
          leaves: '#2d8f45'
        };
      case 'Corruption':
        return {
          trunk: '#2a1a33',
          leaves: '#7d4d99'
        };
      case 'Rock':
        return {
          trunk: '#3d3d3d',
          leaves: '#68705f'
        };
      case 'Snow':
        return {
          trunk: '#5b4b42',
          leaves: '#a3e4d7'
        };
      default:
        return {
          trunk: '#4d3319',
          leaves: '#2d8f45'
        };
    }
  };
  
  // Create tree positions using memo to avoid recreating on every render
  const treePositions = useMemo(() => {
    const count = getTreeCount(biomeType, size);
    return getTreePositions(size, count);
  }, [biomeType, size]);
  
  // Create trunk and leaves materials based on biome type
  const { trunkMaterial, leavesMaterial } = useMemo(() => {
    const colors = getTreeColors(biomeType);
    
    return {
      trunkMaterial: new MeshStandardMaterial({
        color: colors.trunk,
        roughness: 0.9,
      }),
      leavesMaterial: new MeshStandardMaterial({
        color: colors.leaves,
        roughness: 0.7,
      })
    };
  }, [biomeType]);
  
  return (
    <group>
      {treePositions.map((position, index) => (
        <group key={index} position={[position.x, 0, position.z]}>
          {/* Tree trunk */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 1.2, 8]} />
            <primitive object={trunkMaterial} attach="material" />
          </mesh>
          
          {/* Tree leaves */}
          <mesh castShadow position={[0, 1.3, 0]}>
            <coneGeometry args={[0.5, 1.5, 8]} />
            <primitive object={leavesMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}; 