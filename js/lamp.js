// Hero: procedurell mässingslampa (byggd med img2threejs från en referensbild).
// Entré: lampan sänks ner i mörkret, glödlampan flimrar och tänds, rummet lyses upp.
// Interaktion: dra i lampan (pendelfysik), klicka/tryck för att släcka och tända.
// Reducerad rörelse: ingen entré, ingen svängning, lampan står tänd och still.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createBrassPendantLampModel } from '/js/lamp/model.js';

const stage = document.getElementById('lamp-stage');
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    window.__lampFailed?.();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffd59a, 2.4); key.position.set(-3.5, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfd0ff, 0.35); fill.position.set(4, 2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff0c8, 0.8); rim.position.set(0.5, 4, -5); scene.add(rim);
  const hemi = new THREE.HemisphereLight(0xfff0d6, 0x1c1816, 0.35); scene.add(hemi);

  // Pendelpunkt vid sladdens topp (y = 3), lampans kant i y = 0
  const pivot = new THREE.Group(); pivot.position.y = 3; scene.add(pivot);
  const model = createBrassPendantLampModel({ castShadow: false, receiveShadow: false });
  model.position.y = -3; pivot.add(model);
  const envBase = new Map();
  model.traverse((o) => { if (o.isMesh) { o.material.envMapIntensity *= 0.95; envBase.set(o.material, o.material.envMapIntensity); } });
  const bulbLight = new THREE.PointLight(0xffb060, 1.6, 3, 1.6); bulbLight.position.set(0, -0.02, 0); model.add(bulbLight);
  const meshes = model.userData.sculptRuntime?.meshes ?? {};
  const filament = meshes.filament;
  const bulb = meshes.bulb;
  if (bulb) {
    bulb.material.transmission = 0;
    bulb.material.transparent = false;
    bulb.material.opacity = 1;
    bulb.material.needsUpdate = true;
  }
  const baseFilament = filament ? filament.material.emissiveIntensity : 1;
  const baseBulb = 0.7;

  const camera = new THREE.PerspectiveCamera(28, 0.8, 0.05, 20);
  const target = new THREE.Vector3(0, 0.3, 0);
  const glow = stage.querySelector('.stage__fallback span');
  const tmp = new THREE.Vector3();
  const toScreen = (obj) => {
    obj.getWorldPosition(tmp).project(camera);
    return { x: (tmp.x + 1) / 2, y: (1 - tmp.y) / 2 };
  };

  // ---------- Tillstånd ----------
  // Entrén körs bara om rummet fortfarande är mörkt (lampan hann laddas i tid)
  const intro = root.classList.contains('dark') && !reduce;
  let light = intro ? 0 : 1;            // 0 = släckt, 1 = tänd (animeras mjukt)
  let lightTarget = light;
  let drop = intro ? 2.6 : 0, dropV = 0; // hur högt ovanför vila lampan hänger (entré)
  let theta = intro ? 0.12 : 0, thetaV = 0; // svängning i bildplanet (rad)
  let phi = 0, phiV = 0;                // svängning mot/från betraktaren
  let dragging = false, dragTarget = 0, downAt = null;
  let flickerUntil = 0;
  const t0 = performance.now();
  let introStage = intro ? 'drop' : 'done';

  // Duken är bredare än sin yta på större skärmar, så att lampan kan svänga utan att klippas
  let widen = 1;
  function resize() {
    const sw = stage.clientWidth, h = stage.clientHeight;
    if (!sw || !h) return;
    widen = innerWidth > 960 ? 1.8 : 1.5;
    stage.style.setProperty('--widen', widen);
    const w = sw * widen;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const stageAspect = sw / h;
    const visibleW = (stageAspect < 0.75 ? 1.18 : 1.35) * widen, visibleH = Math.max(visibleW / camera.aspect, 1.6);
    const dist = (visibleH / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    target.y = camera.aspect < 0.75 ? 0.5 : 0.3;
    camera.position.set(0, target.y - 0.18, dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    frame(performance.now(), 0);
  }

  function setLights(on, flicker = false) {
    lightTarget = on ? 1 : 0;
    if (on && flicker) flickerUntil = performance.now() + 650;
    root.classList.toggle('lights-off', !on);
  }

  // ---------- Entrésekvens ----------
  function introStep(now) {
    if (introStage === 'done') return;
    const t = (now - t0) / 1000;
    if (introStage === 'drop' && t > 1.7) { introStage = 'flicker'; (window.__marks ||= []).push(['on', Math.round(now)]); setLights(true, true); }
    if (introStage === 'flicker' && t > 2.45) {
      introStage = 'done';
      root.classList.remove('dark');
      root.classList.add('lit');
      setTimeout(() => root.classList.remove('intro'), 1800);
      try { sessionStorage.setItem('bam-intro', '1'); } catch (e) {}
    }
  }

  // ---------- Bildruta ----------
  let last = performance.now();
  function frame(now, dtIn) {
    const dt = dtIn ?? Math.min(0.033, (now - last) / 1000);
    last = now;
    const s = now / 1000;
    introStep(now);

    if (!reduce) {
      // Entré: fjädrande nedsänkning
      dropV += (-26 * drop - 7.8 * dropV) * dt; drop += dropV * dt;
      // Pendel: θ'' = -(g/L) sin θ - c θ'
      const g = 7.5, c = dragging ? 9 : 0.55;
      const breeze = 0.012 * Math.sin(s * 0.9) + 0.006 * Math.sin(s * 2.3 + 1);
      if (dragging) thetaV += (dragTarget - theta) * 70 * dt;
      thetaV += (-g * Math.sin(theta) - c * thetaV + breeze) * dt; theta += thetaV * dt;
      const lim = innerWidth > 960 ? 0.4 : 0.2;
      if (Math.abs(theta) > lim) { theta = Math.sign(theta) * lim; thetaV *= -0.3; }
      phiV += (-g * Math.sin(phi) - 0.6 * phiV + 0.6 * breeze) * dt; phi += phiV * dt;
      model.rotation.y = s * 0.06;
    }
    pivot.position.y = 3 + Math.max(drop, -0.15);
    pivot.rotation.z = theta;
    pivot.rotation.x = phi;

    // Ljus: mjuk övergång + uppstartsflimmer
    light += (lightTarget - light) * Math.min(1, dt * 7);
    let f = 1 + (reduce ? 0 : 0.03 * Math.sin(s * 7.3) + 0.02 * Math.sin(s * 13.7 + 0.8));
    if (now < flickerUntil) f *= [0.15, 1, 0.05, 0.9, 0.3, 1][Math.floor((flickerUntil - now) / 110) % 6];
    const L = light * f;
    if (filament) filament.material.emissiveIntensity = baseFilament * L;
    if (bulb) bulb.material.emissiveIntensity = baseBulb * L;
    bulbLight.intensity = 1.6 * L;
    // Mörkt rum: svalt kantljus och svaga reflexer så att mässingen syns som en silhuett
    const room = 0.22 + 0.78 * light;
    key.intensity = 2.4 * room; fill.intensity = 0.35 * room + 0.5 * (1 - light); hemi.intensity = 0.35 * room;
    rim.intensity = 0.8 * light + 2.2 * (1 - light);
    envBase.forEach((v, m) => { m.envMapIntensity = v * (0.8 + 0.2 * light); });

    renderer.render(scene, camera);

    if (glow && bulb) {
      const p = toScreen(bulb);
      const sr = stage.getBoundingClientRect(), cr = renderer.domElement.getBoundingClientRect();
      const x = cr.left - sr.left + p.x * cr.width, y = cr.top - sr.top + p.y * cr.height;
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      glow.style.opacity = (0.15 + 0.85 * L).toFixed(3);
      root.style.setProperty('--lamp-x', (sr.left + x) + 'px');
      root.style.setProperty('--lamp-y', (sr.top + window.scrollY + y) + 'px');
    }
  }

  // ---------- Interaktion ----------
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  const nearLamp = (e) => {
    const r = el.getBoundingClientRect();
    const b = bulb ? toScreen(bulb) : { x: 0.5, y: 0.6 };
    const dx = (e.clientX - r.left) / r.width - b.x, dy = (e.clientY - r.top) / r.height - (b.y - 0.12);
    return Math.hypot(dx, dy * 0.8) < 0.36;
  };
  const angleFor = (e) => {
    const r = el.getBoundingClientRect();
    const piv = toScreen(pivot);
    const px = r.left + piv.x * r.width, py = r.top + piv.y * r.height;
    return THREE.MathUtils.clamp(Math.atan2(e.clientX - px, Math.max(40, e.clientY - py)), -(innerWidth > 960 ? 0.26 : 0.16), innerWidth > 960 ? 0.26 : 0.16);
  };
  el.addEventListener('pointerdown', (e) => {
    if (!nearLamp(e)) return;
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
    if (!reduce) { dragging = true; dragTarget = angleFor(e); }
    el.setPointerCapture(e.pointerId);
    stage.classList.add('is-grabbing');
  });
  el.addEventListener('pointermove', (e) => {
    if (dragging) { dragTarget = angleFor(e); return; }
    if (finePointer) {
      el.style.cursor = nearLamp(e) ? 'grab' : '';
      // vinddrag: snabba musrörelser nära lampan knuffar den lite
      if (!reduce && nearLamp(e)) thetaV += THREE.MathUtils.clamp(e.movementX, -40, 40) * 0.0016;
    }
  });
  const release = (e) => {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const quick = performance.now() - downAt.t < 350;
    if (moved < 8 && quick) {
      setLights(lightTarget < 0.5, true);
      thetaV += 0.25; // en liten knuff när man drar i snöret
      stage.classList.add('has-toggled');
    }
    dragging = false; downAt = null;
    stage.classList.remove('is-grabbing');
  };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);

  // Tangentbord: lampan är fokuserbar, Enter/mellanslag släcker och tänder
  stage.tabIndex = 0;
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLights(lightTarget < 0.5, true); thetaV += 0.25; }
    if (e.key === 'ArrowLeft') thetaV -= 0.5;
    if (e.key === 'ArrowRight') thetaV += 0.5;
  });

  // ---------- Testläge: ?introAt=1.2 fryser entrén vid 1,2 s (för skärmbilder) ----------
  const introAt = parseFloat(new URLSearchParams(location.search).get('introAt'));
  if (intro && !Number.isNaN(introAt)) {
    resize();
    const base = t0;
    for (let ms = 0; ms <= introAt * 1000; ms += 1000 / 60) frame(base + ms, 1 / 60);
    frame(base + introAt * 1000, 0);
    window.__lampReady?.();
    THREE.DefaultLoadingManager.onLoad = () => { stage.classList.add('is-live'); frame(base + introAt * 1000, 0); window.__frozen = true; };
    return;
  }

  // ---------- Loop ----------
  let running = false, raf = 0;
  const loop = (t) => { frame(t); raf = requestAnimationFrame(loop); };
  const play = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); } };
  const pause = () => { running = false; cancelAnimationFrame(raf); };

  new ResizeObserver(resize).observe(stage);
  resize();
  THREE.DefaultLoadingManager.onLoad = () => stage.classList.add('is-live');
  setTimeout(() => stage.classList.add('is-live'), 2500);
  (window.__marks ||= []).push(['ready', Math.round(performance.now()), intro]);
  window.__lampReady?.();

  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause())).observe(stage);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  play();
}

if (stage) start();
