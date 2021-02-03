"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var shape_1 = require("./shape");
var point2d_1 = require("./point2d");
var Ellipse = /** @class */ (function (_super) {
    __extends(Ellipse, _super);
    function Ellipse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Ellipse.prototype, "center", {
        get: function () {
            return new point2d_1.default(this.position.x + Math.floor(this.width / 2), this.position.y + Math.floor(this.height / 2));
        },
        enumerable: false,
        configurable: true
    });
    Ellipse.prototype.draw = function (isFilled) {
        if (isFilled === void 0) { isFilled = false; }
        this.context.beginPath();
        this.context.ellipse(this.position.x + Math.floor(this.width / 2), this.position.y + Math.floor(this.height / 2), Math.floor(this.width / 2), Math.floor(this.height / 2), 0, 0, 2 * Math.PI);
        _super.prototype.draw.call(this, isFilled);
    };
    return Ellipse;
}(shape_1.default));
exports.default = Ellipse;
