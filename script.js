"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";

const stage = document.getElementById("puzzleStage");
const advanceControl = document.getElementById("advanceControl");
const restartButton = document.getElementById("restartButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const statusText = document.getElementById("puzzleStatus");
const pieceArea = document.getElementById("pieceArea");
const matScene = document.getElementById("matScene");
const matShadow = document.getElementById("matShadow");
const puzzleMat = document.getElementById("puzzleMat");
const matRoll = document.getElementById("matRoll");
const memoryMorph = document.getElementById("memoryMorph");
const morphShell = document.getElementById("morphShell");
const morphPath = document.getElementById("morphPath");
const morphDepth = document.getElementById("morphDepth");
const morphEdge = document.getElementById("morphEdge");
const morphFullImage = document.getElementById("morphFullImage");
const morphCropImage = document.getElementById("morphCropImage");
const assemblyBoard = document.getElementById("assemblyBoard");
const finalBoard = document.getElementById("finalBoard");
const snapFlash = document.getElementById("snapFlash");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function round(value) {
  return Number(value.toFixed(2));
}

function pathForBox(x1, y1, x2, y2, edges = {}) {
  const width = x2 - x1;
  const height = y2 - y1;
  const top = edges.top || 0;
  const right = edges.right || 0;
  const bottom = edges.bottom || 0;
  const left = edges.left || 0;
  const depth = Math.min(width, height) * 0.16;

  const x35 = x1 + width * 0.35;
  const x43 = x1 + width * 0.43;
  const x57 = x1 + width * 0.57;
  const x65 = x1 + width * 0.65;
  const y35 = y1 + height * 0.35;
  const y43 = y1 + height * 0.43;
  const y57 = y1 + height * 0.57;
  const y65 = y1 + height * 0.65;
  const topBump = y1 - top * depth;
  const rightBump = x2 + right * depth;
  const bottomBump = y2 + bottom * depth;
  const leftBump = x1 - left * depth;
  const p = round;

  return [
    `M${p(x1)} ${p(y1)}`,
    `C${p(x1 + width * 0.12)} ${p(y1)} ${p(x1 + width * 0.24)} ${p(y1)} ${p(x35)} ${p(y1)}`,
    `C${p(x1 + width * 0.37)} ${p(y1)} ${p(x1 + width * 0.38)} ${p(topBump)} ${p(x43)} ${p(topBump)}`,
    `C${p(x1 + width * 0.47)} ${p(topBump)} ${p(x1 + width * 0.53)} ${p(topBump)} ${p(x57)} ${p(topBump)}`,
    `C${p(x1 + width * 0.62)} ${p(topBump)} ${p(x1 + width * 0.63)} ${p(y1)} ${p(x65)} ${p(y1)}`,
    `C${p(x1 + width * 0.76)} ${p(y1)} ${p(x1 + width * 0.88)} ${p(y1)} ${p(x2)} ${p(y1)}`,

    `C${p(x2)} ${p(y1 + height * 0.12)} ${p(x2)} ${p(y1 + height * 0.24)} ${p(x2)} ${p(y35)}`,
    `C${p(x2)} ${p(y1 + height * 0.37)} ${p(rightBump)} ${p(y1 + height * 0.38)} ${p(rightBump)} ${p(y43)}`,
    `C${p(rightBump)} ${p(y1 + height * 0.47)} ${p(rightBump)} ${p(y1 + height * 0.53)} ${p(rightBump)} ${p(y57)}`,
    `C${p(rightBump)} ${p(y1 + height * 0.62)} ${p(x2)} ${p(y1 + height * 0.63)} ${p(x2)} ${p(y65)}`,
    `C${p(x2)} ${p(y1 + height * 0.76)} ${p(x2)} ${p(y1 + height * 0.88)} ${p(x2)} ${p(y2)}`,

    `C${p(x2 - width * 0.12)} ${p(y2)} ${p(x2 - width * 0.24)} ${p(y2)} ${p(x65)} ${p(y2)}`,
    `C${p(x2 - width * 0.37)} ${p(y2)} ${p(x2 - width * 0.38)} ${p(bottomBump)} ${p(x57)} ${p(bottomBump)}`,
    `C${p(x2 - width * 0.47)} ${p(bottomBump)} ${p(x2 - width * 0.53)} ${p(bottomBump)} ${p(x43)} ${p(bottomBump)}`,
    `C${p(x2 - width * 0.62)} ${p(bottomBump)} ${p(x2 - width * 0.63)} ${p(y2)} ${p(x35)} ${p(y2)}`,
    `C${p(x2 - width * 0.76)} ${p(y2)} ${p(x2 - width * 0.88)} ${p(y2)} ${p(x1)} ${p(y2)}`,

    `C${p(x1)} ${p(y2 - height * 0.12)} ${p(x1)} ${p(y2 - height * 0.24)} ${p(x1)} ${p(y65)}`,
    `C${p(x1)} ${p(y2 - height * 0.37)} ${p(leftBump)} ${p(y2 - height * 0.38)} ${p(leftBump)} ${p(y57)}`,
    `C${p(leftBump)} ${p(y2 - height * 0.47)} ${p(leftBump)} ${p(y2 - height * 0.53)} ${p(leftBump)} ${p(y43)}`,
    `C${p(leftBump)} ${p(y2 - height * 0.62)} ${p(x1)} ${p(y2 - height * 0.63)} ${p(x1)} ${p(y35)}`,
    `C${p(x1)} ${p(y2 - height * 0.76)} ${p(x1)} ${p(y2 - height * 0.88)} ${p(x1)} ${p(y1)}Z`
  ].join(" ");
}

const photoRatios = new Map([
  [1, 9 / 16],
  [2, 9 / 16],
  [3, 9 / 16],
  [4, 9 / 16],
  [5, 16 / 9],
  [6, 9 / 16]
]);

const boardSeams = {
  top: "M480 55V74C480 86 450 78 450 105C450 132 480 124 480 136V145",
  right: "M598 270H746C758 270 748 238 783 238C818 238 808 270 820 270H910",
  bottom: "M480 395V404C480 416 510 408 510 435C510 462 480 454 480 466V485",
  left: "M362 270H214C202 270 212 238 177 238C142 238 152 270 140 270H50",
  center: "M480 145C466 145 468 116 436 116C370 116 322 164 308 220C303 239 317 253 336 245C352 239 362 248 362 270C362 292 352 301 336 295C317 287 303 301 308 320C322 376 370 424 436 424C468 424 466 395 480 395C494 395 492 424 524 424C590 424 638 376 652 320C657 301 643 287 624 295C608 301 598 292 598 270C598 248 608 239 624 245C643 253 657 239 652 220C638 164 590 116 524 116C492 116 494 145 480 145Z"
};

const boardPaths = {
  7: "M50 55H185C197 55 187 15 225 15C263 15 253 55 265 55H480V74C480 86 450 78 450 105C450 132 480 124 480 136V145C466 145 468 116 436 116C370 116 322 164 308 220C303 239 317 253 336 245C352 239 362 248 362 270H214C202 270 212 238 177 238C142 238 152 270 140 270H50V205C50 193 10 203 10 165C10 127 50 137 50 125V55Z",
  8: "M480 55H690C702 55 692 95 730 95C768 95 758 55 770 55H910V125C910 137 950 127 950 165C950 203 910 193 910 205V270H820C808 270 818 238 783 238C748 238 758 270 746 270H598C598 248 608 239 624 245C643 253 657 239 652 220C638 164 590 116 524 116C492 116 494 145 480 145V136C480 124 450 132 450 105C450 78 480 86 480 74V55Z",
  9: "M50 270H140C152 270 142 238 177 238C212 238 202 270 214 270H362C362 292 352 301 336 295C317 287 303 301 308 320C322 376 370 424 436 424C468 424 466 395 480 395V404C480 416 510 408 510 435C510 462 480 454 480 466V485H265C253 485 263 525 225 525C187 525 197 485 185 485H50V415C50 403 10 413 10 375C10 337 50 347 50 335V270Z",
  6: "M598 270H746C758 270 748 238 783 238C818 238 808 270 820 270H910V335C910 347 950 337 950 375C950 413 910 403 910 415V485H770C758 485 768 525 730 525C692 525 702 485 690 485H480V466C480 454 510 462 510 435C510 408 480 416 480 404V395C494 395 492 424 524 424C590 424 638 376 652 320C657 301 643 287 624 295C608 301 598 292 598 270Z",
  10: boardSeams.center
};

const finalOuterPath = "M50 55H185C197 55 187 15 225 15C263 15 253 55 265 55H480H690C702 55 692 95 730 95C768 95 758 55 770 55H910V125C910 137 950 127 950 165C950 203 910 193 910 205V335C910 347 950 337 950 375C950 413 910 403 910 415V485H770C758 485 768 525 730 525C692 525 702 485 690 485H480H265C253 485 263 525 225 525C187 525 197 485 185 485H50V415C50 403 10 413 10 375C10 337 50 347 50 335V205C50 193 10 203 10 165C10 127 50 137 50 125V55Z";

const boardAssignments = [
  { number: 7, path: boardPaths[7], viewBox: "0 0 520 320", imageBox: { x: 0, y: 0, width: 520, height: 320 } },
  { number: 8, path: boardPaths[8], viewBox: "440 0 520 320", imageBox: { x: 440, y: 0, width: 520, height: 320 } },
  { number: 9, path: boardPaths[9], viewBox: "0 220 520 320", imageBox: { x: 0, y: 220, width: 520, height: 320 } },
  { number: 6, path: boardPaths[6], viewBox: "440 220 520 320", imageBox: { x: 440, y: 220, width: 520, height: 320 } },
  { number: 10, path: boardPaths[10], viewBox: "290 105 380 330", imageBox: { x: 290, y: 105, width: 380, height: 330 } }
];

const shapePaths = {
  1: pathForBox(50, 50, 350, 350, { right: 1, bottom: -1 }),
  2: pathForBox(50, 50, 350, 350, { top: 1, right: -1, left: -1 }),
  3: pathForBox(50, 50, 350, 350, { right: -1, bottom: 1, left: -1 }),
  4: pathForBox(50, 50, 350, 350, { top: -1, right: 1, left: 1 }),
  5: pathForBox(50, 50, 350, 350, { bottom: -1, left: 1 }),
  6: pathForBox(50, 50, 350, 350, { top: 1, left: -1 }),
  7: boardPaths[7],
  8: boardPaths[8],
  9: boardPaths[9],
  12: boardPaths[6]
};

const pieceDefinitions = [
  { number: 1, x: "18%", y: "29%", w: "17%", h: "30.22%", rotation: "-7deg", z: 6, viewBox: "0 0 400 400", imageNumber: 1, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 2, x: "29%", y: "70%", w: "17%", h: "30.22%", rotation: "6deg", z: 5, viewBox: "0 0 400 400", imageNumber: 2, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 3, x: "44%", y: "28%", w: "17%", h: "30.22%", rotation: "4deg", z: 4, viewBox: "0 0 400 400", imageNumber: 3, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 4, x: "84%", y: "72%", w: "15%", h: "26.67%", rotation: "-5deg", z: 9, viewBox: "0 0 400 400", imageNumber: 4, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 5, x: "75%", y: "29%", w: "17%", h: "30.22%", rotation: "7deg", z: 3, viewBox: "0 0 400 400", imageNumber: 5, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 6, x: "57%", y: "72%", w: "17%", h: "30.22%", rotation: "-6deg", z: 8, viewBox: "0 0 400 400", imageNumber: 6, imageBox: { x: 0, y: 0, width: 400, height: 400 } },
  { number: 7, x: "26%", y: "49%", w: "28%", h: "30.63%", rotation: "-2deg", z: 12, viewBox: "0 0 520 320", imageNumber: 7, imageBox: { x: 0, y: 0, width: 520, height: 320 } },
  { number: 8, x: "48%", y: "31%", w: "27%", h: "29.53%", rotation: "2deg", z: 13, viewBox: "440 0 520 320", imageNumber: 8, imageBox: { x: 440, y: 0, width: 520, height: 320 } },
  { number: 9, x: "74%", y: "35%", w: "27%", h: "29.53%", rotation: "-2deg", z: 14, viewBox: "0 220 520 320", imageNumber: 9, imageBox: { x: 0, y: 220, width: 520, height: 320 } },
  { number: 12, x: "62%", y: "70%", w: "27%", h: "29.53%", rotation: "-1deg", z: 15, viewBox: "440 220 520 320", imageNumber: 6, imageBox: { x: 440, y: 220, width: 520, height: 320 } }
];

const stepLabels = [
  "Unroll the puzzle mat and place the Mom memory",
  "Show the Dad memory",
  "Show the farm memory",
  "Show the tasting memory",
  "Show the friends memory",
  "Show the championship memory",
  "Join the first two puzzle pieces",
  "Grow the farm puzzle piece",
  "Grow the friends puzzle piece",
  "Transform the championship piece and assemble the four outer pieces",
  "Complete the puzzle with the center piece",
  "Reveal the final photograph"
];

const completionMessages = [
  "Puzzle mat unrolled and Mom memory placed",
  "Dad memory placed",
  "Farm memory placed",
  "Tasting memory placed",
  "Friends memory placed",
  "Championship memory placed",
  "The first two pieces joined and changed",
  "The farm piece grew and changed",
  "The friends piece grew and changed",
  "The championship piece changed and all four outer pieces assembled",
  "The center piece completed the puzzle",
  "The final photograph is displayed as a puzzle"
];

function buildLoosePieces() {
  pieceArea.innerHTML = pieceDefinitions.map((definition) => {
    const number = definition.number;
    const imageNumber = definition.imageNumber;
    const imageBox = definition.imageBox;
    const path = shapePaths[number];
    return `
      <figure
        class="puzzle-piece"
        data-piece="${number}"
        style="--x:${definition.x};--y:${definition.y};--w:${definition.w};--h:${definition.h};--rotation:${definition.rotation};--z:${definition.z};"
        hidden
      >
        <svg viewBox="${definition.viewBox}" preserveAspectRatio="none">
          <defs>
            <clipPath id="piece-${number}-clip">
              <path class="piece-clip" d="${path}"></path>
            </clipPath>
            <linearGradient id="piece-${number}-cardboard" x1="0" y1="0" x2="0.82" y2="1">
              <stop offset="0" stop-color="#d2aa80"></stop>
              <stop offset="0.46" stop-color="#986942"></stop>
              <stop offset="1" stop-color="#53351f"></stop>
            </linearGradient>
            <linearGradient id="piece-${number}-sheen" x1="0" y1="0" x2="0.76" y2="1">
              <stop offset="0" stop-color="#fff" stop-opacity="0.22"></stop>
              <stop offset="0.28" stop-color="#fff" stop-opacity="0.025"></stop>
              <stop offset="0.72" stop-color="#000" stop-opacity="0.04"></stop>
              <stop offset="1" stop-color="#000" stop-opacity="0.2"></stop>
            </linearGradient>
          </defs>
          <path class="piece-depth piece-depth--back" d="${path}"></path>
          <path class="piece-depth piece-depth--cardboard" d="${path}" style="fill:url(#piece-${number}-cardboard)"></path>
          <path class="piece-depth piece-depth--bevel" d="${path}"></path>
          <image
            href="assets/images/photo${imageNumber}.jpg"
            x="${imageBox.x}"
            y="${imageBox.y}"
            width="${imageBox.width}"
            height="${imageBox.height}"
            preserveAspectRatio="xMidYMid slice"
            clip-path="url(#piece-${number}-clip)"
          ></image>
          <path class="piece-sheen" d="${path}" fill="url(#piece-${number}-sheen)" clip-path="url(#piece-${number}-clip)"></path>
          <path class="piece-edge" d="${path}"></path>
        </svg>
      </figure>`;
  }).join("");
}

function seamMarkup(className) {
  return `
    <g class="${className}">
      <path d="${boardSeams.top}"></path>
      <path d="${boardSeams.right}"></path>
      <path d="${boardSeams.bottom}"></path>
      <path d="${boardSeams.left}"></path>
      <path d="${boardSeams.center}"></path>
    </g>`;
}

function buildAssemblyBoard() {
  const clips = boardAssignments.map(({ number, path }) =>
    `<clipPath id="assembly-clip-${number}"><path d="${path}"></path></clipPath>`
  ).join("");
  const groups = boardAssignments.map(({ number, path, imageBox }) => `
    <g class="assembly-piece" data-assembly-piece="${number}">
      <path class="assembly-depth assembly-depth--back" d="${path}"></path>
      <path class="assembly-depth assembly-depth--cardboard" d="${path}" style="fill:url(#assembly-cardboard)"></path>
      <path class="assembly-depth assembly-depth--bevel" d="${path}"></path>
      <image
        href="assets/images/photo${number}.jpg"
        x="${imageBox.x}"
        y="${imageBox.y}"
        width="${imageBox.width}"
        height="${imageBox.height}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#assembly-clip-${number})"
      ></image>
      <path class="assembly-sheen" d="${path}" fill="url(#assembly-sheen)" clip-path="url(#assembly-clip-${number})"></path>
      <path class="assembly-edge" d="${path}"></path>
    </g>`).join("");

  assemblyBoard.innerHTML = `
    <svg viewBox="0 0 960 540" preserveAspectRatio="none">
      <defs>
        ${clips}
        <linearGradient id="assembly-cardboard" x1="0" y1="0" x2="0.82" y2="1">
          <stop offset="0" stop-color="#d2aa80"></stop>
          <stop offset="0.46" stop-color="#986942"></stop>
          <stop offset="1" stop-color="#53351f"></stop>
        </linearGradient>
        <linearGradient id="assembly-sheen" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0.2"></stop>
          <stop offset="0.3" stop-color="#fff" stop-opacity="0.025"></stop>
          <stop offset="0.72" stop-color="#000" stop-opacity="0.035"></stop>
          <stop offset="1" stop-color="#000" stop-opacity="0.2"></stop>
        </linearGradient>
      </defs>
      ${groups}
    </svg>`;
}

function buildFinalBoard() {
  const clips = boardAssignments.map(({ number, path }) =>
    `<clipPath id="final-clip-${number}"><path d="${path}"></path></clipPath>`
  ).join("");
  const groups = boardAssignments.map(({ number, path }) => `
    <g class="final-region" data-final-region="${number}">
      <path class="final-piece-depth final-piece-depth--back" d="${path}"></path>
      <path class="final-piece-depth final-piece-depth--cardboard" d="${path}" style="fill:url(#final-cardboard)"></path>
      <path class="final-piece-depth final-piece-depth--bevel" d="${path}"></path>
      <image
        class="final-photo"
        href="assets/images/photo11.jpg"
        x="0"
        y="0"
        width="960"
        height="540"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#final-clip-${number})"
      ></image>
      <path class="final-piece-sheen" d="${path}" fill="url(#final-piece-sheen)" clip-path="url(#final-clip-${number})"></path>
      <path class="final-piece-edge" d="${path}"></path>
    </g>`).join("");

  finalBoard.innerHTML = `
    <svg viewBox="0 0 960 540" preserveAspectRatio="none">
      <defs>
        ${clips}
        <clipPath id="final-outer-clip"><path d="${finalOuterPath}"></path></clipPath>
        <radialGradient id="final-vignette">
          <stop offset="52%" stop-color="#000" stop-opacity="0"></stop>
          <stop offset="100%" stop-color="#000" stop-opacity="0.36"></stop>
        </radialGradient>
        <linearGradient id="final-cardboard" x1="0" y1="0" x2="0.82" y2="1">
          <stop offset="0" stop-color="#d2aa80"></stop>
          <stop offset="0.46" stop-color="#986942"></stop>
          <stop offset="1" stop-color="#53351f"></stop>
        </linearGradient>
        <linearGradient id="final-piece-sheen" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0.18"></stop>
          <stop offset="0.3" stop-color="#fff" stop-opacity="0.02"></stop>
          <stop offset="0.75" stop-color="#000" stop-opacity="0.04"></stop>
          <stop offset="1" stop-color="#000" stop-opacity="0.18"></stop>
        </linearGradient>
      </defs>
      ${groups}
      <path class="final-shade" d="${finalOuterPath}" fill="url(#final-vignette)"></path>
      ${seamMarkup("final-seams")}
      <path class="final-outer-edge" d="${finalOuterPath}"></path>
    </svg>`;
}

buildLoosePieces();
buildAssemblyBoard();
buildFinalBoard();

const pieces = new Map(
  [...document.querySelectorAll(".puzzle-piece")].map((piece) => [Number(piece.dataset.piece), piece])
);
const assemblyPieces = new Map(
  [...document.querySelectorAll(".assembly-piece")].map((piece) => [Number(piece.dataset.assemblyPiece), piece])
);
const finalRegions = new Map(
  [...document.querySelectorAll(".final-region")].map((region) => [Number(region.dataset.finalRegion), region])
);
const finalSeams = finalBoard.querySelector(".final-seams");
const finalShade = finalBoard.querySelector(".final-shade");
const finalOuterEdge = finalBoard.querySelector(".final-outer-edge");

let currentStep = 0;
let busy = false;
let runId = 0;

function motionDuration(standard, reduced = 80) {
  return reduceMotion.matches ? reduced : standard;
}

function cssValue(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

function percentNumber(value) {
  return Number.parseFloat(String(value).replace("%", ""));
}

function animationFinished(animation) {
  return animation.finished.catch(() => undefined);
}

async function waitForAnimations(animations) {
  await Promise.all(animations.map(animationFinished));
}

function pause(duration) {
  if (duration <= 0) return Promise.resolve();
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function cancelAnimations(element, subtree = false) {
  if (!element) return;
  element.getAnimations({ subtree }).forEach((animation) => animation.cancel());
}

function clearStyle(element, properties) {
  properties.forEach((property) => element.style.removeProperty(property));
}

function clearPieceState(piece) {
  clearStyle(piece, ["left", "top", "width", "height", "opacity", "filter", "transform"]);
}

function restingTransform(piece, scale = 1, rotation = null) {
  const angle = rotation ?? (cssValue(piece, "--rotation") || "0deg");
  return `translate(-50%, -50%) rotate(${angle}) scale(${scale})`;
}

function updateInterface() {
  stage.dataset.step = String(currentStep);
  advanceControl.disabled = busy || stage.classList.contains("is-loading") || currentStep >= stepLabels.length;
  advanceControl.setAttribute(
    "aria-label",
    currentStep < stepLabels.length ? stepLabels[currentStep] : "Puzzle complete"
  );
}

function resetMorphOverlay() {
  cancelAnimations(memoryMorph, true);
  memoryMorph.hidden = true;
  clearStyle(memoryMorph, ["opacity"]);
  clearStyle(memoryMorph.querySelector(".memory-morph__veil"), ["opacity"]);
  clearStyle(morphShell, ["left", "top", "opacity", "filter", "transform"]);
  clearStyle(morphDepth, ["opacity", "filter", "transform"]);
  clearStyle(morphFullImage, ["opacity", "filter"]);
  clearStyle(morphCropImage, ["opacity", "filter"]);
  morphFullImage.removeAttribute("href");
  morphCropImage.removeAttribute("href");
  [morphPath, morphDepth, morphEdge].forEach((path) => {
    path._morphVersion = (path._morphVersion || 0) + 1;
    path.querySelectorAll("animate").forEach((animation) => animation.remove());
  });
  morphPath.removeAttribute("d");
  morphDepth.removeAttribute("d");
  morphEdge.removeAttribute("d");
}

function resetPuzzle({ announce = true } = {}) {
  runId += 1;
  busy = false;
  currentStep = 0;

  stage.classList.remove("is-mat-open", "is-assembled", "is-complete", "is-final");
  stage.classList.add("is-empty", "is-rolled");

  [matScene, matShadow, puzzleMat, matRoll].forEach((element) => {
    cancelAnimations(element, true);
    clearStyle(element, ["left", "opacity", "filter", "transform"]);
  });

  for (const [number, piece] of pieces) {
    cancelAnimations(piece, true);
    clearPieceState(piece);
    piece.hidden = true;
    const basePath = shapePaths[number];
    [
      piece.querySelector(".piece-clip"),
      piece.querySelector(".piece-edge"),
      piece.querySelector(".piece-sheen"),
      ...piece.querySelectorAll(".piece-depth")
    ].filter(Boolean).forEach((path) => {
      path._morphVersion = (path._morphVersion || 0) + 1;
      path.querySelectorAll("animate").forEach((animation) => animation.remove());
      path.setAttribute("d", basePath);
    });
  }

  resetMorphOverlay();

  cancelAnimations(assemblyBoard, true);
  assemblyBoard.hidden = true;
  clearStyle(assemblyBoard, ["opacity", "filter", "transform"]);
  assemblyPieces.forEach((piece) => {
    clearStyle(piece, ["opacity", "filter", "transform"]);
    piece.style.opacity = "0";
  });

  cancelAnimations(finalBoard, true);
  finalBoard.hidden = true;
  clearStyle(finalBoard, ["opacity", "filter", "transform", "transform-origin"]);
  finalRegions.forEach((region) => clearStyle(region, ["opacity", "filter", "transform"]));
  clearStyle(finalSeams, ["opacity", "filter"]);
  clearStyle(finalShade, ["opacity"]);
  clearStyle(finalOuterEdge, ["opacity", "filter"]);

  cancelAnimations(snapFlash);
  clearStyle(snapFlash, ["left", "top", "width", "opacity", "transform"]);

  statusText.textContent = announce ? "Puzzle restarted" : "Puzzle ready";
  updateInterface();
}

function setSvgHref(element, value) {
  element.setAttribute("href", value);
}

function aspectRectangle(aspectRatio) {
  if (aspectRatio >= 1) {
    const height = 400 / aspectRatio;
    return { x1: 0, y1: (400 - height) / 2, x2: 400, y2: (400 + height) / 2 };
  }
  const width = 400 * aspectRatio;
  return { x1: (400 - width) / 2, y1: 0, x2: (400 + width) / 2, y2: 400 };
}

function morphSvgPath(pathElement, fromPath, toPath, duration) {
  const version = (pathElement._morphVersion || 0) + 1;
  pathElement._morphVersion = version;
  pathElement.setAttribute("d", fromPath);
  if (reduceMotion.matches || duration <= 100 || typeof document.createElementNS !== "function") {
    pathElement.setAttribute("d", toPath);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const animate = document.createElementNS(SVG_NS, "animate");
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallback);
      if (pathElement._morphVersion === version) pathElement.setAttribute("d", toPath);
      animate.remove();
      resolve();
    };
    const fallback = window.setTimeout(finish, duration + 120);
    animate.setAttribute("attributeName", "d");
    animate.setAttribute("from", fromPath);
    animate.setAttribute("to", toPath);
    animate.setAttribute("dur", `${duration}ms`);
    animate.setAttribute("begin", "indefinite");
    animate.setAttribute("fill", "freeze");
    animate.setAttribute("calcMode", "spline");
    animate.setAttribute("keySplines", ".2 .72 .22 1");
    animate.addEventListener("endEvent", finish, { once: true });
    pathElement.appendChild(animate);
    try {
      animate.beginElement();
    } catch {
      finish();
    }
  });
}

