
const Helper = require('../../../../graphics/helper');
const Types = require('../../../../graphics/types');
const PointFlags = Types.PointFlags;
const LineJoin = Types.LineJoin;
const LineCap = Types.LineCap;

class Impl  {
    constructor () {
        this.cmds = [];

        this.style = {
            strokeStyle: 'black',
            fillStyle: 'white',
            lineCap: 'butt',
            lineJoin: 'miter',
            miterLimit: 10
        };
    }

    set strokeColor (v) {
        var strokeStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
        this.cmds.push(['strokeStyle', strokeStyle]);
        this.style.strokeStyle = strokeStyle;
    }

    set fillColor (v) {
        var fillStyle = 'rgba(' + (0 | v.r) + ',' + (0 | v.g) + ',' + (0 | v.b) + ',' + v.a / 255 + ')';
        this.cmds.push(['fillStyle', fillStyle]);
        this.style.fillStyle = fillStyle;
    }

    set lineWidth (v) {
        this.cmds.push(['lineWidth', v]);
        this.style.lineWidth = v;
    }

    set lineCap (v) {
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
    }

    set lineJoin (v) {
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
    }

    set miterLimit (v) {
        this.cmds.push(['miterLimit', v]);
        this.style.miterLimit = v;
    }

    moveTo (x, y) {
        this.cmds.push(['moveTo', [x, y]]);
    }

    lineTo (x, y) {
        this.cmds.push(['lineTo', [x, y]]);
    }

    bezierCurveTo (c1x, c1y, c2x, c2y, x, y) {
        this.cmds.push(['bezierCurveTo', [c1x, c1y, c2x, c2y, x, y]]);
    }

    quadraticCurveTo (cx, cy, x, y) {
        this.cmds.push(['quadraticCurveTo', [cx, cy, x, y]]);
    }

    arc (cx, cy, r, startAngle, endAngle, counterclockwise) {
        Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
    }

    ellipse (cx, cy, rx, ry) {
        Helper.ellipse(this, cx, cy, rx, ry);
    }

    circle (cx, cy, r) {
        Helper.ellipse(this, cx, cy, r, r);
    }

    rect (x, y, w, h) {
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.close();
    }

    roundRect (x, y, w, h, r) {
        Helper.roundRect(this, x, y, w, h, r);
    }

    clear (comp, clean) {
        this.cmds.length = 0;
    }

    close () {
        this.cmds.push(['closePath', []]);
    }

    stroke () {
        this.cmds.push(['stroke', []]);
    }

    fill () {
        this.cmds.push(['fill', []]);
    }
}

module.exports = Impl;
