/**
 * ============================================================================
 * MINE PRESETS — 3D KINETIC AFTER EFFECTS PHYSICS & COLLISION STAGE
 * ============================================================================
 * Features:
 * 1. Real 3D Kinetic Elements (After Effects CC, Transitions, Extensions, Presets,
 *    and Aman Sir Official Mascot Medallion).
 * 2. Real-Time 3D Elastic Collision Physics:
 *    - Objects float in a zero-G kinetic field, collide with each other, bounce off,
 *      exchange momentum, and spark silver particles at the impact point!
 *    - Bounded within an invisible 3D containment field with smooth wall bounces.
 * 3. Interactive Mouse Hover Reactions:
 *    - Dynamic mouse cursor point light casting live specular reflections across surfaces!
 *    - Hovered object magnifies, turns into hyper-reflective liquid chrome mirror,
 *      and triggers a live HUD status indicator.
 * 4. Interactive Shockwave Blast on Click:
 *    - Generates a 3D repulsion shockwave knocking objects away with silver spark trails!
 * 5. 360° Free Drag-to-Rotate Stage with Momentum Physics.
 * 6. 100% PURE LIQUID SILVER, TITANIUM & CHROME — ZERO RGB!
 * ============================================================================
 */

(function () {
  'use strict';

  function initWhenReady() {
    if (typeof THREE === 'undefined') {
      setTimeout(initWhenReady, 50);
      return;
    }
    initKineticCollisionStage();
  }

  function initKineticCollisionStage() {
    const container = document.getElementById('heroKineticCard');
    const stageWrapper = document.getElementById('mascotStage');
    if (!container || !stageWrapper) return;

    stageWrapper.innerHTML = `
      <canvas id="hero3DCanvas" class="hero-3d-canvas" aria-label="3D Kinetic After Effects Collision Simulator"></canvas>
      <div class="mascot-speech-bubble" id="mascotBubble" style="top: 52px;">
        <span class="bubble-txt" id="mascotBubbleTxt">✦ KINETIC 3D PHYSICS • HOVER TO REFLECT / DRAG 360°</span>
      </div>
    `;

    const canvas = document.getElementById('hero3DCanvas');
    const bubble = document.getElementById('mascotBubble');
    const bubbleTxt = document.getElementById('mascotBubbleTxt');

    // -------------------------------------------------------------------------
    // 1. SCENE SETUP, CAMERA & RENDERER
    // -------------------------------------------------------------------------
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // -------------------------------------------------------------------------
    // 2. STUDIO TITANIUM LIGHTING (PURE LIQUID CHROME & SILVER)
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x181a22, 2.4);
    scene.add(ambientLight);

    // Key Light from top-right
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Liquid Chrome Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xdbeafe, 3.8);
    rimLight.position.set(-6, 6, -6);
    scene.add(rimLight);

    // Ground bounce light
    const groundLight = new THREE.DirectionalLight(0x64748b, 1.4);
    groundLight.position.set(0, -5, 3);
    scene.add(groundLight);

    // Interactive Point Light that follows mouse cursor in 3D!
    const mouseLight = new THREE.PointLight(0xffffff, 2.5, 8);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // -------------------------------------------------------------------------
    // 3. PROCEDURAL TEXTURE GENERATORS (HIGH-RES CANVASES)
    // -------------------------------------------------------------------------
    function createTexture(drawFn, size = 512) {
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');
      drawFn(ctx, size);
      const tex = new THREE.CanvasTexture(cvs);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }

    // A. Official After Effects "Ae" Logo Texture
    const aeLogoTex = createTexture((ctx, s) => {
      // Obsidian titanium base
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, s, s);

      // Silver double border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 10;
      ctx.strokeRect(12, 12, s - 24, s - 24);

      ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, s - 56, s - 56);

      // Fine brushed lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let i = 0; i < s; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, s);
        ctx.stroke();
      }

      // "Ae" Bold Glyph
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 24;
      ctx.font = '900 230px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Ae', s / 2, s * 0.44);
      ctx.shadowBlur = 0;

      // Bottom Subtitle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '800 28px "JetBrains Mono", sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('AFTER EFFECTS 4K', s / 2, s * 0.82);
    });

    // B. 4K CC Color Science Texture
    const ccTex = createTexture((ctx, s) => {
      ctx.fillStyle = '#07080b';
      ctx.fillRect(0, 0, s, s);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 10;
      ctx.strokeRect(12, 12, s - 24, s - 24);

      // Contrast S-Curve graph
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(s * 0.15, s * 0.75);
      ctx.bezierCurveTo(s * 0.4, s * 0.75, s * 0.6, s * 0.25, s * 0.85, s * 0.25);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 58px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('4K CC', s / 2, s * 0.48);

      ctx.font = '700 24px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('COLOR PRESETS', s / 2, s * 0.82);
    });

    // C. Transitions & Speed-Ramp Texture
    const transitionTex = createTexture((ctx, s) => {
      ctx.fillStyle = '#0a0b0f';
      ctx.fillRect(0, 0, s, s);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 8;
      ctx.strokeRect(12, 12, s - 24, s - 24);

      // Kinetic speed chevrons
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 15;
      for (let i = 0; i < 3; i++) {
        const x = s * (0.3 + i * 0.2);
        ctx.beginPath();
        ctx.moveTo(x - 30, s * 0.35);
        ctx.lineTo(x + 15, s * 0.5);
        ctx.lineTo(x - 30, s * 0.65);
        ctx.lineTo(x - 15, s * 0.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '900 32px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPEED TRANSITIONS', s / 2, s * 0.82);
    });

    // D. Extensions & Plugins Node Texture
    const extensionTex = createTexture((ctx, s) => {
      ctx.fillStyle = '#08090c';
      ctx.fillRect(0, 0, s, s);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 10;
      ctx.strokeRect(12, 12, s - 24, s - 24);

      // Plugin circuit lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s / 2, s * 0.42, s * 0.22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PLUGINS', s / 2, s * 0.44);

      ctx.font = '700 24px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('EXTENSIONS • SAPPHIRE', s / 2, s * 0.8);
    });

    // E. Presets Master Vault Texture
    const presetsTex = createTexture((ctx, s) => {
      ctx.fillStyle = '#0a0c10';
      ctx.fillRect(0, 0, s, s);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 10;
      ctx.strokeRect(12, 12, s - 24, s - 24);

      // Star / Diamond symbol
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 16;
      ctx.font = '900 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', s / 2, s * 0.45);
      ctx.shadowBlur = 0;

      ctx.font = '900 38px "JetBrains Mono", sans-serif';
      ctx.fillText('PRESETS', s / 2, s * 0.72);
      ctx.font = '700 20px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('MASTER SYSTEM', s / 2, s * 0.84);
    });

    // Load Medallion Texture for Aman Mascot Coin
    const texLoader = new THREE.TextureLoader();
    const medallionTex = texLoader.load('assets/medallion-texture.png');
    medallionTex.generateMipmaps = true;

    // -------------------------------------------------------------------------
    // 4. BUILD 3D KINETIC OBJECTS (PHYSICS PARTICIPANTS)
    // -------------------------------------------------------------------------
    const physicsGroup = new THREE.Group();
    scene.add(physicsGroup);

    const kineticObjects = [];

    // Helper: Material Creator (Brushed Titanium Chrome)
    function createMetalMaterial(map, roughness = 0.15, metalness = 0.92) {
      return new THREE.MeshStandardMaterial({
        map: map,
        roughness: roughness,
        metalness: metalness
      });
    }

    // 1. Official After Effects Cube ("Ae")
    const aeMat = createMetalMaterial(aeLogoTex, 0.18, 0.9);
    const aeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), aeMat);
    physicsGroup.add(aeMesh);
    kineticObjects.push({
      mesh: aeMesh,
      radius: 0.85,
      mass: 1.4,
      pos: new THREE.Vector3(-1.4, 0.9, 0.2),
      vel: new THREE.Vector3(0.012, -0.015, 0.008),
      rotVel: new THREE.Vector3(0.012, 0.016, 0.005),
      name: '✦ AFTER EFFECTS 4K ENGINE',
      desc: 'Industry standard 60FPS motion design & VFX pipeline.'
    });

    // 2. Aman Sir Official Creator Mascot Medallion
    const medGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.24, 36);
    const medEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.12
    });
    const medFaceMat = new THREE.MeshStandardMaterial({
      map: medallionTex,
      metalness: 0.85,
      roughness: 0.2
    });
    const medallionMesh = new THREE.Mesh(medGeo, [medEdgeMat, medFaceMat, medFaceMat]);
    medallionMesh.rotation.x = Math.PI * 0.45;
    physicsGroup.add(medallionMesh);
    kineticObjects.push({
      mesh: medallionMesh,
      radius: 1.0,
      mass: 1.6,
      pos: new THREE.Vector3(0, 0, 0.4),
      vel: new THREE.Vector3(-0.008, 0.012, -0.01),
      rotVel: new THREE.Vector3(0.008, 0.022, 0.006),
      name: '✦ AMAN SIR OFFICIAL MASCOT',
      desc: 'Exclusive Minecraft Herobrine Creator Coin & Brand Emblem.'
    });

    // 3. 4K CC Color Grading Crystal Prism
    const ccMat = createMetalMaterial(ccTex, 0.14, 0.95);
    const ccMesh = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.15), ccMat);
    physicsGroup.add(ccMesh);
    kineticObjects.push({
      mesh: ccMesh,
      radius: 0.82,
      mass: 1.3,
      pos: new THREE.Vector3(1.5, 0.8, -0.3),
      vel: new THREE.Vector3(-0.015, -0.01, 0.012),
      rotVel: new THREE.Vector3(0.015, -0.012, 0.008),
      name: '✦ 4K CINEMATIC CC PRESETS',
      desc: 'Razor-sharp contrast curves & signature film highlight rolloff.'
    });

    // 4. Seamless Transitions (Kinetic Warp Torus)
    const torMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.98
    });
    const torMesh = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.24, 16, 42), torMat);
    // Add inner rotating arrow disc
    const torDisc = new THREE.Mesh(new THREE.CircleGeometry(0.65, 32), createMetalMaterial(transitionTex));
    torMesh.add(torDisc);
    physicsGroup.add(torMesh);
    kineticObjects.push({
      mesh: torMesh,
      radius: 0.92,
      mass: 1.2,
      pos: new THREE.Vector3(-1.2, -1.1, -0.2),
      vel: new THREE.Vector3(0.01, 0.014, -0.008),
      rotVel: new THREE.Vector3(-0.01, 0.018, 0.01),
      name: '✦ SEAMLESS SPEED TRANSITIONS',
      desc: 'Beat-synced kinetic whips, zoom pans & motion warps.'
    });

    // 5. Extensions & Plugins (Hexagonal Chip)
    const hexMat = createMetalMaterial(extensionTex, 0.16, 0.92);
    const hexMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.32, 6), hexMat);
    hexMesh.rotation.x = Math.PI * 0.3;
    physicsGroup.add(hexMesh);
    kineticObjects.push({
      mesh: hexMesh,
      radius: 0.9,
      mass: 1.3,
      pos: new THREE.Vector3(1.3, -1.0, 0.3),
      vel: new THREE.Vector3(-0.012, 0.012, 0.015),
      rotVel: new THREE.Vector3(0.014, 0.012, -0.01),
      name: '✦ PLUGINS & EXTENSIONS HUB',
      desc: 'Sapphire, BCC, Twitch & custom motion graphics workflows.'
    });

    // 6. Signature Presets Vault Cube
    const presetMat = createMetalMaterial(presetsTex, 0.15, 0.94);
    const presetMesh = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), presetMat);
    physicsGroup.add(presetMesh);
    kineticObjects.push({
      mesh: presetMesh,
      radius: 0.78,
      mass: 1.2,
      pos: new THREE.Vector3(0.2, 1.6, -0.4),
      vel: new THREE.Vector3(0.014, -0.008, -0.012),
      rotVel: new THREE.Vector3(-0.015, -0.015, 0.01),
      name: '✦ SIGNATURE PRESETS VAULT',
      desc: 'Master editing systems engineered for instant viral impact.'
    });

    // 7 & 8: Speed-Ramp Keyframe Chrome Diamonds
    const diaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.04,
      metalness: 1.0
    });
    const diaGeo = new THREE.OctahedronGeometry(0.55, 0);

    const dia1 = new THREE.Mesh(diaGeo, diaMat);
    physicsGroup.add(dia1);
    kineticObjects.push({
      mesh: dia1,
      radius: 0.6,
      mass: 0.8,
      pos: new THREE.Vector3(-1.8, 0, 0.5),
      vel: new THREE.Vector3(0.018, 0.01, -0.014),
      rotVel: new THREE.Vector3(0.03, 0.02, 0.01),
      name: '✦ 60FPS SPEED-RAMP KEYFRAME',
      desc: 'Precision Bezier curves for buttery-smooth kinetic flow.'
    });

    const dia2 = new THREE.Mesh(diaGeo, diaMat);
    physicsGroup.add(dia2);
    kineticObjects.push({
      mesh: dia2,
      radius: 0.6,
      mass: 0.8,
      pos: new THREE.Vector3(1.8, -0.2, -0.5),
      vel: new THREE.Vector3(-0.016, -0.012, 0.014),
      rotVel: new THREE.Vector3(-0.02, 0.03, -0.015),
      name: '✦ ZERO-BANDING TITANIUM CRYSTAL',
      desc: '10-Bit dynamic range protection preventing gradient banding.'
    });

    // -------------------------------------------------------------------------
    // 5. BACKGROUND ATMOSPHERE: TITANIUM ORBITS & 3D SPARK CLOUD
    // -------------------------------------------------------------------------
    // Concentric 3D Wireframe Titanium Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: true
    });
    const bgRing1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.02, 8, 64), ringMat);
    bgRing1.rotation.x = Math.PI * 0.35;
    scene.add(bgRing1);

    const bgRing2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.018, 8, 64), ringMat);
    bgRing2.rotation.x = -Math.PI * 0.25;
    bgRing2.rotation.y = Math.PI * 0.15;
    scene.add(bgRing2);

    // Liquid Silver Spark Particle Cloud (400 sparks)
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 9;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 7;

      particleVel[i * 3] = (Math.random() - 0.5) * 0.008;
      particleVel[i * 3 + 1] = (Math.random() - 0.5) * 0.008 + 0.003;
      particleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Collision Impact Spark Burst Generator
    function emitCollisionSparks(x, y, z, count = 18) {
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * particleCount);
        pos[idx * 3] = x + (Math.random() - 0.5) * 0.4;
        pos[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.4;
        pos[idx * 3 + 2] = z + (Math.random() - 0.5) * 0.4;
      }
      particleGeo.attributes.position.needsUpdate = true;
    }

    // -------------------------------------------------------------------------
    // 6. REAL 3D ELASTIC COLLISION PHYSICS ENGINE
    // -------------------------------------------------------------------------
    const boundX = 2.4;
    const boundY = 2.1;
    const boundZ = 1.8;

    function updatePhysics() {
      // 1. Position update & wall collisions
      for (let i = 0; i < kineticObjects.length; i++) {
        const obj = kineticObjects[i];

        // Move
        obj.pos.add(obj.vel);
        obj.mesh.position.copy(obj.pos);

        // Rotate
        obj.mesh.rotation.x += obj.rotVel.x;
        obj.mesh.rotation.y += obj.rotVel.y;
        obj.mesh.rotation.z += obj.rotVel.z;

        // Gentle central gravity pull (keeps objects in view)
        obj.vel.x -= obj.pos.x * 0.0003;
        obj.vel.y -= obj.pos.y * 0.0003;
        obj.vel.z -= obj.pos.z * 0.0003;

        // Boundary Bounce (Elastic wall reflections)
        if (Math.abs(obj.pos.x) > boundX) {
          obj.pos.x = Math.sign(obj.pos.x) * boundX;
          obj.vel.x *= -0.92;
        }
        if (Math.abs(obj.pos.y) > boundY) {
          obj.pos.y = Math.sign(obj.pos.y) * boundY;
          obj.vel.y *= -0.92;
        }
        if (Math.abs(obj.pos.z) > boundZ) {
          obj.pos.z = Math.sign(obj.pos.z) * boundZ;
          obj.vel.z *= -0.92;
        }
      }

      // 2. Inter-object 3D Elastic Collisions ("Aapas me takraye aur bounc kare")
      for (let i = 0; i < kineticObjects.length; i++) {
        for (let j = i + 1; j < kineticObjects.length; j++) {
          const o1 = kineticObjects[i];
          const o2 = kineticObjects[j];

          const dist = o1.pos.distanceTo(o2.pos);
          const minDist = o1.radius + o2.radius;

          if (dist < minDist && dist > 0.001) {
            // Collision normal
            const n = new THREE.Vector3().subVectors(o1.pos, o2.pos).normalize();

            // Separate overlapping objects
            const overlap = minDist - dist;
            o1.pos.addScaledVector(n, overlap * 0.52);
            o2.pos.addScaledVector(n, -overlap * 0.52);
            o1.mesh.position.copy(o1.pos);
            o2.mesh.position.copy(o2.pos);

            // Relative velocity
            const vRel = new THREE.Vector3().subVectors(o1.vel, o2.vel);
            const vRelNormal = vRel.dot(n);

            if (vRelNormal < 0) {
              // Elastic restitution coefficient
              const restitution = 0.95;
              const impulse = (-(1 + restitution) * vRelNormal) / (1 / o1.mass + 1 / o2.mass);

              o1.vel.addScaledVector(n, impulse / o1.mass);
              o2.vel.addScaledVector(n, -impulse / o2.mass);

              // Tumble spin torque on collision
              o1.rotVel.x += (Math.random() - 0.5) * 0.02;
              o1.rotVel.y += (Math.random() - 0.5) * 0.02;
              o2.rotVel.x += (Math.random() - 0.5) * 0.02;
              o2.rotVel.y += (Math.random() - 0.5) * 0.02;

              // Spark burst at impact point!
              const impactPt = o1.pos.clone().lerp(o2.pos, 0.5);
              emitCollisionSparks(impactPt.x, impactPt.y, impactPt.z, 20);
            }
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // 7. MOUSE INTERACTION & HYPER-REFLECTIVE RAYCASTING
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredObj = null;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelY = 0;
    let rotVelX = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let lastInteractionTime = Date.now();

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Move 3D dynamic mouse light across the scene
      mouseLight.position.x = mouse.x * 3.5;
      mouseLight.position.y = mouse.y * 3.0;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;

        rotVelY = deltaX * 0.008;
        rotVelX = deltaY * 0.006;

        targetRotY += rotVelY;
        targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX + rotVelX));

        prevMouseX = clientX;
        prevMouseY = clientY;
        lastInteractionTime = Date.now();
      }
    }

    function onPointerDown(e) {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      rotVelX = 0;
      rotVelY = 0;
      lastInteractionTime = Date.now();
    }

    function onPointerUp() {
      isDragging = false;
    }

    // Click / Tap Repulsion Shockwave
    function onClickShockwave(e) {
      lastInteractionTime = Date.now();

      // Convert mouse click to 3D shockwave center
      const clickPt = new THREE.Vector3(mouse.x * 2.8, mouse.y * 2.4, 0);

      // Knock all kinetic objects away!
      kineticObjects.forEach((obj) => {
        const diff = new THREE.Vector3().subVectors(obj.pos, clickPt);
        const d = Math.max(0.4, diff.length());
        diff.normalize();
        const force = 0.08 / (d * 0.8);
        obj.vel.addScaledVector(diff, force);
        obj.rotVel.multiplyScalar(2.0);
      });

      // Spark blast
      emitCollisionSparks(clickPt.x, clickPt.y, 0, 45);

      // Sound
      if (typeof playSound === 'function') {
        try { playSound('click'); } catch (err) {}
      }
    }

    canvas.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onPointerMove(e);
    });

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    canvas.addEventListener('click', onClickShockwave);

    // -------------------------------------------------------------------------
    // 8. RENDER & INTERACTION LOOP
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Run 3D collision physics
      updatePhysics();

      // Stage 360° Drag & Auto-Orbit
      if (!isDragging) {
        rotVelY *= 0.94;
        rotVelX *= 0.94;
        targetRotY += rotVelY;
        targetRotX += rotVelX;

        // Auto-orbit after 2.5s idle
        if (Date.now() - lastInteractionTime > 2500) {
          targetRotY += 0.005;
        }
      }

      currentRotY += (targetRotY - currentRotY) * 0.1;
      currentRotX += (targetRotX - currentRotX) * 0.1;

      physicsGroup.rotation.y = currentRotY;
      physicsGroup.rotation.x = currentRotX;

      // Animate background orbits & particles
      bgRing1.rotation.z += 0.002;
      bgRing2.rotation.z -= 0.003;

      const pPos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 1] += particleVel[i * 3 + 1];
        if (pPos[i * 3 + 1] > 4.5) pPos[i * 3 + 1] = -4.5;
        pPos[i * 3] += Math.sin(elapsed + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Raycast hover check ("Mouse leke jau to alag hi reflection hona chahiye")
      raycaster.setFromCamera(mouse, camera);
      const meshes = kineticObjects.map((o) => o.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      let found = null;
      if (intersects.length > 0) {
        let hitMesh = intersects[0].object;
        // Find top mesh
        while (hitMesh.parent && hitMesh.parent !== physicsGroup) {
          hitMesh = hitMesh.parent;
        }
        found = kineticObjects.find((o) => o.mesh === hitMesh);
      }

      if (found !== hoveredObj) {
        // Reset old
        if (hoveredObj) {
          hoveredObj.mesh.scale.set(1, 1, 1);
        }

        hoveredObj = found;

        // Highlight new
        if (hoveredObj) {
          hoveredObj.mesh.scale.set(1.22, 1.22, 1.22);

          if (bubbleTxt) {
            bubbleTxt.textContent = `${hoveredObj.name} — ${hoveredObj.desc}`;
          }
          if (bubble) {
            bubble.style.transform = 'translateX(-50%) translateY(-6px) scale(1.04)';
            bubble.style.borderColor = 'rgba(255, 255, 255, 0.9)';
          }
        } else {
          if (bubbleTxt) {
            bubbleTxt.textContent = '✦ KINETIC 3D PHYSICS • HOVER TO REFLECT / DRAG 360°';
          }
          if (bubble) {
            bubble.style.transform = '';
            bubble.style.borderColor = '';
          }
        }
      }

      // Hover glow pulse on active object
      if (hoveredObj) {
        hoveredObj.mesh.scale.setScalar(1.2 + Math.sin(elapsed * 12) * 0.03);
      }

      renderer.render(scene, camera);
    }

    animate();

    // Responsive resize
    window.addEventListener('resize', () => {
      const w = container.clientWidth || 440;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();
