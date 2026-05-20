import { Creature } from "./Creature.js";
import { startMainLoop } from "./mainLoop.js";

const names = [
  "Astra",
  "Blaze",
  "Cinder",
  "Dusk",
  "Ember",
  "Frost",
  "Gale",
  "Haze",
  "Iris",
  "Jade",
  "Kale",
  "Luna",
  "Mistral",
  "Nova",
  "Orion",
  "Pyro",
  "Quill",
  "Rune",
  "Sable",
  "Tempest",
];

const godNames = [
  "Aether",
  "Nyx",
  "Erebus",
  "Hemera",
  "Chronos",
  "Ananke",
  "Eros",
  "Hades",
  "Poseidon",
  "Zeus",
  "Hera",
  "Demeter",
  "Apollo",
  "Artemis",
  "Ares",
  "Athena",
  "Hephaestus",
  "Hermes",
  "Dionysus",
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let generation = 0;

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let creatures = [];

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

const createCreature = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const speed = 50 + Math.random() * 100;
  const strength = 10 + Math.random() * 40;
  const gene = Math.random().toString(36).substring(2, 7); // Random gene string
  const color = randomColor();
  return new Creature(name, x, y, speed, strength, [gene], generation, color);
};

const populate = () => {
  for (let i = 0; i < 25; i++) {
    creatures.push(createCreature());
  }
};

const spawnGod = () => {
  const name = godNames[Math.floor(Math.random() * godNames.length)];
  creatures.push(
    new Creature(
      name,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      500 + Math.random() * 500,
      100 + Math.random() * 100,
      ["god"],
      -1, // Ancestral generation for gods
      "gold",
    ),
  );
};

let lastTime = 0;
let lastSecond = 0;

populate();

startMainLoop((timestamp) => {
  const deltaTime = timestamp - lastTime;
  let creaturesCopy = [...creatures]; // Create a copy to avoid issues with mutation during iteration

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  creatures.forEach((creature) => {
    creature.update(deltaTime, creaturesCopy);
    creature.draw(ctx);
  });

  creatures = creaturesCopy; // Update the original array after all interactions are processed
  lastTime = timestamp;

  if (timestamp - lastSecond >= 1000) {
    console.log("Creatures:", creatures.length);
    lastSecond = timestamp;
  }

  if (creatures.length === 0) {
    console.log("All creatures have died. Restarting ecosystem...");
    generation++;

    populate();
  } else if (creatures.length === 1) {
    console.log("Only one creature remains. Restarting ecosystem...");
    console.log(
      `Survivor: ${creatures[0].name} (Generation ${creatures[0].generation})`,
    );
    console.log(`Survivor's gene: ${creatures[0].gene.join(", ")}`);
    console.log(
      `Survivor's age: ${Math.floor((Date.now() - creatures[0].birthTime) / 1000)} seconds`,
    );

    creatures = [];
    populate();
  }

  if (Math.random() < 0.0001) {
    // 0.1% chance to spawn a god each frame
    spawnGod();
    console.log("A god has spawned!");
  }
});

window.addEventListener("resize", () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});

window.reset = () => {
  console.log("Resetting ecosystem for divine intervention...");
  creatures = [];
  populate();
};
