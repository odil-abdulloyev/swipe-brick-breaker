import gameOptions from './game-options';
import gameState from './game-state';
import gameObjects from './game-objects';

import Block from './block';
import Ball from './ball';
import Bonus from './bonus';
import { Point2D, collisionDetected, distance } from './lib/lib';
import { renderDOMElement } from './utils/dom';
import getCachedRandom from './utils/helpers';

const GAME = {
  options: gameOptions,
  objects: gameObjects,
  state: gameState
};

GAME.createBlocksAndBonus = function () {
  const rand = getCachedRandom(0, this.options.COLUMNS);
  let count = 2;
  if (this.state.level > 100) {
    count = 5;
  } else if (this.state.level > 50) {
    count = 4;
  } else if (this.state.level > 20) {
    count = 3;
  }
  for (let i = 0; i < count; ++i) {
    const blockX = rand() * (this.options.BLOCK_WIDTH + this.options.INTERVAL_SIZE);
    const blockY = this.options.BLOCK_HEIGHT + this.options.INTERVAL_SIZE;
    const block = new Block(
      this.objects.context,
      new Point2D(blockX, blockY),
      this.options.BLOCK_WIDTH,
      this.options.BLOCK_HEIGHT,
      this.state.level
    );
    block.draw(this.setBlockColor(block));
    this.objects.blocks.push(block);
  }
  const bonusX = rand() * (this.options.BLOCK_WIDTH + this.options.INTERVAL_SIZE)
    + this.options.BLOCK_WIDTH / 2 - this.options.BONUS_RADIUS;
  const bonusY = this.options.BLOCK_HEIGHT + this.options.INTERVAL_SIZE
    + this.options.BLOCK_HEIGHT / 2 - this.options.BONUS_RADIUS;
  const bonus = new Bonus(
    this.objects.context, new Point2D(bonusX, bonusY), this.options.BONUS_RADIUS
  );
  bonus.draw(this.options.BONUS_COLOR);
  this.objects.bonuses.push(bonus);
};

GAME.createBall = function () {
  const ball = new Ball(
    this.objects.context,
    new Point2D(this.state.startPosition.x, this.state.startPosition.y),
    this.options.BALL_RADIUS
  );
  ball.setSpeed(this.options.BALL_SPEED);
  ball.draw(this.options.BALL_COLOR);
  this.objects.balls.push(ball);
};

GAME.strictClearField = function () {
  this.objects.context.clearRect(0, 0, this.objects.field.width, this.objects.field.height);
};

GAME.trailingClearField = function () {
  this.objects.context.fillStyle = 'rgba(230, 230, 230, 0.4)';
  this.objects.context.fillRect(0, 0, this.objects.field.width, this.objects.field.height);
};

GAME.redrawObjects = function () {
  this.trailingClearField();
  if (this.objects.aim.isActive) {
    this.objects.aim.draw(this.options.AIM_COLOR);
  }
  this.objects.bonuses.forEach((bonus) => {
    bonus.draw(this.options.BONUS_COLOR);
  });
  this.objects.balls.forEach((ball) => {
    ball.draw(this.options.BALL_COLOR);
  });
  this.objects.blocks.forEach((block) => {
    block.draw(this.setBlockColor(block));
  });
};

GAME.placeBalls = function () {
  this.objects.balls.forEach((ball) => {
    ball.position = new Point2D(this.state.startPosition.x, this.state.startPosition.y);
  });
};

GAME.setBlockColor = function (block) {
  const { hp } = block;
  const { level } = this.state;
  let color = null;
  if (hp <= 0.3 * level) {
    color = this.options.BLOCK_LIGHT_COLOR;
  } else if (hp <= 0.6 * level) {
    color = this.options.BLOCK_MEDIUM_COLOR;
  } else {
    color = this.options.BLOCK_DARK_COLOR;
  }
  return color;
};

