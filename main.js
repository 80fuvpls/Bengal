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

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1.5);
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xffffff, 1));

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

  const percent = Math.floor(
    (loadedImages / TOTAL_IMAGES) * 100
  );

  loadPercent.textContent = `${percent}%`;

  if (loadedImages >= TOTAL_IMAGES) {

  // giữ loader thêm để GPU warmup
  setTimeout(() => {
    revealStarted = true;
    // fade UI in trước
    document.querySelector('.ui').style.opacity = 1;

    // rồi mới hide loader
    loaderScreen.classList.add('hide');

  }, 1400);
 }
}

// ===== INIT =====
(async () => {
  await document.fonts.load("800 80px Melodrama");
  await document.fonts.load("100 50px 'Azeret Mono'");

  textRing = createTextRing();
  scene.add(textRing);
})();

// ===== TEXT RING (NEW SYSTEM) =====
let textRing;
let revealStarted = false;

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
    font: "100 50px 'Azeret Mono'"
  });

  group.add(big);
  group.add(small);

  return group;
}


// ===== CORE =====
function createTextBand({ text, radius, height, y, font }) {

  // 🧠 canvas dài
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 4096;
  canvas.height = 128;

 ctx.fillStyle = "#ffffe3";
ctx.font = font;
ctx.textBaseline = "middle";
ctx.textAlign = "left";

// đo text
const metrics = ctx.measureText(text);
const textWidth = metrics.width;

// repeat đúng cách
const repeatCount = Math.ceil(canvas.width / textWidth) + 1;
let repeated = text.repeat(repeatCount);

// vẽ
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillText(repeated, 0, canvas.height / 2);

// texture KHÔNG repeat
const texture = new THREE.CanvasTexture(canvas);
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.repeat.x = 1;
texture.anisotropy = 16;

  // 🎯 dùng cylinder = vòng tròn chuẩn
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    128,
    1,
    true // open ended
  );

const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  opacity: 1,
  side: THREE.DoubleSide,
  depthWrite: false,
  depthTest: true,
  alphaTest: 0.2
});



  const mesh = new THREE.Mesh(geometry, material);
mesh.renderOrder = 10;
  mesh.position.y = y;

  return mesh;
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
    texture.generateMipmaps = false;
texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

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
      side: THREE.FrontSide,
      depthWrite: true,
      depthTest: true
    });

    const mesh = new THREE.Mesh(geo, mat);

    mesh.renderOrder = 0;
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);

    mesh.scale.set(0.6, 0.6, 0.6);

    mesh.userData.fadeIn = true;
    mesh.userData.delay = ((Math.atan2(z, x) + Math.PI) / (2 * Math.PI)) * 2;

    group.add(mesh);

    loadedImages++;
    updateLoader();
  });
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

  if (revealStarted) {
   time += 0.01;
  }

group.children.forEach(mesh => {
  if (mesh.userData.fadeIn) {

    const delay = mesh.userData.delay;

    if (revealStarted && time > delay) {

      const targetScale = 0.6;
      const progress = Math.min(
  (time - delay) * 0.6,
  1
);

      mesh.material.opacity = progress;

      if (progress >= 0.99) {
  mesh.material.transparent = false;
  mesh.material.opacity = 1;
}

     mesh.scale.x += (targetScale - mesh.scale.x) * 0.06;
mesh.scale.y += (targetScale - mesh.scale.y) * 0.06;

mesh.material.opacity = Math.min(progress, 1);
    }
  }
});

  

// ===== TEXT RING =====
if (textRing) {

  const zoomt = (currentZ - Z_IN) / (Z_OUT - Z_IN);

  // quay đúng trục
  textRing.rotation.y += 0.002;

  // tilt cinematic
  textRing.rotation.z = -0.1 - zoomt * 0.15;
  textRing.rotation.x = 0.08 + zoomt * 0.1;

  // fade
  const opacity = Math.min(Math.max((zoomt - 0.2) * 2, 0), 1);

  textRing.children.forEach(mesh => {
    mesh.material.opacity = opacity;
  });

  textRing.visible = zoomt > 0.1;
}

  // ===== BACKGROUND =====
  const bgt = (currentZ - Z_IN) / (Z_OUT - Z_IN);

  if (bgt < 0.25) {
    document.body.style.background = "#000000";
  } else {
    document.body.style.background = `
      radial-gradient(circle at center,
        #000000 0%,
        #000000 20%,
        #680101 55%,
        #282d65 75%,
        #67a9e8 90%,
        #ffffe3 100%
      )
    `;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
let time = 0;
// ===== RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


