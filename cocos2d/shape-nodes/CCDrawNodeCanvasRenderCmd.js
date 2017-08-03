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

cc.DrawNode.CanvasRenderCmd = function(renderableObject){
    this._rootCtor(renderableObject);
    this._needDraw = true;
    this._buffer = null;
    this._drawColor = null;
    this._blendFunc = null;
};

var proto = cc.DrawNode.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = cc.DrawNode.CanvasRenderCmd;

proto.rendering = function (ctx, scaleX, scaleY) {
    var wrapper = ctx || cc._renderContext, context = wrapper.getContext(), node = this._node;
    var alpha = node._displayedOpacity / 255;
    if (alpha === 0)
        return;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);

    //context.save();
    wrapper.setGlobalAlpha(alpha);
    if ((this._blendFunc && (this._blendFunc.src === cc.macro.SRC_ALPHA) && (this._blendFunc.dst === cc.macro.ONE)))
        wrapper.setCompositeOperation('lighter');               //todo: need refactor
    var locBuffer = this._buffer;
    for (var i = 0, len = locBuffer.length; i < len; i++) {
        var element = locBuffer[i];
        switch (element.type) {
            case cc.DrawNode.TYPE_DOT:
                this._drawDot(wrapper, element, scaleX, scaleY);
                break;
            case cc.DrawNode.TYPE_SEGMENT:
                this._drawSegment(wrapper, element, scaleX, scaleY);
                break;
            case cc.DrawNode.TYPE_POLY:
                this._drawPoly(wrapper, element, scaleX, scaleY);
                break;
        }
    }
    //context.restore();            //todo It can be reserve
};

proto._drawDot = function (wrapper, element, scaleX, scaleY) {
    var locColor = element.fillColor, locPos = element.verts[0], locRadius = element.lineWidth;

    var ctx = wrapper.getContext();
    wrapper.setFillStyle("rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")");

    ctx.beginPath();
    ctx.arc(locPos.x, -locPos.y, locRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
};

proto._drawSegment = function (wrapper, element, scaleX, scaleY) {
    var locColor = element.lineColor;
    var locFrom = element.verts[0], locTo = element.verts[1];
    var locLineWidth = element.lineWidth, locLineCap = element.lineCap;

    var ctx = wrapper.getContext();
    wrapper.setStrokeStyle("rgba(" + (0 | locColor.r) + "," + (0 | locColor.g) + "," + (0 | locColor.b) + "," + locColor.a / 255 + ")");

    ctx.lineWidth = locLineWidth * scaleX;
    ctx.beginPath();
    ctx.lineCap = locLineCap;
    ctx.moveTo(locFrom.x, -locFrom.y);
    ctx.lineTo(locTo.x, -locTo.y);
    ctx.stroke();
};

proto._drawPoly = function (wrapper, element, scaleX, scaleY) {
    var locVertices = element.verts, locLineCap = element.lineCap;
    if (locVertices == null)
        return;

    var locFillColor = element.fillColor, locLineWidth = element.lineWidth;
    var locLineColor = element.lineColor, locIsClosePolygon = element.isClosePolygon;
    var locIsFill = element.isFill, locIsStroke = element.isStroke;

    var ctx = wrapper.getContext();
    var firstPoint = locVertices[0];
    ctx.lineCap = locLineCap;
    if (locFillColor)
        wrapper.setFillStyle("rgba(" + (0 | locFillColor.r) + "," + (0 | locFillColor.g) + ","
            + (0 | locFillColor.b) + "," + locFillColor.a / 255 + ")");
    if (locLineWidth)
        ctx.lineWidth = locLineWidth * scaleX;
    if (locLineColor)
        wrapper.setStrokeStyle("rgba(" + (0 | locLineColor.r) + "," + (0 | locLineColor.g) + ","
            + (0 | locLineColor.b) + "," + locLineColor.a / 255 + ")");

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, -firstPoint.y);
    for (var i = 1, len = locVertices.length; i < len; i++)
        ctx.lineTo(locVertices[i].x, -locVertices[i].y);

    if (locIsClosePolygon)
        ctx.closePath();
    if (locIsFill)
        ctx.fill();
    if (locIsStroke)
        ctx.stroke();
};