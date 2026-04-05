class QT {
  constructor(rectangle, capacity) {
    //From Rectangle class
    this.boundary = rectangle;
    this.divided = false;
    this.capacity = capacity;
    this.points = [];
  }

  insert(p) {
    //point
    if (!this.boundary.contains(p)) return false;

    if (this.points.length < this.capacity) this.points.push(p);
    else {
      if (!this.divided) this.subdivide();

      if (this.ne.insert(p)) return true;
      else if (this.nw.insert(p)) return true;
      else if (this.se.insert(p)) return true;
      else if (this.sw.insert(p)) return true;
    }
  }

  subdivide() {
    this.se = new QT(
      new Rectangle(
        this.boundary.x + this.boundary.w / 4,
        this.boundary.y + this.boundary.h / 4,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.capacity
    );
    this.ne = new QT(
      new Rectangle(
        this.boundary.x + this.boundary.w / 4,
        this.boundary.y - this.boundary.h / 4,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.capacity
    );
    this.sw = new QT(
      new Rectangle(
        this.boundary.x - this.boundary.w / 4,
        this.boundary.y + this.boundary.h / 4,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.capacity
    );
    this.nw = new QT(
      new Rectangle(
        this.boundary.x - this.boundary.w / 4,
        this.boundary.y - this.boundary.h / 4,
        this.boundary.w / 2,
        this.boundary.h / 2
      ),
      this.capacity
    );

    this.divided = true;
  }

  query(rangeRect, found) {
    if (!this.boundary.intersects(rangeRect)) return;

    if (!found) found = [];

    for (let p of this.points) {
      if (rangeRect.contains(p)) found.push(p);
    }

    if (this.divided) {
      this.ne.query(rangeRect, found);
      this.nw.query(rangeRect, found);
      this.se.query(rangeRect, found);
      this.sw.query(rangeRect, found);
    }

    return found;
  }

  show() {
    rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);

    for (let p of this.points) {
      point(p.pos.x, p.pos.y);
    }

    if (this.divided) {
      this.ne.show();
      this.nw.show();
      this.se.show();
      this.sw.show();
    }
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    //Center Pos (x,y), total width, total height
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(p) {
    //point
    return (
      p.pos.x >= this.x - this.w / 2 &&
      p.pos.x < this.x + this.w / 2 &&
      p.pos.y >= this.y - this.h / 2 &&
      p.pos.y < this.y + this.h / 2
    );
  }

  intersects(rectangle) {
    //Object of Rectangle class (qt.boundary)
    return !(
      rectangle.x + rectangle.w / 2 < this.x - this.w / 2 ||
      rectangle.x - rectangle.w / 2 > this.x + this.w / 2 ||
      rectangle.y + rectangle.h / 2 < this.y - this.h / 2 ||
      rectangle.y - rectangle.h / 2 > this.y + this.h / 2
    );
  }
}
