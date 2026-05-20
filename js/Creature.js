export class Creature {
  constructor(name, x, y, speed, strength, gene, generation, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.strength = strength;
    this.gene = gene;
    this.generation = generation;
    this.direction = Math.random() * 2 * Math.PI;
    this.visionRange = Math.random() * 100 + 50;
    this.MIN_INTERACTION_TIME = 10_000; // 10 seconds
    this.timeSinceLastInteraction = 0;
    this.color = color;

    this.birthTime = Date.now();
  }

  #distanceTo(other) {
    return Math.hypot(this.x - other.x, this.y - other.y);
  }

  #colorDistance(color1, color2) {
    if (color1 === "gold" || color2 === "gold") {
      return Math.random() * 50 + 50; // Random distance for gold to add unpredictability
    }

    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);

    return Math.sqrt(
      (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2,
    );
  }

  #compatibilityWith(other) {
    const strengthDiff = Math.abs(this.strength - other.strength);
    const speedDiff = Math.abs(this.speed - other.speed);
    const externalFactor = Math.random() + 0.5; // Random factor to add some unpredictability

    let compatibility = (20 / (strengthDiff + speedDiff)) * externalFactor; // Higher compatibility for similar strength and speed

    const colorDiff = this.#colorDistance(this.color, other.color);

    if (colorDiff < 100) {
      compatibility *= 1.5; // Boost compatibility for similar colors
    } else if (colorDiff > 200) {
      compatibility *= 0.75; // Reduce compatibility for very different colors
    }

    if (this.gene.some((gene) => other.gene.includes(gene))) {
      compatibility *= 1.5; // Boost compatibility for shared genes
    }

    return compatibility;
  }

  #mix(value1, value2) {
    const meRatio = Math.random();
    const otherRatio = 1 - meRatio;
    const mutation = 0.8 + Math.random() * 0.4; // Mutation factor between 0.8 and 1.2

    return (value1 * meRatio + value2 * otherRatio) * mutation;
  }

  #mixColors(color1, color2) {
    if (color1 === "gold" || color2 === "gold") {
      return "gold"; // If either parent is gold, child is gold
    }

    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);

    const factor = Math.random(); // Random factor to mix colors

    const mixed = c1.map((c, i) =>
      Math.round(c * factor + c2[i] * (1 - factor)),
    );

    return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
  }

  get size() {
    return this.strength / 3;
  }

  #move(deltaTime) {
    const moveSpeed = (Math.random() * this.speed) / Math.sqrt(this.size); // Larger creatures move slower

    this.x += (Math.cos(this.direction) * moveSpeed * deltaTime) / 1000;
    this.y += (Math.sin(this.direction) * moveSpeed * deltaTime) / 1000;
  }

  #canInteractWith(other) {
    if (this.timeSinceLastInteraction < this.MIN_INTERACTION_TIME) return false;

    const dist = this.#distanceTo(other);
    return dist <= Math.max(this.size, other.size) + 10; // Interaction occurs when creatures are close enough (size-based threshold)
  }

  eat(prey) {
    const strengthGained = prey.strength * (0.25 + Math.random() * 0.25); // Gain 25-50% of prey's strength
    this.strength += strengthGained;

    const speedGained = prey.speed * (0.25 + Math.random() * 0.25); // Gain 25-50% of prey's speed
    this.speed += speedGained;
  }

  #joinNames(name1, name2) {
    const parts1 = name1.split(" ").filter((part) => isNaN(part[0])); // Ignore grade suffixes
    const parts2 = name2.split(" ").filter((part) => isNaN(part[0])); // Ignore grade suffixes
    const nameComponents = {};

    parts1.forEach((part) => {
      nameComponents[part] = (nameComponents[part] || 0) + 1;
    });

    parts2.forEach((part) => {
      nameComponents[part] = (nameComponents[part] || 0) + 1;
    });

    const gradeSuffixes = ["nd", "rd"];

    const sortedParts = Object.entries(nameComponents)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .map(
        ([part, grade]) =>
          `${part} ${grade + 1}${gradeSuffixes[grade] || "th"}`,
      ); // Format as "name grade"

    return sortedParts.join(" ");
  }

  #reproduceWith(partner) {
    let childStrength = this.#mix(this.strength, partner.strength);
    let childSpeed = this.#mix(this.speed, partner.speed);

    const childX = (this.x + partner.x) / 2 + (Math.random() - 0.5) * 20; // Spawn near parents
    const childY = (this.y + partner.y) / 2 + (Math.random() - 0.5) * 20;
    const childColor = this.#mixColors(this.color, partner.color);

    const gene = [...new Set([...this.gene, ...partner.gene])];

    if (gene.includes("god")) {
      childStrength *= 2; // God gene doubles strength
      childSpeed *= 2; // God gene doubles speed
    }

    const child = new Creature(
      this.#joinNames(this.name, partner.name),
      childX,
      childY,
      childSpeed,
      childStrength,
      gene,
      Math.max(this.generation, partner.generation) + 1,
      childColor,
    );

    return child;
  }

  dead(creatures) {
    console.log(
      `${this.name} has died at age ${Math.floor((Date.now() - this.birthTime) / 1000)} seconds.`,
    );

    const index = creatures.indexOf(this);
    if (index > -1) {
      creatures.splice(index, 1); // Remove this creature from the ecosystem
    }
  }

  #interactWith(other, creatures) {
    const compatibility = this.#compatibilityWith(other);

    if (compatibility > 0.55) {
      const child = this.#reproduceWith(other);

      creatures.push(child);

      this.timeSinceLastInteraction = 0;
      other.timeSinceLastInteraction = 0;
    } else if (compatibility < 0.3) {
      if (this.strength > other.strength) {
        // This creature wins
        this.eat(other);
        other.dead(creatures);
      } else {
        // Other creature wins
        other.eat(this);

        this.dead(creatures);
      }

      this.timeSinceLastInteraction = 0;
      other.timeSinceLastInteraction = 0;
    }
  }

  #interact(creatures) {
    let interactions = 0;
    creatures.forEach((other) => {
      if (other === this) return; // Limit interactions per frame

      if (this.#canInteractWith(other)) {
        this.#interactWith(other, creatures);
        interactions++;
      }
    });
  }

  #findNearest(creatures) {
    const p = this.timeSinceLastInteraction * Math.random(); // Randomize search frequency based on time since last interaction
    if (p < 7500) return; // Only search for nearest creature occasionally

    const nearest = this.#getNearest(creatures);

    if (nearest) {
      const angleToNearest = Math.atan2(nearest.y - this.y, nearest.x - this.x);
      const compatibility = this.#compatibilityWith(nearest);

      if (this.strength > nearest.strength || compatibility > 0.5) {
        this.direction = angleToNearest; // Move towards weaker creature
      } else {
        this.direction = (angleToNearest + Math.PI) % (2 * Math.PI); // Move away from stronger creature
      }
    }
  }

  #naturalDeath() {
    if (this.timeSinceLastInteraction > 20000) {
      if (Math.random() < 0.25) {
        // 25% chance of dying after 20 seconds without interaction
        return true;
      } else {
        this.timeSinceLastInteraction = 15000; // Reset timer to give creature another chance to interact
      }
    }
    return false;
  }

  update(deltaTime, creatures) {
    this.#move(deltaTime);
    this.#findNearest(creatures);

    this.direction += (Math.random() - 0.5) * 0.1; // Randomly change direction
    this.direction = this.direction % (2 * Math.PI); // Keep direction within 0 to 2π

    this.timeSinceLastInteraction += deltaTime;

    if (this.#naturalDeath()) {
      this.dead(creatures);
      return;
    }

    this.#interact(creatures);
  }

  draw(ctx) {
    if (
      this.x < 0 ||
      this.x > ctx.canvas.width ||
      this.y < 0 ||
      this.y > ctx.canvas.height
    ) {
      this.direction =
        (this.direction + Math.PI + Math.random() * Math.PI) % (2 * Math.PI); // Reverse direction
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  #getNearest(creatures) {
    let nearest = null;
    let nearestDist = Infinity;

    for (const creature of creatures) {
      if (creature === this) continue;

      const dist = this.#distanceTo(creature);

      if (dist < nearestDist && dist <= this.visionRange) {
        nearest = creature;
        nearestDist = dist;
      }
    }

    return nearest;
  }
}
