const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const bg_shine = document.getElementById("bg-shine");

var isMoving = false;

let VIEWPORT_WIDTH = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
let VIEWPORT_HEIGHT = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

function init() {
  isMoving = false;
  setMoonCoords(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2);
  bg_shine.style.backgroundImage =
    "radial-gradient(circle at center, white, black 12%)";
}

function getCoords(DOMElement) {
  let rect = DOMElement.getBoundingClientRect();
  return [rect.x, rect.y];
}

function setMoonCoords(x, y) {
  moon.style.left = x + "px";
  moon.style.top = y + "px";
}

function getIntersectArea() {
  let [moonx, moony] = getCoords(moon);
  let [sunx, suny] = getCoords(sun);
  return Math.max(
    0,
    300 - Math.sqrt(Math.pow(moonx - sunx, 2) + Math.pow(moony - suny, 2))
  );
}

function moonListener(ev) {
  if (ev.buttons) {
    isMoving = true;
    setMoonCoords(ev.clientX, ev.clientY);

    let brightness = getIntersectArea();
    bg_shine.style.backgroundImage =
      "radial-gradient(circle at center, white, black " +
      (100 * (300 - brightness + 50)) / 450 +
      "%)";
  }
}

moon.addEventListener("mousedown", moonListener);
moon.addEventListener("mousemove", moonListener);

document.addEventListener("mouseup", (ev) => {
  if (isMoving) init();
});

init();
