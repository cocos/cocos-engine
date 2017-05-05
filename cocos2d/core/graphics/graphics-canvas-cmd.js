/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Js = cc.js;

var LineCap     = require('./types').LineCap;
var LineJoin    = require('./types').LineJoin;

var Helper = require('./helper');

var CanvasRenderCmd = function (renderable) {
    this._rootCtor(renderable);
    this._needDraw = true;
    this.cmds = [];

    this.style = {
        strokeStyle: 'black',
        fillStyle: 'white',
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10
    };
};

var _p = CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
_p.constructor = CanvasRenderCmd;

_p._updateCurrentRegions = function() {
    var temp = this._currentRegion;
    this._currentRegion = this._oldRegion;
    this._oldRegion = temp;
    this._currentRegion.setTo(0,0, cc.visibleRect.width, cc.visibleRect.height);
};

_p.rendering = function (ctx, scaleX, scaleY) {
    var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    
    context.save();
    context.scale(1, -1);

    var style = this.style;
    context.strokeStyle = style.strokeStyle;
    context.fillStyle = style.fillStyle;
    context.lineWidth = style.lineWidth;
    context.lineJoin = style.lineJoin;
    context.miterLimit = style.miterLimit;

    var endPath = true;
    var cmds = this.cmds;
    for (var i = 0, l = cmds.length; i < l; i++) {
        var cmd = cmds[i];
        var ctxCmd = cmd[0], args = cmd[1];

        if (ctxCmd === 'moveTo' && endPath) {
            context.beginPath();
            endPath = false;
        }
        else if (ctxCmd === 'fill' || ctxCmd === 'stroke' || ctxCmd === 'fillRect') {
            endPath = true;
        }

        if (typeof context[ctxCmd] === 'function') {
            context[ctxCmd].apply(context, args);
        }
        else {
            context[ctxCmd] = args;
        }
    }

    context.restore();
};

// draw api

_p.setStrokeColor = function (v) {
    var strokeStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
    this.cmds.push(['strokeStyle', strokeStyle]);
    this.style.strokeStyle = strokeStyle;
};

_p.setFillColor = function (v) {
    var fillStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
    this.cmds.push(['fillStyle', fillStyle]);
    this.style.fillStyle = fillStyle;
};

_p.setLineWidth = function (v) {
    this.cmds.push(['lineWidth', v]);
    this.style.lineWidth = v;
};

_p.setLineCap = function (v) {
    var lineCap = 'butt';
    if (v === LineCap.BUTT) {
        lineCap = 'butt';
    }
    else if (v === LineCap.ROUND) {
        lineCap = 'round';
    }
    else if (v === LineCap.SQUARE) {
        lineCap = 'square';
    }
    this.cmds.push(['lineCap', lineCap]);
    this.style.lineCap = lineCap;
};

_p.setLineJoin = function (v) {
    var lineJoin = 'bevel';
    if (v === LineJoin.BEVEL) {
        lineJoin = 'bevel';
    }
    else if (v === LineJoin.ROUND) {
        lineJoin = 'round';
    }
    else if (v === LineJoin.MITER) {
        lineJoin = 'miter';
    }

    this.cmds.push(['lineJoin', lineJoin]);
    this.style.lineJoin = lineJoin;
};

_p.setMiterLimit = function (v) {
    this.cmds.push(['miterLimit', v]);
    this.style.miterLimit = v;
};

// draw functions

_p.beginPath = function () {
};

_p.moveTo = function (x, y) {
    this.cmds.push(['moveTo', [x, y]]);
};

_p.lineTo = function (x, y) {
    this.cmds.push(['lineTo', [x, y]]);
};

_p.bezierCurveTo = function (c1x, c1y, c2x, c2y, x, y) {
    this.cmds.push(['bezierCurveTo', [c1x, c1y, c2x, c2y, x, y]]);
};

_p.quadraticCurveTo = function (cx, cy, x, y) {
    this.cmds.push(['quadraticCurveTo', [cx, cy, x, y]]);
};

_p.arc = function (cx, cy, r, startAngle, endAngle, counterclockwise) {
    Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
};

_p.ellipse = function (cx, cy, rx, ry) {
    Helper.ellipse(this, cx, cy, rx, ry);
};

_p.circle = function (cx, cy, r) {
    Helper.ellipse(this, cx, cy, r, r);
};

_p.rect = function (x, y, w, h) {
    this.moveTo(x, y);
    this.lineTo(x+w, y);
    this.lineTo(x+w, y+h);
    this.lineTo(x, y+h);
    this.close();
};

_p.roundRect = function (x, y, w, h, r) {
    Helper.roundRect(this, x, y, w, h, r);
};

_p.fillRect = function (x, y, w, h) {
    this.cmds.push(['fillRect', [x, y, w, h]]);
    this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
};

_p.close = function () {
    this.cmds.push(['closePath', []]);
};

_p.stroke = function () {
    this.cmds.push(['stroke', []]);
    this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
};

_p.fill = function () {
    this.cmds.push(['fill', []]);
    this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
};

_p.clear = function () {
    this.cmds.length = 0;
    this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
};

module.exports = CanvasRenderCmd;