function snapAt(left, top, width = "18%", duration = motionDuration(430, 70)) {
  snapFlash.style.left = left;
  snapFlash.style.top = top;
  snapFlash.style.width = width;
  return snapFlash.animate(
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(.28)" },
      { opacity: 0.68, transform: "translate(-50%, -50%) scale(.72)", offset: 0.28 },
      { opacity: 0.18, transform: "translate(-50%, -50%) scale(1.02)", offset: 0.58 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.18)" }
    ],
    { duration, easing: "cubic-bezier(.18,.74,.22,1)", fill: "none" }
  );
}

async function unrollMat(token) {
  const duration = motionDuration(2320, 120);

  const surface = puzzleMat.animate(
    [
      { opacity: 0.38, filter: "brightness(.58)", transform: "scaleX(.018)" },
      { opacity: 0.9, filter: "brightness(.86)", transform: "scaleX(.54)", offset: 0.48 },
      { opacity: 1, filter: "brightness(1.04)", transform: "scaleX(1.008)", offset: 0.9 },
      { opacity: 1, filter: "brightness(1)", transform: "scaleX(1)" }
    ],
    { duration, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
  );

  const roll = matRoll.animate(
    [
      { left: "0%", opacity: 1, filter: "brightness(.72)", transform: "translateX(-18%) scaleX(1.04)" },
      { left: "48%", opacity: 1, filter: "brightness(1.08)", transform: "translateX(-50%) scaleX(.94)", offset: 0.48 },
      { left: "96.5%", opacity: 1, filter: "brightness(.9)", transform: "translateX(-64%) scaleX(.8)", offset: 0.9 },
      { left: "100%", opacity: 0, filter: "brightness(.68)", transform: "translateX(-72%) scaleX(.66)" }
    ],
    { duration, easing: "cubic-bezier(.24,.78,.2,1)", fill: "forwards" }
  );

  const scene = matScene.animate(
    [
      { transform: "rotateX(4deg) rotateZ(-1.15deg) scale(.92)" },
      { transform: "rotateX(1.6deg) rotateZ(-.3deg) scale(1.004)", offset: 0.9 },
      { transform: "rotateX(1.25deg) rotateZ(-.25deg) scale(1)" }
    ],
    { duration, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
  );

  const shadow = matShadow.animate(
    [
      { opacity: 0.5, transform: "translateY(2.6%) scaleX(.035) scaleY(.94)", filter: "blur(1.3vw)" },
      { opacity: 0.82, transform: "translateY(2.35%) scaleX(.985) scaleY(.98)", filter: "blur(2.1vw)" }
    ],
    { duration, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
  );

  await waitForAnimations([surface, roll, scene, shadow]);
  if (token !== runId) return false;

  [puzzleMat, matRoll, matScene, matShadow].forEach((element) => cancelAnimations(element));
  clearStyle(puzzleMat, ["opacity", "filter", "transform"]);
  clearStyle(matRoll, ["left", "opacity", "filter", "transform"]);
  clearStyle(matScene, ["transform"]);
  clearStyle(matShadow, ["opacity", "filter", "transform"]);
  stage.classList.remove("is-rolled");
  stage.classList.add("is-mat-open");
  return true;
}

async function revealMemory(number, token) {
  const piece = pieces.get(number);
  const targetLeft = cssValue(piece, "--x");
  const targetTop = cssValue(piece, "--y");
  const targetWidthPercent = percentNumber(cssValue(piece, "--w"));
  const targetRotation = cssValue(piece, "--rotation") || "0deg";
  const stageRect = stage.getBoundingClientRect();
  const displayScale = Math.min(stageRect.width * 0.62 / 400, stageRect.height * 0.76 / 400);
  const targetScale = stageRect.width * targetWidthPercent / 100 / 400;
  const aspectBox = aspectRectangle(photoRatios.get(number));
  const startPath = pathForBox(aspectBox.x1, aspectBox.y1, aspectBox.x2, aspectBox.y2);
  const targetPath = shapePaths[number];
  const introDuration = motionDuration(1020, 70);
  const morphDuration = motionDuration(1640, 110);
  const source = `assets/images/photo${number}.jpg`;

  setSvgHref(morphFullImage, source);
  setSvgHref(morphCropImage, source);
  morphPath.setAttribute("d", startPath);
  morphDepth.setAttribute("d", startPath);
  morphEdge.setAttribute("d", startPath);
  morphDepth.style.opacity = "0";
  morphFullImage.style.opacity = "0";
  morphCropImage.style.opacity = "0";
  morphShell.style.left = "50%";
  morphShell.style.top = "50%";
  morphShell.style.transform = `translate(-50%, -50%) scale(${displayScale})`;
  memoryMorph.hidden = false;

  const veil = memoryMorph.querySelector(".memory-morph__veil");
  const introAnimations = [
    veil.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: introDuration * 0.62,
      easing: "ease-out",
      fill: "both"
    }),
    morphShell.animate(
      [
        { opacity: 0, filter: "brightness(.72) blur(3px)", transform: `translate(-50%, -50%) scale(${displayScale * 1.12})` },
        { opacity: 1, filter: "brightness(1.04) blur(0px)", transform: `translate(-50%, -50%) scale(${displayScale * 1.015})`, offset: 0.76 },
        { opacity: 1, filter: "brightness(1) blur(0px)", transform: `translate(-50%, -50%) scale(${displayScale})` }
      ],
      { duration: introDuration, easing: "cubic-bezier(.18,.76,.2,1)", fill: "both" }
    ),
    morphFullImage.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: introDuration * 0.72,
      easing: "ease-out",
      fill: "both"
    })
  ];

  await waitForAnimations(introAnimations);
  if (token !== runId) return false;
  await pause(motionDuration(340, 0));
  if (token !== runId) return false;

  const shellAnimation = morphShell.animate(
    [
      {
        left: "50%",
        top: "50%",
        filter: "brightness(1) blur(0px)",
        transform: `translate(-50%, -50%) rotate(0deg) scale(${displayScale})`
      },
      {
        left: targetLeft,
        top: targetTop,
        filter: "brightness(1.06) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${targetRotation}) scale(${targetScale * 1.025})`,
        offset: 0.84
      },
      {
        left: targetLeft,
        top: targetTop,
        filter: "brightness(1) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${targetRotation}) scale(${targetScale})`
      }
    ],
    { duration: morphDuration, easing: "cubic-bezier(.22,.72,.2,1)", fill: "both" }
  );

  const fullFade = morphFullImage.animate(
    [
      { opacity: 1, filter: "brightness(1)" },
      { opacity: 0.92, filter: "brightness(1.04)", offset: 0.28 },
      { opacity: 0, filter: "brightness(1.12)" }
    ],
    { duration: morphDuration * 0.72, delay: morphDuration * 0.12, easing: "ease-in", fill: "both" }
  );

  const cropReveal = morphCropImage.animate(
    [
      { opacity: 0, filter: "brightness(1.16) blur(2px)" },
      { opacity: 0, filter: "brightness(1.12) blur(2px)", offset: 0.18 },
      { opacity: 1, filter: "brightness(1) blur(0px)" }
    ],
    { duration: morphDuration * 0.82, delay: morphDuration * 0.08, easing: "ease-out", fill: "both" }
  );

  const veilFade = veil.animate(
    [{ opacity: 1 }, { opacity: 0.96, offset: 0.38 }, { opacity: 0 }],
    { duration: morphDuration, easing: "ease-in", fill: "both" }
  );

  const depthReveal = morphDepth.animate(
    [
      { opacity: 0, transform: "translate(0, 0)" },
      { opacity: 0, transform: "translate(0, 0)", offset: 0.32 },
      { opacity: 1, transform: "translate(0, 10px)" }
    ],
    { duration: morphDuration, easing: "ease-out", fill: "both" }
  );

  const pathMorphs = [
    morphSvgPath(morphPath, startPath, targetPath, morphDuration),
    morphSvgPath(morphDepth, startPath, targetPath, morphDuration),
    morphSvgPath(morphEdge, startPath, targetPath, morphDuration)
  ];

  await Promise.all([
    waitForAnimations([shellAnimation, fullFade, cropReveal, veilFade, depthReveal]),
    ...pathMorphs
  ]);
  if (token !== runId) return false;

  piece.hidden = false;
  cancelAnimations(piece, true);
  clearPieceState(piece);
  resetMorphOverlay();
  return true;
}

