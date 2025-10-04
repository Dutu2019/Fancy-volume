const container = document.getElementById("container");
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const bg_shine = document.getElementById("bg-shine");
const counter = document.getElementById("counter");

let VIEWPORT_WIDTH = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
let VIEWPORT_HEIGHT = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

const BG_COLOR_BEGIN = "#1D92D4";
const MOON_COLOR_BEGIN = "#1881be";
const BG_COLOR_END = "#3D1634";
const MOON_COLOR_END = "#101b24";

const BG_COLOR_BEGIN_RGB = hexToRgb(BG_COLOR_BEGIN);
const MOON_COLOR_BEGIN_RGB = hexToRgb(MOON_COLOR_BEGIN);
const BG_COLOR_END_RGB = hexToRgb(BG_COLOR_END);
const MOON_COLOR_END_RGB = hexToRgb(MOON_COLOR_END);

function init() {
  setMoonCoords(VIEWPORT_WIDTH / 2, VIEWPORT_HEIGHT / 2);
  container.style.backgroundColor = BG_COLOR_END;
  moon.style.backgroundColor = MOON_COLOR_END;
  bg_shine.style.backgroundImage =
    "radial-gradient(circle at center, white, #00000000 180px)";
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
    Math.sqrt(Math.pow(moonx - sunx, 2) + Math.pow(moony - suny, 2)) - 3
  );
}

function moonListener(ev) {
  if (ev.buttons) {
    setMoonCoords(ev.clientX, ev.clientY);

    let brightness = getIntersectArea();
    counter.innerText = `${mapRange(brightness, 0, 300, 0, 100)}%`;
    bg_shine.style.backgroundImage = `radial-gradient(circle at center, white, #00000000 ${mapRange(
      brightness,
      0,
      300,
      180,
      800
    )}px)`;

    container.style.backgroundColor = `#${mapRangeHex(
      brightness,
      0,
      300,
      BG_COLOR_END_RGB[0],
      BG_COLOR_BEGIN_RGB[0]
    )}${mapRangeHex(
      brightness,
      0,
      300,
      BG_COLOR_END_RGB[1],
      BG_COLOR_BEGIN_RGB[1]
    )}${mapRangeHex(
      brightness,
      0,
      300,
      BG_COLOR_END_RGB[2],
      BG_COLOR_BEGIN_RGB[2]
    )}`;
    moon.style.backgroundColor = `#${mapRangeHex(
      brightness,
      0,
      300,
      MOON_COLOR_END_RGB[0],
      MOON_COLOR_BEGIN_RGB[0]
    )}${mapRangeHex(
      brightness,
      0,
      300,
      MOON_COLOR_END_RGB[1],
      MOON_COLOR_BEGIN_RGB[1]
    )}${mapRangeHex(
      brightness,
      0,
      300,
      MOON_COLOR_END_RGB[2],
      MOON_COLOR_BEGIN_RGB[2]
    )}`;
  }
}

moon.addEventListener("mousedown", moonListener);
moon.addEventListener("mousemove", moonListener);

init();

// Helper funcs
function mapRangeHex(value, fromMin, fromMax, toMin, toMax) {
  if (fromMin === fromMax) return toMin;

  const clampedValue = Math.max(fromMin, Math.min(fromMax, value));

  const ratio = (clampedValue - fromMin) / (fromMax - fromMin);
  return Math.round(toMin + ratio * (toMax - toMin)).toString(16);
}

function mapRange(value, fromMin, fromMax, toMin, toMax) {
  if (fromMin === fromMax) return toMin;

  const clampedValue = Math.max(fromMin, Math.min(fromMax, value));

  const ratio = (clampedValue - fromMin) / (fromMax - fromMin);
  return Math.round(toMin + ratio * (toMax - toMin));
}

function hexToRgb(hex) {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse each pair of hex digits
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return [r, g, b];
}
