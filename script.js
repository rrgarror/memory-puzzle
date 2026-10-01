"use strict";

const stage = document.getElementById("puzzleStage");
const advanceControl = document.getElementById("advanceControl");
const restartButton = document.getElementById("restartButton");
const statusText = document.getElementById("puzzleStatus");
const photoReveal = document.getElementById("photoReveal");
const revealImage = document.getElementById("revealImage");
const completionFrame = document.getElementById("completionFrame");
const finalBoard = document.getElementById("finalBoard");
const finalTiles = [...document.querySelectorAll(".final-tile")];
const finalSeams = document.querySelector(".final-seams");
const joinGlow = document.getElementById("joinGlow");
const pieces = new Map(
  [...document.querySelectorAll(".puzzle-piece")].map((piece) => [Number(piece.dataset.piece), piece])
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const stepLabels = [
  "Show the Mom memory",
  "Show the Dad memory",
  "Show the farm memory",
  "Show the tasting memory",
  "Show the friends memory",
  "Show the championship memory",
  "Join the first two puzzle pieces",
  "Transform the farm puzzle piece",
  "Transform the friends puzzle piece",
  "Assemble the puzzle around the tasting piece",
  "Complete the puzzle with the tasting piece",
  "Flip the puzzle to the final photograph"
];

const completionMessages = [
  "Mom memory placed",
  "Dad memory placed",
  "Farm memory placed",
  "Tasting memory placed",
  "Friends memory placed",
  "Championship memory placed",
  "The first two pieces formed a new piece",
  "The farm piece transformed",
  "The friends piece transformed",
  "The puzzle assembled with one space remaining",
  "The puzzle shape is complete",
  "The final photograph is displayed as a puzzle"
];

const assembledLayout = new Map([
  [7, { left: "26%", top: "50%", width: "32%", height: "72%" }],
  [8, { left: "50%", top: "32%", width: "32%", height: "48%" }],
  [9, { left: "74%", top: "32%", width: "32%", height: "48%" }],
  [6, { left: "74%", top: "68%", width: "32%", height: "48%" }],
  [10, { left: "50%", top: "68%", width: "32%", height: "48%" }]
]);

let currentStep = 0;
let busy = false;
let runId = 0;

function motionDuration(standard, reduced = 90) {
  return reduceMotion.matches ? reduced : standard;
}

function cssValue(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

function percentNumber(value) {
  return Number.parseFloat(value.replace("%", ""));
}

function restingTransform(element, scale = 1, rotation = null) {
  const angle = rotation ?? (cssValue(element, "--rotation") || "0deg");
  return `translate(-50%, -50%) rotate(${angle}) scale(${scale})`;
}

function cancelAnimations(element, subtree = false) {
  element.getAnimations({ subtree }).forEach((animation) => animation.cancel());
}

function clearPieceState(piece) {
  ["left", "top", "width", "height", "opacity", "filter", "transform"].forEach((property) => {
    piece.style.removeProperty(property);
  });
}

function clearFinalTile(tile) {
  ["opacity", "filter", "transform"].forEach((property) => tile.style.removeProperty(property));
}

function animationFinished(animation) {
  return animation.finished.catch(() => undefined);
}

async function waitForAnimations(animations) {
  await Promise.all(animations.map(animationFinished));
}

function commitLayout(piece, layout) {
  piece.style.left = layout.left;
  piece.style.top = layout.top;
  piece.style.width = layout.width;
  piece.style.height = layout.height;
  piece.style.opacity = "1";
  piece.style.filter = "brightness(1) blur(0px)";
  piece.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
}

function updateInterface() {
  stage.dataset.step = String(currentStep);
  advanceControl.disabled = busy || stage.classList.contains("is-loading") || currentStep >= stepLabels.length;
  advanceControl.setAttribute(
    "aria-label",
    currentStep < stepLabels.length ? stepLabels[currentStep] : "Puzzle complete"
  );
}

function resetPuzzle({ announce = true } = {}) {
  runId += 1;
  busy = false;
  currentStep = 0;

  stage.classList.remove("is-assembled", "is-complete", "is-final");
  stage.classList.add("is-empty");

  for (const piece of pieces.values()) {
    cancelAnimations(piece, true);
    clearPieceState(piece);
    piece.hidden = true;
  }

  cancelAnimations(photoReveal, true);
  photoReveal.hidden = true;
  photoReveal.style.removeProperty("opacity");
  revealImage.removeAttribute("src");
  revealImage.style.removeProperty("opacity");
  revealImage.style.removeProperty("filter");
  revealImage.style.removeProperty("transform");

  cancelAnimations(completionFrame);
  completionFrame.hidden = true;
  completionFrame.style.removeProperty("opacity");
  completionFrame.style.removeProperty("filter");
  completionFrame.style.removeProperty("transform");

  cancelAnimations(finalBoard, true);
  finalBoard.hidden = true;
  finalTiles.forEach(clearFinalTile);
  finalSeams.style.removeProperty("opacity");

  cancelAnimations(joinGlow);
  ["left", "top", "width", "height", "opacity", "transform"].forEach((property) => {
    joinGlow.style.removeProperty(property);
  });

  statusText.textContent = announce ? "Puzzle restarted" : "Puzzle ready";
  updateInterface();
}

function glowAt(left, top, width, height, duration) {
  joinGlow.style.left = left;
  joinGlow.style.top = top;
  joinGlow.style.width = width;
  joinGlow.style.height = height;

  return joinGlow.animate(
    [
      { opacity: 0, transform: "translate(-50%, -50%) scale(.38)" },
      { opacity: 0.72, transform: "translate(-50%, -50%) scale(1.02)", offset: 0.5 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.62)" }
    ],
    {
      duration,
      easing: "cubic-bezier(.2,.72,.28,1)",
      fill: "none"
    }
  );
}

async function revealMemory(number, token) {
  const piece = pieces.get(number);
  const targetLeft = cssValue(piece, "--x");
  const targetTop = cssValue(piece, "--y");
  const targetRotation = cssValue(piece, "--rotation") || "0deg";
  const targetWidth = percentNumber(cssValue(piece, "--w"));
  const openingScale = Math.min(3.1, 64 / targetWidth);
  const introDuration = motionDuration(720, 70);
  const settleDuration = motionDuration(920, 100);

  revealImage.src = `assets/images/photo${number}.jpg`;
  photoReveal.hidden = false;

  const veilAnimation = photoReveal.animate(
    [
      { opacity: 0 },
      { opacity: 1 }
    ],
    { duration: introDuration * 0.55, easing: "ease-out", fill: "both" }
  );

  const imageAnimation = revealImage.animate(
    [
      { opacity: 0, filter: "brightness(.72) blur(3px)", transform: "scale(1.17)" },
      { opacity: 1, filter: "brightness(1.04) blur(0px)", transform: "scale(1.025)", offset: 0.72 },
      { opacity: 1, filter: "brightness(1) blur(0px)", transform: "scale(1)" }
    ],
    { duration: introDuration, easing: "cubic-bezier(.18,.76,.2,1)", fill: "both" }
  );

  await waitForAnimations([veilAnimation, imageAnimation]);
  if (token !== runId) return false;

  piece.hidden = false;

  const pieceAnimation = piece.animate(
    [
      {
        left: "50%",
        top: "50%",
        opacity: 0,
        filter: "brightness(1.22) blur(4px)",
        transform: `translate(-50%, -50%) rotate(0deg) scale(${openingScale})`
      },
      {
        left: "50%",
        top: "50%",
        opacity: 1,
        filter: "brightness(1.12) blur(0px)",
        transform: `translate(-50%, -50%) rotate(0deg) scale(${openingScale * 0.96})`,
        offset: 0.2
      },
      {
        left: targetLeft,
        top: targetTop,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${targetRotation}) scale(1)`
      }
    ],
    {
      duration: settleDuration,
      easing: "cubic-bezier(.2,.78,.2,1)",
      fill: "both"
    }
  );

  const fadeAnimation = photoReveal.animate(
    [
      { opacity: 1 },
      { opacity: 0, offset: 0.76 },
      { opacity: 0 }
    ],
    {
      duration: settleDuration * 0.72,
      easing: "ease-in",
      fill: "both"
    }
  );

  const glowAnimation = glowAt(targetLeft, targetTop, "24%", "42%", settleDuration);
  await waitForAnimations([pieceAnimation, fadeAnimation, glowAnimation]);
  if (token !== runId) return false;

  cancelAnimations(piece);
  clearPieceState(piece);
  piece.hidden = false;
  cancelAnimations(photoReveal, true);
  photoReveal.hidden = true;
  photoReveal.style.removeProperty("opacity");
  revealImage.style.removeProperty("opacity");
  revealImage.style.removeProperty("filter");
  revealImage.style.removeProperty("transform");
  return true;
}

function moveAndFade(piece, left, top, scale, duration) {
  const style = getComputedStyle(piece);

  return piece.animate(
    [
      {
        left: style.left,
        top: style.top,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        transform: style.transform
      },
      {
        left,
        top,
        opacity: 1,
        filter: "brightness(1.08) blur(0px)",
        transform: `translate(-50%, -50%) rotate(0deg) scale(${scale})`,
        offset: 0.76
      },
      {
        left,
        top,
        opacity: 0,
        filter: "brightness(1.22) blur(3px)",
        transform: `translate(-50%, -50%) rotate(0deg) scale(${scale})`
      }
    ],
    {
      duration,
      easing: "cubic-bezier(.48,.02,.2,1)",
      fill: "forwards"
    }
  );
}

function appearPiece(piece, duration, delay = 0, initialScale = 0.9) {
  piece.hidden = false;
  const rotation = cssValue(piece, "--rotation") || "0deg";

  return piece.animate(
    [
      {
        opacity: 0,
        filter: "brightness(1.25) blur(5px)",
        transform: `translate(-50%, -50%) rotate(${rotation}) scale(${initialScale})`
      },
      {
        opacity: 1,
        filter: "brightness(1.06) blur(0px)",
        transform: `translate(-50%, -50%) rotate(${rotation}) scale(1.025)`,
        offset: 0.76
      },
      {
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        transform: restingTransform(piece)
      }
    ],
    {
      duration,
      delay,
      easing: "cubic-bezier(.16,.78,.24,1)",
      fill: "both"
    }
  );
}

async function mergeFirstPair(token) {
  const first = pieces.get(1);
  const second = pieces.get(2);
  const result = pieces.get(7);
  const movementDuration = motionDuration(1100, 110);
  const revealDuration = motionDuration(560, 90);
  const revealDelay = motionDuration(650, 35);

  const animations = [
    moveAndFade(first, "22%", "34%", 1.32, movementDuration),
    moveAndFade(second, "22%", "66%", 1.32, movementDuration),
    appearPiece(result, revealDuration, revealDelay, 0.93),
    glowAt("22%", "50%", "31%", "68%", movementDuration)
  ];

  await waitForAnimations(animations);
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
  const duration = motionDuration(1050, 110);
  const revealDuration = motionDuration(540, 90);
  const revealDelay = motionDuration(570, 35);
  const targetLeft = cssValue(result, "--x");
  const targetTop = cssValue(result, "--y");
  const targetScale = percentNumber(cssValue(result, "--w")) / percentNumber(cssValue(source, "--w"));

  const animations = [
    moveAndFade(source, targetLeft, targetTop, targetScale, duration),
    appearPiece(result, revealDuration, revealDelay, 0.88),
    glowAt(targetLeft, targetTop, "32%", "55%", duration)
  ];

  await waitForAnimations(animations);
  if (token !== runId) return false;

  cancelAnimations(source);
  clearPieceState(source);
  source.hidden = true;
  cancelAnimations(result);
  clearPieceState(result);
  result.hidden = false;
  return true;
}

function animateToLayout(piece, layout, duration, delay = 0) {
  const style = getComputedStyle(piece);

  return piece.animate(
    [
      {
        left: style.left,
        top: style.top,
        width: style.width,
        height: style.height,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        transform: style.transform
      },
      {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        opacity: 1,
        filter: "brightness(1.06) blur(0px)",
        transform: "translate(-50%, -50%) rotate(0deg) scale(1.015)",
        offset: 0.82
      },
      {
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
        transform: "translate(-50%, -50%) rotate(0deg) scale(1)"
      }
    ],
    {
      duration,
      delay,
      easing: "cubic-bezier(.46,.02,.18,1)",
      fill: "forwards"
    }
  );
}

async function assembleAroundGap(token) {
  const trigger = pieces.get(6);
  const pulseDuration = motionDuration(420, 70);
  const moveDuration = motionDuration(1280, 130);

  const pulse = trigger.animate(
    [
      { filter: "brightness(1)", transform: restingTransform(trigger) },
      { filter: "brightness(1.22)", transform: restingTransform(trigger, 1.13), offset: 0.48 },
      { filter: "brightness(1)", transform: restingTransform(trigger) }
    ],
    { duration: pulseDuration, easing: "ease-in-out" }
  );

  await animationFinished(pulse);
  if (token !== runId) return false;

  const movingPieces = [7, 8, 9, 6].map((number) => pieces.get(number));
  const animations = movingPieces.map((piece, index) =>
    animateToLayout(
      piece,
      assembledLayout.get(Number(piece.dataset.piece)),
      moveDuration,
      reduceMotion.matches ? 0 : index * 45
    )
  );
  animations.push(glowAt("50%", "50%", "76%", "86%", moveDuration));

  await waitForAnimations(animations);
  if (token !== runId) return false;

  movingPieces.forEach((piece) => {
    cancelAnimations(piece);
    commitLayout(piece, assembledLayout.get(Number(piece.dataset.piece)));
  });
  stage.classList.add("is-assembled");
  return true;
}

async function completeWithFourth(token) {
  const source = pieces.get(4);
  const result = pieces.get(10);
  const morphDuration = motionDuration(620, 90);
  const moveDuration = motionDuration(1120, 120);

  result.hidden = false;

  const sourceAnimation = source.animate(
    [
      { opacity: 1, filter: "brightness(1)", transform: restingTransform(source) },
      { opacity: 1, filter: "brightness(1.24)", transform: restingTransform(source, 1.08), offset: 0.48 },
      { opacity: 0, filter: "brightness(1.28) blur(3px)", transform: restingTransform(source, 0.94) }
    ],
    { duration: morphDuration, easing: "cubic-bezier(.22,.72,.24,1)", fill: "forwards" }
  );

  const resultAnimation = appearPiece(result, morphDuration * 0.72, morphDuration * 0.34, 0.9);
  const firstGlow = glowAt(cssValue(result, "--x"), cssValue(result, "--y"), "26%", "46%", morphDuration);

  await waitForAnimations([sourceAnimation, resultAnimation, firstGlow]);
  if (token !== runId) return false;

  cancelAnimations(source);
  clearPieceState(source);
  source.hidden = true;
  cancelAnimations(result);
  clearPieceState(result);
  result.hidden = false;

  completionFrame.hidden = false;
  const frameAnimation = completionFrame.animate(
    [
      { opacity: 0, filter: "brightness(1.5)", transform: "scale(.985)" },
      { opacity: 1, filter: "brightness(1)", transform: "scale(1)" }
    ],
    { duration: moveDuration, delay: motionDuration(380, 0), easing: "ease-out", fill: "both" }
  );

  const moveAnimation = animateToLayout(result, assembledLayout.get(10), moveDuration);
  const secondGlow = glowAt("50%", "68%", "38%", "54%", moveDuration);
  await waitForAnimations([frameAnimation, moveAnimation, secondGlow]);
  if (token !== runId) return false;

  cancelAnimations(result);
  commitLayout(result, assembledLayout.get(10));
  cancelAnimations(completionFrame);
  completionFrame.style.opacity = "1";
  stage.classList.add("is-complete");
  return true;
}

async function flipToFinalPhotograph(token) {
  const duration = motionDuration(720, 100);
  const stagger = reduceMotion.matches ? 0 : 95;

  finalBoard.hidden = false;
  finalTiles.forEach(clearFinalTile);
  finalSeams.style.opacity = "0";

  const tileAnimations = finalTiles.map((tile, index) =>
    tile.animate(
      [
        {
          opacity: 0,
          filter: "brightness(.56) saturate(.72)",
          transform: "rotateY(90deg) scale(.96)"
        },
        {
          opacity: 1,
          filter: "brightness(1.08) saturate(1.04)",
          transform: "rotateY(-4deg) scale(1.006)",
          offset: 0.82
        },
        {
          opacity: 1,
          filter: "brightness(1) saturate(1)",
          transform: "rotateY(0deg) scale(1)"
        }
      ],
      {
        duration,
        delay: index * stagger,
        easing: "cubic-bezier(.2,.72,.22,1)",
        fill: "forwards"
      }
    )
  );

  const seamsAnimation = finalSeams.animate(
    [
      { opacity: 0 },
      { opacity: 0, offset: 0.62 },
      { opacity: 1 }
    ],
    {
      duration: duration + stagger * (finalTiles.length - 1),
      easing: "ease-out",
      fill: "forwards"
    }
  );

  const frameFade = completionFrame.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      duration: motionDuration(360, 50),
      delay: duration * 0.65,
      easing: "ease-in",
      fill: "forwards"
    }
  );

  await waitForAnimations([...tileAnimations, seamsAnimation, frameFade]);
  if (token !== runId) return false;

  [6, 7, 8, 9, 10].forEach((number) => {
    const piece = pieces.get(number);
    cancelAnimations(piece);
    piece.hidden = true;
  });

  finalTiles.forEach((tile) => {
    cancelAnimations(tile);
    tile.style.opacity = "1";
    tile.style.filter = "brightness(1) saturate(1)";
    tile.style.transform = "rotateY(0deg) scale(1)";
  });
  cancelAnimations(finalSeams);
  finalSeams.style.opacity = "1";
  completionFrame.hidden = true;
  stage.classList.add("is-final");
  return true;
}

async function runCurrentStep(token) {
  if (currentStep < 6) return revealMemory(currentStep + 1, token);
  if (currentStep === 6) return mergeFirstPair(token);
  if (currentStep === 7) return growMemory(3, 8, token);
  if (currentStep === 8) return growMemory(5, 9, token);
  if (currentStep === 9) return assembleAroundGap(token);
  if (currentStep === 10) return completeWithFourth(token);
  if (currentStep === 11) return flipToFinalPhotograph(token);
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
