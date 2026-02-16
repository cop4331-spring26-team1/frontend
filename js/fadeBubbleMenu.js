// fadebubblesmenu.js
const bubbleMenu = document.querySelector(".bubbleMenu");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY; // how far the page has scrolled
  const fadeStart = 50; // start fading after 50px
  const fadeEnd = 100; // fully invisible after 300px

  let opacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
  if (opacity < 0) opacity = 0;
  if (opacity > 1) opacity = 1;

  bubbleMenu.style.opacity = opacity;
});
