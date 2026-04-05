class Predator {
  constructor(size, speed, agility, perception, energy, pos) {
    this.size = size;
    this.maxSpeed = speed;
    this.agility = agility;
    this.perception = perception;

    this.mass = this.size ** 3;
    if (this.mass < 0.3) this.mass = 0.3;

    this.eMax = 80 * this.mass;
    this.e = energy;
    if (this.e > this.eMax) this.e = this.eMax;

    this.pos = pos;
    this.vel = p5.Vector.fromAngle(random(TWO_PI));

    this.wanderTheta = 0;
    this.maxForce = this.agility / 10;

    this.type = "Predator";
    
    this.lastRepro = millis();
    
    this.state = "1"// Wander = 1, hunt = 2
  }

  consumeEnergy() {
    this.e -=
      0.0025 * this.mass * this.vel.mag() ** 2 +
      0.0008 * this.perception +
      0.02;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    beginShape();
    vertex(8 * this.size, 0);
    vertex(-8 * this.size, -4 * this.size);
    vertex(-8 * this.size, 4 * this.size);
    endShape();
    pop();
  }

  show2() {
    if (this.state === 1) fill(255, 0, 0);
    else fill(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    beginShape();
    vertex(8 * this.size, 0);
    vertex(-8 * this.size, -4 * this.size);
    vertex(-8 * this.size, 4 * this.size);
    endShape();
    pop();
  }

  wander() {
    const wanderD = 80;
    const wanderR = 25;
    const delta = 0.3;

    this.wanderTheta += random(-delta, delta);
    const circlePos = p5.Vector.add(this.pos, this.vel.copy().setMag(wanderD));
    const dir = this.vel.heading();
    const circleOffset = createVector(
      wanderR * cos(this.wanderTheta + dir),
      wanderR * sin(this.wanderTheta + dir)
    );
    const target = p5.Vector.add(circlePos, circleOffset);

    let desiredVector = p5.Vector.sub(target, this.pos);
    desiredVector.setMag(this.maxSpeed);

    let steer = p5.Vector.sub(desiredVector, this.vel);
    steer.limit(this.maxForce);

    this.vel.add(steer);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.boundaryLimit();
  }

  boundaryLimit() {
    if (this.pos.y >= height) this.pos.y -= height;
    if (this.pos.y < 0) this.pos.y += height;
    if (this.pos.x >= width) this.pos.x -= width;
    if (this.pos.x < 0) this.pos.x += width;
  }

  query(qt) {
    let target;
    let lowDist = Infinity;

    const pInRange = qt.query(
      new Rectangle(
        this.pos.x,
        this.pos.y,
        this.perception * 2,
        this.perception * 2
      )
    );

    for (let p of pInRange) {
      const targetDist = p5.Vector.dist(p.pos, this.pos);
      if (
        targetDist < this.perception &&
        targetDist < lowDist &&
        p.type === "Herbivore"
      ) {
        if (targetDist < 7 * this.size && this.size >= 0.85 * p.size) {
          this.e += 50 + p.mass * 20;
          if (this.e > this.eMax) this.e = this.eMax;
          herbivores.splice(herbivores.indexOf(p), 1);
        }

        target = p.pos.copy();
        lowDist = targetDist;
      }
    }

    if (!target) {
      this.wander();
      this.state = 1;
    }
    else {
      this.moveTowardFood(target, lowDist);
      this.state = 2;
    }
  }
  
  query2(array) {
    let target;
    let lowDist = Infinity;

    for (let p of array) {
      const targetDist = p5.Vector.dist(p.pos, this.pos);
      if (
        targetDist < this.perception &&
        targetDist < lowDist &&
        p.type === "Herbivore"
      ) {
        if (targetDist < 7 * this.size && this.size >= 0.85 * p.size) {
          this.e += 50 + p.mass * 20;
          if (this.e > this.eMax) this.e = this.eMax;
          herbivores.splice(herbivores.indexOf(p), 1);
        }

        target = p.pos.copy();
        lowDist = targetDist;
      }
    }

    if (!target) {
      this.wander();
      this.state = 1;
    }
    else {
      this.moveTowardFood(target, lowDist);
      this.state = 2;
    }
  }

  moveTowardFood(target, distance) {
    let desiredVector = p5.Vector.sub(target, this.pos);
    if (distance < 20) {
      const m = map(distance, 0, 20, this.maxSpeed / 2, this.maxSpeed);
      desiredVector.setMag(m);
    } else desiredVector.setMag(this.maxSpeed);

    let steer = p5.Vector.sub(desiredVector, this.vel);
    steer.limit(this.maxForce);

    this.vel.add(steer);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    this.boundaryLimit();
  }
  
  checkRepro() {
    const current = millis();
    if (current - 5000 >= this.lastRepro && this.e > 0.7 * this.eMax) {
      if (random() >= 0.92) {
        let childSize =
          random() < 0.9
            ? this.size
            : random() < 0.5
            ? this.size * 1.1
            : this.size * 0.9;
        let childSpeed =
          random() < 0.9
            ? this.maxSpeed
            : random() < 0.5
            ? this.maxSpeed * 1.1
            : this.maxSpeed * 0.9;
        let childAgility =
          random() < 0.9
            ? this.agility
            : random() < 0.5
            ? this.agility * 1.1
            : this.agility * 0.9;
        let childPerception =
          random() < 0.9
            ? this.perception
            : random() < 0.5
            ? this.perception * 1.1
            : this.perception * 0.9;

        if (childSize > 1.6) childSize = 1.6;
        if (childSize < 0.6) childSize = 0.6;
        if (childSpeed > 4.5) childSpeed = 4.5;
        if (childSpeed < 1) childSpeed = 1;
        if (childAgility > 1.6) childAgility = 1.6;
        if (childAgility < 0.6) childAgility = 0.6;
        if (childPerception > 140) childPerception = 140;
        if (childPerception < 30) childPerception = 30;

        predators.push(
          new Predator(
            childSize,
            childSpeed,
            childAgility,
            childPerception,
            this.eMax * 0.35,
            this.pos.copy()
          )
        );
        this.e -= this.eMax * 0.35;
        this.lastRepro = current;
      } else this.lastRepro = current - 4000;
    }
  }
}
