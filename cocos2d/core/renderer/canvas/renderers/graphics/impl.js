/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Helper = require('../../../../graphics/helper');
const Types = require('../../../../graphics/types');
const js = require('../../../../platform/js');
const LineJoin = Types.LineJoin;
const LineCap = Types.LineCap;

function Impl () {
    this.cmds = [];

    this.style = {
        strokeStyle: 'black',
        fillStyle: 'white',
        lineCap: 'butt',
        lineJoin: 'miter',
        miterLimit: 10
    };
}

let _proto = Impl.prototype;

js.mixin(_proto, {
    moveTo (x, y) {
        this.cmds.push(['moveTo', [x, y]]);
    },

    lineTo (x, y) {
        this.cmds.push(['lineTo', [x, y]]);
    },

    bezierCurveTo (c1x, c1y, c2x, c2y, x, y) {
        this.cmds.push(['bezierCurveTo', [c1x, c1y, c2x, c2y, x, y]]);
    },

    quadraticCurveTo (cx, cy, x, y) {
        this.cmds.push(['quadraticCurveTo', [cx, cy, x, y]]);
    },

    arc (cx, cy, r, startAngle, endAngle, counterclockwise) {
        Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
    },

    ellipse (cx, cy, rx, ry) {
        Helper.ellipse(this, cx, cy, rx, ry);
    },

    circle (cx, cy, r) {
        Helper.ellipse(this, cx, cy, r, r);
    },

    rect (x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.close();
    },

    roundRect (x, y, w, h, r) {
        Helper.roundRect(this, x, y, w, h, r);
    },

    clear (comp, clean) {
        this.cmds.length = 0;
    },

    close () {
        this.cmds.push(['closePath', []]);
    },

    stroke () {
        this.cmds.push(['stroke', []]);
    },

    fill () {
        this.cmds.push(['fill', []]);
    }
});

js.set(_proto, 'strokeColor', function (v) {
    var strokeStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
    this.cmds.push(['strokeStyle', strokeStyle]);
    this.style.strokeStyle = strokeStyle;
});

js.set(_proto, 'fillColor', function (v) {
    var fillStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
    this.cmds.push(['fillStyle', fillStyle]);
    this.style.fillStyle = fillStyle;
});

js.set(_proto, 'lineWidth', function (v) {
    this.cmds.push(['lineWidth', v]);
    this.style.lineWidth = v;
});


js.set(_proto, 'lineCap', function (v) {
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
});

js.set(_proto, 'lineJoin', function (v) {
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
});

js.set(_proto, 'miterLimit', function (v) {
    this.cmds.push(['miterLimit', v]);
    this.style.miterLimit = v;
});

cc.Graphics._Impl = Impl;
module.exports = Impl;
