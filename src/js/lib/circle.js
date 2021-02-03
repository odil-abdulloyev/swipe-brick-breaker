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
var ellipse_1 = require("./ellipse");
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(context, position, radius) {
        var _this = _super.call(this, context, position, 2 * radius, 2 * radius) || this;
        _this.radius = radius;
        return _this;
    }
    return Circle;
}(ellipse_1.default));
exports.default = Circle;
