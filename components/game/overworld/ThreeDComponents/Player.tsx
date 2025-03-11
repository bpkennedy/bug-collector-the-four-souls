'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { useGame } from '@/contexts/GameContext';

interface PlayerProps {
  position: [number, number, number];
}

export const Player: React.FC<PlayerProps> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);
  const targetPosition = useRef(new Vector3(...position));
  const { gameState } = useGame();
  
  // Update target position when player moves
  useEffect(() => {
    targetPosition.current = new Vector3(
      position[0],
      position[1],
      position[2]
    );
  }, [position]);
  
  // Animate the player's movement
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth movement towards target position
      meshRef.current.position.lerp(targetPosition.current, 5 * delta);
      
      // Add slight bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1 + 0.2;
      
      // Rotate based on movement direction
      if (meshRef.current.position.distanceTo(targetPosition.current) > 0.1) {
        const direction = new Vector3().subVectors(
          targetPosition.current,
          meshRef.current.position
        );
        if (direction.length() > 0.1) {
          const angle = Math.atan2(direction.x, direction.z);
          meshRef.current.rotation.y = angle;
        }
      }
    }
  });
  
  // Use the current world to determine the player appearance
  const getPlayerColor = () => {
    const world = gameState.gameProgress.currentWorldId;
    switch (world) {
      case 'world1': return '#ff9900'; // Fire world - orange
      case 'world2': return '#9966cc'; // Corruption world - purple
      case 'world3': return '#888888'; // Rock world - gray
      case 'world4': return '#3399ff'; // Water world - blue
      case 'world5': return '#33cc33'; // Earth - green
      default: return '#ffffff';       // Default - white
    }
  };
  
  return (
    <group>
      {/* Player body */}
      <mesh 
        ref={meshRef}
        position={[position[0], position[1] + 0.3, position[2]]}
        castShadow
      >
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial color={getPlayerColor()} />
      </mesh>
      
      {/* Player shadow/indicator on ground */}
      <mesh 
        position={[position[0], 0.01, position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}; 