function currentPieceFrame(piece) {
  const style = getComputedStyle(piece);
  return {
    left: style.left,
    top: style.top,
    width: style.width,
    height: style.height,
    transform: style.transform,
    filter: style.filter
  };
}

function animatePieceTo(piece, layout, duration, delay = 0, options = {}) {
  const start = currentPieceFrame(piece);
  const endRotation = options.rotation || "0deg";
  const overshoot = options.overshoot ?? 1.018;
  const endOpacity = options.opacity ?? 1;
  return piece.animate(
    [
      {
        left: start.left,
        top: start.top,
        width: start.width,
        height: start.height,
        opacity: 1,
        filter: start.filter,
        transform: start.transform
      },
      {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        opacity: Math.max(endOpacity, 0.72),
        filter: "brightness(1.07) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${endRotation}) scale(${overshoot})`,
        offset: 0.84
      },
      {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        opacity: endOpacity,
        filter: "brightness(1) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${endRotation}) scale(1)`
      }
    ],
    {
      duration,
      delay,
      easing: "cubic-bezier(.22,.82,.2,1)",
      fill: "forwards"
    }
  );
}

function commitPieceLayout(piece, layout, rotation = "0deg") {
  piece.style.left = layout.left;
  piece.style.top = layout.top;
  piece.style.width = layout.width;
  piece.style.height = layout.height;
  piece.style.opacity = "1";
  piece.style.filter = "brightness(1) blur(0px)";
  piece.style.transform = `translate(-50%, -50%) rotate(${rotation}) scale(1)`;
}

