/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2012 Neofect. All rights reserved.

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

 Created by Jung Sang-Taik on 2012-03-16
 ****************************************************************************/

EventTarget = require("../cocos2d/core/event/event-target");

/**
 * <p>
 * A 9-slice sprite for cocos2d UI.                                                                    <br/>
 *                                                                                                     <br/>
 * 9-slice scaling allows you to specify how scaling is applied                                        <br/>
 * to specific areas of a sprite. With 9-slice scaling (3x3 grid),                                     <br/>
 * you can ensure that the sprite does not become distorted when                                       <br/>
 * scaled.                                                                                             <br/>
 * @note: it will refactor in v3.1                                                                    <br/>
 * @see http://yannickloriot.com/library/ios/cccontrolextension/Classes/CCScale9Sprite.html            <br/>
 * </p>
 * @class
 * @extends _ccsg.Node
 *
 * @property {cc.Size}  preferredSize   - The preferred size of the 9-slice sprite
 * @property {cc.Rect}  capInsets       - The cap insets of the 9-slice sprite
 * @property {Number}   insetLeft       - The left inset of the 9-slice sprite
 * @property {Number}   insetTop        - The top inset of the 9-slice sprite
 * @property {Number}   insetRight      - The right inset of the 9-slice sprite
 * @property {Number}   insetBottom     - The bottom inset of the 9-slice sprite
 */
