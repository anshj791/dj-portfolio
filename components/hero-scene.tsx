"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshReflectorMaterial, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group } from "three";

function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x += (2.55 + pointer.x * 0.18 - camera.position.x) * 0.05;
    camera.position.y += (1.45 + pointer.y * 0.08 - camera.position.y) * 0.05;
    camera.position.z += (5.85 - camera.position.z) * 0.05;
    camera.lookAt(0, 0.02, -0.75);
  });

  return null;
}

function RoomSculpture() {
  const group = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = pointer.x * 0.14 + Math.sin(clock.elapsedTime * 0.35) * 0.05;
    group.current.rotation.x = -0.04 + pointer.y * 0.05;
  });

  return (
    <group ref={group} position={[0, 0.05, 0]} scale={0.9}>
      <mesh position={[0, -0.62, 0]} receiveShadow>
        <boxGeometry args={[5.6, 0.08, 4.2]} />
        <meshStandardMaterial color="#d8c6ae" roughness={0.72} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.9, -1.9]} castShadow>
        <boxGeometry args={[5.6, 3, 0.08]} />
        <meshStandardMaterial color="#efe3d2" roughness={0.85} />
      </mesh>
      <mesh position={[-2.75, 0.9, 0]} castShadow>
        <boxGeometry args={[0.08, 3, 4.2]} />
        <meshStandardMaterial color="#e7d8c5" roughness={0.82} />
      </mesh>
      <mesh position={[0.25, -0.14, -0.5]} castShadow>
        <boxGeometry args={[1.9, 0.45, 0.92]} />
        <meshStandardMaterial color="#746b58" roughness={0.55} />
      </mesh>
      <mesh position={[0.25, 0.2, -0.73]} castShadow>
        <boxGeometry args={[1.9, 1.05, 0.18]} />
        <meshStandardMaterial color="#8d8067" roughness={0.58} />
      </mesh>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.28}>
        <mesh position={[-1.35, 0.52, -1.12]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#b46d55" roughness={0.42} metalness={0.05} />
        </mesh>
      </Float>
      <mesh position={[1.45, 0.02, -1.15]} castShadow>
        <cylinderGeometry args={[0.23, 0.28, 1.2, 36]} />
        <meshStandardMaterial color="#a6784f" roughness={0.36} metalness={0.22} />
      </mesh>
      <mesh position={[1.45, 0.68, -1.15]} castShadow>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color="#f8efe1" roughness={0.4} />
      </mesh>
      <mesh position={[-1.65, -0.35, 0.9]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.24, 48]} />
        <meshStandardMaterial color="#4b4a3f" roughness={0.5} />
      </mesh>
      <mesh position={[-1.65, -0.17, 0.9]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 48]} />
        <meshStandardMaterial color="#efe4d5" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.4, 4]} />
        <MeshReflectorMaterial
          color="#d3c0a8"
          blur={[350, 90]}
          mixBlur={0.8}
          mixStrength={0.18}
          roughness={0.8}
          depthScale={0.22}
          mirror={0.12}
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas className="h-full w-full" shadows dpr={[1, 1.6]}>
      <PerspectiveCamera makeDefault position={[2.55, 1.45, 5.85]} fov={34} />
      <CameraRig />
      <ambientLight intensity={1.9} />
      <directionalLight castShadow position={[3, 4, 3]} intensity={2.4} shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2, 2, 2]} intensity={0.8} color="#cfa67f" />
      <Suspense fallback={null}>
        <RoomSculpture />
        <Environment preset="apartment" />
      </Suspense>
    </Canvas>
  );
}
