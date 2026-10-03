"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";

const stage = document.getElementById("puzzleStage");
const advanceControl = document.getElementById("advanceControl");
const restartButton = document.getElementById("restartButton");
const statusText = document.getElementById("puzzleStatus");
const pieceArea = document.getElementById("pieceArea");
const matScene = document.getElementById("matScene");
const matShadow = document.getElementById("matShadow");
const matPanelLeft = document.getElementById("matPanelLeft");
const matPanelRight = document.getElementById("matPanelRight");
const matStrap = document.getElementById("matStrap");
const memoryMorph = document.getElementById("memoryMorph");
const morphShell = document.getElementById("morphShell");
const morphPath = document.getElementById("morphPath");
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

const shapePaths = {
  1: pathForBox(50, 50, 350, 350, { right: 1, bottom: -1 }),
  2: pathForBox(50, 50, 350, 350, { top: 1, right: -1, left: -1 }),
  3: pathForBox(50, 50, 350, 350, { right: -1, bottom: 1, left: -1 }),
  4: pathForBox(50, 50, 350, 350, { top: -1, right: 1, left: 1 }),
  5: pathForBox(50, 50, 350, 350, { bottom: -1, left: 1 }),
  6: pathForBox(50, 50, 350, 350, { top: 1, left: -1 }),
  "6-transformed": pathForBox(50, 50, 350, 350, { top: -1, right: 1, bottom: 1 }),
  7: pathForBox(50, 50, 650, 350, { right: 1, bottom: -1 }),
  8: pathForBox(50, 50, 350, 350, { right: -1, bottom: 1, left: -1 }),
  9: pathForBox(50, 50, 350, 350, { bottom: -1, left: 1 })
};

const compoundSeam = "M350 50 V150 C350 162 398 150 398 200 C398 250 350 238 350 250 V350";

const pieceDefinitions = [
  { number: 1, x: "18%", y: "29%", w: "17%", h: "30.22%", rotation: "-7deg", z: 6 },
  { number: 2, x: "29%", y: "70%", w: "17%", h: "30.22%", rotation: "6deg", z: 5 },
  { number: 3, x: "44%", y: "28%", w: "17%", h: "30.22%", rotation: "4deg", z: 4 },
  { number: 4, x: "84%", y: "72%", w: "15%", h: "26.67%", rotation: "-5deg", z: 9 },
  { number: 5, x: "75%", y: "29%", w: "17%", h: "30.22%", rotation: "7deg", z: 3 },
  { number: 6, x: "57%", y: "72%", w: "17%", h: "30.22%", rotation: "-6deg", z: 8 },
  { number: 7, x: "25%", y: "50%", w: "32.67%", h: "33.19%", rotation: "-2deg", z: 12, wide: true },
  { number: 8, x: "48%", y: "31%", w: "23%", h: "40.89%", rotation: "2deg", z: 13 },
  { number: 9, x: "74%", y: "34%", w: "23%", h: "40.89%", rotation: "-2deg", z: 14 }
];

const photoRatios = new Map([
  [1, 9 / 16],
  [2, 9 / 16],
  [3, 9 / 16],
  [4, 9 / 16],
  [5, 16 / 9],
  [6, 9 / 16]
]);

const boardPaths = {
  7: "M0 0H960L630 150H530C520 150 530 112 480 112C430 112 440 150 430 150H330Z",
  8: "M960 0V540L630 390V315C630 305 668 315 668 270C668 225 630 235 630 225V150Z",
  9: "M960 540H0L330 390H430C440 390 430 352 480 352C530 352 520 390 530 390H630Z",
  6: "M0 540V0L330 150V225C330 235 292 225 292 270C292 315 330 305 330 315V390Z",
  10: "M330 150H430C440 150 430 112 480 112C530 112 520 150 530 150H630V225C630 235 668 225 668 270C668 315 630 305 630 315V390H530C520 390 530 352 480 352C430 352 440 390 430 390H330V315C330 305 292 315 292 270C292 225 330 235 330 225Z"
};

const boardAssignments = [
  { number: 7, path: boardPaths[7], imageBox: { x: 0, y: 0, width: 960, height: 180 } },
  { number: 8, path: boardPaths[8], imageBox: { x: 600, y: 0, width: 360, height: 540 } },
  { number: 9, path: boardPaths[9], imageBox: { x: 0, y: 360, width: 960, height: 180 } },
  { number: 6, path: boardPaths[6], imageBox: { x: 0, y: 0, width: 360, height: 540 } },
  { number: 10, path: boardPaths[10], imageBox: { x: 292, y: 112, width: 376, height: 278 } }
];

