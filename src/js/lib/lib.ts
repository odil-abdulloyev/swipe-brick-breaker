export { default as Point2D } from './point2d';
export { default as Shape } from './shape';
export { default as Rectangle } from './rectangle';
export { default as Ellipse } from './ellipse';
export { default as Circle } from './circle';
export { default as Line } from './line';

import Shape from './shape';
import Point2D from './point2d';

export const collisionDetected = (shape1: Shape, shape2: Shape) => (
  shape1.position.x <= shape2.position.x + shape2.width
  && shape1.position.y <= shape2.position.y + shape2.height
  && shape1.position.x + shape1.width >= shape2.position.x
  && shape1.position.y + shape1.height >= shape2.position.y
);

export const distance = (point1: Point2D, point2: Point2D) => Math.sqrt(
  (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
);
