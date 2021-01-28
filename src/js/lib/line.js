import Shape from './shape';

export default class Line extends Shape {
  constructor(context, begin, end) {
    super(context, begin, Math.abs(begin.x - end.x), Math.abs(begin.y - end.y));
    this.begin = begin;
    this.end = end;
  }

  draw() {
    this.context.beginPath();
    this.context.moveTo(this.begin.x, this.begin.y);
    this.context.lineTo(this.end.x, this.end.y);
    super.draw(false);
  }

  setDash(segments) {
    this.context.setLineDash(segments);
  }
}
