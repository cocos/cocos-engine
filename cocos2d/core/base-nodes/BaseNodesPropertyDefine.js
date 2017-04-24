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

cc._tmp.PrototypeCCNode = function () {

    var _p = _ccsg.Node.prototype;

    cc.defineGetterSetter(_p, "x", _p.getPositionX, _p.setPositionX);
    cc.defineGetterSetter(_p, "y", _p.getPositionY, _p.setPositionY);
    cc.defineGetterSetter(_p, "width", _p._getWidth, _p._setWidth);
    cc.defineGetterSetter(_p, "height", _p._getHeight, _p._setHeight);
    cc.defineGetterSetter(_p, "anchorX", _p._getAnchorX, _p._setAnchorX);
    cc.defineGetterSetter(_p, "anchorY", _p._getAnchorY, _p._setAnchorY);
    cc.defineGetterSetter(_p, "skewX", _p.getSkewX, _p.setSkewX);
    cc.defineGetterSetter(_p, "skewY", _p.getSkewY, _p.setSkewY);
    cc.defineGetterSetter(_p, "zIndex", _p.getLocalZOrder, _p.setLocalZOrder);
    cc.defineGetterSetter(_p, "vertexZ", _p.getVertexZ, _p.setVertexZ);
    cc.defineGetterSetter(_p, "rotation", _p.getRotation, _p.setRotation);
    cc.defineGetterSetter(_p, "rotationX", _p.getRotationX, _p.setRotationX);
    cc.defineGetterSetter(_p, "rotationY", _p.getRotationY, _p.setRotationY);
    cc.defineGetterSetter(_p, "scale", _p.getScale, _p.setScale);
    cc.defineGetterSetter(_p, "scaleX", _p.getScaleX, _p.setScaleX);
    cc.defineGetterSetter(_p, "scaleY", _p.getScaleY, _p.setScaleY);
    cc.defineGetterSetter(_p, "children", _p.getChildren);
    cc.defineGetterSetter(_p, "childrenCount", _p.getChildrenCount);
    cc.defineGetterSetter(_p, "parent", _p.getParent, _p.setParent);
    cc.defineGetterSetter(_p, "visible", _p.isVisible, _p.setVisible);
    cc.defineGetterSetter(_p, "running", _p.isRunning);
    cc.defineGetterSetter(_p, "ignoreAnchor", _p.isIgnoreAnchorPointForPosition, _p.setIgnoreAnchorPointForPosition);
    cc.defineGetterSetter(_p, "scheduler", _p.getScheduler, _p.setScheduler);
    //cc.defineGetterSetter(_p, "boundingBox", _p.getBoundingBox);
    cc.defineGetterSetter(_p, "shaderProgram", _p.getShaderProgram, _p.setShaderProgram);
    cc.defineGetterSetter(_p, "opacity", _p.getOpacity, _p.setOpacity);
    cc.defineGetterSetter(_p, "opacityModifyRGB", _p.isOpacityModifyRGB);
    cc.defineGetterSetter(_p, "cascadeOpacity", _p.isCascadeOpacityEnabled, _p.setCascadeOpacityEnabled);
    cc.defineGetterSetter(_p, "color", _p.getColor, _p.setColor);
    cc.defineGetterSetter(_p, "cascadeColor", _p.isCascadeColorEnabled, _p.setCascadeColorEnabled);
};