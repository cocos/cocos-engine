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

//-------------------------- ClippingNode's canvas render cmd --------------------------------
cc.ClippingNode.CanvasRenderCmd = function(renderable){
    this._rootCtor(renderable);

    this._rendererClipCmd = new cc.CustomRenderCmd(this, this._drawStencilCommand);
    this._rendererRestoreCmd = new cc.CustomRenderCmd(this, this._restoreCmdCallback);
};
var proto = cc.ClippingNode.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = cc.ClippingNode.CanvasRenderCmd;

proto.initStencilBits = function(){};

proto.setStencil = function(stencil){
    if(stencil == null)
        return;

    this._node._stencil = stencil;

    if (stencil instanceof cc.DrawNode) {

    }else{
        cc.errorID(6300);
    }
};

// should reset program used by _stencil
proto.resetProgramByStencil = function () { };

proto._restoreCmdCallback = function (ctx) {
    var wrapper = ctx || cc._renderContext;
    wrapper.restore();
};

proto._drawStencilCommand = function (ctx, scaleX, scaleY) {
    var wrapper = ctx || cc._renderContext, context = wrapper.getContext();
    wrapper.save();
    context.beginPath();                                                         //save for clip
    wrapper.setTransform(this._worldTransform, scaleX, scaleY);

    //draw elements
    var stencilBuffer = this._node._stencil._buffer;
    for(var index = 0; index < stencilBuffer.length; ++index) {
        var vertices = stencilBuffer[index].verts;
        if(vertices.length < 3) continue;
        context.moveTo(vertices[0].x, -vertices[0].y);
        for(var vIndex = 1; vIndex < vertices.length; ++vIndex) {
            context.lineTo(vertices[vIndex].x, -vertices[vIndex].y);
        }
    }
    //end draw elements
    context.clip();
};

proto.visit = function(parentCmd){
    var node = this._node;
    this._propagateFlagsDown(parentCmd);
    // quick return if not visible
    if (!node._visible)
        return;

    parentCmd = parentCmd || this.getParentRenderCmd();
    if( parentCmd)
        this._curLevel = parentCmd._curLevel + 1;

    this._syncStatus(parentCmd);
    if(this._node._stencil) {
        cc.renderer.pushRenderCommand(this._rendererClipCmd);
    }
    var i, children = node._children;

    var len = children.length;
    if (len > 0) {
        node.sortAllChildren();
        for (i = 0; i < len; i++)
            children[i]._renderCmd.visit(this);
    }

    if(this._node._stencil) {
        cc.renderer.pushRenderCommand(this._rendererRestoreCmd);
    }
    this._dirtyFlag = 0;
};