const stepLabels = [
  "Unfold the puzzle mat",
  "Show the Mom memory",
  "Show the Dad memory",
  "Show the farm memory",
  "Show the tasting memory",
  "Show the friends memory",
  "Show the championship memory",
  "Join the first two puzzle pieces",
  "Grow the farm puzzle piece",
  "Grow the friends puzzle piece",
  "Transform the championship puzzle piece",
  "Assemble four pieces around the center",
  "Complete the puzzle with the center piece",
  "Reveal the final photograph"
];

const completionMessages = [
  "Puzzle mat unfolded",
  "Mom memory placed",
  "Dad memory placed",
  "Farm memory placed",
  "Tasting memory placed",
  "Friends memory placed",
  "Championship memory placed",
  "The first two pieces joined and changed",
  "The farm piece grew and changed",
  "The friends piece grew and changed",
  "The championship piece changed shape",
  "Four pieces assembled around the center",
  "The center piece completed the puzzle",
  "The final photograph is displayed as a puzzle"
];

function buildLoosePieces() {
  pieceArea.innerHTML = pieceDefinitions.map((definition) => {
    const number = definition.number;
    const viewBox = definition.wide ? "0 0 700 400" : "0 0 400 400";
    const imageWidth = definition.wide ? 700 : 400;
    const seam = number === 7 ? `<path class="piece-seam" d="${compoundSeam}"></path>` : "";
    return `
      <figure
        class="puzzle-piece${definition.wide ? " compound-piece" : ""}"
        data-piece="${number}"
        style="--x:${definition.x};--y:${definition.y};--w:${definition.w};--h:${definition.h};--rotation:${definition.rotation};--z:${definition.z};"
        hidden
      >
        <svg viewBox="${viewBox}" preserveAspectRatio="none">
          <defs>
            <clipPath id="piece-${number}-clip">
              <path class="piece-clip" d="${shapePaths[number]}"></path>
            </clipPath>
          </defs>
          <image
            href="assets/images/photo${number}.jpg"
            x="0"
            y="0"
            width="${imageWidth}"
            height="400"
            preserveAspectRatio="xMidYMid slice"
            clip-path="url(#piece-${number}-clip)"
          ></image>
          <path class="piece-edge" d="${shapePaths[number]}"></path>
          ${seam}
        </svg>
      </figure>`;
  }).join("");
}

function seamMarkup(className) {
  return `
    <g class="${className}">
      <rect x="2" y="2" width="956" height="536"></rect>
      <path d="M0 0L330 150"></path>
      <path d="M960 0L630 150"></path>
      <path d="M960 540L630 390"></path>
      <path d="M0 540L330 390"></path>
      <path d="${boardPaths[10]}"></path>
    </g>`;
}

function buildAssemblyBoard() {
  const clips = boardAssignments.map(({ number, path }) =>
    `<clipPath id="assembly-clip-${number}"><path d="${path}"></path></clipPath>`
  ).join("");
  const groups = boardAssignments.map(({ number, path, imageBox }) => `
    <g class="assembly-piece" data-assembly-piece="${number}">
      <image
        href="assets/images/photo${number}.jpg"
        x="${imageBox.x}"
        y="${imageBox.y}"
        width="${imageBox.width}"
        height="${imageBox.height}"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#assembly-clip-${number})"
      ></image>
      <path class="assembly-edge" d="${path}"></path>
    </g>`).join("");

  assemblyBoard.innerHTML = `
    <svg viewBox="0 0 960 540" preserveAspectRatio="none">
      <defs>${clips}</defs>
      ${groups}
    </svg>`;
}

