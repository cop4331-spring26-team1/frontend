// js/bubbles.js
(function () {
  console.log("bubbles.js loaded");

  const layer = document.querySelector(".floatBubbles");
  console.log("floatBubbles found:", !!layer);

  if (!layer) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function spawnBubble() {
    const b = document.createElement("div");
    b.className = "bubble";

    const size = rand(10, 34);
    const left = rand(0, 100);
    const dur = rand(4.0, 8.5);
    const delay = rand(0, 0.7);
    const rise = window.innerHeight + rand(80, 260);

    const driftStart = rand(-18, 18) + "px";
    const driftEnd = rand(-90, 90) + "px";

    b.style.width = size + "px";
    b.style.height = size + "px";
    b.style.left = left + "%";
    b.style.setProperty("--dur", dur + "s");
    b.style.setProperty("--delay", delay + "s");
    b.style.setProperty("--rise", rise + "px");
    b.style.setProperty("--xdriftStart", driftStart);
    b.style.setProperty("--xdriftEnd", driftEnd);

    layer.appendChild(b);

    const ttlMs = (dur + delay) * 1000 + 250;
    window.setTimeout(() => b.remove(), ttlMs);
  }

  window.setInterval(() => {
    const count = Math.random() < 0.35 ? 2 : 1;
    for (let i = 0; i < count; i++) spawnBubble();
  }, 420);
})();
