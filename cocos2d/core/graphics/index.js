'use strict';


if (!cc.sys.isNative) {
    cc.GraphicsNode = require('./graphics-node');
}

var GraphicsNode = cc.GraphicsNode;
var _p = GraphicsNode.prototype;

cc.defineGetterSetter( _p, 'lineWidth',   _p.getStrokeWidth, _p.setStrokeWidth );
cc.defineGetterSetter( _p, 'lineCap',     _p.getLineCap,     _p.setLineCap );
cc.defineGetterSetter( _p, 'lineJoin',    _p.getLineJoin,    _p.setLineJoin );
cc.defineGetterSetter( _p, 'miterLimit',  _p.getMiterLimit,  _p.setMiterLimit );
cc.defineGetterSetter( _p, 'deviceRatio', _p.getDeviceRatio, _p.setDeviceRatio );
cc.defineGetterSetter( _p, 'strokeColor', _p.getStrokeColor, _p.setStrokeColor);
cc.defineGetterSetter( _p, 'fillColor',   _p.getFillColor,   _p.setFillColor);

require('./graphics');
