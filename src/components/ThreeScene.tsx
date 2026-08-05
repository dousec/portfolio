import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export default function ThreeScene() {
  return (
    <Canvas style={{ height: '500px' }}>
      <Environment preset="sunset" />
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="coral" roughness={0.2} metalness={0.8} />
      </mesh>
      <OrbitControls autoRotate />
    </Canvas>
  );
}