cc.Scale9Sprite = _ccsg.Node.extend({
    //resource data, could be async loaded.
    _spriteFrame: null,

    //scale 9 data
    _insetLeft: 0,
    _insetRight: 0,
    _insetTop: 0,
    _insetBottom: 0,
    //blend function
    _blendFunc: null,
    //sliced or simple
    _renderingType: 1,
    //bright or not
    _brightState: 0,
    //rendering quads
    _quads: [],
    _quadsDirty: true,

    ctor: function (textureOrSpriteFrame) {
        _ccsg.Node.prototype.ctor.call(this);
        this._renderCmd.setState(this._brightState);
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        //
        if (typeof textureOrSpriteFrame === 'string') {
            var frame = cc.spriteFrameCache.getSpriteFrame(textureOrSpriteFrame);
            if (frame) {
                this.initWithSpriteFrame(frame);
            } else {
                this.initWithTexture(textureOrSpriteFrame);
            }
        } else if (textureOrSpriteFrame instanceof cc.SpriteFrame) {
            this.initWithSpriteFrame(textureOrSpriteFrame);
        }
        else if (textureOrSpriteFrame instanceof cc.Texture2D) {
            this.initWithTexture(textureOrSpriteFrame);
        }
    },

    loaded: function () {
        if (this._spriteFrame === null) {
            return false;
        } else {
            return this._spriteFrame.textureLoaded();
        }
    },

    /**
     * Initializes a 9-slice sprite with a texture file
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    initWithTexture: function (textureOrTextureFile) {
        this.setTexture(textureOrTextureFile);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame
     * @param spriteFrameOrSFName The sprite frame object.
     */
    initWithSpriteFrame: function (spriteFrameOrSFName) {
        this.setSpriteFrame(spriteFrameOrSFName);
    },

    /**
     * Change the texture file of 9 slice sprite
     *
     * @param textureOrTextureFile The name of the texture file.
     */
    setTexture: function (textureOrTextureFile) {
        var spriteFrame = cc.SpriteFrame.createWithTexture(textureOrTextureFile);
        this.setSpriteFrame(spriteFrame);
    },

    /**
     * Change the sprite frame of 9 slice sprite
     *
     * @param spriteFrameOrSFFileName The name of the texture file.
     */
    setSpriteFrame: function (spriteFrameOrSFName) {
        var spriteFrame;
        if (spriteFrameOrSFName instanceof cc.SpriteFrame) {
            spriteFrame = spriteFrameOrSFName;
        }
        else {
            spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameOrSFName);
        }

        if (spriteFrame) {
            this._spriteFrame = spriteFrame;
            this._quadsDirty = true;
            var self = this;
            var onResourceDataLoaded = function () {
                if (cc.sizeEqualToSize(self._contentSize, cc.size(0, 0))) {
                    self.setContentSize(self._spriteFrame.getRect());
                }
            };
            if (spriteFrame.textureLoaded()) {
                onResourceDataLoaded();
            } else {
                spriteFrame.once('load', onResourceDataLoaded, this);
            }
        }
    },

    /**
     * Sets the source blending function.
     *
     * @param blendFunc A structure with source and destination factor to specify pixel arithmetic. e.g. {GL_ONE, GL_ONE}, {GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA}.
     */
    setBlendFunc: function (blendFunc, dst) {
        if (dst === undefined) {
            this._blendFunc.src = blendFunc.src || cc.BLEND_SRC;
            this._blendFunc.dst = blendFunc.dst || cc.BLEND_DST;
        }
        else {
            this._blendFunc.src = blendFunc || cc.BLEND_SRC;
            this._blendFunc.dst = dst || cc.BLEND_DST;
        }
    },

    /**
     * Returns the blending function that is currently being used.
     *
     * @return A BlendFunc structure with source and destination factor which specified pixel arithmetic.
     */
    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    },

    // overrides
    setContentSize: function (width, height) {
        if (height === undefined) {
            height = width.height;
            width = width.width;
        }
        if (width === this._contentSize.width && height === this._contentSize.height) {
            return;
        }

        _ccsg.Node.prototype.setContentSize.call(this, width, height);
        this._quadsDirty = true;
    },

    /**
     * Change the state of 9-slice sprite.
     * @see `State`
     * @param state A enum value in State.
     */
    setState: function (state) {
        this._brightState = state;
        this._renderCmd.setState(state);
    },

    /**
     * Query the current bright state.
     * @return @see `State`
     */
    getState: function () {
        return this._brightState;
    },

    /**
     * change the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    setRenderingType: function (type) {
        if (this._renderingType === type) return;
        this._renderingType = type;
        this._quadsDirty = true;
    },
    /**
     * get the rendering type, could be simple or slice
     * @return @see `RenderingType`
     */
    getRenderingType: function () {
        return this._renderingType;
    },
    /**
     * change the left border of 9 slice sprite, it should be specified before trimmed.
     * @param insetLeft left border.
     */
    setInsetLeft: function (insetLeft) {
        this._insetLeft = insetLeft;
        this._quadsDirty = true;
    },
    /**
     * get the left border of 9 slice sprite, the result is specified before trimmed.
     * @return left border.
     */
    getInsetLeft: function () {
        return this._insetLeft;
    },
    /**
     * change the top border of 9 slice sprite, it should be specified before trimmed.
     * @param insetTop top border.
     */
    setInsetTop: function (insetTop) {
        this._insetTop = insetTop;
        this._quadsDirty = true;
    },

    /**
     * get the top border of 9 slice sprite, the result is specified before trimmed.
     * @return top border.
     */
    getInsetTop: function () {
        return this._insetTop;
    },

    /**
     * change the right border of 9 slice sprite, it should be specified before trimmed.
     * @param insetRight right border.
     */
    setInsetRight: function (insetRight) {
        this._insetRight = insetRight;
        this._quadsDirty = true;
    },

    /**
     * get the right border of 9 slice sprite, the result is specified before trimmed.
     * @return right border.
     */
    getInsetRight: function () {
        return this._insetRight;
    },

    /**
     * change the bottom border of 9 slice sprite, it should be specified before trimmed.
     * @param insetBottom bottom border.
     */
    setInsetBottom: function (insetBottom) {
        this._insetBottom = insetBottom;
        this._quadsDirty = true;
    },
    /**
     * get the bottom border of 9 slice sprite, the result is specified before trimmed.
     * @return bottom border.
     */
    getInsetBottom: function () {
        return this._insetBottom;
    },

    _rebuildQuads: function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        var spriteFrame = this._spriteFrame;
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();

        this._quads = [];
        //build vertices
        var vertices = this._calculateVertices();

        //build uvs
        var uvs = this._calculateUVs();

        //build quads
        var quad;
        if (this._renderingType == cc.Scale9Sprite.RenderingType.SIMPLE) {
            quad = new cc.V3F_C4B_T2F_Quad();

            quad._bl.colors = color;
            quad._br.colors = color;
            quad._tl.colors = color;
            quad._tr.colors = color;

            quad._bl.vertices = new cc.Vertex3F(vertices[0].x, vertices[0].y, 0);
            quad._br.vertices = new cc.Vertex3F(vertices[3].x, vertices[0].y, 0);
            quad._tl.vertices = new cc.Vertex3F(vertices[0].x, vertices[3].y, 0);
            quad._tr.vertices = new cc.Vertex3F(vertices[3].x, vertices[3].y, 0);

            if (!spriteFrame._rotated) {
                quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
                quad._br.texCoords = new cc.Tex2F(uvs[3].x, uvs[0].y);
                quad._tl.texCoords = new cc.Tex2F(uvs[0].x, uvs[3].y);
                quad._tr.texCoords = new cc.Tex2F(uvs[3].x, uvs[3].y);
            } else {
                quad._bl.texCoords = new cc.Tex2F(uvs[0].x, uvs[3].y);
                quad._br.texCoords = new cc.Tex2F(uvs[0].x, uvs[0].y);
                quad._tl.texCoords = new cc.Tex2F(uvs[3].x, uvs[3].y);
                quad._tr.texCoords = new cc.Tex2F(uvs[3].x, uvs[0].y);
            }
            this._quads.push(quad);

        } else {
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    quad = new cc.V3F_C4B_T2F_Quad();
                    quad._bl.colors = color;
                    quad._br.colors = color;
                    quad._tl.colors = color;
                    quad._tr.colors = color;

                    quad._bl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j].y, 0);
                    quad._br.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j].y, 0);
                    quad._tl.vertices = new cc.Vertex3F(vertices[i].x, vertices[j + 1].y, 0);
                    quad._tr.vertices = new cc.Vertex3F(vertices[i + 1].x, vertices[j + 1].y, 0);

                    if (!spriteFrame._rotated) {
                        quad._bl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j].y);
                        quad._br.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j].y);
                        quad._tl.texCoords = new cc.Tex2F(uvs[i].x, uvs[j + 1].y);
                        quad._tr.texCoords = new cc.Tex2F(uvs[i + 1].x, uvs[j + 1].y);
                    } else {
                        quad._bl.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - i].y);
                        quad._br.texCoords = new cc.Tex2F(uvs[j].x, uvs[3 - (i + 1)].y);
                        quad._tl.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - i].y);
                        quad._tr.texCoords = new cc.Tex2F(uvs[j + 1].x, uvs[3 - (i + 1)].y);
                    }
                    this._quads.push(quad);
                }
            }
        }
        this._quadsDirty = false;
    },


    _calculateVertices: function () {
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;

        var spriteFrame = this._spriteFrame;
        var rect = spriteFrame._rect;
        leftWidth = this._insetLeft;
        rightWidth = this._insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;

        topHeight = this._insetTop;
        bottomHeight = this._insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var preferSize = this.getContentSize();
        var sizableWidth = preferSize.width - leftWidth - rightWidth;
        var sizableHeight = preferSize.height - topHeight - bottomHeight;
        var xScale = preferSize.width / (leftWidth + rightWidth);
        var yScale = preferSize.height / (topHeight + bottomHeight);
        xScale = xScale > 1 ? 1 : xScale;
        yScale = yScale > 1 ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        var x0, x1, x2, x3;
        var y0, y1, y2, y3;
        x0 = 0;
        x1 = leftWidth * xScale;
        x2 = x1 + sizableWidth;
        x3 = preferSize.width;

        y0 = 0;
        y1 = bottomHeight * yScale;
        y2 = y1 + sizableHeight;
        y3 = preferSize.height;

        //apply contentscale factor
        x0 = x0 / cc.contentScaleFactor();
        x1 = x1 / cc.contentScaleFactor();
        x2 = x2 / cc.contentScaleFactor();
        x3 = x3 / cc.contentScaleFactor();
        y0 = y0 / cc.contentScaleFactor();
        y1 = y1 / cc.contentScaleFactor();
        y2 = y2 / cc.contentScaleFactor();
        y3 = y3 / cc.contentScaleFactor();

        var vertices = [];
        vertices.push(cc.p(x0, y0));
        vertices.push(cc.p(x1, y1));
        vertices.push(cc.p(x2, y2));
        vertices.push(cc.p(x3, y3));

        return vertices;
    },

    _calculateUVs: function () {
        var spriteFrame = this._spriteFrame;
        var rect = spriteFrame._rect;
        var atlasWidth = spriteFrame._texture.getPixelWidth();
        var atlasHeight = spriteFrame._texture.getPixelHeight();

        //caculate texture coordinate
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        leftWidth = this._insetLeft;
        rightWidth = this._insetRight;
        centerWidth = rect.width - leftWidth - rightWidth;

        topHeight = this._insetTop;
        bottomHeight = this._insetBottom;
        centerHeight = rect.height - topHeight - bottomHeight;

        var textureRect = cc.rectPointsToPixels(spriteFrame.getRect());

        //uv computation should take spritesheet into account.
        var u0, u1, u2, u3;
        var v0, v1, v2, v3;

        if (spriteFrame._rotated) {
            u0 = textureRect.x / atlasWidth;
            u1 = (bottomHeight + textureRect.x) / atlasWidth;
            u2 = (bottomHeight + centerHeight + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.height) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (leftWidth + textureRect.y) / atlasHeight;
            v2 = (leftWidth + centerWidth + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.width) / atlasHeight;
        }
        else {
            u0 = textureRect.x / atlasWidth;
            u1 = (leftWidth + textureRect.x) / atlasWidth;
            u2 = (leftWidth + centerWidth + textureRect.x) / atlasWidth;
            u3 = (textureRect.x + textureRect.width) / atlasWidth;

            v0 = textureRect.y / atlasHeight;
            v1 = (topHeight + textureRect.y) / atlasHeight;
            v2 = (topHeight + centerHeight + textureRect.y) / atlasHeight;
            v3 = (textureRect.y + textureRect.height) / atlasHeight;
        }

        var uvCoordinates = [];
        uvCoordinates.push(cc.p(u0, v3));
        uvCoordinates.push(cc.p(u1, v2));
        uvCoordinates.push(cc.p(u2, v1));
        uvCoordinates.push(cc.p(u3, v0));

        return uvCoordinates;
    },

    _onColorOpacityDirty: function () {
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        var index;
        var quadLength = this._quads.length;
        for (index = 0; index < quadLength; ++index) {
            //svar quad = this._quads[index];
            this._quads[index]._bl.colors = color;
            this._quads[index]._br.colors = color;
            this._quads[index]._tl.colors = color;
            this._quads[index]._tr.colors = color;
        }
    },

    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new cc.Scale9Sprite.WebGLRenderCmd(this);
    }

});

