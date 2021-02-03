import gameOptions from './game-options';
import gameState from './game-state';
import gameObjects from './game-objects';
import gameDOMElements from './game-dom-elements';

import Block from './block';
import Ball from './ball';
import Bonus from './bonus';
import { Point2D, collisionDetected, distance } from './lib/lib';
import { renderDOMElement } from './utils/dom';
import { getCachedRandom, findByField } from './utils/helpers';
import DBManager from './utils/db-manager';

const GAME = {
  options: gameOptions,
  objects: gameObjects,
  state: gameState,
  DOMElements: gameDOMElements,
  DBManager: new DBManager('https://swipe-brick-breaker-52559-default-rtdb.firebaseio.com/players.json'),
  highScores: null
};

GAME.createBlocksAndBonus = function () {
  const rand = getCachedRandom(0, this.options.COLUMNS);
  let count = 2;
  const getRandomCount = (arr) => arr[Math.floor(Math.random() * arr.length)];
  if (this.state.level > 100) {
    count = getRandomCount([2, 3, 4, 5]);
  } else if (this.state.level > 50) {
    count = getRandomCount([2, 3, 4]);
  } else if (this.state.level > 20) {
    count = getRandomCount([2, 3]);
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
  this.objects.context.save();
  this.objects.context.fillStyle = `${this.options.FIELD_COLOR}60`;
  this.objects.context.fillRect(0, 0, this.objects.field.width, this.objects.field.height);
  this.objects.context.restore();
};

GAME.redrawObjects = function () {
  this.trailingClearField();
  if (this.objects.aim.isActive && this.state.aimingEnabled) {
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
    color = this.options.BLOCK_NORMAL_COLOR;
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

GAME.updateUI = function () {
  this.DOMElements.scoreElements.forEach((el) => {
    el.dataset.score = this.state.level - 1;
  });
  this.DOMElements.ballsElement.dataset.balls = this.objects.balls.length;
  this.highScores.then((response) => {
    const rows = response.reduce((html, record, i) => {
      this.DOMElements.recordElement.dataset.record = response.length ? response[0].score : 0;
      const tr = `
        <tr>
          <td>${i + 1}</td>
          <td>${record.name}</td>
          <td>${record.score}</td>
          <td>${record.date}</td>
        </tr>
      `;
      return html + tr;
    }, '');
    this.DOMElements.tableElement.querySelector('tbody').innerHTML = rows;
  });
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
    this.highScores
      .then((response) => findByField(response, 'score', this.state.level - 1))
      .then((position) => {
        if (position < this.options.MAX_RECORDS_COUNT - 1) {
          this.DOMElements.newRecordModalElement.classList.add('active');
        } else {
          this.DOMElements.gameOverModalElement.classList.add('active');
        }
      });
    this.DOMElements.overlayElement.classList.add('active');
    this.playSound(this.DOMElements.gameOverSound);
  }

  if (this.state.newBallsCount > 0 && !this.gameOver()) {
    this.playSound(this.DOMElements.newStageSound);
  }
  this.createBlocksAndBonus();
  for (let i = 0; i < this.state.newBallsCount; ++i) {
    this.createBall();
  }
  this.state.newBallsCount = 0;
  this.updateUI();
  this.placeBalls();
  this.objects.aim.setOrigin(
    new Point2D(
      this.state.startPosition.x + this.options.BALL_RADIUS,
      this.objects.field.height - this.options.BALL_RADIUS
    )
  );
};

GAME.handleBallAndBlockCollision = function (ball, block) {
  const getPoint = (value, min, max) => {
    if (value <= min || value >= max) {
      return Math.abs(max - value) < Math.abs(min - value) ? max : min;
    }
    return value;
  };
  const pointX = getPoint(ball.center.x, block.position.x, block.position.x + block.width);
  const pointY = getPoint(ball.center.y, block.position.y, block.position.y + block.height);
  if (distance(ball.center, new Point2D(pointX, pointY)) <= ball.radius) {
    let nx = ball.center.x - pointX;
    let ny = ball.center.y - pointY;
    const len = Math.sqrt(nx * nx + ny * ny);
    if (len <= ball.radius
      && (pointX === block.position.x || pointX === block.position.x + block.width)
      && (pointY === block.position.y || pointY === block.position.y + block.height)
    ) {
      nx /= len;
      ny /= len;
      const projection = ball.vx * nx + ball.vy * ny;
      ball.vx -= +(2 * projection * nx).toFixed(2);
      ball.vy -= +(2 * projection * ny).toFixed(2);
      ball.normalizeSpeed();
    } else {
      if (pointX === block.position.x + block.width || pointX === block.position.x) {
        ball.position.x = pointX === block.position.x + block.width ? pointX : pointX - ball.width;
        ball.vx *= -1;
      }
      if (pointY === block.position.y + block.height || pointY === block.position.y) {
        ball.position.y = pointY === block.position.y + block.height
          ? pointY
          : pointY - ball.height;
        ball.vy *= -1;
      }
    }
    if (--block.hp === 0) {
      const { blocks } = this.objects;
      blocks.splice(blocks.indexOf(block), 1);
    }
    this.playSound(this.DOMElements.blockBumpSound);
  }
};

GAME.playSound = function (sound) {
  if (this.state.soundOn) {
    sound.currentTime = 0;
    sound.play();
  }
};

GAME.handleBallAndWallCollision = function (ball) {
  if (ball.position.x <= 0 || ball.position.x + ball.width >= this.objects.field.width) {
    ball.position.x = ball.position.x <= 0 ? 0 : this.objects.field.width - ball.width;
    ball.vx *= -1;
  }
  if (ball.position.y <= 0 || ball.position.y + ball.height > this.objects.field.height) {
    ball.position.y = ball.position.y <= 0 ? 0 : this.objects.field.height - ball.height;
    if (ball.position.y <= 0) {
      ball.vy *= -1;
    } else {
      ball.stop();
    }
  }
};

GAME.handleBallAndBonusCollision = function (ball, bonus) {
  if (collisionDetected(ball, bonus)) {
    const index = this.objects.bonuses.indexOf(bonus);
    this.objects.bonuses.splice(index, 1);
    ++this.state.newBallsCount;
    this.playSound(this.DOMElements.bonusBumpSound);
  }
};

GAME.endOfStage = function () {
  return this.objects.balls.every(
    (ball) => ball.position.y + ball.height >= this.objects.field.height
  );
};

GAME.animate = function () {
  this.state.requests.push(window.requestAnimationFrame(() => {
    this.animate();
    this.redrawObjects();
  }));

  let firstBall = true;
  this.objects.balls.forEach((ball, i) => {
    window.requestAnimationFrame(() => {
      if (i === 0) {
        ball.move();
      } else {
        this.state.timeouts.push(window.setTimeout(() => {
          ball.move();
        }, this.options.BALL_SHOOT_TIMEOUT * i));
      }
    });
    if (ball.position.y + ball.height > this.objects.field.height) {
      if (firstBall) {
        firstBall = false;
        this.state.startPosition = new Point2D(ball.position.x, this.state.startPosition.y);
      }
    }
    this.handleBallAndWallCollision(ball);
    this.objects.blocks.forEach((block) => {
      this.handleBallAndBlockCollision(ball, block);
    });
    this.objects.bonuses.forEach((bonus) => {
      this.handleBallAndBonusCollision(ball, bonus);
    });
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
    this.redrawObjects();
  }
};

GAME.handleMouseMove = function (e) {
  if (this.objects.aim.isActive && !this.objects.aim.isBlocked) {
    this.objects.aim.handleMouseMove(e);
    this.strictClearField();
    this.redrawObjects();
  }
};

GAME.handleMouseUp = function () {
  if (!this.objects.aim.isBlocked) {
    this.objects.aim.isActive = false;
    this.objects.aim.isBlocked = true;
    const calcSpeed = (x) => +(
      (this.options.BALL_SPEED * x) / Math.sqrt(this.objects.aim.vx ** 2 + this.objects.aim.vy ** 2)
    ).toFixed(2);
    this.objects.balls.forEach((ball) => {
      ball.setVx(calcSpeed(this.objects.aim.vx));
      ball.setVy(calcSpeed(this.objects.aim.vy));
      ball.normalizeSpeed();
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
  this.highScores = this.DBManager.getRecords()
    .then((records) => records.sort((lhs, rhs) => rhs.score - lhs.score))
    .then((sortedRecords) => sortedRecords.slice(0, this.options.MAX_RECORDS_COUNT));
  renderDOMElement(this.objects.field, document.getElementById('app'));
  this.createBlocksAndBonus();
  this.createBall();
  this.updateUI();
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
  this.objects.aim.origin = new Point2D(
    this.state.startPosition.x + this.options.BALL_RADIUS,
    this.state.startPosition.y + this.options.BALL_RADIUS
  );
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
