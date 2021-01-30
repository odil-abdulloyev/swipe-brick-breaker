import { Rectangle } from './lib/lib';
import gameOption from './game-options';

export default class Block extends Rectangle {
  constructor(context, position, width, height, hp) {
    super(context, position, width, height);
    this.hp = hp;
  }

  draw(color) {
    this.context.save();
    this.context.fillStyle = color;
    this.context.shadowColor = gameOption.SHADOW_COLOR;
    this.context.shadowOffsetX = 4;
    this.context.shadowOffsetY = 4;
    super.draw(true);
    this.context.shadowColor = 'transparent';
    this.context.fillStyle = '#ffffff';
    this.context.font = '1.2rem monospace';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(`${this.hp}`, this.position.x + this.width / 2, this.position.y + this.height / 2);
    this.context.restore();
    return this;
  }
}
