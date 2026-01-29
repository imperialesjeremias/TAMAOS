import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

const AgentModel = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#00ff9d" wireframe />
        </mesh>
    );
};

export const Scene = () => {
    return (
        <div className="scene-container" style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AgentModel />
                <OrbitControls enableZoom={false} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