var _p = cc.Scale9Sprite.prototype;
cc.js.addon(_p, EventTarget.prototype);

// Extended properties
/** @expose */
_p.insetLeft;
cc.defineGetterSetter(_p, "insetLeft", _p.getInsetLeft, _p.setInsetLeft);
/** @expose */
_p.insetTop;
cc.defineGetterSetter(_p, "insetTop", _p.getInsetTop, _p.setInsetTop);
/** @expose */
_p.insetRight;
cc.defineGetterSetter(_p, "insetRight", _p.getInsetRight, _p.setInsetRight);
/** @expose */
_p.insetBottom;
cc.defineGetterSetter(_p, "insetBottom", _p.getInsetBottom, _p.setInsetBottom);

_p = null;


cc.Scale9Sprite.create = function (file) {
    return new cc.Scale9Sprite(file);
};

/**
 * create a cc.Scale9Sprite with Sprite frame.
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrame, capInsets)" instead.
 * @param {cc.SpriteFrame} spriteFrame
 * @param {cc.Rect} capInsets
 * @returns {cc.Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrame = function (spriteFrame) {
    return new cc.Scale9Sprite(spriteFrame);
};

/**
 * create a cc.Scale9Sprite with a Sprite frame name
 * @deprecated since v3.0, please use "new cc.Scale9Sprite(spriteFrameName, capInsets)" instead.
 * @param {string} spriteFrameName
 * @param {cc.Rect} capInsets
 * @returns {Scale9Sprite}
 */
cc.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName) {
    return new cc.Scale9Sprite(spriteFrameName);
};

cc.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};
cc.Scale9Sprite.RenderingType = {SIMPLE: 0, SLICE: 1};
