// js/bubbles.js
(function () {
  console.log("bubbles.js loaded");

  const layer = document.querySelector(".floatBubbles");
  console.log("floatBubbles found:", !!layer);

  if (!layer) return;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function popBubble(bubble) {
    // Get bubble position and size
    const rect = bubble.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const size = rect.width;
    
    // Add pop class to trigger animation
    bubble.classList.add("bubble-popping");
    
    // Create particle fragments for explosion effect
    const particleCount = 6;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "bubble-particle";
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = size * 0.8;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      const particleSize = size * 0.3;
      
      // Position particle at center, then it will animate outward
      particle.style.left = (centerX - particleSize / 2) + "px";
      particle.style.top = (centerY - particleSize / 2) + "px";
      particle.style.setProperty("--endX", endX + "px");
      particle.style.setProperty("--endY", endY + "px");
      particle.style.width = particleSize + "px";
      particle.style.height = particleSize + "px";
      
      layer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 300);
    }
    
    // Remove bubble after animation completes
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, 300);
  }

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

    // Add hover event listener for easter egg
    b.addEventListener("mouseenter", () => popBubble(b));
    b.style.cursor = "pointer";

    layer.appendChild(b);

    const ttlMs = (dur + delay) * 1000 + 250;
    window.setTimeout(() => {
      if (b.parentNode) {
        b.remove();
      }
    }, ttlMs);
  }

  window.setInterval(() => {
    const count = Math.random() < 0.35 ? 2 : 1;
    for (let i = 0; i < count; i++) spawnBubble();
  }, 420);
})();
