import Ellipse from './ellipse';
import Point2D from './point2d';

export default class Circle extends Ellipse {
  radius: number;
  constructor(context: CanvasRenderingContext2D, position: Point2D, radius: number) {
    super(context, position, 2 * radius, 2 * radius);
    this.radius = radius;
  }
}
