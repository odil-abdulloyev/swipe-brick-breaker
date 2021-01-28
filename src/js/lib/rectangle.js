import Shape from './shape';

export default class Rectangle extends Shape {
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
