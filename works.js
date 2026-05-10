const projects = [
  {
    title: "SỐNG",
    image: "./assets/images/song/preview.jpg",
    link: "song.html"
  },
  {
    title: "HEROES OR VILLAINS",
    image: "./assets/images/hov/preview.jpg",
    link: "hov.html"
  },
  {
    title: "VỌNG",
    image: "./assets/images/vong/preview.jpg",
    link: "vong.html"
  },
  {
    title: "KHÁC BIỆT",
    image: "./assets/images/log/preview.jpg",
    link: "khacbiet.html"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  intro();
  setup();
});

function setup() {
  const stack = document.getElementById("stack");
  const leftText = document.getElementById("leftText");

  projects.forEach(p => {
    const el = document.createElement("a");
    el.className = "card";
    el.href = p.link;

    el.innerHTML = `
      <img src="${p.image}">
      <div class="view">VIEW</div>
    `;

    stack.appendChild(el);
  });

  const cards = document.querySelectorAll(".card");

  let current = 0;
let target = 0;

window.addEventListener("scroll", () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const progress = window.scrollY / max;

  target = progress * (projects.length - 1);
});

function animate() {
  current += (target - current) * 0.08; // 🔥 độ mượt (0.05 = chậm hơn, 0.12 = nhanh hơn)

  update(Math.round(current));

  requestAnimationFrame(animate);
}

animate();

  function update(i) {
    cards.forEach((c, idx) => {
      c.className = "card";

      if (idx === i) c.classList.add("active");
      else if (idx === i + 1) c.classList.add("next1");
      else if (idx === i + 2) c.classList.add("next2");
      else if (idx === i - 1) c.classList.add("prev");
    });

    leftText.innerText = projects[i].title;
  }

  update(0);
}

function intro() {
  const text = document.getElementById("bengal");
  const intro = document.querySelector(".intro");

  setTimeout(() => text.style.opacity = 1, 200);
  setTimeout(() => {
  intro.style.transform = "translateY(-100%)";
  intro.style.pointerEvents = "none"; // 👈 chặn nó intercept chuột
}, 2000);
}