import { Circle } from './lib/lib';

export default class Ball extends Circle {
  constructor(context, position, radius) {
    super(context, position, radius);
    this.speed = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  stop() {
    this.vx = 0;
    this.vy = 0;
  }

  normalizeSpeed() {
    if (Math.abs(this.vy) < 1) {
      this.vx = +(0.8 * this.speed).toFixed(2);
      this.vy = +(0.2 * this.speed).toFixed(2);
    }
  }

  draw(color) {
    this.context.save();
    this.context.fillStyle = color;
    super.draw(true);
    this.context.restore();
  }
}
