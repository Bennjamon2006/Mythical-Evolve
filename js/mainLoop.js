let loopId = null;
let lastTime = 0;
let fps = 0;

function mainLoop(timestamp, fn) {
  loopId = requestAnimationFrame((timestamp) => mainLoop(timestamp, fn));

  fps++;

  if (timestamp - lastTime >= 1000) {
    console.log("FPS:", fps);
    fps = 0;
    lastTime = timestamp;
  }

  fn(timestamp);
}

export function startMainLoop(fn) {
  if (!loopId) {
    mainLoop(0, fn);
  }
}

export function stopMainLoop() {
  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }
}
