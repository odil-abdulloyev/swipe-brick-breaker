import Shape from './shape';
import Point2D from './point2d';

export default class Ellipse extends Shape {
  get center(): Point2D {
    return new Point2D(
      this.position.x + Math.floor(this.width / 2),
      this.position.y + Math.floor(this.height / 2),
    );
  }

  draw(isFilled: boolean = false) {
    this.context.beginPath();
    this.context.ellipse(
      this.position.x + Math.floor(this.width / 2),
      this.position.y + Math.floor(this.height / 2),
      Math.floor(this.width / 2),
      Math.floor(this.height / 2),
      0,
      0,
      2 * Math.PI,
    );
    super.draw(isFilled);
  }
}
