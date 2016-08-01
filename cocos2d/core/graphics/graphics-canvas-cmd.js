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

var PI = 3.14159265358979323846264338327;

var min     = Math.min;
var max     = Math.max;
var cos     = Math.cos;
var sin     = Math.sin;
var abs     = Math.abs;
var sign    = Math.sign;

var KAPPA90 = 0.5522847493;

var CanvasRenderCmd = function (renderable) {
    _ccsg.Node.CanvasRenderCmd.call(this, renderable);
    this._needDraw = true;
    this.cmds = [];
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

    var endPath = true;
    var cmds = this.cmds;
    for (var i = 0, l = cmds.length; i < l; i++) {
        var cmd = cmds[i];
        var ctxCmd = cmd[0], args = cmd[1];

        if (ctxCmd === 'clear') {
            cmds.splice(0, i+1);
            i = 0;
            l = cmds.length;
            continue;
        }
        else if (ctxCmd === 'moveTo' && endPath) {
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
Js.mixin(_p, {
    setStrokeColor: function (v) {
        var fillStyle = "rgba(" + (0 | v.r) + "," + (0 | v.g) + "," + (0 | v.b) + "," + v.a / 255 + ")";
        this.cmds.push(['strokeStyle', fillStyle]);
    },

    setFillColor: function (v) {
        var fillStyle = "rgba(" + (0 | v.r) + "," + (0 | v.g) + "," + (0 | v.b) + "," + v.a / 255 + ")";
        this.cmds.push(['fillStyle', fillStyle]);
    },

    setLineWidth: function (v) {
        this.cmds.push(['lineWidth', v]);
    },

    setLineCap: function (v) {
        if (v === LineCap.BUTT) {
            this.cmds.push(['lineCap', 'butt']);
        }
        else if (v === LineCap.ROUND) {
            this.cmds.push(['lineCap', 'round']);
        }
        else if (v === LineCap.SQUARE) {
            this.cmds.push(['lineCap', 'square']);
        }
    },

    setLineJoin: function (v) {
        if (v === LineJoin.BEVEL) {
            this.cmds.push(['lineJoin', 'bevel']);
        }
        else if (v === LineJoin.ROUND) {
            this.cmds.push(['lineJoin', 'round']);
        }
        else if (v === LineJoin.MITER) {
            this.cmds.push(['lineJoin', 'miter']);
        }
    },

    setMiterLimit: function (v) {
        this.cmds.push(['miterLimit', v]);
    },

    // draw functions
    
    beginPath: function () {
    },
    
    moveTo: function (x, y) {
        this.cmds.push(['moveTo', arguments]);
    },

    lineTo: function () {
        this.cmds.push(['lineTo', arguments]);
    },

    bezierCurveTo: function () {
        this.cmds.push(['bezierCurveTo', arguments]);
    },

    quadraticCurveTo: function () {
        this.cmds.push(['quadraticCurveTo', arguments]);
    },

    //
    arc: function (cx, cy, r, a0, a1, counterclockwise) {
        // this.cmds.push(['arc', arguments]);
        var a = 0, da = 0, hda = 0, kappa = 0;
        var dx = 0, dy = 0, x = 0, y = 0, tanx = 0, tany = 0;
        var px = 0, py = 0, ptanx = 0, ptany = 0;
        var i, ndivs;

        // Clamp angles
        da = a1 - a0;
        if (!counterclockwise) {
            if (abs(da) >= PI * 2) {
                da = PI * 2;
            } else {
                while (da < 0) da += PI * 2;
            }
        } else {
            if (abs(da) >= PI * 2) {
                da = -PI * 2;
            } else {
                while (da > 0) da -= PI * 2;
            }
        }

        // Split arc into max 90 degree segments.
        ndivs = max(1, min(abs(da) / (PI * 0.5) + 0.5, 5)) | 0;
        hda = da / ndivs / 2.0;
        kappa = abs(4.0 / 3.0 * (1 - cos(hda)) / sin(hda));

        if (counterclockwise) kappa = -kappa;

        for (i = 0; i <= ndivs; i++) {
            a = a0 + da * (i / ndivs);
            dx = cos(a);
            dy = sin(a);
            x = cx + dx * r;
            y = cy + dy * r;
            tanx = -dy * r * kappa;
            tany = dx * r * kappa;

            if (i === 0) {
                this.moveTo(x, y);
            } else {
                this.bezierCurveTo(px + ptanx, py + ptany, x - tanx, y - tany, x, y);
            }
            px = x;
            py = y;
            ptanx = tanx;
            ptany = tany;
        }
    },

    ellipse: function (cx, cy, rx, ry) {
        this.moveTo(cx - rx, cy);
        this.bezierCurveTo(cx - rx, cy + ry * KAPPA90, cx - rx * KAPPA90, cy + ry, cx, cy + ry);
        this.bezierCurveTo(cx + rx * KAPPA90, cy + ry, cx + rx, cy + ry * KAPPA90, cx + rx, cy);
        this.bezierCurveTo(cx + rx, cy - ry * KAPPA90, cx + rx * KAPPA90, cy - ry, cx, cy - ry);
        this.bezierCurveTo(cx - rx * KAPPA90, cy - ry, cx - rx, cy - ry * KAPPA90, cx - rx, cy);
        this.close();
    },

    circle: function (cx, cy, r) {
        this.ellipse(cx, cy, r, r);
        this.close();
    },

    rect: function (x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x+w, y);
        this.lineTo(x+w, y+h);
        this.lineTo(x, y+h);
        this.close();
    },

    roundRect: function (x, y, w, h, r) {
        if (r < 0.1) {
            this.rect(x, y, w, h);
            return;
        } else {
            var rx = min(r, abs(w) * 0.5) * sign(w),
                ry = min(r, abs(h) * 0.5) * sign(h);

            this.moveTo(x, y + ry);
            this.lineTo(x, y + h - ry);
            this.bezierCurveTo(x, y + h - ry * (1 - KAPPA90), x + rx * (1 - KAPPA90), y + h, x + rx, y + h);
            this.lineTo(x + w - rx, y + h);
            this.bezierCurveTo(x + w - rx * (1 - KAPPA90), y + h, x + w, y + h - ry * (1 - KAPPA90), x + w, y + h - ry);
            this.lineTo(x + w, y + ry);
            this.bezierCurveTo(x + w, y + ry * (1 - KAPPA90), x + w - rx * (1 - KAPPA90), y, x + w - rx, y);
            this.lineTo(x + rx, y);
            this.bezierCurveTo(x + rx * (1 - KAPPA90), y, x, y + ry * (1 - KAPPA90), x, y + ry);
            this.close();
        }
    },

    fillRect: function (x, y, w, h) {
        this.cmds.push(['fillRect', arguments]);
        this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    close: function () {
        this.cmds.push(['closePath', arguments]);
    },

    stroke: function () {
        this.cmds.push(['stroke', arguments]);
        this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    fill: function () {
        this.cmds.push(['fill', arguments]);
        this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    },

    clear: function () {
        this.cmds.push(['clear']);
        this.setDirtyFlag(_ccsg.Node._dirtyFlags.contentDirty);
    }
});

var misc = require('../utils/misc');
misc.propertyDefine(CanvasRenderCmd, ['lineWidth', 'lineCap', 'lineJoin', 'miterLimit', 'strokeColor', 'fillColor'], {});

module.exports = CanvasRenderCmd;
