class Food {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.type = "Food";
  }
  
  show() {
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}