// ===== LOCK SCROLL INTRO =====
document.body.style.overflow = "hidden";

function enterSite(){
  const intro = document.getElementById("intro");

  intro.style.transition = "opacity 0.8s ease";
  intro.style.opacity = "0";

  setTimeout(()=>{
    intro.style.display = "none";
    document.body.style.overflow = "auto";
     triggerHero(); // 👈 THÊM DÒNG NÀY

  },800);
}


// ===== SECTION 2 (FINAL - STABLE HORIZONTAL SLIDER) =====
const items = document.querySelectorAll(".item");
const gallery = document.querySelector(".gallery");

let current = 0;
let isAnimating = false;

// setup ban đầu
function updateSlider(){
  items.forEach((item, index)=>{
    item.className = "item";

    const offset = index - current;

    if(offset === 0){
      item.classList.add("center");
    }
    else if(offset === -1){
      item.classList.add("left");
    }
    else if(offset === 1){
      item.classList.add("right");
    }
    else if(offset === -2){
      item.classList.add("left-2");
    }
    else if(offset === 2){
      item.classList.add("right-2");
    }
    else{
      item.classList.add("hidden");
    }
  });
}

// ===== ARROW CONTROL =====
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

function goLeft(){
  if(isAnimating) return;
  current = Math.max(0, current - 1);
  updateSlider();

  isAnimating = true;
  setTimeout(()=> isAnimating = false, 600);
}

function goRight(){
  if(isAnimating) return;
  current = Math.min(items.length - 1, current + 1);
  updateSlider();

  isAnimating = true;
  setTimeout(()=> isAnimating = false, 600);
}

arrowLeft.addEventListener("click", goLeft);
arrowRight.addEventListener("click", goRight);

// ===== DRAG WITH MOUSE =====
let isDragging = false;
let startX = 0;

gallery.addEventListener("mousedown", (e)=>{
  isDragging = true;
  startX = e.clientX;
});

window.addEventListener("mouseup", ()=>{
  isDragging = false;
});

window.addEventListener("mousemove", (e)=>{
  if(!isDragging || isAnimating) return;

  let diff = e.clientX - startX;

  if(Math.abs(diff) > 80){ // độ nhạy
    if(diff > 0){
      goLeft();
    } else {
      goRight();
    }
    isDragging = false;
  }
});


updateSlider();


// 👇 CORE FIX: chỉ cần nằm trong màn hình là hoạt động
function isInViewport(el){
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}


let scrollAccumulator = 0;
const SCROLL_THRESHOLD = 80; // chỉnh độ nhạy ở đây

window.addEventListener("wheel", (e) => {

  if(!isInViewport(gallery)) return;

  // ❗ CHỈ ƯU TIÊN NGANG
  let delta = e.deltaX;
if(Math.abs(delta) < 2) return;

  // nếu gần như không có scroll ngang → bỏ qua
  if(Math.abs(delta) < 2) return;

  e.preventDefault();

  if(isAnimating) return;

  scrollAccumulator += delta;

  // đủ lực mới chuyển slide
  if(Math.abs(scrollAccumulator) >= SCROLL_THRESHOLD){

    if(scrollAccumulator > 0){
      current++;
    } else {
      current--;
    }

    current = Math.max(0, Math.min(items.length - 1, current));

    updateSlider();

    isAnimating = true;

    setTimeout(()=>{
      isAnimating = false;
    }, 600);

    // reset sau khi đã trigger
    scrollAccumulator = 0;
  }

}, { passive: false });


// ===== INTRO EFFECT =====
const title = document.getElementById("title");

window.addEventListener("mousemove",(e)=>{
  const rect = title.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  title.style.webkitMaskImage = `
    radial-gradient(circle at ${x}% ${y}%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 4%,
    rgba(0,0,0,0) 10%)
  `;

  title.style.maskImage = `
    radial-gradient(circle at ${x}% ${y}%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 8%,
    rgba(0,0,0,0) 20%)
  `;

  const centerY = rect.top + rect.height / 2;
  const dist = Math.abs(e.clientY - centerY);

  let blur = Math.min(dist / 10, 18);
  title.style.filter = `blur(${blur}px)`;
});

const hint = document.getElementById("hint");
window.addEventListener("mousemove",()=>{
  hint.style.opacity = "0";
});

// ===== SECTION 4 TEXT REVEAL =====
const revealText = document.querySelector(".reveal-text");

function revealOnScroll(){
  const rect = revealText.getBoundingClientRect();

  if(rect.top < window.innerHeight * 0.8){
    revealText.classList.add("show");
  }
}

window.addEventListener("scroll", revealOnScroll);

document.addEventListener("DOMContentLoaded", () => {

  const title = document.getElementById("title");
  const intro = document.getElementById("intro");

  // ===== DESKTOP (mousemove) =====
  let started = false;

  intro.addEventListener("mousemove", (e) => {

    const rect = intro.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(!started){
      title.style.transition = "opacity 0.6s ease";
      title.style.opacity = 1;
      started = true;
    }

    title.style.webkitMaskImage = `
      radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 100%)
    `;

  });


  // ===== MOBILE (tap reveal) =====
  if(window.innerWidth < 768){

    intro.addEventListener("touchstart", () => {
      title.style.transition = "opacity 1s ease";
      title.style.opacity = 1;

      title.style.webkitMaskImage = "none"; // 👈 hiện full luôn
    }, { once: true });

  }

});

// ===== HERO ANIMATION =====
function triggerHero(){
  const heroContent = document.querySelector(".hero-content");

  setTimeout(() => {
    heroContent.classList.add("show");
  }, 300);
}

const paragraphs = document.querySelectorAll(".info-text p");

function revealTextOnScroll(){
  paragraphs.forEach((p) => {
    const rect = p.getBoundingClientRect();

    if(rect.top < window.innerHeight * 0.85){
      p.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealTextOnScroll);

const boxes = document.querySelectorAll(".box");

function revealBoxes(){
  boxes.forEach((box, index) => {
    const rect = box.getBoundingClientRect();

    if(rect.top < window.innerHeight * 0.85){
      setTimeout(() => {
        box.classList.add("show");
      }, index * 150); // stagger nhẹ
    }
  });
}

window.addEventListener("scroll", revealBoxes);