'use client';

import {
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from '@react-three/fiber';
import { Html, OrbitControls, useTexture } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import Countries from '@/data/countries.json';

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const first = args[0];
  if (
    typeof first === 'string' &&
    first.includes('THREE.Clock') &&
    first.includes('deprecated')
  ) {
    return;
  }
  originalWarn(...args);
};

export interface Location {
  country: string;
  flag: string;
  cities: string[];
  coords: string;
  count: number;
  lat: number;
  lng: number;
}

export const LOCATIONS: Location[] = Countries as unknown as Location[];

function toCartesian(
  lat: number,
  lng: number,
  radius: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
    gl_FragColor = vec4(uColor, 1.0) * intensity * uIntensity;
  }
`;

function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#ffffff') },
      uIntensity: { value: 0.9 },
    }),
    [],
  );

  return (
    <mesh scale={1.14}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

interface MarkerProps {
  location: Location;
  hovered: string | null;
  onHover: (name: string | null) => void;
}

function Marker({ location, hovered, onHover }: MarkerProps) {
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => toCartesian(location.lat, location.lng, 1.015),
    [location],
  );
  const phase = useMemo(
    () => (location.lat * 3 + location.lng) * 0.35,
    [location],
  );
  const isHovered = hovered === location.country;

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(location.country);
  };
  const handlePointerOut = () => onHover(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (ringRef.current) {
      const pulse = Math.sin(t * 2.2);
      const scale = 1 + 0.4 * Math.abs(pulse);
      ringRef.current.scale.setScalar(scale);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0.04, 0.5 - 0.4 * Math.abs(pulse));
    }
    if (dotRef.current) {
      const target = isHovered ? 2.4 : 1;
      const next = THREE.MathUtils.lerp(dotRef.current.scale.x, target, 0.12);
      dotRef.current.scale.setScalar(next);
    }
  });

  return (
    <group>
      <mesh
        ref={dotRef}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={position}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Html
        position={position}
        center
        distanceFactor={2.6}
        zIndexRange={[16777271, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="pointer-events-none flex select-none items-center gap-2 whitespace-nowrap rounded-full border border-zinc-200 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-800 shadow-sm transition-opacity duration-300"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <span aria-hidden="true">{location.flag}</span>
          <span>{location.country}</span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-500 normal-case tracking-normal">
            {location.cities.join(', ')}
          </span>
        </div>
      </Html>
    </group>
  );
}

function ResponsiveScale({ children }: { children: ReactNode }) {
  const sizeWidth = useThree((state) => state.size.width);
  const sizeHeight = useThree((state) => state.size.height);
  const viewportWidth = useThree((state) => state.viewport.width);
  const scale = useMemo(() => {
    if (sizeWidth < 768) return 0.62;
    const maxByHeight = (1 - 144 / sizeHeight) * (2.61 / 2.28);
    return Math.min(viewportWidth / 2.2, Math.max(0.4, maxByHeight));
  }, [sizeWidth, sizeHeight, viewportWidth]);
  return <group scale={scale}>{children}</group>;
}

interface EarthProps {
  scrollProgress: number;
  hovered: string | null;
  onHover: (name: string | null) => void;
}

function Earth({ scrollProgress, hovered, onHover }: EarthProps) {
  const earthMap = useTexture('/assets/textures/earth.webp');
  earthMap.colorSpace = THREE.SRGBColorSpace;

  const globeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          roughness={0.55}
          metalness={0}
          emissive="#ffffff"
          emissiveMap={earthMap}
          emissiveIntensity={0.35}
        />
      </mesh>
      {LOCATIONS.map((location) => (
        <Marker
          key={location.country}
          location={location}
          hovered={hovered}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export interface GlobeSceneProps {
  className?: string;
  scrollProgress?: number;
}

export default function GlobeScene({
  className = '',
  scrollProgress = 0,
}: GlobeSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const resumeTimer = useRef<number | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const pauseAutoRotate = useCallback(() => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
    if (controlsRef.current) controlsRef.current.autoRotate = false;
  }, []);

  const resumeAutoRotate = useCallback((delay: number) => {
    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
    }
    resumeTimer.current = window.setTimeout(() => {
      if (controlsRef.current) controlsRef.current.autoRotate = true;
      resumeTimer.current = null;
    }, delay);
  }, []);

  const handleHover = useCallback(
    (name: string | null) => setHovered(name),
    [],
  );

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.35} />
          <directionalLight position={[5, 3, 5]} intensity={2.1} />
          <ResponsiveScale>
            <Earth
              scrollProgress={scrollProgress}
              hovered={hovered}
              onHover={handleHover}
            />
            <Atmosphere />
          </ResponsiveScale>
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI - Math.PI / 3.2}
            onStart={pauseAutoRotate}
            onEnd={() => resumeAutoRotate(1200)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
