import { Point2D, Line } from './lib/lib';

function getMousePosition(event) {
  const rect = event.target.getBoundingClientRect();
  return new Point2D(event.clientX - rect.left, event.clientY - rect.top);
}

export default class Aim {
  constructor(context, origin) {
    this.context = context;
    this.origin = origin;
    this.vx = 0;
    this.vy = 0;
    this.isActive = false;
    this.isBlocked = false;
  }

  setOrigin(origin) {
    this.origin = origin;
  }

  handleMouseMove(event) {
    const { x, y } = getMousePosition(event);
    const x0 = this.origin.x;
    const y0 = this.origin.y;
    this.vx = x - x0;
    this.vy = y - y0;
  }

  draw(color) {
    this.context.save();
    const k = 9999;
    const end = new Point2D(this.origin.x + k * this.vx, this.origin.y + k * this.vy);
    const line = new Line(this.context, this.origin, end);
    this.context.strokeStyle = color;
    this.context.lineWidth = 3;
    line.setDash([10, 10]);
    line.draw();
    this.context.restore();
  }
}
