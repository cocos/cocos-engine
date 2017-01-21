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

var macro = cc.macro;

//Sprite's WebGL render command
_ccsg.Sprite.WebGLRenderCmd = function (renderable) {
    this._rootCtor(renderable);
    this._needDraw = true;

    this._vertices = [
        {x: 0, y: 0, u: 0, v: 0}, // tl
        {x: 0, y: 0, u: 0, v: 0}, // bl
        {x: 0, y: 0, u: 0, v: 0}, // tr
        {x: 0, y: 0, u: 0, v: 0}  // br
    ];
    this._dirty = false;
    this._recursiveDirty = false;

    this._shaderProgram = cc.shaderCache.programForKey(macro.SHADER_SPRITE_POSITION_TEXTURECOLOR);
};

var proto = _ccsg.Sprite.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
proto.constructor = _ccsg.Sprite.WebGLRenderCmd;

proto.updateBlendFunc = function (blendFunc) {};

proto.setDirtyFlag = function(dirtyFlag){
    _ccsg.Node.WebGLRenderCmd.prototype.setDirtyFlag.call(this, dirtyFlag);
    this._dirty = true;
};

proto.setDirtyRecursively = function (value) {
    this._recursiveDirty = value;
    this._dirty = value;
    // recursively set dirty
    var locChildren = this._node._children, child, l = locChildren ? locChildren.length : 0;
    for (var i = 0; i < l; i++) {
        child = locChildren[i];
        (child instanceof _ccsg.Sprite) && child._renderCmd.setDirtyRecursively(value);
    }
};

proto._handleTextureForRotatedTexture = function (texture) {
    return texture;
};

proto.isFrameDisplayed = function (frame) {
    var node = this._node;
    return (cc.rectEqualToRect(frame.getRect(), node._rect) && frame.getTexture().getName() === node._texture.getName()
        && cc.pointEqualToPoint(frame.getOffset(), node._unflippedOffsetPositionFromCenter));
};

proto._updateForSetSpriteFrame = function () {};

proto._spriteFrameLoadedCallback = function (event) {
    var spriteFrame = event.currentTarget;
    this._node.setTextureRect(spriteFrame.getRect(), spriteFrame.isRotated(), spriteFrame.getOriginalSize());
    this._node.emit("load");
};

proto._textureLoadedCallback = function (event) {
    var node = this._node, sender = event.currentTarget;
    if (node._textureLoaded)
        return;

    node._textureLoaded = true;
    var locRect = node._rect;
    if (!locRect) {
        locRect = cc.rect(0, 0, sender.width, sender.height);
    } else if (cc._rectEqualToZero(locRect)) {
        locRect.width = sender.width;
        locRect.height = sender.height;
    }

    node.texture = sender;
    node.setTextureRect(locRect, node._rectRotated);

    node.emit("load");

    // Force refresh the render command list
    cc.renderer.childrenOrderDirty = true;
};

proto._setTextureCoords = function (rect) {
    var node = this._node;

    var tex = node._texture;
    var uvs = this._vertices;
    if (!tex)
        return;

    var atlasWidth = tex.pixelWidth;
    var atlasHeight = tex.pixelHeight;

    var left, right, top, bottom, tempSwap;
    if (node._rectRotated) {
        if (macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
            left = (2 * rect.x + 1) / (2 * atlasWidth);
            right = left + (rect.height * 2 - 2) / (2 * atlasWidth);
            top = (2 * rect.y + 1) / (2 * atlasHeight);
            bottom = top + (rect.width * 2 - 2) / (2 * atlasHeight);
        } else {
            left = rect.x / atlasWidth;
            right = (rect.x + rect.height) / atlasWidth;
            top = rect.y / atlasHeight;
            bottom = (rect.y + rect.width) / atlasHeight;
        }

        if (node._flippedX) {
            tempSwap = top;
            top = bottom;
            bottom = tempSwap;
        }

        if (node._flippedY) {
            tempSwap = left;
            left = right;
            right = tempSwap;
        }

        uvs[0].u = right;  // tl
        uvs[0].v = top;    // tl
        uvs[1].u = left;   // bl
        uvs[1].v = top;    // bl
        uvs[2].u = right;  // tr
        uvs[2].v = bottom; // tr
        uvs[3].u = left;   // br
        uvs[3].v = bottom; // br
    } else {
        if (macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL) {
            left = (2 * rect.x + 1) / (2 * atlasWidth);
            right = left + (rect.width * 2 - 2) / (2 * atlasWidth);
            top = (2 * rect.y + 1) / (2 * atlasHeight);
            bottom = top + (rect.height * 2 - 2) / (2 * atlasHeight);
        } else {
            left = rect.x / atlasWidth;
            right = (rect.x + rect.width) / atlasWidth;
            top = rect.y / atlasHeight;
            bottom = (rect.y + rect.height) / atlasHeight;
        }

        if (node._flippedX) {
            tempSwap = left;
            left = right;
            right = tempSwap;
        }

        if (node._flippedY) {
            tempSwap = top;
            top = bottom;
            bottom = tempSwap;
        }

        uvs[0].u = left;   // tl
        uvs[0].v = top;    // tl
        uvs[1].u = left;   // bl
        uvs[1].v = bottom; // bl
        uvs[2].u = right;  // tr
        uvs[2].v = top;    // tr
        uvs[3].u = right;  // br
        uvs[3].v = bottom; // br
    }
};

