export default class Point2D {
  constructor(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new TypeError('Invalid type of argument');
    }
    this.x = x;
    this.y = y;
  }
}
