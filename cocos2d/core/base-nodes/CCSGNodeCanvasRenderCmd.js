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


//-----------------------Canvas ---------------------------

//The _ccsg.Node's render command for Canvas
_ccsg.Node.CanvasRenderCmd = function (renderable) {
    this._ctor(renderable);
};

var proto = _ccsg.Node.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.RenderCmd.prototype);
proto.constructor = _ccsg.Node.CanvasRenderCmd;
proto._rootCtor = _ccsg.Node.CanvasRenderCmd;

proto.detachFromParent = function () {
    var selChildren = this._node._children, item;
    for (var i = 0, len = selChildren.length; i < len; i++) {
        item = selChildren[i];
        if (item && item._renderCmd)
            item._renderCmd.detachFromParent();
    }
};

proto.setShaderProgram = function (shaderProgram) {
    //do nothing.
};

proto.getShaderProgram = function () {
    return null;
};

//util functions
_ccsg.Node.CanvasRenderCmd._getCompositeOperationByBlendFunc = function (blendFunc) {
    if (!blendFunc)
        return "source-over";
    else {
        if (( blendFunc.src === cc.macro.SRC_ALPHA && blendFunc.dst === cc.macro.ONE) || (blendFunc.src === cc.macro.ONE && blendFunc.dst === cc.macro.ONE))
            return "lighter";
        else if (blendFunc.src === cc.macro.ZERO && blendFunc.dst === cc.macro.SRC_ALPHA)
            return "destination-in";
        else if (blendFunc.src === cc.macro.ZERO && blendFunc.dst === cc.macro.ONE_MINUS_SRC_ALPHA)
            return "destination-out";
        else
            return "source-over";
    }
};
