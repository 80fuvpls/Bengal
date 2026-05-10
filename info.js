import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js';

window.addEventListener("load", () => {

  /* =========================================================
     INTRO + HERO
  ========================================================= */

  const intro =
  document.getElementById("intro");

  const introImg =
  document.getElementById("introImg");

  const finalImg =
  document.getElementById("finalImg");

  const ui =
  document.getElementById("ui");

  const heroText =
  document.getElementById("heroText");

  const quote =
  document.getElementById("quote");

  const desc =
  document.getElementById("desc");

  window.scrollTo(0, 0);

  requestAnimationFrame(() => {

  introImg.style.opacity = "1";

  introImg.style.transform =
  "scale(1)";

});

/* =========================================
INTRO APPEAR
========================================= */

requestAnimationFrame(()=>{

  introImg.style.opacity = "1";

  introImg.style.transform =
  "scale(1)";

});

/* =========================================
MOVE TO FINAL POSITION
========================================= */

setTimeout(()=>{

  const start =
  introImg.getBoundingClientRect();

  const end =
  finalImg.getBoundingClientRect();

  const x =
  end.left - start.left;

  const y =
  end.top - start.top;

  introImg.style.transform =

  `
  translate3d(${x}px, ${y}px, 0)
  scale(.96)
  `;

}, 1200);

/* =========================================
REVEAL UI AFTER ARRIVAL
========================================= */

setTimeout(()=>{

  finalImg.style.opacity = "1";

  ui.style.opacity = "1";

  heroText.classList.add(
    "show"
  );

}, 2650);

/* =========================================
REMOVE INTRO
========================================= */

setTimeout(()=>{

  intro.style.opacity = "0";

}, 2900);

setTimeout(()=>{

  intro.style.pointerEvents =
  "none";

}, 3900);

  /* =========================================================
     SECTION 2 REVEAL
  ========================================================= */

  function revealSection2(){

    const trigger =
    window.innerHeight * 0.8;

    if(
      quote.getBoundingClientRect().top
      < trigger
    ){

      quote.classList.add("show");

      setTimeout(() => {

        desc.classList.add("show");

      }, 700);

    }

  }

  window.addEventListener(
    "scroll",
    revealSection2
  );

  /* =========================================================
SPHERE EXPERIENCE
========================================================= */

const canvas =
document.getElementById(
  "sphereCanvas"
);

const sphereMessage =
document.getElementById(
  "sphereMessage"
);

const sphereText =
document.querySelector(
  ".sphere-text"
);

/* =========================================================
SCENE
========================================================= */

const scene =
new THREE.Scene();

const camera =
new THREE.PerspectiveCamera(

  22,

  window.innerWidth /
  window.innerHeight,

  .1,

  1000

);

camera.position.z = 14;

/* =========================================================
RENDERER
========================================================= */

const renderer =
new THREE.WebGLRenderer({

  canvas,

  antialias:true,

  alpha:true

});

renderer.setSize(

  window.innerWidth,
  window.innerHeight

);

renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    1.5
  )

);

renderer.outputColorSpace =
THREE.SRGBColorSpace;
/* =========================================================
GROUP
========================================================= */

const saturnGroup =
new THREE.Group();

scene.add(
  saturnGroup
);

saturnGroup.rotation.x =
-.42;

/* =========================================================
COLOR
========================================================= */

const COLOR =
0xf4f1d8;

/* =========================================================
LINE MATERIAL
========================================================= */

const lineMaterial =
new THREE.LineBasicMaterial({

  color:COLOR,

  transparent:true,

  opacity:.9

});

const faintMaterial =
new THREE.LineBasicMaterial({

  color:COLOR,

  transparent:true,

  opacity:.22

});

/* =========================================================
SPHERE
========================================================= */

const sphereGroup =
new THREE.Group();

saturnGroup.add(
  sphereGroup
);

const RADIUS = 2.4;

/* =========================================================
LATITUDE
========================================================= */

