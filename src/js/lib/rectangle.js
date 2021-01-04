import Shape from './shape';

export default class Rectangle extends Shape {
  constructor(context, position, width, height) {
    super(context, position, width, height);
  }

  draw(isFilled = false) {
    this.context.beginPath();
    this.context.rect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
    );
    super.draw(isFilled);
  }
}
