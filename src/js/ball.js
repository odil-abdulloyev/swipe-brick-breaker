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
    if (this.vy === 0) {
      this.vx = Math.round(0.85 * this.speed);
      this.vy = Math.round(0.15 * this.speed);
    }
  }

  draw(color) {
    this.context.save();
    this.context.fillStyle = color;
    super.draw(true);
    this.context.restore();
  }
}
