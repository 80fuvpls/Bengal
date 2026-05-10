import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';

// ===== SETUP =====
const canvas = document.getElementById('scene');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 1.2);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});

// 🔥 FIX: giảm lag mạnh trên production
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xffffff, 1));

// ===== GLOBAL STATE FIX =====
let textRing = null;
let time = 0;
let revealStarted = false;

// ===== DATA =====
const TOTAL = 100;
const RADIUS = 3.2;

const group = new THREE.Group();
scene.add(group);

const loader = new THREE.TextureLoader();

// ===== LOADER UI =====
const loaderScreen = document.getElementById('loader');
const loadPercent = document.getElementById('loadPercent');

let loadedImages = 0;
const TOTAL_IMAGES = TOTAL;

function updateLoader() {
  const percent = Math.floor((loadedImages / TOTAL_IMAGES) * 100);
  loadPercent.textContent = `${percent}%`;

  if (loadedImages >= TOTAL_IMAGES && !revealStarted) {
    setTimeout(() => {
      revealStarted = true;

      document.querySelector('.ui').style.opacity = 1;
      loaderScreen.classList.add('hide');
    }, 1200);
  }
}

// ===== FONT LOAD (FIX: tránh treo loader) =====
(async () => {
  try {
    await Promise.race([
      document.fonts.load("800 80px Melodrama"),
      new Promise(res => setTimeout(res, 3000))
    ]);

    await Promise.race([
      document.fonts.load("100 50px Azeret Mono"),
      new Promise(res => setTimeout(res, 3000))
    ]);

    textRing = createTextRing();
    scene.add(textRing);

  } catch (e) {
    console.log("font load fail:", e);
  }
})();

// ===== TEXT RING =====
function createTextRing() {
  const group = new THREE.Group();

  const big = createTextBand({
    text: "FREEDOM IS THE OXYGEN OF THE SOUL ✦ ",
    radius: 4.5,
    height: 0.5,
    y: 0.4,
    font: "700 80px Melodrama"
  });

  const small = createTextBand({
    text: "ONLY DEAD FISH FOLLOW THE STREAM ✦ ",
    radius: 4.5,
    height: 0.3,
    y: -0.4,
    font: "100 50px Azeret Mono"
  });

  group.add(big);
  group.add(small);

  return group;
}

// ===== TEXT BAND =====
function createTextBand({ text, radius, height, y, font }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 4096;
  canvas.height = 128;

  ctx.fillStyle = "#ffffe3";
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;

  const repeatCount = Math.ceil(canvas.width / textWidth) + 2;
  const repeated = text.repeat(repeatCount);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(repeated, 0, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;

  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    128,
    1,
    true
  );

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    alphaTest: 0.2
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = y;

  return mesh;
}

// ===== SAFE INCREMENT (FIX LOADER BUG) =====
function incrementLoad() {
  loadedImages++;
  updateLoader();
}

// ===== CREATE SPHERE =====
for (let i = 0; i < TOTAL; i++) {

  const phi = Math.acos(1 - 2 * (i + 0.5) / TOTAL);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;

  const x = RADIUS * Math.sin(phi) * Math.cos(theta);
  const y = RADIUS * Math.cos(phi);
  const z = RADIUS * Math.sin(phi) * Math.sin(theta);

  loader.load(
    `assets/images/${i + 1}.jpg`,

    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const img = texture.image;
      const aspect = img.width / img.height;

      const base = 1.2;
      const width = aspect >= 1 ? base : base * aspect;
      const height = aspect >= 1 ? base / aspect : base;

      const geo = new THREE.PlaneGeometry(width, height);

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: true
      });

      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);

      mesh.scale.set(0.6, 0.6, 0.6);

      mesh.userData.fadeIn = true;
      mesh.userData.delay = ((Math.atan2(z, x) + Math.PI) / (2 * Math.PI)) * 2;

      group.add(mesh);

      incrementLoad();
    },

    undefined,

    (err) => {
      console.log("❌ IMAGE FAIL:", i + 1, err);
      incrementLoad();
    }
  );
}

// ===== DRAG =====
let isDragging = false;
let prev = { x: 0, y: 0 };

let rotation = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
  isDragging = true;
  prev.x = e.clientX;
  prev.y = e.clientY;
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const dx = e.clientX - prev.x;
  const dy = e.clientY - prev.y;

  targetRotation.y += dx * 0.005;
  targetRotation.x += dy * 0.005;

  prev.x = e.clientX;
  prev.y = e.clientY;
});

// ===== ZOOM =====
let currentZ = 1.2;
let targetZ = 1.2;

let currentFov = 75;
let targetFov = 75;

const Z_IN = 1.2;
const Z_OUT = 7;

const FOV_IN = 75;
const FOV_OUT = 60;

window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    targetZ = Z_OUT;
    targetFov = FOV_OUT;
  } else {
    targetZ = Z_IN;
    targetFov = FOV_IN;

    targetRotation.x = 0;
    targetRotation.y = 0;
  }
});

// ===== ANIMATE =====
function animate() {

  currentZ += (targetZ - currentZ) * 0.06;
  camera.position.z = currentZ;

  currentFov += (targetFov - currentFov) * 0.06;
  camera.fov = currentFov;
  camera.updateProjectionMatrix();

  rotation.x += (targetRotation.x - rotation.x) * 0.08;
  rotation.y += (targetRotation.y - rotation.y) * 0.08;

  group.rotation.x = rotation.x;
  group.rotation.y = rotation.y;

  camera.lookAt(0, 0, 0);

  if (revealStarted) time += 0.01;

  group.children.forEach(mesh => {
    if (!mesh.userData.fadeIn) return;

    const delay = mesh.userData.delay;

    if (revealStarted && time > delay) {

      const progress = Math.min((time - delay) * 0.6, 1);

      mesh.material.opacity = progress;

      if (progress >= 0.99) {
        mesh.material.opacity = 1;
      }

      mesh.scale.x += (0.6 - mesh.scale.x) * 0.06;
      mesh.scale.y += (0.6 - mesh.scale.y) * 0.06;
    }
  });

  if (textRing) {
    const zoomt = (currentZ - Z_IN) / (Z_OUT - Z_IN);

    textRing.rotation.y += 0.002;
    textRing.rotation.z = -0.1 - zoomt * 0.15;
    textRing.rotation.x = 0.08 + zoomt * 0.1;

    const opacity = Math.min(Math.max((zoomt - 0.2) * 2, 0), 1);

    textRing.children.forEach(mesh => {
      mesh.material.opacity = opacity;
    });

    textRing.visible = zoomt > 0.1;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// ===== RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});