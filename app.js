/* app.js — robust scroll-spy + layout nav + light/dark theme toggle + accent picker
   ─────────────────────────────────────────────────────────────
   Supports:
   - Light mode (off-white #f0f0f0 canvas, pure white #ffffff cards & sidebar)
   - Dark mode (pure black #000000 canvas, dark #121212 cards & sidebar)
   - Accent color selection (Neutral, Cyan, Emerald, Amber, Rose, Violet)
   - Container-relative offset calculation for fail-safe section scrolling
   - Wide-screen one-page app synchronization
*/

(function () {
  'use strict';

  const content     = document.getElementById('content');
  const sidebar     = document.getElementById('sidebar');
  const menuBtn     = document.getElementById('menuBtn');
  const overlay     = document.getElementById('overlay');
  const navLinks    = document.querySelectorAll('.nav-link[data-target]');
  const pages       = document.querySelectorAll('.page[id]');
  const themeBtns   = document.querySelectorAll('[data-action="toggle-theme"]');
  const accentDots  = document.querySelectorAll('.accent-dot[data-accent]');

  // ── Theme Management ─────────────────────────────────────────
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeBtns.forEach(btn => {
      const label = btn.querySelector('.theme-btn-label');
      if (label) {
        label.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
      }
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Apply initial theme immediately
  applyTheme(getPreferredTheme());

  // Listen for OS theme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  // ── Dynamic Accent Color Picker ──────────────────────────────
  function setAccent(accent) {
    if (accent === 'neutral') {
      document.documentElement.removeAttribute('data-accent');
      localStorage.removeItem('accent');
    } else {
      document.documentElement.setAttribute('data-accent', accent);
      localStorage.setItem('accent', accent);
    }
    accentDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.accent === accent);
    });
  }

  const savedAccent = localStorage.getItem('accent') || 'neutral';
  setAccent(savedAccent);

  accentDots.forEach(dot => {
    dot.addEventListener('click', () => {
      setAccent(dot.dataset.accent);
    });
  });

  // ── Active nav link ─────────────────────────────────────────
  function setActive(id) {
    navLinks.forEach(link => {
      const match = link.dataset.target === id;
      link.classList.toggle('active', match);
    });
  }

  // ── Accurate Container-Relative Scroll Calculation ───────────
  function scrollToSection(targetId, smooth = true) {
    const target = document.getElementById(targetId);
    if (!target) return;

    setActive(targetId);

    if (window.innerWidth <= 768) {
      closeSidebar();
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    } else {
      const contentRect = content.getBoundingClientRect();
      const targetRect  = target.getBoundingClientRect();
      const targetScrollTop = content.scrollTop + (targetRect.top - contentRect.top);

      content.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }

    history.replaceState(null, '', `#${targetId}`);
  }

  // ── Scroll-spy via IntersectionObserver ─────────────────────
  const isMobile = () => window.innerWidth <= 768;

  function makeObserver() {
    return new IntersectionObserver(
      entries => {
        let best = null;
        entries.forEach(entry => {
          if (
            entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.intersectionRatio)
          ) {
            best = entry;
          }
        });
        if (best && best.target.id) {
          setActive(best.target.id);
        }
      },
      {
        root: isMobile() ? null : content,
        rootMargin: '-5% 0px -40% 0px',
        threshold: [0.05, 0.2, 0.4],
      }
    );
  }

  let observer = makeObserver();
  pages.forEach(p => observer.observe(p));

  // Re-initialise the observer if the viewport crosses the mobile breakpoint
  let wasDesktop = !isMobile();
  window.addEventListener('resize', () => {
    const isDesktop = !isMobile();
    if (isDesktop !== wasDesktop) {
      observer.disconnect();
      observer = makeObserver();
      pages.forEach(p => observer.observe(p));
      wasDesktop = isDesktop;
    }
  });

  // ── Nav click listener ──────────────────────────────────────
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.dataset.target;
      scrollToSection(targetId, true);
    });
  });

  // ── Mobile sidebar ──────────────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  // ── Restore scroll position on load ─────────────────────────
  window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      setTimeout(() => scrollToSection(hash, false), 50);
    } else if (pages.length > 0) {
      setActive(pages[0].id);
    }
  });

  // ══════════════════════════════════════════════════════════════
  // AI, ML & ROBOTICS WORKSPACES: 3D VISUALIZATIONS & TELEMETRY
  // ══════════════════════════════════════════════════════════════

  // 1. Workspace: 3D Latent Space & Vector Clusters (Three.js)
  function initLatentWorkspace() {
    const canvas = document.getElementById('latent-canvas');
    const container = document.getElementById('latent-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(45, 35, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Grid Floor
    const grid = new THREE.GridHelper(60, 30, 0x333333, 0x1a1a1a);
    grid.position.y = -15;
    scene.add(grid);

    // Cluster Generation
    const clusterColors = [0xffffff, 0xa3a3a3, 0x525252];
    const clusterCenters = [
      new THREE.Vector3(-12, 6, 8),
      new THREE.Vector3(14, -4, -10),
      new THREE.Vector3(2, 12, -15)
    ];

    let pointCount = 1024;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    function generateClusters(spread) {
      for (let i = 0; i < pointCount; i++) {
        const cIdx = i % 3;
        const center = clusterCenters[cIdx];
        const col = new THREE.Color(clusterColors[cIdx]);

        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 8.5 * spread;

        const x = center.x + r * Math.sin(phi) * Math.cos(theta);
        const y = center.y + r * Math.sin(phi) * Math.sin(theta);
        const z = center.z + r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.attributes.position.needsUpdate = true;
    }

    generateClusters(1.0);

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Centroid wireframe spheres
    const centroidMeshes = clusterCenters.map((c, i) => {
      const sGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const sMat = new THREE.MeshBasicMaterial({ color: clusterColors[i], wireframe: true });
      const mesh = new THREE.Mesh(sGeo, sMat);
      mesh.position.copy(c);
      scene.add(mesh);
      return mesh;
    });

    // Interaction controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotSpeed = 1.0;

    container.addEventListener('mousedown', e => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      pointCloud.rotation.y += dx * 0.006;
      pointCloud.rotation.x += dy * 0.006;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('wheel', e => {
      e.preventDefault();
      camera.position.z = Math.max(20, Math.min(120, camera.position.z + e.deltaY * 0.05));
    }, { passive: false });

    // Slider Listeners
    const spreadSlider = document.getElementById('latent-spread-slider');
    const spreadVal = document.getElementById('latent-spread-val');
    if (spreadSlider && spreadVal) {
      spreadSlider.addEventListener('input', e => {
        const val = parseFloat(e.target.value);
        spreadVal.textContent = val.toFixed(1) + 'x';
        generateClusters(val);
      });
    }

    const rotSlider = document.getElementById('latent-rotation-slider');
    const rotVal = document.getElementById('latent-rot-val');
    if (rotSlider && rotVal) {
      rotSlider.addEventListener('input', e => {
        rotSpeed = parseFloat(e.target.value);
        rotVal.textContent = rotSpeed.toFixed(1) + 'x';
      });
    }

    const resetBtn = document.getElementById('latent-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        camera.position.set(45, 35, 55);
        camera.lookAt(0, 0, 0);
        pointCloud.rotation.set(0, 0, 0);
      });
    }

    const resampleBtn = document.getElementById('latent-resample-btn');
    if (resampleBtn) {
      resampleBtn.addEventListener('click', () => {
        generateClusters(parseFloat(spreadSlider ? spreadSlider.value : 1.0));
      });
    }

    // Legend highlight
    document.querySelectorAll('.cluster-legend-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.cluster-legend-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const cName = item.querySelector('.legend-name')?.textContent || 'Cluster';
        const statCluster = document.getElementById('latent-stat-cluster');
        if (statCluster) statCluster.textContent = cName;
      });
    });

    // Resize handler
    function onResize() {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (rotSpeed > 0 && !isDragging) {
        pointCloud.rotation.y += 0.002 * rotSpeed;
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  // 2. Workspace: 3D Robotics Kinematics & IK (Three.js)
  function initRoboticsWorkspace() {
    const canvas = document.getElementById('robotics-canvas');
    const container = document.getElementById('robotics-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(30, 25, 35);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Grid & Axis
    const grid = new THREE.GridHelper(40, 20, 0x444444, 0x1f1f1f);
    scene.add(grid);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Arm Link Hierarchies
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    // Base cylinder
    const baseGeo = new THREE.CylinderGeometry(4, 5, 2, 24);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xe5e5e5, metalness: 0.2, roughness: 0.5 });

    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    baseMesh.position.y = 1;
    baseGroup.add(baseMesh);

    // Shoulder Joint
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.y = 2;
    baseGroup.add(shoulderGroup);

    const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), chromeMat);
    shoulderJoint.position.y = 1;
    shoulderGroup.add(shoulderJoint);

    // Link 1 (Upper Arm)
    const link1Len = 12;
    const link1Geo = new THREE.CylinderGeometry(1.2, 1.4, link1Len, 16);
    const link1Mesh = new THREE.Mesh(link1Geo, whiteMat);
    link1Mesh.position.y = link1Len / 2 + 1;
    shoulderGroup.add(link1Mesh);

    // Elbow Joint
    const elbowGroup = new THREE.Group();
    elbowGroup.position.y = link1Len + 1;
    shoulderGroup.add(elbowGroup);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), chromeMat);
    elbowGroup.add(elbowJoint);

    // Link 2 (Forearm)
    const link2Len = 10;
    const link2Geo = new THREE.CylinderGeometry(1.0, 1.1, link2Len, 16);
    const link2Mesh = new THREE.Mesh(link2Geo, whiteMat);
    link2Mesh.position.y = link2Len / 2;
    elbowGroup.add(link2Mesh);

    // Wrist Joint
    const wristGroup = new THREE.Group();
    wristGroup.position.y = link2Len;
    elbowGroup.add(wristGroup);

    const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), chromeMat);
    wristGroup.add(wristJoint);

    // End Effector Gripper
    const eeGeo = new THREE.BoxGeometry(1.6, 2.5, 3.2);
    const eeMesh = new THREE.Mesh(eeGeo, metalMat);
    eeMesh.position.y = 1.5;
    wristGroup.add(eeMesh);

    // Target tracking beacon
    const targetBeacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    scene.add(targetBeacon);

    // Joint Sliders & State
    const j1Slider = document.getElementById('joint1-slider');
    const j2Slider = document.getElementById('joint2-slider');
    const j3Slider = document.getElementById('joint3-slider');
    const j4Slider = document.getElementById('joint4-slider');

    function updateAnglesFromSliders() {
      if (!j1Slider || !j2Slider || !j3Slider || !j4Slider) return;
      const a1 = (parseFloat(j1Slider.value) * Math.PI) / 180;
      const a2 = (parseFloat(j2Slider.value) * Math.PI) / 180;
      const a3 = (parseFloat(j3Slider.value) * Math.PI) / 180;
      const a4 = (parseFloat(j4Slider.value) * Math.PI) / 180;

      baseGroup.rotation.y = a1;
      shoulderGroup.rotation.z = a2;
      elbowGroup.rotation.z = a3;
      wristGroup.rotation.x = a4;

      document.getElementById('joint1-val').textContent = j1Slider.value + '°';
      document.getElementById('joint2-val').textContent = j2Slider.value + '°';
      document.getElementById('joint3-val').textContent = j3Slider.value + '°';
      document.getElementById('joint4-val').textContent = j4Slider.value + '°';

      // Calculate End Effector World Coordinates
      const eeWorldPos = new THREE.Vector3();
      eeMesh.getWorldPosition(eeWorldPos);
      targetBeacon.position.copy(eeWorldPos);

      const eeDisplay = document.getElementById('robotics-ee-pos');
      if (eeDisplay) {
        eeDisplay.textContent = `[${eeWorldPos.x.toFixed(1)}, ${eeWorldPos.y.toFixed(1)}, ${eeWorldPos.z.toFixed(1)}]`;
      }
    }

    [j1Slider, j2Slider, j3Slider, j4Slider].forEach(slider => {
      if (slider) slider.addEventListener('input', updateAnglesFromSliders);
    });

    updateAnglesFromSliders();

    // Home and Wave buttons
    const homeBtn = document.getElementById('arm-home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (j1Slider) j1Slider.value = 0;
        if (j2Slider) j2Slider.value = 45;
        if (j3Slider) j3Slider.value = -45;
        if (j4Slider) j4Slider.value = 30;
        updateAnglesFromSliders();
      });
    }

    let isWaving = false;
    let waveTime = 0;
    const waveBtn = document.getElementById('arm-wave-btn');
    if (waveBtn) {
      waveBtn.addEventListener('click', () => {
        isWaving = !isWaving;
        waveBtn.textContent = isWaving ? 'Halt Trajectory' : 'Run Trajectory';
      });
    }

    // Drag to orbit scene
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    container.addEventListener('mousedown', e => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      scene.rotation.y += dx * 0.008;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    function animate() {
      requestAnimationFrame(animate);
      if (isWaving) {
        waveTime += 0.03;
        if (j1Slider) j1Slider.value = Math.sin(waveTime) * 60;
        if (j2Slider) j2Slider.value = 30 + Math.cos(waveTime * 0.8) * 25;
        if (j3Slider) j3Slider.value = -35 + Math.sin(waveTime * 1.2) * 20;
        updateAnglesFromSliders();
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // 3. Workspace: Attention Matrix & Token Heatmaps
  function initAttentionWorkspace() {
    const tokens = [
      "The", "transformer", "neural", "architecture", "computes",
      "multi", "head", "self", "attention", "over",
      "input", "token", "sequences", "with", "deep", "reasoning"
    ];

    const tokensXContainer = document.getElementById('matrix-tokens-x');
    const tokensYContainer = document.getElementById('matrix-tokens-y');
    const cellsGrid = document.getElementById('matrix-cells-grid');

    if (!tokensXContainer || !tokensYContainer || !cellsGrid) return;

    tokensXContainer.innerHTML = '';
    tokensYContainer.innerHTML = '';
    cellsGrid.innerHTML = '';

    // Populate Column Headers (X)
    tokens.forEach((tok) => {
      const el = document.createElement('div');
      el.className = 'token-label-x';
      el.textContent = tok;
      tokensXContainer.appendChild(el);
    });

    // Populate Row Headers (Y)
    tokens.forEach((tok) => {
      const el = document.createElement('div');
      el.className = 'token-label-y';
      el.textContent = tok;
      tokensYContainer.appendChild(el);
    });

    // Seed pseudo attention weights per head
    let activeHead = 7;
    function renderHeatmap(headIndex) {
      cellsGrid.innerHTML = '';
      for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
          const cell = document.createElement('div');
          cell.className = 'matrix-cell';

          // Causal mask: cannot attend to future tokens
          let weight = 0;
          if (col <= row) {
            // Pseudo induction pattern: strong diagonal and semantic pairs
            const diff = row - col;
            const seed = (row * 17 + col * 23 + headIndex * 37) % 100 / 100;
            if (diff === 0) weight = 0.35 + seed * 0.3;
            else if (diff === 1) weight = 0.20 + seed * 0.2;
            else if (row === 15 && col === 3) weight = 0.84; // "reasoning" -> "architecture"
            else weight = Math.pow(seed, 2) * 0.25;
          }

          // Grayscale luminance based on attention weight
          const lum = Math.floor(weight * 255);
          cell.style.backgroundColor = `rgb(${lum}, ${lum}, ${lum})`;
          cell.dataset.q = tokens[row];
          cell.dataset.k = tokens[col];
          cell.dataset.weight = weight.toFixed(4);

          cell.addEventListener('mouseenter', () => {
            document.querySelectorAll('.matrix-cell').forEach(c => c.classList.remove('active-cell'));
            cell.classList.add('active-cell');

            const qEl = document.getElementById('inspect-q-token');
            const kEl = document.getElementById('inspect-k-token');
            const wEl = document.getElementById('inspect-weight');
            if (qEl) qEl.textContent = `"${cell.dataset.q}"`;
            if (kEl) kEl.textContent = `"${cell.dataset.k}"`;
            if (wEl) wEl.textContent = cell.dataset.weight;
          });

          cellsGrid.appendChild(cell);
        }
      }
    }

    renderHeatmap(activeHead);

    const prevBtn = document.getElementById('btn-head-prev');
    const nextBtn = document.getElementById('btn-head-next');
    const headSelect = document.getElementById('attn-head-select');

    if (headSelect) {
      headSelect.addEventListener('change', e => {
        activeHead = parseInt(e.target.value);
        renderHeatmap(activeHead);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeHead = (activeHead - 1 + 32) % 32;
        renderHeatmap(activeHead);
        if (headSelect) headSelect.value = String(activeHead);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeHead = (activeHead + 1) % 32;
        renderHeatmap(activeHead);
        if (headSelect) headSelect.value = String(activeHead);
      });
    }
  }

  // 4. Workspace: 3D Loss Surfaces & Telemetry (Three.js)
  function initLossSurfaceWorkspace() {
    const canvas = document.getElementById('surface-canvas');
    const container = document.getElementById('surface-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(40, 30, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Parametric 3D Loss Surface (Rastrigin & Saddle composite)
    const gridSize = 48;
    const geometry = new THREE.PlaneGeometry(36, 36, gridSize, gridSize);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Loss equation L(x, z)
      const r2 = (x * x + z * z) * 0.03;
      const y = (Math.cos(x * 0.6) + Math.cos(z * 0.6)) * 2.2 + r2 * 2.5 - 6;
      pos.setY(i, y);
    }
    geometry.computeVertexNormals();

    const wireMat = new THREE.MeshBasicMaterial({ color: 0x4a4a4a, wireframe: true });
    const surfaceMesh = new THREE.Mesh(geometry, wireMat);
    scene.add(surfaceMesh);

    // Optimization Parameter Ball θ
    const ballGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.position.set(12, 4, 10);
    scene.add(ballMesh);

    // Trajectory Line
    const trailPoints = [ballMesh.position.clone()];
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({ color: 0xcccccc });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trailLine);

    // Descent step simulation
    let currentStep = 124500;
    let currentLoss = 0.2418;

    function stepDescent() {
      const curX = ballMesh.position.x;
      const curZ = ballMesh.position.z;

      // Gradient direction towards local minimum (0, 0)
      const gradX = curX * 0.15 + (Math.sin(curX * 0.6) * 1.2);
      const gradZ = curZ * 0.15 + (Math.sin(curZ * 0.6) * 1.2);

      const lr = 0.08;
      const newX = curX - gradX * lr + (Math.random() - 0.5) * 0.1;
      const newZ = curZ - gradZ * lr + (Math.random() - 0.5) * 0.1;
      const r2 = (newX * newX + newZ * newZ) * 0.03;
      const newY = (Math.cos(newX * 0.6) + Math.cos(newZ * 0.6)) * 2.2 + r2 * 2.5 - 6 + 0.9;

      ballMesh.position.set(newX, newY, newZ);
      trailPoints.push(ballMesh.position.clone());
      trailLine.geometry.setFromPoints(trailPoints);

      currentStep += 100;
      currentLoss = Math.max(0.012, currentLoss * 0.985);

      const stepEl = document.getElementById('train-stat-step');
      const lossEl = document.getElementById('train-stat-loss');
      if (stepEl) stepEl.textContent = currentStep.toLocaleString();
      if (lossEl) lossEl.textContent = currentLoss.toFixed(4);
    }

    const stepBtn = document.getElementById('surface-step-btn');
    if (stepBtn) {
      stepBtn.addEventListener('click', stepDescent);
    }

    const resetBtn = document.getElementById('surface-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        ballMesh.position.set(12, 4, 10);
        trailPoints.length = 0;
        trailPoints.push(ballMesh.position.clone());
        trailLine.geometry.setFromPoints(trailPoints);
        currentLoss = 0.2418;
        currentStep = 124500;
      });
    }

    // Drag to rotate landscape
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    container.addEventListener('mousedown', e => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      surfaceMesh.rotation.y += dx * 0.007;
      ballMesh.rotation.y += dx * 0.007;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    function animate() {
      requestAnimationFrame(animate);
      surfaceMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  // Initialize all interactive ML/Robotics workbenches once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    initLatentWorkspace();
    initRoboticsWorkspace();
    initAttentionWorkspace();
    initLossSurfaceWorkspace();
  });

  // ── Collapsible Desktop Sidebar ──────────────────────────────
  const shell = document.querySelector('.shell');
  const collapseBtns = document.querySelectorAll('[data-action="toggle-sidebar"]');

  function applySidebarState(isCollapsed) {
    if (isCollapsed) {
      shell.classList.add('sidebar-collapsed');
      localStorage.setItem('sidebar-collapsed', 'true');
    } else {
      shell.classList.remove('sidebar-collapsed');
      localStorage.setItem('sidebar-collapsed', 'false');
    }
  }

  function toggleSidebar() {
    const isCurrentlyCollapsed = shell.classList.contains('sidebar-collapsed');
    applySidebarState(!isCurrentlyCollapsed);
  }

  collapseBtns.forEach(btn => {
    btn.addEventListener('click', toggleSidebar);
  });

  // Load saved state (default is expanded)
  if (localStorage.getItem('sidebar-collapsed') === 'true') {
    applySidebarState(true);
  }

  // Keyboard shortcut: Alt + B or Ctrl + B to fold/unfold sidebar
  window.addEventListener('keydown', e => {
    if ((e.altKey || e.ctrlKey) && e.key.toLowerCase() === 'b' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      toggleSidebar();
    }
  });

})();
