import { Rectangle } from './lib/lib';

export default class Block extends Rectangle {
  constructor(context, position, width, height, hp) {
    super(context, position, width, height);
    this.hp = hp;
  }
}
