/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var CanvasRenderCmd = require('./graphics-canvas-cmd');
var WebGLRenderCmd  = require('./graphics-webgl-cmd');

var LineCap     = require('./types').LineCap;
var LineJoin    = require('./types').LineJoin;

var Js = cc.js;

// GraphicsNode
var GraphicsNode = _ccsg.Node.extend({
    // constructor
    ctor: function () {
        this._super();

        this.strokeColor = cc.Color.BLACK;
        this.fillColor = cc.Color.WHITE;
    },

    // clear
    clear: function (clean) {
        this._renderCmd.clear(clean);
    },

    // extends functions
    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new CanvasRenderCmd(this);
        else
            return new WebGLRenderCmd(this);
    }
});

var _p = GraphicsNode.prototype;

// draw api

// properties
_p._strokeColor = null;
_p._fillColor = null;

_p._lineWidth = 1;

_p._lineCap = LineCap.BUTT;
_p._lineJoin = LineJoin.MITER;

_p._miterLimit = 10;

_p.setStrokeColor = function (v) {
    this._strokeColor = v;
    this._renderCmd.setStrokeColor(v);
};
_p.getStrokeColor = function () {
    return this._strokeColor;
};

_p.setFillColor = function (v) {
    this._fillColor = v;
    this._renderCmd.setFillColor(v);
};
_p.getFillColor = function () {
    return this._fillColor;
};

_p.setLineWidth = function (v) {
    this._lineWidth = v;
    this._renderCmd.setLineWidth(v);
};
_p.getLineWidth = function () {
    return this._lineWidth;
};

_p.setLineCap = function (v) {
    this._lineCap = v;
    this._renderCmd.setLineCap(v);
};
_p.getLineCap = function () {
    return this._lineCap;
};

_p.setLineJoin = function (v) {
    this._lineJoin = v;
    this._renderCmd.setLineJoin(v);
};
_p.getLineJoin = function () {
    return this._lineJoin;
};

_p.setMiterLimit = function (v) {
    this._miterLimit = v;
    this._renderCmd.setMiterLimit(v);
};
_p.getMiterLimit = function () {
    return this._miterLimit;
};

// draw functions

_p.beginPath = function () {
    this._renderCmd.beginPath();
};

_p.moveTo = function (x, y) {
    this._renderCmd.moveTo(x, y);
};

_p.lineTo = function (x, y) {
    this._renderCmd.lineTo(x, y);
};

_p.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) {
    this._renderCmd.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
};

_p.quadraticCurveTo = function (cx, cy, x, y) {
    this._renderCmd.quadraticCurveTo(cx, cy, x, y);
};

//
_p.arc = function (cx, cy, r, a0, a1, counterclockwise) {
    this._renderCmd.arc(cx, cy, r, a0, a1, counterclockwise);
};

_p.ellipse = function (cx, cy, rx, ry) {
    this._renderCmd.ellipse(cx, cy, rx, ry);
};

_p.circle = function (cx, cy, r) {
    this._renderCmd.circle(cx, cy, r);
};

_p.rect = function (x, y, w, h) {
    this._renderCmd.rect(x, y, w, h);
};

_p.roundRect = function (x, y, w, h, r) {
    this._renderCmd.roundRect(x, y, w, h, r);
};

_p.fillRect = function (x, y, w, h) {
    this._renderCmd.fillRect(x, y, w, h);
};

_p.close = function () {
    this._renderCmd.close();
};

_p.stroke = function () {
    this._renderCmd.stroke();
};

_p.fill = function () {
    this._renderCmd.fill();
};

module.exports = GraphicsNode;
