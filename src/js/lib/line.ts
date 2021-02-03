import Point2D from './point2d';
import Shape from './shape';

export default class Line extends Shape {
  begin: Point2D;
  end: Point2D;
  constructor(context: CanvasRenderingContext2D, begin: Point2D, end: Point2D) {
    super(context, begin, Math.abs(begin.x - end.x), Math.abs(begin.y - end.y));
    this.begin = begin;
    this.end = end;
  }

  draw(): void {
    this.context.beginPath();
    this.context.moveTo(this.begin.x, this.begin.y);
    this.context.lineTo(this.end.x, this.end.y);
    super.draw(false);
  }

  setDash(segments: Array<number>): void {
    this.context.setLineDash(segments);
  }
}
