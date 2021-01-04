import { createDOMElement, renderDOMElement } from './utils/helpers';
import Block from './block';
import { Point2D } from './lib/lib';

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 55;
const INTERVAL_SIZE = 3;
const BLOCK_PRIMARY_COLOR = '#ff4051';
const BLOCK_SECONDARY_COLOR = '#f88968';
const BALL_COLOR = '#5aa7f3';
const BONUS_COLOR = '#3ad361';

export default class Game {
  constructor(rows, columns) {
    this.field = createDOMElement('canvas', {
      id: 'canvas',
      width: columns * BLOCK_WIDTH + (columns - 1) * INTERVAL_SIZE,
      height: rows * BLOCK_HEIGHT + (rows - 1) * INTERVAL_SIZE
    });
    this.context = this.field.getContext('2d');
    this.balls = [];
    this.blocks = [];
    this.level = 1;
    this.rows = rows;
    this.columns = columns;
  }

  init() {
    this.context.fillStyle = BLOCK_PRIMARY_COLOR;
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 6; ++j) {
        const block = new Block(
          this.context,
          new Point2D(j * (BLOCK_WIDTH + INTERVAL_SIZE), i * (BLOCK_HEIGHT + INTERVAL_SIZE)),
          BLOCK_WIDTH,
          BLOCK_HEIGHT,
          this.level
        );
        block.draw(true);
        this.blocks.push(block);
      }
    }
    renderDOMElement(this.field, document.body);
  }
}
