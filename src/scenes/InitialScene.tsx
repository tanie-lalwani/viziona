import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

export default function InitialScene() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }} style={{ height: '100vh', width: '100vw' }}>
      <Suspense fallback={null}>
        {/* Simple 3D environment placeholder */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} />
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#b0e0e6" />
        </mesh>
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <Environment preset="sunset" />
        <OrbitControls enablePan={false} />
      </Suspense>
    </Canvas>
  );
}
