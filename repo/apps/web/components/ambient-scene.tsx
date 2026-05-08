"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function AmbientScene() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    ref.current.appendChild(renderer.domElement);
    const geometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth < 768;
    const pointCount = isMobile ? 120 : 220;
    const verts = new Float32Array(pointCount * 3);
    for (let i = 0; i < verts.length; i += 3) {
      verts[i] = (Math.random() - 0.5) * 20;
      verts[i + 1] = (Math.random() - 0.5) * 10;
      verts[i + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: "#ffbf55", size: 0.03, transparent: true, opacity: 0.8 })
    );
    scene.add(points);
    let frame = 0;
    let visible = true;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible) return;
      points.rotation.y += 0.0006;
      points.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };
    animate();
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const onVisibility = () => {
      visible = !document.hidden;
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      (points.material as THREE.Material).dispose();
      renderer.dispose();
      ref.current?.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-20 opacity-40" />;
}
