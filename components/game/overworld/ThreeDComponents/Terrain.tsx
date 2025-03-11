'use client';

import React, { useMemo } from 'react';
import { BiomeType } from '@/lib/types/game';
import { MeshStandardMaterial } from 'three';

interface TerrainProps {
  biomeType: BiomeType;
  size: number;
}

export const Terrain: React.FC<TerrainProps> = ({ biomeType, size }) => {
  // Create different terrain materials based on biome type
  const getMaterialProps = (type: BiomeType) => {
    switch (type) {
      case 'Fire':
        return { color: '#a23e1c', roughness: 0.8, metalness: 0.2 };
      case 'Water':
        return { color: '#1a6387', roughness: 0.3, metalness: 0.8 };
      case 'Grass':
        return { color: '#2d6a1e', roughness: 0.8, metalness: 0.0 };
      case 'Corruption':
        return { color: '#472759', roughness: 0.6, metalness: 0.4 };
      case 'Rock':
        return { color: '#525252', roughness: 0.9, metalness: 0.1 };
      case 'Snow':
        return { color: '#d8e0e6', roughness: 0.7, metalness: 0.0 };
      default:
        return { color: '#2d6a1e', roughness: 0.8, metalness: 0.0 };
    }
  };
  
  // Create terrain material using memo to avoid unnecessary recreations
  const terrainMaterial = useMemo(() => {
    const props = getMaterialProps(biomeType);
    return new MeshStandardMaterial({
      color: props.color,
      roughness: props.roughness,
      metalness: props.metalness,
    });
  }, [biomeType]);
  
  return (
    <mesh 
      receiveShadow 
      position={[size / 2 - 0.5, -0.1, size / 2 - 0.5]} 
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[size, size, size, size]} />
      <primitive object={terrainMaterial} attach="material" />
    </mesh>
  );
}; 