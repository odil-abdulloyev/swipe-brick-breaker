import Ellipse from './ellipse';

export default class Circle extends Ellipse {
  constructor(context, position, radius) {
    super(context, position, 2 * radius, 2 * radius);
    this.radius = radius;
  }
}
