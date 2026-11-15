"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3D holographic render of the same SEASMP architecture graph as the SVG
 * fallback. Mounted only after SystemDiagram confirms desktop viewport +
 * WebGL support, so no-JS and low-power visitors never pay for this.
 */

const NODES_3D = [
  { id: "nextjs", label: "NEXT.JS", pos: [0, 2.05, 0] },
  { id: "fastify", label: "FASTIFY", pos: [0, 0.72, 0.45] },
  { id: "fastapi", label: "FASTAPI", pos: [-1.7, -0.78, -0.35] },
  { id: "postgres", label: "POSTGRESQL", pos: [1.7, -0.78, -0.35] },
  { id: "redis", label: "REDIS", pos: [0, -2.05, 0.15] },
];

const EDGES_3D = [
  { from: "nextjs", to: "fastify" },
  { from: "fastify", to: "fastapi" },
  { from: "fastify", to: "postgres" },
  { from: "fastify", to: "redis" },
  { from: "fastapi", to: "postgres" },
];

function nodePos(id) {
  return NODES_3D.find((n) => n.id === id).pos;
}

let haloTexture = null;
function getHaloTexture() {
  if (haloTexture) return haloTexture;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.32)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  haloTexture = new THREE.CanvasTexture(canvas);
  return haloTexture;
}

const labelTextures = new Map();
function getLabelTexture(text) {
  if (labelTextures.has(text)) return labelTextures.get(text);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.font = "600 34px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  labelTextures.set(text, texture);
  return texture;
}

const EDGE_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EDGE_FRAGMENT = `
  uniform float uTime;
  uniform float uActive;
  uniform vec3 uColor;
  uniform float uGlow;
  varying vec2 vUv;
  void main() {
    float base = (0.3 + uActive * 0.4) * uGlow;
    float speed = 0.45 + uActive * 1.6;
    float band = fract(vUv.y * 4.0 - uTime * speed);
    float pulse = smoothstep(0.82, 1.0, band) + smoothstep(0.18, 0.0, band);
    float intensity = base + pulse * (0.9 + uActive * 0.7) * uGlow;
    gl_FragColor = vec4(uColor * intensity, clamp(intensity, 0.0, 1.0));
  }
`;

function Edge({ from, to, active, frozen, accent }) {
  const coreGeometry = useMemo(() => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(...nodePos(from)),
      new THREE.Vector3(...nodePos(to))
    );
    return new THREE.TubeGeometry(curve, 8, 0.028, 8, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glowGeometry = useMemo(() => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(...nodePos(from)),
      new THREE.Vector3(...nodePos(to))
    );
    return new THREE.TubeGeometry(curve, 8, 0.09, 8, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActive: { value: 0 },
      uColor: { value: new THREE.Color(accent) },
      uGlow: { value: 1 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActive: { value: 0 },
      uColor: { value: new THREE.Color(accent) },
      uGlow: { value: 0.35 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((_, delta) => {
    const next = THREE.MathUtils.lerp(coreUniforms.uActive.value, active ? 1 : 0, 0.12);
    coreUniforms.uActive.value = next;
    glowUniforms.uActive.value = next;
    coreUniforms.uColor.value.set(accent);
    glowUniforms.uColor.value.set(accent);
    if (!frozen) {
      coreUniforms.uTime.value += delta;
      glowUniforms.uTime.value = coreUniforms.uTime.value;
    }
  });

  return (
    <group>
      <mesh geometry={glowGeometry}>
        <shaderMaterial
          uniforms={glowUniforms}
          vertexShader={EDGE_VERTEX}
          fragmentShader={EDGE_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh geometry={coreGeometry}>
        <shaderMaterial
          uniforms={coreUniforms}
          vertexShader={EDGE_VERTEX}
          fragmentShader={EDGE_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Node({ id, label, pos, isActive, onHover, onSelect, frozen, accent, labelColor }) {
  const group = useRef();
  const mesh = useRef();
  const scaleRef = useRef(1);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 0)), []);
  const labelTexture = useMemo(() => getLabelTexture(label), [label]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!frozen && group.current && mesh.current) {
      group.current.position.y = pos[1] + Math.sin(t * 0.6 + phase) * 0.08;
      mesh.current.rotation.y += delta * 0.15;
      mesh.current.rotation.x += delta * 0.07;
    }
    const target = isActive ? 1.18 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, 0.15);
    if (group.current) group.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group ref={group} position={pos}>
      <sprite scale={isActive ? [1.7, 1.7, 1] : [1.3, 1.3, 1]}>
        <spriteMaterial
          map={getHaloTexture()}
          color={accent}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={isActive ? 0.9 : 0.5}
        />
      </sprite>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onHover(id);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isActive ? 1.6 : 0.65}
          transparent
          opacity={0.3}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={accent} transparent opacity={isActive ? 1 : 0.8} />
      </lineSegments>
      <sprite position={[0, -0.72, 0]} scale={[1.5, 0.375, 1]}>
        <spriteMaterial
          map={labelTexture}
          color={labelColor}
          transparent
          depthWrite
          alphaTest={0.5}
          opacity={isActive ? 1 : 0.75}
        />
      </sprite>
    </group>
  );
}

function Particles({ frozen, accent }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!frozen && ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={accent}
        size={0.032}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Rig({ children, frozen }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!frozen) group.current.rotation.y += delta * 0.045;
    const damp = frozen ? 0.25 : 1;
    const nx = state.pointer.x * 0.22 * damp;
    const ny = state.pointer.y * -0.14 * damp;
    target.current.x = THREE.MathUtils.lerp(target.current.x, nx, 0.05);
    target.current.y = THREE.MathUtils.lerp(target.current.y, ny, 0.05);
    group.current.rotation.x = target.current.y;
    group.current.position.x = target.current.x;
  });

  return <group ref={group}>{children}</group>;
}

export default function SystemDiagramScene({ hot, selected, onHover, onSelect, reducedMotion, accent, fogColor, labelColor, onReady }) {
  const active = hot || selected;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={1.1} color="#8aacff" />
      <fog attach="fog" args={[fogColor, 5, 12]} />
      <Rig frozen={reducedMotion}>
        <Particles frozen={reducedMotion} accent={accent} />
        {EDGES_3D.map((e) => (
          <Edge
            key={`${e.from}-${e.to}`}
            from={e.from}
            to={e.to}
            active={active === e.from || active === e.to}
            frozen={reducedMotion}
            accent={accent}
          />
        ))}
        {NODES_3D.map((n) => (
          <Node
            key={n.id}
            id={n.id}
            label={n.label}
            pos={n.pos}
            isActive={active === n.id}
            onHover={onHover}
            onSelect={onSelect}
            frozen={reducedMotion}
            accent={accent}
            labelColor={labelColor}
          />
        ))}
      </Rig>
    </Canvas>
  );
}
