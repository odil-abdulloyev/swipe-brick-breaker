import Point2D from './point2d';

export default abstract class Shape {
  context: CanvasRenderingContext2D;
  position: Point2D;
  width: number;
  height: number;
  vx: number;
  vy: number;

  constructor(context: CanvasRenderingContext2D, position: Point2D, width: number, height: number) {
    this.context = context;
    this.position = position;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
  }

  draw(isFilled: boolean = false): void {
    this.context.save();
    if (isFilled) {
      this.context.fill();
    } else {
      this.context.stroke();
    }
    this.context.restore();
  }

  clear(): void {
    this.context.clearRect(
      this.position.x - this.context.lineWidth,
      this.position.y - this.context.lineWidth,
      this.width + 2 * this.context.lineWidth,
      this.height + 2 * this.context.lineWidth,
    );
  }

  move(): void {
    this.position.x += this.vx;
    this.position.y += this.vy;
  }

  moveOn(vx: number, vy: number): void {
    this.position.x += vx;
    this.position.y += vy;
  }

  moveTo(x: number, y: number): void {
    this.position.x = x;
    this.position.y = y;
  }

  setVx(vx: number): void {
    this.vx = vx;
  }

  setVy(vy: number): void {
    this.vy = vy;
  }

  setPosition(position: Point2D) {
    this.position = position;
  }
}