GAME.gameOver = function () {
  return this.objects.blocks.some(
    (block) => block.position.y + block.height === this.objects.field.height
  );
};

GAME.startNewStage = function () {
  ++this.state.level;
  this.objects.aim.isBlocked = false;
  const vy = this.options.BLOCK_HEIGHT + this.options.INTERVAL_SIZE;
  this.objects.blocks.forEach((block) => {
    block.moveOn(0, vy);
  });
  this.objects.bonuses.forEach((bonus) => {
    bonus.moveOn(0, vy);
    if (bonus.position.y > this.objects.field.height) {
      const index = this.objects.bonuses.indexOf(bonus);
      this.objects.bonuses.splice(index, 1);
    }
  });
  if (this.gameOver()) {
    document.querySelector('.game-over').classList.add('active');
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('.game-over__score').dataset.score = this.state.level;
  }
  this.createBlocksAndBonus();
  for (let i = 0; i < this.state.newBallsCount; ++i) {
    this.createBall();
  }
  this.state.newBallsCount = 0;
  this.placeBalls();
  this.objects.aim.setOrigin(
    new Point2D(
      this.state.startPosition.x + this.options.BALL_RADIUS,
      this.objects.field.height - this.options.BALL_RADIUS
    )
  );
};

GAME.handleBallAndBlockCollision = function (ball, block) {
  if (collisionDetected(block, ball)) {
    const topCenter = new Point2D(
      block.position.x + block.width / 2, block.position.y
    );
    const bottomCenter = new Point2D(
      block.position.x + block.width / 2, block.position.y + block.height
    );
    const leftCenter = new Point2D(
      block.position.x, block.position.y + block.height / 2
    );
    const rightCenter = new Point2D(
      block.position.x + block.width, block.position.y + block.height / 2
    );

    const { center } = ball;

    const dist1 = distance(center, topCenter);
    const dist2 = distance(center, bottomCenter);
    const dist3 = distance(center, leftCenter);
    const dist4 = distance(center, rightCenter);
    const minDist = Math.min(dist1, dist2, dist3, dist4);

    if (minDist === dist1) {
      ball.vy = -Math.abs(ball.vy);
    }
    if (minDist === dist2) {
      ball.vy = Math.abs(ball.vy);
    }
    if (minDist === dist3) {
      ball.vx = -Math.abs(ball.vx);
    }
    if (minDist === dist4) {
      ball.vx = Math.abs(ball.vx);
    }
    if (--block.hp === 0) {
      const { blocks } = this.objects;
      blocks.splice(blocks.indexOf(block), 1);
    }
  }
};

GAME.handleBallAndWallCollision = function (ball) {
  if (ball.position.x <= 0 || ball.position.x + ball.width >= this.objects.field.width) {
    ball.position.x = ball.position.x <= 0 ? 0 : this.objects.field.width - ball.width;
    ball.vx *= -1;
  }
  if (ball.position.y <= 0 || ball.position.y + ball.height >= this.objects.field.height) {
    ball.position.y = ball.position.y <= 0 ? 0 : this.objects.field.height - ball.height;
    if (ball.position.y <= 0) {
      ball.vy *= -1;
    } else {
      ball.vx = 0;
      ball.vy = 0;
    }
  }
};

GAME.handleBallAndBonusCollision = function (ball, bonus) {
  if (collisionDetected(ball, bonus)) {
    const index = this.objects.bonuses.indexOf(bonus);
    this.objects.bonuses.splice(index, 1);
    ++this.state.newBallsCount;
  }
};

GAME.endOfStage = function () {
  return this.objects.balls.every(
    (ball) => ball.position.y + ball.height >= this.objects.field.height
  );
};

