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
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(context, begin, end) {
        var _this = _super.call(this, context, begin, Math.abs(begin.x - end.x), Math.abs(begin.y - end.y)) || this;
        _this.begin = begin;
        _this.end = end;
        return _this;
    }
    Line.prototype.draw = function () {
        this.context.beginPath();
        this.context.moveTo(this.begin.x, this.begin.y);
        this.context.lineTo(this.end.x, this.end.y);
        _super.prototype.draw.call(this, false);
    };
    Line.prototype.setDash = function (segments) {
        this.context.setLineDash(segments);
    };
    return Line;
}(shape_1.default));
exports.default = Line;
