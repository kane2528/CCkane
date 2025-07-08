import React, { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  MessageSquare,
  Smartphone,
  Bell,
  Star,
  ArrowRight,
  Timer,
  CheckCircle,
  Gift,
  Sparkles,
} from "lucide-react";
import Confetti from "react-confetti";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stars,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import CountUp from "react-countup";

function CuteRobot() {
    const robotRef = useRef(null);
    const headRef = useRef(null);
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const antennaRef = useRef(null);
  
    useFrame((state) => {
      if (robotRef.current) {
        // Gentle floating motion
        robotRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 0.5) * 0.3 - 1;
        robotRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      }
  
      if (headRef.current) {
        // Subtle head bobbing
        headRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      }
  
      if (antennaRef.current) {
        // Antenna wiggling
        antennaRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
  
      // Blinking animation
      if (leftEyeRef.current && rightEyeRef.current) {
        const blink = Math.sin(state.clock.elapsedTime * 0.5) > 0.95 ? 0.1 : 1;
        leftEyeRef.current.scale.y = blink;
        rightEyeRef.current.scale.y = blink;
      }
    });
  
    return (
      <group ref={robotRef} position={[6.5, 0, -2]} scale={0.6}>
        {/* Robot Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.9, 1.1, 1.2, 8]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
        </mesh>
  
        {/* Robot Head - Make it bigger and rounder for cuteness */}
        <mesh ref={headRef} position={[0, 1.2, 0]}>
          <boxGeometry args={[1.4, 1.1, 1.1]} />
          <meshStandardMaterial color="#6366f1" metalness={0.6} roughness={0.4} />
        </mesh>
  
        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.35, 1.35, 0.56]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.35, 1.35, 0.56]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
          />
        </mesh>
  
        {/* Mouth */}
        <mesh position={[0, 1, 0.51]}>
          <boxGeometry args={[0.4, 0.1, 0.02]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#eab308"
            emissiveIntensity={0.3}
          />
        </mesh>
  
        {/* Antenna */}
        <group ref={antennaRef} position={[0, 1.8, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshStandardMaterial
              color="#94a3b8"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#eab308"
              emissive="#eab308"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
  
        {/* Arms */}
        <mesh position={[-1.2, 0.3, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 1]} />
          <meshStandardMaterial color="#5b21b6" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[1.2, 0.3, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 1]} />
          <meshStandardMaterial color="#5b21b6" metalness={0.6} roughness={0.4} />
        </mesh>
  
        {/* Hands */}
        <mesh position={[-1.6, -0.2, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[1.6, -0.2, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
        </mesh>
  
        {/* Legs */}
        <mesh position={[-0.4, -1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1]} />
          <meshStandardMaterial color="#5b21b6" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0.4, -1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1]} />
          <meshStandardMaterial color="#5b21b6" metalness={0.6} roughness={0.4} />
        </mesh>
  
        {/* Feet */}
        <mesh position={[-0.4, -1.8, 0.2]}>
          <boxGeometry args={[0.3, 0.2, 0.6]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.4, -1.8, 0.2]}>
          <boxGeometry args={[0.3, 0.2, 0.6]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.7} roughness={0.3} />
        </mesh>
  
        {/* Chest Panel */}
        <mesh position={[0, 0.2, 0.8]}>
          <boxGeometry args={[0.6, 0.8, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
  
        {/* Chest Lights */}
        <mesh position={[-0.15, 0.4, 0.83]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.4, 0.83]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#eab308"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.15, 0.4, 0.83]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    );
  }