function buildFinalBoard() {
  const clips = boardAssignments.map(({ number, path }) =>
    `<clipPath id="final-clip-${number}"><path d="${path}"></path></clipPath>`
  ).join("");
  const groups = boardAssignments.map(({ number }) => `
    <g class="final-region" data-final-region="${number}" clip-path="url(#final-clip-${number})">
      <image
        class="final-photo"
        href="assets/images/photo11.jpg"
        x="0"
        y="0"
        width="960"
        height="540"
        preserveAspectRatio="xMidYMid slice"
      ></image>
    </g>`).join("");

  finalBoard.innerHTML = `
    <svg viewBox="0 0 960 540" preserveAspectRatio="none">
      <defs>
        ${clips}
        <radialGradient id="final-vignette">
          <stop offset="52%" stop-color="#000" stop-opacity="0"></stop>
          <stop offset="100%" stop-color="#000" stop-opacity="0.36"></stop>
        </radialGradient>
      </defs>
      ${groups}
      <rect class="final-shade" width="960" height="540"></rect>
      ${seamMarkup("final-seams")}
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
  clearStyle(morphFullImage, ["opacity", "filter"]);
  clearStyle(morphCropImage, ["opacity", "filter"]);
  morphFullImage.removeAttribute("href");
  morphCropImage.removeAttribute("href");
  [morphPath, morphEdge].forEach((path) => {
    path._morphVersion = (path._morphVersion || 0) + 1;
    path.querySelectorAll("animate").forEach((animation) => animation.remove());
  });
  morphPath.removeAttribute("d");
  morphEdge.removeAttribute("d");
}

function resetPuzzle({ announce = true } = {}) {
  runId += 1;
  busy = false;
  currentStep = 0;

  stage.classList.remove("is-mat-open", "is-assembled", "is-complete", "is-final");
  stage.classList.add("is-empty", "is-folded");

  [matScene, matShadow, matPanelLeft, matPanelRight, matStrap].forEach((element) => {
    cancelAnimations(element, true);
    clearStyle(element, ["opacity", "filter", "transform"]);
  });

  for (const [number, piece] of pieces) {
    cancelAnimations(piece, true);
    clearPieceState(piece);
    piece.hidden = true;
    const basePath = shapePaths[number];
    [piece.querySelector(".piece-clip"), piece.querySelector(".piece-edge")].forEach((path) => {
      path._morphVersion = (path._morphVersion || 0) + 1;
      path.querySelectorAll("animate").forEach((animation) => animation.remove());
      path.setAttribute("d", basePath);
    });
  }

  resetMorphOverlay();

  cancelAnimations(assemblyBoard, true);
  assemblyBoard.hidden = true;
  assemblyPieces.forEach((piece) => {
    clearStyle(piece, ["opacity", "filter", "transform"]);
    piece.style.opacity = "0";
  });

  cancelAnimations(finalBoard, true);
  finalBoard.hidden = true;
  finalRegions.forEach((region) => clearStyle(region, ["opacity", "filter", "transform"]));
  clearStyle(finalSeams, ["opacity", "filter"]);
  clearStyle(finalShade, ["opacity"]);

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

async function unfoldMat(token) {
  const duration = motionDuration(1320, 120);
  const strapDuration = motionDuration(430, 60);

  const strap = matStrap.animate(
    [
      { opacity: 1, transform: "translateX(-50%) scaleX(1)" },
      { opacity: 0, transform: "translateX(-50%) scaleX(.56)" }
    ],
    { duration: strapDuration, easing: "ease-in", fill: "forwards" }
  );

  const left = matPanelLeft.animate(
    [
      { transform: "rotateY(178deg)", filter: "brightness(.68)" },
      { transform: "rotateY(178deg)", filter: "brightness(.7)", offset: 0.12 },
      { transform: "translateX(0) rotateY(-5deg)", filter: "brightness(1.04)", offset: 0.86 },
      { transform: "translateX(0) rotateY(0deg)", filter: "brightness(1)" }
    ],
    { duration, easing: "cubic-bezier(.2,.68,.2,1)", fill: "forwards" }
  );

  const right = matPanelRight.animate(
    [
      { transform: "rotateY(-178deg)", filter: "brightness(.75)" },
      { transform: "rotateY(-178deg)", filter: "brightness(.76)", offset: 0.2 },
      { transform: "translateX(0) rotateY(5deg)", filter: "brightness(1.04)", offset: 0.88 },
      { transform: "translateX(0) rotateY(0deg)", filter: "brightness(1)" }
    ],
    { duration, easing: "cubic-bezier(.2,.68,.2,1)", fill: "forwards" }
  );

  const scene = matScene.animate(
    [
      { transform: "rotateX(7deg) rotateZ(-3.25deg) scale(.79)" },
      { transform: "rotateX(3deg) rotateZ(-1deg) scale(.96)", offset: 0.78 },
      { transform: "rotateX(1.5deg) rotateZ(-.35deg) scale(1)" }
    ],
    { duration, easing: "cubic-bezier(.18,.72,.2,1)", fill: "forwards" }
  );

  const shadow = matShadow.animate(
    [
      { opacity: 0.48, transform: "translateY(2.6%) scale(.44)", filter: "blur(1.4vw)" },
      { opacity: 0.72, transform: "translateY(2.1%) scale(.98)", filter: "blur(2vw)" }
    ],
    { duration, easing: "ease-out", fill: "forwards" }
  );

  await waitForAnimations([strap, left, right, scene, shadow]);
  if (token !== runId) return false;

  [matStrap, matPanelLeft, matPanelRight, matScene, matShadow].forEach((element) => cancelAnimations(element));
  clearStyle(matStrap, ["opacity", "transform"]);
  clearStyle(matPanelLeft, ["filter", "transform"]);
  clearStyle(matPanelRight, ["filter", "transform"]);
  clearStyle(matScene, ["transform"]);
  clearStyle(matShadow, ["opacity", "filter", "transform"]);
  stage.classList.remove("is-folded");
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
  const introDuration = motionDuration(720, 70);
  const morphDuration = motionDuration(1040, 110);
  const source = `assets/images/photo${number}.jpg`;

  setSvgHref(morphFullImage, source);
  setSvgHref(morphCropImage, source);
  morphPath.setAttribute("d", startPath);
  morphEdge.setAttribute("d", startPath);
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
  await pause(motionDuration(240, 0));
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

  const pathMorphs = [
    morphSvgPath(morphPath, startPath, targetPath, morphDuration),
    morphSvgPath(morphEdge, startPath, targetPath, morphDuration)
  ];

  await Promise.all([
    waitForAnimations([shellAnimation, fullFade, cropReveal, veilFade]),
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
      easing: "cubic-bezier(.28,.02,.18,1)",
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
  const moveDuration = motionDuration(980, 100);
  const changeDuration = motionDuration(620, 90);
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

  await animationFinished(snapAt("25%", "50%", "12%"));
  if (token !== runId) return false;
  await pause(motionDuration(140, 0));

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
  const duration = motionDuration(1060, 110);
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
    { duration, delay: motionDuration(260, 0), easing: "cubic-bezier(.18,.74,.22,1)", fill: "forwards" }
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
  const piece = pieces.get(6);
  const clip = piece.querySelector(".piece-clip");
  const edge = piece.querySelector(".piece-edge");
  const fromPath = shapePaths[6];
  const toPath = shapePaths["6-transformed"];
  const duration = motionDuration(980, 100);
  const layout = { left: "61%", top: "70%", width: "23%", height: "40.89%" };

  const movement = animatePieceTo(piece, layout, duration, 0, {
    rotation: "-1deg",
    overshoot: 1.035
  });
  const glow = snapAt(layout.left, layout.top, "23%", duration);

  await Promise.all([
    waitForAnimations([movement, glow]),
    morphSvgPath(clip, fromPath, toPath, duration),
    morphSvgPath(edge, fromPath, toPath, duration)
  ]);
  if (token !== runId) return false;

  cancelAnimations(piece);
  commitPieceLayout(piece, layout, "-1deg");
  clip.setAttribute("d", toPath);
  edge.setAttribute("d", toPath);
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
    { duration, delay, easing: "cubic-bezier(.34,.02,.18,1)", fill: "forwards" }
  );
}

async function assembleOuterPieces(token) {
  const duration = motionDuration(1180, 120);
  const stagger = reduceMotion.matches ? 0 : 65;
  const sequence = [
    { number: 7, start: "translate(0,-22%) scale(.82) rotate(-2deg)", destination: { left: "50%", top: "25%" } },
    { number: 8, start: "translate(23%,0) scale(.82) rotate(2deg)", destination: { left: "75%", top: "50%" } },
    { number: 9, start: "translate(0,22%) scale(.82) rotate(2deg)", destination: { left: "50%", top: "75%" } },
    { number: 6, start: "translate(-23%,0) scale(.82) rotate(-2deg)", destination: { left: "25%", top: "50%" } }
  ];

  assemblyBoard.hidden = false;
  const animations = [];
  sequence.forEach(({ number, start, destination }, index) => {
    const loose = pieces.get(number);
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
      { duration, delay, easing: "cubic-bezier(.28,.02,.18,1)", fill: "forwards" }
    ));
  });
  animations.push(snapAt("50%", "50%", "62%", duration + stagger * 3));

  await waitForAnimations(animations);
  if (token !== runId) return false;

  sequence.forEach(({ number }) => {
    const loose = pieces.get(number);
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
  const moveDuration = motionDuration(840, 90);
  const revealDuration = motionDuration(560, 80);
  const centerLayout = { left: "50%", top: "50%", width: "20%", height: "35.56%" };

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
  const centerDuration = motionDuration(620, 80);
  const outerDuration = motionDuration(760, 90);
  const outerStagger = reduceMotion.matches ? 0 : 70;
  const center = finalRegions.get(10);
  const outerOrder = [7, 8, 9, 6];

  finalBoard.hidden = false;
  finalRegions.forEach((region) => {
    region.style.opacity = "0";
    region.style.transform = "scale(.94)";
    region.style.filter = "sepia(.5) brightness(1.18) blur(4px)";
  });
  finalSeams.style.opacity = "0";
  finalShade.style.opacity = "0";

  const centerReveal = center.animate(
    [
      { opacity: 0, filter: "sepia(.65) brightness(1.3) blur(5px)", transform: "scale(.82)" },
      { opacity: 1, filter: "sepia(.08) brightness(1.07) blur(0px)", transform: "scale(1.03)", offset: 0.8 },
      { opacity: 1, filter: "sepia(0) brightness(1) blur(0px)", transform: "scale(1)" }
    ],
    { duration: centerDuration, easing: "cubic-bezier(.18,.76,.2,1)", fill: "forwards" }
  );
  await animationFinished(centerReveal);
  if (token !== runId) return false;

  const outerAnimations = outerOrder.map((number, index) => finalRegions.get(number).animate(
    [
      { opacity: 0, filter: "sepia(.52) brightness(1.24) blur(4px)", transform: "scale(.92)" },
      { opacity: 1, filter: "sepia(.06) brightness(1.06) blur(0px)", transform: "scale(1.018)", offset: 0.82 },
      { opacity: 1, filter: "sepia(0) brightness(1) blur(0px)", transform: "scale(1)" }
    ],
    {
      duration: outerDuration,
      delay: index * outerStagger,
      easing: "cubic-bezier(.18,.74,.22,1)",
      fill: "forwards"
    }
  ));
  const seamsReveal = finalSeams.animate(
    [{ opacity: 0 }, { opacity: 0, offset: 0.44 }, { opacity: 1 }],
    {
      duration: outerDuration + outerStagger * (outerOrder.length - 1),
      easing: "ease-out",
      fill: "forwards"
    }
  );
  const shadeReveal = finalShade.animate(
    [{ opacity: 0 }, { opacity: 0, offset: 0.36 }, { opacity: 0.42 }],
    {
      duration: outerDuration + outerStagger * (outerOrder.length - 1),
      easing: "ease-out",
      fill: "forwards"
    }
  );

  await waitForAnimations([...outerAnimations, seamsReveal, shadeReveal]);
  if (token !== runId) return false;

  finalRegions.forEach((region) => {
    cancelAnimations(region);
    region.style.opacity = "1";
    region.style.filter = "sepia(0) brightness(1) blur(0px)";
    region.style.transform = "scale(1)";
  });
  cancelAnimations(finalSeams);
  finalSeams.style.opacity = "1";
  cancelAnimations(finalShade);
  finalShade.style.opacity = "0.42";
  assemblyBoard.hidden = true;
  stage.classList.add("is-final");
  return true;
}

async function runCurrentStep(token) {
  if (currentStep === 0) return unfoldMat(token);
  if (currentStep >= 1 && currentStep <= 6) return revealMemory(currentStep, token);
  if (currentStep === 7) return mergeFirstPair(token);
  if (currentStep === 8) return growMemory(3, 8, token);
  if (currentStep === 9) return growMemory(5, 9, token);
  if (currentStep === 10) return transformSix(token);
  if (currentStep === 11) return assembleOuterPieces(token);
  if (currentStep === 12) return completeCenterPiece(token);
  if (currentStep === 13) return revealFinalPhotograph(token);
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

advanceControl.addEventListener("click", advancePuzzle);
restartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  resetPuzzle();
});

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
