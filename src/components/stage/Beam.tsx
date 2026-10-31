"use client";

import { useMemo } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying float vAlong;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vAlong = uv.y;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlong;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float along = pow(vAlong, 1.6);                       // bright at the lens, fades to the floor
    float edge = pow(abs(dot(vNormal, vView)), 2.2);      // soft beam edges
    gl_FragColor = vec4(uColor, along * edge * uOpacity);
  }
`;

/** Volumetric light cone. Apex at origin, points down +z (use lookAt on the parent). */
export function useBeam(color: string, length = 9, radius = 1.4) {
  return useMemo(() => {
    const geometry = new THREE.ConeGeometry(radius, length, 40, 1, true);
    geometry.translate(0, -length / 2, 0);
    geometry.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    return { geometry, material };
  }, [color, length, radius]);
}
