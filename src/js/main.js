import '../scss/style.scss';
import {
  Rectangle,
  Point2D,
  Circle,
  collide,
  distance
} from './lib/lib';
import Game from './game';

const ctx = document.querySelector('#game-field').getContext('2d');

const shapes = [];

const blocks = [];
const block1 = new Rectangle(ctx, new Point2D(350, 250), 80, 45);
block1.draw(true);
const block2 = new Rectangle(ctx, new Point2D(420, 300), 80, 45);
block2.draw(true);
blocks.push(block1, block2);
shapes.push(block1, block2);

const balls = [];
for (let i = 0; i < 10; ++i) {
  const circle = new Circle(ctx, new Point2D(50 + i * 20, 50 + i * 20), 10);
  shapes.push(circle);
  circle.setVx(6);
  circle.setVy(6);
  balls.push(circle);
}

const animate = (block, circle) => {
  if (circle.position.x <= 0 || circle.position.x + circle.width >= 1000) {
    circle.vx *= -1;
  }
  if (circle.position.y <= 0 || circle.position.y + circle.height >= 540) {
    circle.vy *= -1;
  }
  if (collide(block, circle)) {
    const topCenter = new Point2D(
      block.position.x + Math.floor(block.width / 2), block.position.y
    );
    const bottomCenter = new Point2D(
      block.position.x + Math.floor(block.width / 2), block.position.y + block.height
    );
    const leftCenter = new Point2D(
      block.position.x, block.position.y + Math.floor(block.height / 2)
    );
    const rightCenter = new Point2D(
      block.position.x + block.width, block.position.y + Math.floor(block.height / 2)
    );

    const { center } = circle;

    const dist1 = distance(center, topCenter);
    const dist2 = distance(center, bottomCenter);
    const dist3 = distance(center, leftCenter);
    const dist4 = distance(center, rightCenter);
    const minDist = Math.min(dist1, dist2, dist3, dist4);

    if (minDist === dist1) {
      circle.vy = -Math.abs(circle.vy);
    }
    if (minDist === dist2) {
      circle.vy = Math.abs(circle.vy);
    }
    if (minDist === dist3) {
      circle.vx = -Math.abs(circle.vx);
    }
    if (minDist === dist4) {
      circle.vx = Math.abs(circle.vx);
    }
  }
  circle.clear().move().draw(true);
  shapes.forEach((shape) => {
    shape.draw(true);
  });
  window.requestAnimationFrame(() => {
    animate(block, circle);
  });
};

balls.forEach((ball) => {
  blocks.forEach((block) => {
    animate(block, ball);
  });
});

const g = new Game(10, 6);
g.init();