proto._setColorDirty = function () {};

proto._updateBlendFunc = function () {
    // it's possible to have an untextured sprite
    var node = this._node;
    if (!node._texture || !node._texture.hasPremultipliedAlpha()) {
        node._blendFunc.src = macro.SRC_ALPHA;
        node._blendFunc.dst = macro.ONE_MINUS_SRC_ALPHA;
        node.opacityModifyRGB = false;
    } else {
        node._blendFunc.src = macro.BLEND_SRC;
        node._blendFunc.dst = macro.BLEND_DST;
        node.opacityModifyRGB = true;
    }
};

proto._setTexture = function (texture) {
    var node = this._node;

    if(node._texture !== texture){
        node._textureLoaded = texture ? texture._textureLoaded : false;
        node._texture = texture;
        this._updateBlendFunc();

        if (node._textureLoaded) {
            // Force refresh the render command list
            cc.renderer.childrenOrderDirty = true;
        }
    }
};

proto._checkTextureBoundary = function (texture, rect, rotated) {
    if (texture && texture.url) {
        var _x, _y;
        if (rotated) {
            _x = rect.x + rect.height;
            _y = rect.y + rect.width;
        } else {
            _x = rect.x + rect.width;
            _y = rect.y + rect.height;
        }
        if (_x > texture.width) {
            cc.errorID(3300, texture.url);
        }
        if (_y > texture.height) {
            cc.errorID(3400, texture.url);
        }
    }
};

proto.transform = function (parentCmd, recursive) {
    this.originTransform(parentCmd, recursive);

    var node = this._node,
        lx = node._offsetPosition.x, rx = lx + node._rect.width,
        by = node._offsetPosition.y, ty = by + node._rect.height,
        wt = this._worldTransform;

    var vertices = this._vertices;
    vertices[0].x = lx * wt.a + ty * wt.c + wt.tx; // tl
    vertices[0].y = lx * wt.b + ty * wt.d + wt.ty;
    vertices[1].x = lx * wt.a + by * wt.c + wt.tx; // bl
    vertices[1].y = lx * wt.b + by * wt.d + wt.ty;
    vertices[2].x = rx * wt.a + ty * wt.c + wt.tx; // tr
    vertices[2].y = rx * wt.b + ty * wt.d + wt.ty;
    vertices[3].x = rx * wt.a + by * wt.c + wt.tx; // br
    vertices[3].y = rx * wt.b + by * wt.d + wt.ty;
};

proto.needDraw = function () {
    var node = this._node, locTexture = node._texture;
    return (this._needDraw && locTexture);
};

proto.uploadData = function (f32buffer, ui32buffer, vertexDataOffset) {
    var node = this._node, locTexture = node._texture;
    if (!(locTexture && locTexture._textureLoaded && node._rect.width && node._rect.height) || !this._displayedOpacity)
        return 0;

    // Fill in vertex data with quad information (4 vertices for sprite)
    var opacity = this._displayedOpacity;
    var color, colorVal = this._displayedColor._val;
    if (node._opacityModifyRGB) {
        var a = opacity / 255,
            r = this._displayedColor.r * a,
            g = this._displayedColor.g * a,
            b = this._displayedColor.b * a;
        color = ((opacity<<24) >>> 0) + (b<<16) + (g<<8) + r;
    }
    else {
        color = ((opacity<<24) >>> 0) + ((colorVal&0xff00)<<8) + ((colorVal&0xff0000)>>8) + (colorVal>>24);
    }
    var z = node._vertexZ;

    var vertices = this._vertices;
    var i, len = vertices.length, vertex, offset = vertexDataOffset;
    for (i = 0; i < len; ++i) {
        vertex = vertices[i];
        f32buffer[offset] = vertex.x;
        f32buffer[offset + 1] = vertex.y;
        f32buffer[offset + 2] = z;
        ui32buffer[offset + 3] = color;
        f32buffer[offset + 4] = vertex.u;
        f32buffer[offset + 5] = vertex.v;
        offset += 6;
    }

    return len;
};