for(let i = -10; i <= 7; i++){

  const y =
  (i / 10) * RADIUS;

  const r =
  Math.sqrt(
    RADIUS * RADIUS -
    y * y
  );

  const points = [];

  for(let j = 0; j <= 100; j++){

    const t =
    (j / 100) *
    Math.PI * 2;

    points.push(

      new THREE.Vector3(

        Math.cos(t) * r,

        y,

        Math.sin(t) * r

      )

    );

  }

  const geometry =
  new THREE.BufferGeometry()
  .setFromPoints(points);

  const line =
  new THREE.Line(
    geometry,
    lineMaterial
  );

  sphereGroup.add(
    line
  );

}

/* =========================================================
LONGITUDE
========================================================= */

for(let i = 0; i < 16; i++){

  const points = [];

  const phi =
  (i / 16) *
  Math.PI * 2;

  for(let j = 0; j <= 100; j++){

    const t =
    (j / 100) *
    Math.PI;

    points.push(

      new THREE.Vector3(

        Math.cos(phi) *
        Math.sin(t) *
        RADIUS,

        Math.cos(t) *
        RADIUS,

        Math.sin(phi) *
        Math.sin(t) *
        RADIUS

      )

    );

  }

  const geometry =
  new THREE.BufferGeometry()
  .setFromPoints(points);

  const line =
  new THREE.Line(
    geometry,
    lineMaterial
  );

  sphereGroup.add(
    line
  );

}

/* =========================================================
SATURN GRID RING
========================================================= */

const ringGroup = new THREE.Group();
saturnGroup.add(ringGroup);

const INNER = 3;
const OUTER = 5;

const RING_SEGMENTS = 180;
const RADIAL_COUNT = 72;

/* =========================================================
RING MATERIAL
========================================================= */

const ringMaterial = new THREE.LineBasicMaterial({

  color: 0xffffe3,
  transparent: true,
  opacity: .72

});

/* =========================================================
CONCENTRIC GRID
========================================================= */

for(let r = INNER; r <= OUTER; r += .22){

  const points = [];

  for(let i = 0; i <= RING_SEGMENTS; i++){

    const t =
    (i / RING_SEGMENTS) *
    Math.PI * 2;

    points.push(

      new THREE.Vector3(

        Math.cos(t) * r,

        0,

        Math.sin(t) * r

      )

    );

  }

  const geometry =
  new THREE.BufferGeometry()
  .setFromPoints(points);

  const line =
  new THREE.Line(
    geometry,
    ringMaterial.clone()
  );

  ringGroup.add(line);

}

/* =========================================================
RADIAL GRID
========================================================= */

for(let i = 0; i < RADIAL_COUNT; i++){

  const t =
  (i / RADIAL_COUNT) *
  Math.PI * 2;

  const points = [

    new THREE.Vector3(

      Math.cos(t) * INNER,
      0,
      Math.sin(t) * INNER

    ),

    new THREE.Vector3(

      Math.cos(t) * OUTER,
      0,
      Math.sin(t) * OUTER

    )

  ];

  const geometry =
  new THREE.BufferGeometry()
  .setFromPoints(points);

  const line =
  new THREE.Line(
    geometry,
    ringMaterial.clone()
  );

  ringGroup.add(line);

}

/* =========================================================
RING ORIENTATION
========================================================= */

ringGroup.rotation.x =
THREE.MathUtils.degToRad(78);

/* =========================================================
DEPTH FEEL
========================================================= */

ringGroup.children.forEach((line, i)=>{

  line.material.opacity =
  .72 + Math.random() * .18;

});

/* =========================================================
MOUSE
========================================================= */

const mouse = {

  x:0,
  y:0

};

window.addEventListener(

  "mousemove",

  e => {

    mouse.x =

      (
        e.clientX /
        window.innerWidth
      ) - .5;

    mouse.y =

      (
        e.clientY /
        window.innerHeight
      ) - .5;

  }

);

