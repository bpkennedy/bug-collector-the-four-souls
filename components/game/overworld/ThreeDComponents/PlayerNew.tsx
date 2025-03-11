'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Mesh } from 'three';
import { useGame } from '@/contexts/GameContext';
import { ModelLoader } from './ModelLoader';

interface PlayerProps {
  position: [number, number, number];
  movementDirection?: { x: number; z: number } | null;
}

export const PlayerNew: React.FC<PlayerProps> = ({ position, movementDirection }) => {
  const meshRef = useRef<Mesh>(null);
  const targetPosition = useRef(new Vector3(...position));
  const facingDirection = useRef(new Vector3(0, 0, -1)); // Default facing forward
  const { gameState } = useGame();
  
  // Update target position when player moves
  useEffect(() => {
    targetPosition.current = new Vector3(
      position[0],
      position[1],
      position[2]
    );
  }, [position]);
  
  // Determine which model to use based on game progress
  const getPlayerModel = () => {
    const worldCount = gameState.gameProgress.completedWorlds.length;
    // As the player progresses, they get different models
    if (worldCount >= 4) {
      return '/models/player_champion.glb'; // End-game model
    } else if (worldCount >= 2) {
      return '/models/player_advanced.glb'; // Mid-game model
    } else {
      return '/models/player.glb'; // Starting model
    }
  };
  
  // Animate the player model based on movement direction
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Update player position from the parent component's position
      meshRef.current.position.set(position[0], position[1] + 0.3, position[2]);
      
      // Update player rotation based on movement direction if moving
      if (movementDirection && (movementDirection.x !== 0 || movementDirection.z !== 0)) {
        // Calculate angle from movement direction
        const angle = Math.atan2(movementDirection.x, -movementDirection.z);
        
        // Update facing direction for visual effects
        facingDirection.current = new Vector3(movementDirection.x, 0, movementDirection.z).normalize();
        
        // Smoothly rotate to face movement direction
        const currentRotation = meshRef.current.rotation.y;
        // Use lerp for smooth rotation
        meshRef.current.rotation.y = currentRotation + (angle - currentRotation) * Math.min(1, 10 * delta);
        
        // Add a slight bouncing effect when moving
        meshRef.current.position.y = position[1] + 0.3 + Math.abs(Math.sin(Date.now() * 0.01)) * 0.05;
      } else {
        // If not moving, add a gentle idle animation
        meshRef.current.position.y = position[1] + 0.3 + Math.sin(Date.now() * 0.003) * 0.03;
      }
    }
  });
  
  // Use the world to determine appearance
  const getPlayerAnimation = () => {
    // Return different animations based on player state (could be expanded)
    return 'idle';
  };
  
  return (
    <group>
      {/* Invisible mesh for physics/positioning */}
      <mesh 
        ref={meshRef}
        position={[position[0], position[1] + 0.3, position[2]]}
        visible={false}
      >
        <boxGeometry args={[0.5, 1.0, 0.5]} />
      </mesh>
      
      {/* Visible 3D model */}
      <ModelLoader
        modelPath={getPlayerModel()}
        position={[meshRef.current ? meshRef.current.position.x : position[0], 
                  meshRef.current ? meshRef.current.position.y - 0.5 : position[1], 
                  meshRef.current ? meshRef.current.position.z : position[2]]}
        scale={1.0} // Increased scale for downloaded models
        animation={getPlayerAnimation()}
        fallbackType="player"
      />
      
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