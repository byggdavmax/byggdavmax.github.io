// Hero: procedurell mässingslampa (byggd med img2threejs från en referensbild).
// Svajar sakta som en pendel kring sladdens topp och glöder varmt. Statisk vid reducerad rörelse.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createBrassPendantLampModel } from '/js/lamp/model.js';

const stage = document.getElementById('lamp-stage');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) {
    return; // ingen WebGL: det varma skenet i CSS står kvar
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.3).texture;
  pmrem.dispose();

  // Ljus enligt referensen: varm nyckel uppe till vänster, svag fyllning, kantljus, glödlampan själv
  const key = new THREE.DirectionalLight(0xffd59a, 2.4); key.position.set(-3.5, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfd0ff, 0.35); fill.position.set(4, 2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff0c8, 0.8); rim.position.set(0.5, 4, -5); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xfff0d6, 0x1c1816, 0.35));

  // Pendelpunkt vid sladdens topp (y = 3), lampans kant i y = 0
  const pivot = new THREE.Group(); pivot.position.y = 3; scene.add(pivot);
  const model = createBrassPendantLampModel({ castShadow: false, receiveShadow: false });
  model.position.y = -3; pivot.add(model);
  model.traverse((o) => { if (o.isMesh) o.material.envMapIntensity *= 0.5; });
  const bulbLight = new THREE.PointLight(0xffb060, 1.6, 3, 1.6); bulbLight.position.set(0, -0.02, 0); model.add(bulbLight);
  const filament = model.userData.sculptRuntime?.meshes?.filament;
  const baseEmissive = filament ? filament.material.emissiveIntensity : 1;

  const camera = new THREE.PerspectiveCamera(28, 0.8, 0.05, 20);
  const target = new THREE.Vector3(0, 0.3, 0);
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Lampans skärm (diameter 1) ska fylla cirka 74 % av bredden
    const visibleW = 1.35, visibleH = Math.max(visibleW / camera.aspect, 1.6);
    const dist = (visibleH / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0.12, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    render(performance.now());
  }

  function render(t) {
    const s = t / 1000;
    if (!reduce) {
      pivot.rotation.z = THREE.MathUtils.degToRad(1.3) * Math.sin(s * (2 * Math.PI / 6.5));
      pivot.rotation.x = THREE.MathUtils.degToRad(0.6) * Math.sin(s * (2 * Math.PI / 9.1) + 1.2);
      model.rotation.y = s * 0.06;
      const flicker = 1 + 0.035 * Math.sin(s * 7.3) + 0.02 * Math.sin(s * 13.7 + 0.8);
      if (filament) filament.material.emissiveIntensity = baseEmissive * flicker;
      bulbLight.intensity = 1.6 * flicker;
    }
    renderer.render(scene, camera);
  }

  let running = false, raf = 0;
  const loop = (t) => { render(t); raf = requestAnimationFrame(loop); };
  const play = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } };
  const pause = () => { running = false; cancelAnimationFrame(raf); };

  new ResizeObserver(resize).observe(stage);
  resize();
  THREE.DefaultLoadingManager.onLoad = () => { stage.classList.add('is-live'); render(performance.now()); };
  setTimeout(() => stage.classList.add('is-live'), 2500);

  if (!reduce) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause())).observe(stage);
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  }
}

if (stage) start();
