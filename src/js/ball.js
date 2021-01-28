import { Circle } from './lib/lib';

export default class Ball extends Circle {
  constructor(context, position, radius) {
    super(context, position, radius);
    this.speed = 0;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  draw(color) {
    this.context.save();
    this.context.fillStyle = color;
    super.draw(true);
    this.context.restore();
  }
}
