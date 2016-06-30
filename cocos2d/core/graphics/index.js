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
