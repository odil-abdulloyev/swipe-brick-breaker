export default class Shape {
  constructor(context, position, width, height) {
    this.context = context;
    this.position = position;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
  }

  draw(isFilled = false) {
    this.context.save();
    if (isFilled) {
      this.context.fill();
    } else {
      this.context.stroke();
    }
    this.context.restore();
    return this;
  }

  clear() {
    this.context.clearRect(
      this.position.x - this.context.lineWidth,
      this.position.y - this.context.lineWidth,
      this.width + 2 * this.context.lineWidth,
      this.height + 2 * this.context.lineWidth,
    );
    return this;
  }

  move() {
    this.position.x += this.vx;
    this.position.y += this.vy;
    return this;
  }

  moveOn(vx, vy) {
    this.position.x += vx;
    this.position.y += vy;
    return this;
  }

  setVx(vx) {
    this.vx = vx;
    return this;
  }

  setVy(vy) {
    this.vy = vy;
    return this;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }
}