GAME.animate = function () {
  console.log('running');
  this.state.requests.push(window.requestAnimationFrame(() => {
    this.animate();
    this.redrawObjects();
  }));
  let firstBall = true;

  this.objects.balls.forEach((ball, i) => {
    this.handleBallAndWallCollision(ball);
    this.objects.blocks.forEach((block) => {
      this.handleBallAndBlockCollision(ball, block);
    });
    this.objects.bonuses.forEach((bonus) => {
      this.handleBallAndBonusCollision(ball, bonus);
    });
    if (ball.position.y + ball.height >= this.objects.field.height) {
      ball.vx = 0;
      ball.vy = 0;
      if (firstBall) {
        firstBall = false;
        this.state.startPosition = new Point2D(ball.position.x, this.state.startPosition.y);
      }
    }
    if (i === 0) {
      ball.move();
    } else {
      this.state.timeouts.push(window.setTimeout(() => {
        ball.move();
      }, this.options.BALL_SHOOT_TIMEOUT * i));
    }
  });
  if (this.endOfStage()) {
    this.stopAnimation();
    this.strictClearField();
    this.startNewStage();
  }
};

GAME.handleMouseDown = function (e) {
  if (!this.objects.aim.isBlocked) {
    this.objects.aim.isActive = true;
    this.objects.aim.handleMouseMove(e);
    this.objects.aim.draw(this.options.AIM_COLOR);
  }
};

GAME.handleMouseMove = function (e) {
  if (this.objects.aim.isActive && !this.objects.aim.isBlocked) {
    this.objects.aim.handleMouseMove(e);
    this.objects.aim.draw(this.options.AIM_COLOR);
    this.strictClearField();
    this.redrawObjects();
  }
};

GAME.handleMouseUp = function () {
  if (!this.objects.aim.isBlocked) {
    this.objects.aim.isActive = false;
    this.objects.aim.isBlocked = true;
    const calcSpeed = (x) => (this.options.BALL_SPEED * x)
      / Math.sqrt(this.objects.aim.vx ** 2 + this.objects.aim.vy ** 2);
    this.objects.balls.forEach((ball) => {
      ball.setVx(calcSpeed(this.objects.aim.vx));
      ball.setVy(calcSpeed(this.objects.aim.vy));
    });
    this.state.requests.push(window.requestAnimationFrame(() => {
      this.animate();
    }));
  }
};

GAME.stopAnimation = function () {
  this.state.requests.forEach((id) => {
    window.cancelAnimationFrame(id);
  });
  this.state.requests = [];
  this.state.timeouts.forEach((id) => {
    window.clearTimeout(id);
  });
  this.state.timeouts = [];
};

function handleMouseDown(e) {
  GAME.handleMouseDown(e);
}

function handleMouseMove(e) {
  GAME.handleMouseMove(e);
}

function handleMouseUp(e) {
  GAME.handleMouseUp(e);
}

GAME.init = function () {
  renderDOMElement(this.objects.field, document.getElementById('game-field-wrapper'));
  this.createBlocksAndBonus();
  this.createBall();
  this.objects.field.addEventListener('mousedown', handleMouseDown);
  this.objects.field.addEventListener('mousemove', handleMouseMove);
  this.objects.field.addEventListener('mouseup', handleMouseUp);
};

GAME.reset = function () {
  this.state.level = 1;
  this.state.startPosition = new Point2D(
    this.objects.field.width / 2 - gameOptions.BALL_RADIUS,
    this.objects.field.height - 2 * gameOptions.BALL_RADIUS - 1
  );
  this.objects.aim.origin = this.state.startPosition;
  this.objects.aim.isActive = false;
  this.objects.aim.isBlocked = false;
  this.objects.balls = [];
  this.objects.blocks = [];
  this.objects.bonuses = [];
  this.state.timeouts = [];
  this.state.requests = [];
  this.state.newBallsCount = 0;
  this.strictClearField();
  this.redrawObjects();
  this.objects.field.removeEventListener('mousedown', handleMouseDown);
  this.objects.field.removeEventListener('mousemove', handleMouseMove);
  this.objects.field.removeEventListener('mouseup', handleMouseUp);
  this.objects.field.remove();
};

export default GAME;