async function mergeFirstPair(token) {
  const first = pieces.get(1);
  const second = pieces.get(2);
  const result = pieces.get(7);
  const moveDuration = motionDuration(1380, 100);
  const changeDuration = motionDuration(1020, 90);
  const leftLayout = { left: "18%", top: "50%", width: "18.67%", height: "33.19%" };
  const rightLayout = { left: "32%", top: "50%", width: "18.67%", height: "33.19%" };

  await waitForAnimations([
    animatePieceTo(first, leftLayout, moveDuration, 0, { overshoot: 1.01 }),
    animatePieceTo(second, rightLayout, moveDuration, 0, { overshoot: 1.01 })
  ]);
  if (token !== runId) return false;

  cancelAnimations(first);
  cancelAnimations(second);
  commitPieceLayout(first, leftLayout);
  commitPieceLayout(second, rightLayout);

  await animationFinished(snapAt("25%", "50%", "12%", motionDuration(530, 70)));
  if (token !== runId) return false;
  await pause(motionDuration(240, 0));

  result.hidden = false;
  result.style.left = "25%";
  result.style.top = "50%";
  result.style.opacity = "0";
  result.style.filter = "brightness(1.2) blur(3px)";
  result.style.transform = "translate(-50%, -50%) rotate(0deg) scale(.9)";

  const resultReveal = result.animate(
    [
      { opacity: 0, filter: "brightness(1.24) blur(4px)", transform: "translate(-50%, -50%) rotate(0deg) scale(.9)" },
      { opacity: 1, filter: "brightness(1.07) blur(0px)", transform: "translate(-50%, -50%) rotate(-1deg) scale(1.025)", offset: 0.78 },
      { opacity: 1, filter: "brightness(1) blur(0px)", transform: "translate(-50%, -50%) rotate(-2deg) scale(1)" }
    ],
    { duration: changeDuration, easing: "cubic-bezier(.18,.74,.22,1)", fill: "forwards" }
  );
  const firstFade = first.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: changeDuration * 0.7,
    easing: "ease-in",
    fill: "forwards"
  });
  const secondFade = second.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: changeDuration * 0.7,
    easing: "ease-in",
    fill: "forwards"
  });
  await waitForAnimations([resultReveal, firstFade, secondFade]);
  if (token !== runId) return false;

  [first, second].forEach((piece) => {
    cancelAnimations(piece);
    clearPieceState(piece);
    piece.hidden = true;
  });
  cancelAnimations(result);
  clearPieceState(result);
  result.hidden = false;
  return true;
}

