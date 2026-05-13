/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { LandValue, ParcelStructure, TileAnalytics } from '../services/geminiService';
import { PositioningData } from './PositioningMonitor';

function ManaParticles({ count = 200 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       p[i * 3] = (Math.random() - 0.5) * 50;
       p[i * 3 + 1] = Math.random() * 20;
       p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y += 0.001;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial
        transparent
        color="#bc13fe"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingCrystal({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    ref.current.rotation.y += 0.01;
    ref.current.rotation.z += 0.005;
    ref.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.005;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[0.4]} />
        <MeshDistortMaterial
          color="#00ffff"
          emissive="#bc13fe"
          emissiveIntensity={2}
          speed={3}
          distort={0.4}
        />
      </mesh>
    </Float>
  );
}

function CyberAvatar({ data }: { data: PositioningData }) {
  const group = useRef<THREE.Group>(null!);
  const { beta, gamma } = data;

  useFrame((state) => {
    if (!group.current) return;
    
    // Position shifting based on phone tilt
    const targetX = (gamma || 0) * 0.15;
    const targetZ = (beta || 0) * -0.15;
    
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.1);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.1);
    
    // Hover animation
    group.current.position.y = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    
    // Subtle rotation based on movement
    group.current.rotation.y = (gamma || 0) * 0.05;
  });

  return (
    <group ref={group}>
      {/* Head/Core */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} wireframe />
      </mesh>
      
      {/* Geometric Body */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial color="#bc13fe" transparent opacity={0.6} wireframe />
      </mesh>

      {/* Connection Rings */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00ff9f" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.2, 0]}>
          <torusGeometry args={[1.4, 0.01, 16, 100]} />
          <meshBasicMaterial color="#bc13fe" transparent opacity={0.3} />
        </mesh>
        {/* Arcane Sigil Ring (represented by segments) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 4]} position={[0, 0.1, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.02]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        ))}
      </group>

      <pointLight color="#00ffff" intensity={2} distance={5} />
    </group>
  );
}

function ThirdPersonCamera({ data }: { data: PositioningData }) {
  const { alpha, beta, gamma } = data;
  
  useFrame((state) => {
    // GTA Style Follow Camera
    // Focus point is the avatar's estimated center
    const targetPos = new THREE.Vector3((gamma || 0) * 0.15, 1, (beta || 0) * -0.15);
    
    // Camera position: offset behind and above
    const cameraOffset = new THREE.Vector3(0, 5, 12);
    
    // Influence camera angle by phone rotation
    if (alpha !== null) {
      const angle = THREE.MathUtils.degToRad(alpha);
      cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * 0.1);
    }
    
    const desiredPos = targetPos.clone().add(cameraOffset);
    state.camera.position.lerp(desiredPos, 0.05);
    state.camera.lookAt(targetPos);
  });
  
  return null;
}

function NeonRain({ speed = 1 }) {
  const points = useRef<THREE.Points>(null!);
  const count = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const currentPositions = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      currentPositions[i * 3 + 1] -= delta * 15 * speed;
      if (currentPositions[i * 3 + 1] < 0) currentPositions[i * 3 + 1] = 20;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={points} positions={positions}>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function BuiltStructure({ type, position, level, analytics }: { type: string, position: [number, number, number], level: number, analytics?: TileAnalytics }) {
  const group = useRef<THREE.Group>(null!);
  const resonance = analytics?.resonance || 50;
  const surge = analytics?.socialSurge || 20;
  const fuzz = analytics?.fuzzDensity || 10;
  
  useFrame((state) => {
    group.current.rotation.y += 0.01 * (1 + surge / 50);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 2) * (surge / 40);
  });

  const Geometry = () => {
    switch(type) {
      case 'tower': return <boxGeometry args={[0.8, 6 + (surge / 20), 0.8]} />;
      case 'pylon': return <cylinderGeometry args={[0.1, 0.4, 4 + (level * 0.5), 6]} />;
      case 'core': return <octahedronGeometry args={[1.5 + (fuzz / 50)]} />;
      case 'obelisk': return <coneGeometry args={[1, 5, 4]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const glowColor = surge > 60 ? "#00ffff" : fuzz > 60 ? "#ff00ff" : "#bc13fe";
  
  return (
    <Float speed={2 * (1 + resonance / 100)} rotationIntensity={1} floatIntensity={1} position={position}>
      <group ref={group}>
        <mesh>
          <Geometry />
          <meshStandardMaterial 
            color={glowColor} 
            wireframe 
            emissive={glowColor} 
            emissiveIntensity={surge / 10}
          />
        </mesh>
        <pointLight color={glowColor} intensity={surge / 5} distance={15} />
      </group>
    </Float>
  );
}

function DataSilo({ position, active, color }: { position: [number, number, number], active: boolean, color: string }) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (active) {
      mesh.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
    } else {
      mesh.current.scale.y = 1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <cylinderGeometry args={[0.5, 0.7, 8, 6]} />
        <meshStandardMaterial 
          color={active ? color : "#1a1a1f"} 
          wireframe 
          emissive={active ? color : "#000"}
          emissiveIntensity={active ? 2 : 0}
        />
      </mesh>
      {/* Halo effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial color={active ? color : "#333"} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function CyberForest({ 
  isSyncing, 
  weather = 'calm', 
  isInjecting = false, 
  claimedLands = [],
  positioningData,
  isRoaming = false
}: { 
  isSyncing?: boolean, 
  weather?: 'calm' | 'storm' | 'rain', 
  isInjecting?: boolean, 
  claimedLands?: Array<LandValue & { lat: number, lng: number }>,
  positioningData?: PositioningData,
  isRoaming?: boolean
}) {
  const speedScale = isSyncing ? 8 : (weather === 'storm' ? 3 : 1);
  const fogColor = weather === 'storm' ? '#220022' : (weather === 'rain' ? '#001111' : '#0a0a0c');
  
  const siloPositions = useMemo(() => [
    [-15, 0, -15], [15, 0, -15], [-15, 0, 15], [15, 0, 15], [0, 0, -20]
  ] as [number, number, number][], []);

  const structuresToRender = useMemo(() => {
    const list: Array<{ type: string, position: [number, number, number], level: number, analytics?: TileAnalytics }> = [];
    claimedLands.forEach((land, landIdx) => {
      if (land.structures) {
        land.structures.forEach((s, sIdx) => {
          // Deterministic positioning based on lat/lng
          const hashX = Math.sin(land.lat * 1000 + sIdx) * 20;
          const hashZ = Math.cos(land.lng * 1000 + sIdx) * 20;
          list.push({
            type: s.type,
            position: [hashX, 0, hashZ],
            level: s.level,
            analytics: land.analytics
          });
        });
      }
    });
    return list;
  }, [claimedLands]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 10, 20], fov: 50 }} gl={{ alpha: true }}>
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 5, isSyncing ? 20 : 35]} />
        
        <ambientLight intensity={weather === 'storm' ? 0.1 : 0.3} />
        <pointLight position={[10, 10, 10]} color="#00FF00" intensity={isSyncing ? 15 : (isInjecting ? 8 : 2)} />
        
        {weather === 'rain' && <NeonRain speed={1.5} />}
        {(isSyncing || isInjecting) && <NeonRain speed={isSyncing ? 4 : 2} />}

        <ManaParticles />
        
        {/* Floating Arcane Crystals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingCrystal 
            key={`crystal-${i}`} 
            position={[
              Math.sin(i * 0.5) * 15, 
              5 + Math.cos(i * 0.3) * 5, 
              Math.cos(i * 0.5) * 15
            ]} 
          />
        ))}

        {/* Data Silos */}
        {siloPositions.map((pos, i) => (
          <DataSilo 
            key={i} 
            position={pos} 
            active={isInjecting || isSyncing} 
            color={i % 2 === 0 ? "#00ff9f" : "#ff3e00"} 
          />
        ))}

        {/* User Built Structures */}
        {structuresToRender.map((s, i) => (
          <BuiltStructure 
            key={i}
            type={s.type}
            position={s.position}
            level={s.level}
            analytics={s.analytics}
          />
        ))}

        {positioningData && (
          <>
            <CyberAvatar data={positioningData} />
            <ThirdPersonCamera data={positioningData} />
          </>
        )}

        {/* Polygon Forest Elements */}
        {Array.from({ length: 25 }).map((_, i) => (
          <Float key={i} speed={2 * speedScale} rotationIntensity={2 * speedScale} floatIntensity={1}>
            <mesh position={[(Math.random() - 0.5) * 50, 2 + Math.random() * 8, (Math.random() - 0.5) * 50]}>
              <octahedronGeometry args={[Math.random() * 0.6 + 0.3]} />
              <MeshDistortMaterial
                color={Math.random() > 0.5 ? (weather === 'storm' ? "#ff00ff" : "#00ff9f") : "#ff3e00"}
                speed={3 * speedScale}
                distort={isSyncing ? 0.8 : (weather === 'storm' ? 0.6 : 0.4)}
                wireframe={true}
              />
            </mesh>
          </Float>
        ))}

        {/* The Cyber Portal Central Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, isSyncing ? 8 : 6.2, 64]} />
          <meshBasicMaterial color={isSyncing ? "#ff3e00" : (weather === 'rain' ? "#00ffff" : "#00ff9f")} transparent opacity={0.6} side={2} />
        </mesh>
        
        {!positioningData?.alpha && (
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={isSyncing || weather === 'storm'} autoRotateSpeed={isSyncing ? 20 : 2} />
        )}
      </Canvas>
    </div>
  );
}
