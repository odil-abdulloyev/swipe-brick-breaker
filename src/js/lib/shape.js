"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shape = /** @class */ (function () {
    function Shape(context, position, width, height) {
        this.context = context;
        this.position = position;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
    }
    Shape.prototype.draw = function (isFilled) {
        if (isFilled === void 0) { isFilled = false; }
        this.context.save();
        if (isFilled) {
            this.context.fill();
        }
        else {
            this.context.stroke();
        }
        this.context.restore();
    };
    Shape.prototype.clear = function () {
        this.context.clearRect(this.position.x - this.context.lineWidth, this.position.y - this.context.lineWidth, this.width + 2 * this.context.lineWidth, this.height + 2 * this.context.lineWidth);
    };
    Shape.prototype.move = function () {
        this.position.x += this.vx;
        this.position.y += this.vy;
    };
    Shape.prototype.moveOn = function (vx, vy) {
        this.position.x += vx;
        this.position.y += vy;
    };
    Shape.prototype.moveTo = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };
    Shape.prototype.setVx = function (vx) {
        this.vx = vx;
    };
    Shape.prototype.setVy = function (vy) {
        this.vy = vy;
    };
    Shape.prototype.setPosition = function (position) {
        this.position = position;
    };
    return Shape;
}());
exports.default = Shape;