async function growMemory(sourceNumber, resultNumber, token) {
  const source = pieces.get(sourceNumber);
  const result = pieces.get(resultNumber);
  const duration = motionDuration(1760, 110);
  const layout = {
    left: cssValue(result, "--x"),
    top: cssValue(result, "--y"),
    width: cssValue(result, "--w"),
    height: cssValue(result, "--h")
  };
  const rotation = cssValue(result, "--rotation") || "0deg";

  result.hidden = false;
  result.style.left = layout.left;
  result.style.top = layout.top;
  result.style.width = layout.width;
  result.style.height = layout.height;
  result.style.opacity = "0";
  result.style.transform = `translate(-50%, -50%) rotate(${rotation}) scale(.92)`;

  const sourceGrow = animatePieceTo(source, layout, duration, 0, {
    rotation,
    overshoot: 1.045,
    opacity: 0
  });
  const resultReveal = result.animate(
    [
      { opacity: 0, filter: "brightness(1.22) blur(4px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(.92)` },
      { opacity: 0, filter: "brightness(1.18) blur(3px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(.98)`, offset: 0.28 },
      { opacity: 1, filter: "brightness(1.06) blur(0px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(1.025)`, offset: 0.84 },
      { opacity: 1, filter: "brightness(1) blur(0px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(1)` }
    ],
    { duration, delay: motionDuration(560, 0), easing: "cubic-bezier(.18,.74,.22,1)", fill: "forwards" }
  );
  const flash = snapAt(layout.left, layout.top, "24%", duration);

  await waitForAnimations([sourceGrow, resultReveal, flash]);
  if (token !== runId) return false;

  cancelAnimations(source);
  clearPieceState(source);
  source.hidden = true;
  cancelAnimations(result);
  clearPieceState(result);
  result.hidden = false;
  return true;
}

async function transformSix(token) {
  const source = pieces.get(6);
  const result = pieces.get(12);
  const duration = motionDuration(1980, 100);
  const layout = {
    left: cssValue(result, "--x"),
    top: cssValue(result, "--y"),
    width: cssValue(result, "--w"),
    height: cssValue(result, "--h")
  };
  const rotation = cssValue(result, "--rotation") || "0deg";

  result.hidden = false;
  result.style.left = layout.left;
  result.style.top = layout.top;
  result.style.width = layout.width;
  result.style.height = layout.height;
  result.style.opacity = "0";
  result.style.filter = "brightness(1.16) blur(3px)";
  result.style.transform = `translate(-50%, -50%) rotate(${rotation}) scale(.86)`;

  const movement = animatePieceTo(source, layout, duration, 0, {
    rotation,
    overshoot: 1.025,
    opacity: 0
  });
  const reveal = result.animate(
    [
      { opacity: 0, filter: "brightness(1.16) blur(3px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(.86)` },
      { opacity: 0, filter: "brightness(1.12) blur(2px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(.92)`, offset: 0.34 },
      { opacity: 1, filter: "brightness(1.04) blur(0px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(1.018)`, offset: 0.88 },
      { opacity: 1, filter: "brightness(1) blur(0px)", transform: `translate(-50%, -50%) rotate(${rotation}) scale(1)` }
    ],
    { duration, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
  );
  const glow = snapAt(layout.left, layout.top, "23%", duration);

  await waitForAnimations([movement, reveal, glow]);
  if (token !== runId) return false;

  cancelAnimations(source);
  clearPieceState(source);
  source.hidden = true;
  cancelAnimations(result);
  clearPieceState(result);
  result.hidden = false;
  return true;
}

function fadeLoosePiece(piece, destination, duration, delay = 0) {
  const start = currentPieceFrame(piece);
  return piece.animate(
    [
      {
        left: start.left,
        top: start.top,
        opacity: 1,
        filter: start.filter,
        transform: start.transform
      },
      {
        left: destination.left,
        top: destination.top,
        opacity: 0.82,
        filter: "brightness(1.08) blur(0px)",
        transform: "translate(-50%, -50%) rotate(0deg) scale(1.05)",
        offset: 0.72
      },
      {
        left: destination.left,
        top: destination.top,
        opacity: 0,
        filter: "brightness(1.18) blur(2px)",
        transform: "translate(-50%, -50%) rotate(0deg) scale(.98)"
      }
    ],
    { duration, delay, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
  );
}

async function assembleOuterPieces(token) {
  const duration = motionDuration(2180, 120);
  const stagger = reduceMotion.matches ? 0 : 65;
  const sequence = [
    { number: 7, looseNumber: 7, start: "translate(-18%,-18%) scale(.82) rotate(-2deg)", destination: { left: "32%", top: "33%" } },
    { number: 8, looseNumber: 8, start: "translate(18%,-18%) scale(.82) rotate(2deg)", destination: { left: "68%", top: "33%" } },
    { number: 9, looseNumber: 9, start: "translate(-18%,18%) scale(.82) rotate(2deg)", destination: { left: "32%", top: "67%" } },
    { number: 6, looseNumber: 12, start: "translate(18%,18%) scale(.82) rotate(-2deg)", destination: { left: "68%", top: "67%" } }
  ];

  assemblyBoard.hidden = false;
  const animations = [];
  sequence.forEach(({ number, looseNumber, start, destination }, index) => {
    const loose = pieces.get(looseNumber);
    const assembled = assemblyPieces.get(number);
    const delay = index * stagger;
    assembled.style.opacity = "0";
    assembled.style.transform = start;
    animations.push(fadeLoosePiece(loose, destination, duration, delay));
    animations.push(assembled.animate(
      [
        { opacity: 0, filter: "brightness(1.18) blur(3px)", transform: start },
        { opacity: 1, filter: "brightness(1.08) blur(0px)", transform: "translate(0,0) scale(1.018) rotate(0deg)", offset: 0.84 },
        { opacity: 1, filter: "brightness(1) blur(0px)", transform: "translate(0,0) scale(1) rotate(0deg)" }
      ],
      { duration, delay, easing: "cubic-bezier(.22,.82,.2,1)", fill: "forwards" }
    ));
  });
  animations.push(snapAt("50%", "50%", "62%", duration + stagger * 3));

  await waitForAnimations(animations);
  if (token !== runId) return false;

  sequence.forEach(({ number, looseNumber }) => {
    const loose = pieces.get(looseNumber);
    const assembled = assemblyPieces.get(number);
    cancelAnimations(loose);
    clearPieceState(loose);
    loose.hidden = true;
    cancelAnimations(assembled);
    assembled.style.opacity = "1";
    assembled.style.filter = "brightness(1) blur(0px)";
    assembled.style.transform = "translate(0,0) scale(1) rotate(0deg)";
  });
  stage.classList.add("is-assembled");
  return true;
}

async function completeCenterPiece(token) {
  const source = pieces.get(4);
  const center = assemblyPieces.get(10);
  const moveDuration = motionDuration(1340, 90);
  const revealDuration = motionDuration(1060, 80);
  const centerLayout = { left: "50%", top: "50%", width: "25.5%", height: "45.33%" };

  const move = animatePieceTo(source, centerLayout, moveDuration, 0, {
    rotation: "0deg",
    overshoot: 1.02,
    opacity: 0.25
  });
  await animationFinished(move);
  if (token !== runId) return false;

  center.style.opacity = "0";
  center.style.transform = "translate(38%,28%) scale(.48) rotate(-5deg)";
  const reveal = center.animate(
    [
      { opacity: 0, filter: "brightness(1.25) blur(4px)", transform: "translate(38%,28%) scale(.48) rotate(-5deg)" },
      { opacity: 1, filter: "brightness(1.09) blur(0px)", transform: "translate(0,0) scale(1.035) rotate(0deg)", offset: 0.78 },
      { opacity: 1, filter: "brightness(1) blur(0px)", transform: "translate(0,0) scale(1) rotate(0deg)" }
    ],
    { duration: revealDuration, easing: "cubic-bezier(.18,.76,.2,1)", fill: "forwards" }
  );
  const sourceFade = source.animate([{ opacity: 0.25 }, { opacity: 0 }], {
    duration: revealDuration * 0.7,
    easing: "ease-in",
    fill: "forwards"
  });
  const flash = snapAt("50%", "50%", "23%", revealDuration);
  await waitForAnimations([reveal, sourceFade, flash]);
  if (token !== runId) return false;

  cancelAnimations(source);
  clearPieceState(source);
  source.hidden = true;
  cancelAnimations(center);
  center.style.opacity = "1";
  center.style.filter = "brightness(1) blur(0px)";
  center.style.transform = "translate(0,0) scale(1) rotate(0deg)";
  stage.classList.add("is-complete");
  return true;
}

async function revealFinalPhotograph(token) {
  const totalDuration = 15000;
  const pieceDuration = reduceMotion.matches ? 160 : totalDuration / 5;
  const halfTurn = pieceDuration / 2;
  const finishDuration = reduceMotion.matches ? 90 : 1000;
  const finishDelay = reduceMotion.matches ? 0 : totalDuration - finishDuration;
  const revealOrder = [7, 8, 9, 6, 10];

  finalBoard.hidden = false;
  finalBoard.style.opacity = "1";
  finalBoard.style.filter = "brightness(1)";
  finalBoard.style.transform = "none";
  finalRegions.forEach((region) => {
    region.style.opacity = "0";
    region.style.transform = "rotateY(-90deg) scale(.975)";
    region.style.filter = "brightness(.68)";
  });
  finalSeams.style.opacity = "0";
  finalShade.style.opacity = "0";
  finalOuterEdge.style.opacity = "0";

  const flipAnimations = [];
  revealOrder.forEach((number, index) => {
    const oldPiece = assemblyPieces.get(number);
    const newPiece = finalRegions.get(number);
    const direction = index % 2 === 0 ? 1 : -1;
    const delay = reduceMotion.matches ? index * pieceDuration : index * pieceDuration;

    flipAnimations.push(oldPiece.animate(
      [
        {
          opacity: 1,
          filter: "brightness(1)",
          transform: "perspective(1500px) rotateY(0deg) translateZ(0) scale(1)"
        },
        {
          opacity: 1,
          filter: "brightness(.78)",
          transform: `perspective(1500px) rotateY(${direction * 72}deg) translateZ(10px) scale(.985)`,
          offset: 0.8
        },
        {
          opacity: 0,
          filter: "brightness(.52)",
          transform: `perspective(1500px) rotateY(${direction * 90}deg) translateZ(4px) scale(.975)`
        }
      ],
      {
        duration: halfTurn,
        delay,
        easing: "cubic-bezier(.55,.08,.72,.34)",
        fill: "forwards"
      }
    ));

    flipAnimations.push(newPiece.animate(
      [
        {
          opacity: 0,
          filter: "brightness(.52)",
          transform: `perspective(1500px) rotateY(${direction * -90}deg) translateZ(4px) scale(.975)`
        },
        {
          opacity: 1,
          filter: "brightness(1.08)",
          transform: `perspective(1500px) rotateY(${direction * -8}deg) translateZ(10px) scale(1.012)`,
          offset: 0.84
        },
        {
          opacity: 1,
          filter: "brightness(1)",
          transform: "perspective(1500px) rotateY(0deg) translateZ(0) scale(1)"
        }
      ],
      {
        duration: halfTurn,
        delay: delay + halfTurn,
        easing: "cubic-bezier(.18,.76,.22,1)",
        fill: "forwards"
      }
    ));
  });

  const seamsReveal = finalSeams.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: finishDuration,
      delay: finishDelay,
      easing: "ease-out",
      fill: "forwards"
    }
  );
  const shadeReveal = finalShade.animate(
    [{ opacity: 0 }, { opacity: 0.3 }],
    {
      duration: finishDuration,
      delay: finishDelay,
      easing: "ease-out",
      fill: "forwards"
    }
  );
  const edgeReveal = finalOuterEdge.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: finishDuration,
      delay: finishDelay,
      easing: "ease-out",
      fill: "forwards"
    }
  );

  await waitForAnimations([
    ...flipAnimations,
    edgeReveal,
    seamsReveal,
    shadeReveal
  ]);
  if (token !== runId) return false;

  cancelAnimations(assemblyBoard);
  assemblyBoard.hidden = true;
  clearStyle(assemblyBoard, ["opacity", "filter", "transform"]);
  cancelAnimations(finalBoard);
  finalBoard.style.opacity = "1";
  finalBoard.style.filter = "brightness(1)";
  finalBoard.style.transform = "none";
  finalRegions.forEach((region) => {
    cancelAnimations(region);
    region.style.opacity = "1";
    region.style.filter = "brightness(1)";
    region.style.transform = "perspective(1500px) rotateY(0deg) translateZ(0) scale(1)";
  });
  cancelAnimations(finalSeams);
  finalSeams.style.opacity = "1";
  cancelAnimations(finalShade);
  finalShade.style.opacity = "0.3";
  cancelAnimations(finalOuterEdge);
  finalOuterEdge.style.opacity = "1";
  stage.classList.add("is-final");
  return true;
}

async function unrollAndPlaceFirstMemory(token) {
  const unrolled = await unrollMat(token);
  if (!unrolled || token !== runId) return false;
  return revealMemory(1, token);
}

async function transformAndAssemble(token) {
  const transformed = await transformSix(token);
  if (!transformed || token !== runId) return false;
  await pause(motionDuration(260, 0));
  if (token !== runId) return false;
  return assembleOuterPieces(token);
}

async function runCurrentStep(token) {
  if (currentStep === 0) return unrollAndPlaceFirstMemory(token);
  if (currentStep >= 1 && currentStep <= 5) return revealMemory(currentStep + 1, token);
  if (currentStep === 6) return mergeFirstPair(token);
  if (currentStep === 7) return growMemory(3, 8, token);
  if (currentStep === 8) return growMemory(5, 9, token);
  if (currentStep === 9) return transformAndAssemble(token);
  if (currentStep === 10) return completeCenterPiece(token);
  if (currentStep === 11) return revealFinalPhotograph(token);
  return false;
}

async function advancePuzzle() {
  if (busy || currentStep >= stepLabels.length || stage.classList.contains("is-loading")) return;

  busy = true;
  stage.classList.remove("is-empty");
  updateInterface();

  const token = runId;
  const completed = await runCurrentStep(token);
  if (!completed || token !== runId) return;

  statusText.textContent = completionMessages[currentStep];
  currentStep += 1;
  busy = false;
  updateInterface();
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function updateFullscreenControl() {
  const active = Boolean(fullscreenElement()) || document.body.classList.contains("is-pseudo-fullscreen");
  fullscreenButton.setAttribute("aria-pressed", String(active));
  fullscreenButton.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
}

async function toggleFullscreen() {
  if (fullscreenElement()) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) {
      try {
        await exit.call(document);
      } catch {
        document.body.classList.remove("is-pseudo-fullscreen");
      }
    }
    updateFullscreenControl();
    return;
  }

  if (document.body.classList.contains("is-pseudo-fullscreen")) {
    document.body.classList.remove("is-pseudo-fullscreen");
    updateFullscreenControl();
    return;
  }

  const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  if (request) {
    try {
      await request.call(document.documentElement);
    } catch {
      document.body.classList.add("is-pseudo-fullscreen");
    }
  } else {
    document.body.classList.add("is-pseudo-fullscreen");
  }
  updateFullscreenControl();
}

advanceControl.addEventListener("click", advancePuzzle);
restartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  resetPuzzle();
});
fullscreenButton.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleFullscreen();
});
document.addEventListener("fullscreenchange", updateFullscreenControl);
document.addEventListener("webkitfullscreenchange", updateFullscreenControl);

const imagePromises = Array.from({ length: 11 }, (_, index) => {
  const source = `assets/images/photo${index + 1}.jpg`;
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
    image.src = source;
    if (image.complete) resolve();
  });
});

Promise.all(imagePromises).then(() => {
  stage.classList.remove("is-loading");
  resetPuzzle({ announce: false });
});
