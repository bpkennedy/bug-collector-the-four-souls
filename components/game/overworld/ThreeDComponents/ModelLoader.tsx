'use client';

import React, { useRef, useEffect } from 'react';
import { Group, MeshStandardMaterial, Color } from 'three';
import { useFrame } from '@react-three/fiber';

interface ModelLoaderProps {
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animation?: string;
  animationSpeed?: number;
  color?: string;
  fallbackType?: 'player' | 'bug' | 'aggressiveBug';
}

// This component now focuses exclusively on fallback geometries
export const ModelLoader: React.FC<ModelLoaderProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  color,
  fallbackType = 'bug'
}) => {
  const group = useRef<Group>(null);
  
  // Create materials based on color
  const material = useRef(new MeshStandardMaterial({
    color: color || '#ffffff',
    roughness: 0.7,
    metalness: 0.2
  }));
  
  // Update material color when color prop changes
  useEffect(() => {
    if (color) {
      material.current.color = new Color(color);
    }
  }, [color]);
  
  // Add animation effects
  useFrame((_, delta) => {
    if (group.current) {
      // Gentle floating effect for all models
      group.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.05;
      
      // Add rotation animation
      group.current.rotation.y += delta * 0.2;
    }
  });
  
  // Determine which fallback to use
  if (fallbackType === 'player') {
    // Player fallback - a simple humanoid shape
    return (
      <group 
        ref={group} 
        position={position} 
        rotation={[rotation[0], rotation[1], rotation[2]]} 
        scale={[scale, scale, scale]}
      >
        {/* Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Arms */}
        <mesh position={[0.4, 0.6, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        <mesh position={[-0.4, 0.6, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Legs */}
        <mesh position={[0.2, 0.0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        <mesh position={[-0.2, 0.0, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
      </group>
    );
  } else if (fallbackType === 'aggressiveBug') {
    // Aggressive bug fallback - a spikey shape
    return (
      <group 
        ref={group} 
        position={position} 
        rotation={[rotation[0], rotation[1], rotation[2]]} 
        scale={[scale, scale, scale]}
      >
        {/* Body */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <dodecahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.2, 0.3]} castShadow>
          <octahedronGeometry args={[0.15, 1]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Legs */}
        {[30, 60, 120, 150, 210, 240, 300, 330].map((angle, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle * Math.PI / 180) * 0.3, 
              0.1, 
              Math.sin(angle * Math.PI / 180) * 0.3
            ]} 
            rotation={[0, angle * Math.PI / 180, Math.PI / 4]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
            <meshStandardMaterial ref={material} />
          </mesh>
        ))}
      </group>
    );
  } else {
    // Regular bug fallback - a simple insect shape
    return (
      <group 
        ref={group} 
        position={position} 
        rotation={[rotation[0], rotation[1], rotation[2]]} 
        scale={[scale, scale, scale]}
      >
        {/* Body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.15, 0.25]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial ref={material} />
        </mesh>
        
        {/* Legs */}
        {[45, 90, 135, 225, 270, 315].map((angle, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle * Math.PI / 180) * 0.2, 
              0.1, 
              Math.sin(angle * Math.PI / 180) * 0.2
            ]} 
            rotation={[0, angle * Math.PI / 180, Math.PI / 4]}
            castShadow
          >
            <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
            <meshStandardMaterial ref={material} />
          </mesh>
        ))}
      </group>
    );
  }
}; 