/* =========================================================
HOVER
========================================================= */

window.addEventListener(

  "mousemove",

  e => {

    const rect =
    canvas.getBoundingClientRect();

    const cx =
    rect.left +
    rect.width / 2;

    const cy =
    rect.top +
    rect.height / 2;

    const dx =
    e.clientX - cx;

    const dy =
    e.clientY - cy;

    const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

    if(distance < 240){

   window.addEventListener(

  "mousemove",

  e => {

    const rect =
    canvas.getBoundingClientRect();

    const cx =
    rect.left +
    rect.width / 2;

    const cy =
    rect.top +
    rect.height / 2;

    const dx =
    e.clientX - cx;

    const dy =
    e.clientY - cy;

    const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );

    hoveringSphere =
    distance < 220;

    if(hoveringSphere){

      cursorLabel.style.opacity =
      1;

      cursorLabel.style.transform =
      "translate(-50%, -50%) scale(1)";

    }else{

      cursorLabel.style.opacity =
      0;

      cursorLabel.style.transform =
      "translate(-50%, -50%) scale(.85)";

    }

  }

);

    }

  }

);

/* =========================================================
CLICK
========================================================= */

let opened = false;

canvas.addEventListener(

  "click",

  () => {

    opened = !opened;

    if(opened){

      sphereMessage.classList.add(
        "show"
      );

    }else{

      sphereMessage.classList.remove(
        "show"
      );

    }

  }

);

/* =========================================================
ANIMATE
========================================================= */

function animate(){

  requestAnimationFrame(
    animate
  );

  sphereGroup.rotation.y +=
  .0012;


  /* subtle orbital breathing */

  ringGroup.rotation.z =
  Math.sin(Date.now() * .00012) * .03;

  saturnGroup.rotation.y += (

  (
    mouse.x * .55
  )
  -
  saturnGroup.rotation.y

) * .08;

  saturnGroup.rotation.x += (

  (
    -.55 +
    (-mouse.y * .18)
  )
  -
  saturnGroup.rotation.x

) * .08;

  if(opened){
    
    sphereGroup.children.forEach(line=>{

    line.material.opacity +=

    (
      .08 -
      line.material.opacity
    ) * .04;

   });

    ringGroup.children.forEach(line=>{

  if(line.material){

    line.material.opacity +=

      (
        .035 -
        line.material.opacity
      ) * .04;

  }

    });
    camera.position.z +=

      (
        5.8
        -
        camera.position.z
      ) * .04;

    sphereText.style.transform =

    `
    perspective(1600px)
    rotateY(${mouse.x * 9}deg)
    rotateX(${mouse.y * -8}deg)
    scaleX(1.04)
    scaleY(1.08)
    `;

  }else{
    sphereGroup.children.forEach(line=>{

  line.material.opacity +=

    (
      .9 -
      line.material.opacity
    ) * .04;

   });

    ringGroup.children.forEach(line=>{

  if(line.material){

    line.material.opacity +=

      (
        .18 -
        line.material.opacity
      ) * .04;

  }

  });

    camera.position.z +=

      (
        14
        -
        camera.position.z
      ) * .04;

    sphereText.style.transform =

    `
    perspective(1600px)
    rotateY(${mouse.x * 3}deg)
    rotateX(${mouse.y * -2}deg)
    `;

  }

  renderer.render(
    scene,
    camera
  );

}

animate();

/* =========================================================
RESIZE
========================================================= */

window.addEventListener(

  "resize",

  () => {

    camera.aspect =

      window.innerWidth /

      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(

      window.innerWidth,

      window.innerHeight

    );

  }
  
);

const cursorLabel =
document.getElementById(
  "cursorLabel"
);

let hoveringSphere = false;

/* =========================================================
CURSOR FOLLOW
========================================================= */

window.addEventListener(

  "mousemove",

  e => {

    cursorLabel.style.left =
    e.clientX + "px";

    cursorLabel.style.top =
    e.clientY + "px";

  }

);

});