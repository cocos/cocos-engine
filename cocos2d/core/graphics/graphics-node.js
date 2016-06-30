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
Js.mixin(_p, {
    // properties
    _strokeColor: null,
    _fillColor: null,

    _lineWidth: 1,

    _lineCap: LineCap.BUTT,
    _lineJoin: LineJoin.MITER,

    setStrokeColor: function (v) {
        this._strokeColor = v;
        this._renderCmd.strokeColor = v;
    },
    getStrokeColor: function () {
        return this._strokeColor;
    },

    setFillColor: function (v) {
        this._fillColor = v;
        this._renderCmd.fillColor = v;
    },
    getFillColor: function () {
        return this._fillColor;
    },

    setLineWidth: function (v) {
        this._lineWidth = v;
        this._renderCmd.lineWidth = v;
    },
    getLineWidth: function () {
        return this._lineWidth;
    },

    setLineCap: function (v) {
        this._lineCap = v;
        this._renderCmd.lineCap = v;
    },
    getLineCap: function () {
        return this._lineCap;
    },

    setLineJoin: function (v) {
        this._lineJoin = v;
        this._renderCmd.lineJoin = v;
    },
    getLineJoin: function () {
        return this._lineJoin;
    },

    // draw functions
    
    beginPath: function () {
        this._renderCmd.beginPath();
    },

    moveTo: function (x, y) {
        this._renderCmd.moveTo(x, y);
    },

    lineTo: function (x, y) {
        this._renderCmd.lineTo(x, y);
    },

    bezierCurveTo: function (c1x, c1y, c2x, c2y, x, y) {
        this._renderCmd.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
    },

    quadraticCurveTo: function (cx, cy, x, y) {
        this._renderCmd.quadraticCurveTo(cx, cy, x, y);
    },

    //
    arc: function (cx, cy, r, a0, a1, counterclockwise) {
        this._renderCmd.arc(cx, cy, r, a0, a1, counterclockwise);
    },

    ellipse: function (cx, cy, rx, ry) {
        this._renderCmd.ellipse(cx, cy, rx, ry);
    },

    circle: function (cx, cy, r) {
        this._renderCmd.circle(cx, cy, r);
    },

    rect: function (x, y, w, h) {
        this._renderCmd.rect(x, y, w, h);
    },

    roundRect: function (x, y, w, h, r) {
        this._renderCmd.roundRect(x, y, w, h, r);
    },

    fillRect: function (x, y, w, h) {
        this._renderCmd.fillRect(x, y, w, h);
    },

    close: function () {
        this._renderCmd.close();
    },

    stroke: function () {
        this._renderCmd.stroke();
    },

    fill: function () {
        this._renderCmd.fill();
    }
});

cc.defineGetterSetter(_p, 'strokeColor', _p.getStrokeColor, _p.setStrokeColor);
cc.defineGetterSetter(_p, 'fillColor',   _p.getFillColor,   _p.setFillColor);
cc.defineGetterSetter(_p, 'lineWidth',   _p.getLineWidth,   _p.setLineWidth);
cc.defineGetterSetter(_p, 'lineCap',     _p.getLineCap,     _p.setLineCap);
cc.defineGetterSetter(_p, 'lineJoin',    _p.getLineJoin,    _p.setLineJoin);


module.exports = GraphicsNode;
