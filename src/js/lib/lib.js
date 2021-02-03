"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = exports.collisionDetected = exports.Line = exports.Circle = exports.Ellipse = exports.Rectangle = exports.Shape = exports.Point2D = void 0;
var point2d_1 = require("./point2d");
Object.defineProperty(exports, "Point2D", { enumerable: true, get: function () { return point2d_1.default; } });
var shape_1 = require("./shape");
Object.defineProperty(exports, "Shape", { enumerable: true, get: function () { return shape_1.default; } });
var rectangle_1 = require("./rectangle");
Object.defineProperty(exports, "Rectangle", { enumerable: true, get: function () { return rectangle_1.default; } });
var ellipse_1 = require("./ellipse");
Object.defineProperty(exports, "Ellipse", { enumerable: true, get: function () { return ellipse_1.default; } });
var circle_1 = require("./circle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return circle_1.default; } });
var line_1 = require("./line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return line_1.default; } });
var collisionDetected = function (shape1, shape2) { return (shape1.position.x <= shape2.position.x + shape2.width
    && shape1.position.y <= shape2.position.y + shape2.height
    && shape1.position.x + shape1.width >= shape2.position.x
    && shape1.position.y + shape1.height >= shape2.position.y); };
exports.collisionDetected = collisionDetected;
var distance = function (point1, point2) { return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2)); };
exports.distance = distance;
