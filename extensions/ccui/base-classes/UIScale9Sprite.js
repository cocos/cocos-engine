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
ccui.Scale9Sprite = cc.Scale9Sprite = _ccsg.Node.extend({
    //resource data, could be async loaded.
    _resourceData: null,

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

    ctor: function (fileOrData) {
        _ccsg.Node.prototype.ctor.call(this);
        this._renderCmd.setState(this._brightState);
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
        this.setAnchorPoint(cc.p(0.5,0.5));
        //todo
        if(fileOrData instanceof  cc.Scale9Sprite.Scale9ResourceData) {
            this.initWithResourceData(fileOrData);
        }
        else {
            if(typeof fileOrData === 'string') {
                var frame = cc.spriteFrameCache.getSpriteFrame(fileOrData);
                if(frame) {
                    this.initWithSpriteFrame(frame);
                } else {
                    this.initWithTexture(fileOrData);
                }
            }
        }
    },

    loaded: function () {
        if (this._resourceData === null) {
            return false;
        } else {
            return this._resourceData.loaded();
        }
    },

    initWithTexture: function (textureOrTextureFile) {
        this.setTexture(textureOrTextureFile);
    },

    initWithSpriteFrame: function (spriteFrameOrSFName) {
        this.setSpriteFrame(spriteFrameOrSFName);
    },

    initWithResourceData: function (s9ResData) {
        this.setResourceData(s9ResData);
    },

    setTexture: function (textureOrTextureFile) {
        var resourceData = new cc.Scale9Sprite.Scale9ResourceData();
        resourceData.initWithTexture(textureOrTextureFile);
        this.setResourceData(resourceData);
    },

    setSpriteFrame: function (spriteFrameOrSFFileName) {
        var resourceData = new cc.Scale9Sprite.Scale9ResourceData();
        resourceData.initWithSpriteFrame(spriteFrameOrSFFileName);
        this.setResourceData(resourceData);
    },

    setResourceData: function (s9ResData) {
        if (s9ResData instanceof cc.Scale9Sprite.Scale9ResourceData) {
            this._resourceData = s9ResData;
            this._quadsDirty = true;
            var self = this;
            var onResourceDataLoaded = function() {
                if(cc.sizeEqualToSize(self._contentSize, cc.size(0,0))) {
                    self.setContentSize(self._resourceData._originalSize);
                }
            };
            if(s9ResData.loaded()) {
                onResourceDataLoaded();
            } else {
                s9ResData.once('load', onResourceDataLoaded, this);
            }
        }

    },

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

    getBlendFunc: function () {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    },

    setContentSize : function(width, height){
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

    setPreferredSize : function(width, height) {
        this.setContentSize(width, height);
    },

    getPreferredSize : function() {
        return this._contentSize;
    },

    setState : function(state){
        this._brightState = state;
        this._renderCmd.setState(state);
    },

    getState : function(){
        return this._brightState;
    },

    setRenderingType: function(type) {
        if(this._renderingType == type) return;
        this._renderingType = type;
        this._quadsDirty = true;
    },
    getRenderingType: function() {
        return this._renderingType;
    },
    setInsetLeft : function(insetLeft){
        this._insetLeft = insetLeft;
        this._quadsDirty = true;
    },

    getInsetLeft : function(){
        return this._insetLeft;
    },

    setInsetTop : function(insetTop){
        this._insetTop = insetTop;
        this._quadsDirty = true;
    },

    getInsetTop : function(){
        return this._insetTop;
    },

    setInsetRight : function(insetRight){
        this._insetRight = insetRight;
        this._quadsDirty = true;
    },

    getInsetRight : function(){
        return this._insetRight;
    },

    setInsetBottom : function(insetBottom)
    {
        this._insetBottom = insetBottom;
        this._quadsDirty = true;
    },

    getInsetBottom : function(){
        return this._insetBottom;
    },

    _rebuildQuads: function () {
        if (!this.loaded() || this._quadsDirty === false) return;
        var resourceData = this._resourceData;
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

            if (!resourceData._rotated) {
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

                    if (!resourceData._rotated) {
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

        var resourceData = this._resourceData;
        leftWidth = this._insetLeft;
        rightWidth = this._insetRight;
        centerWidth = resourceData._originalSize.width - leftWidth - rightWidth;

        topHeight = this._insetTop;
        bottomHeight = this._insetBottom;
        centerHeight = resourceData._originalSize.height - topHeight - bottomHeight;

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

        //apply trim
        var trimmedLeft = resourceData.getTrimmedLeft();
        var trimmedRight = resourceData.getTrimmedRight();
        var trimmedBottom = resourceData.getTrimmedBottom();
        var trimmedTop = resourceData.getTrimmedTop();

        if(trimmedLeft >= 0 && trimmedLeft <= leftWidth) {
            x0 += trimmedLeft * xScale;
        } else if (trimmedLeft > leftWidth && trimmedLeft <= leftWidth + centerWidth) {
            x1 += (trimmedLeft - leftWidth) * sizableWidth / centerWidth;
            x0 = x1;
        } else {
            x2 += (trimmedLeft - (leftWidth + centerWidth)) * xScale;
            x0 = x1 = x2;
        }

        if(trimmedRight >= 0 && trimmedRight <= rightWidth) {
            x3 -= trimmedRight * xScale;
        } else if( trimmedRight > rightWidth && trimmedRight <= rightWidth + centerWidth) {
            x2 -= (trimmedRight - rightWidth) * sizableWidth / centerWidth;
            x3 = x2;
        } else {
            x1 -= (trimmedRight - (rightWidth + centerWidth)) * xScale;
            x3 = x2 = x1;
        }

        if(trimmedTop >= 0 && trimmedTop <= topHeight) {
            y3 -= trimmedTop * yScale;
        } else if(trimmedTop > topHeight && trimmedTop <= topHeight + centerHeight) {
            y2 -= (trimmedTop - topHeight) * sizableHeight / centerHeight;
            y3 = y2;
        } else {
            y1 -= (trimmedTop - (topHeight + centerHeight)) * yScale;
            y3 = y2 = y1;
        }

        if(trimmedBottom >= 0 && trimmedBottom <= bottomHeight) {
            y0 += trimmedBottom * yScale;
        } else if(trimmedBottom > bottomHeight && trimmedBottom <= bottomHeight + centerHeight) {
            y1 += (trimmedBottom - bottomHeight) * sizableHeight / centerHeight;
            y0 = y1;
        } else {
            y2 += (trimmedBottom - (bottomHeight + centerHeight)) * yScale;
            y0 = y1 = y2;
        }

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
        var resourceData = this._resourceData;
        var atlasWidth = resourceData._texture.getPixelWidth();
        var atlasHeight = resourceData._texture.getPixelHeight();

        //caculate texture coordinate
        var leftWidth, centerWidth, rightWidth;
        var topHeight, centerHeight, bottomHeight;
        leftWidth = this._insetLeft;
        rightWidth = this._insetRight;
        centerWidth = resourceData._originalSize.width - leftWidth - rightWidth;

        topHeight = this._insetTop;
        bottomHeight = this._insetBottom;
        centerHeight = resourceData._originalSize.height - topHeight - bottomHeight;

        //apply trim
        var trimmedLeft = this._resourceData.getTrimmedLeft();
        var trimmedRight = this._resourceData.getTrimmedRight();
        var trimmedBottom = this._resourceData.getTrimmedBottom();
        var trimmedTop = this._resourceData.getTrimmedTop();
        //left
        leftWidth -= trimmedLeft;
        if(leftWidth < 0) {
            centerWidth += leftWidth;
            leftWidth = 0;
        }
        if (centerWidth < 0) {
            rightWidth += centerWidth;
            centerWidth = 0;
        }
        //right
        rightWidth -= trimmedRight;
        if(rightWidth <0) {
            centerWidth += rightWidth;
            rightWidth = 0;
        }
        if(centerWidth < 0) {
            leftWidth += centerWidth;
            centerWidth = 0;
        }

        //bottom
        bottomHeight -= trimmedBottom;
        if(bottomHeight < 0) {
            centerHeight += bottomHeight;
            bottomHeight = 0;
        }
        if(centerHeight < 0) {
            topHeight += centerHeight;
            centerHeight = 0;
        }

        //top
        topHeight -= trimmedTop;
        if(topHeight < 0) {
            centerHeight += topHeight;
            topHeight = 0;
        }
        if(centerHeight <0) {
            bottomHeight += centerHeight;
            centerHeight = 0;
        }

        var textureRect = cc.rectPointsToPixels(resourceData._spriteRect);

        //uv computation should take spritesheet into account.
        var u0, u1, u2, u3;
        var v0, v1, v2, v3;

        if (resourceData._rotated) {
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

    _onColorOpacityDirty : function() {
        var color = this.getDisplayedColor();
        color.a = this.getDisplayedOpacity();
        var index;
        var quadLength = this._quads.length;
        for(index = 0; index < quadLength; ++index) {
            //svar quad = this._quads[index];
            this._quads[index]._bl.colors = color;
            this._quads[index]._br.colors = color;
            this._quads[index]._tl.colors = color;
            this._quads[index]._tr.colors = color;
        }
    },

    _createRenderCmd: function () {
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new ccui.Scale9Sprite.CanvasRenderCmd(this);
        else
            return new ccui.Scale9Sprite.WebGLRenderCmd(this);
    }

});

ccui.Scale9Sprite.Scale9ResourceData = cc.Scale9Sprite.Scale9ResourceData = function ()
{
    this._texture = null;
    this._spriteRect = null;
    this._rotated = false;
    this._trimmedOffset = null;
    this._originalSize = null;
    this._loaded = false;

    var trimmedResult = [0,0,0,0]; //left, right, bottom, top
    var trimmedDirty = true;

    this.loaded = function() {
        return this._loaded;
    };

    this.computeTrimmed = function () {
        if(this._loaded && trimmedDirty) {
            trimmedResult = [];
            var result = trimmedResult;
            var leftTrim = (this._originalSize.width + (2 * this._trimmedOffset.x) - this._spriteRect.width)/2;
            var rightTrim = this._originalSize.width - leftTrim - this._spriteRect.width;

            var bottomTrim = (this._originalSize.height + (2 * this._trimmedOffset.y) - this._spriteRect.height) /2;
            var topTrim = this._originalSize.height - bottomTrim - this._spriteRect.height;
            result.push(leftTrim);
            result.push(rightTrim);
            result.push(bottomTrim);
            result.push(topTrim);
            trimmedDirty = false;
        }
    };

    this.getTrimmedLeft = function () {
        this.computeTrimmed();
        return trimmedResult[0];
    };

    this.getTrimmedRight = function () {
        this.computeTrimmed();
        return trimmedResult[1];
    };

    this.getTrimmedBottom = function () {
        this.computeTrimmed();
        return trimmedResult[2];
    };

    this.getTrimmedTop = function () {
        this.computeTrimmed();
        return trimmedResult[3];
    };
    /**
    textureOrTextureFile: texture handle or texture file image;
    Other params is optional
    */
    this.initWithTexture = function(textureOrTextureFile, spriteRect, rotated, trimmedOffset, originalSize){
        var texture;
        if(textureOrTextureFile instanceof cc.Texture2D) {
            texture = textureOrTextureFile;
        } else {
            texture = cc.textureCache.addImage(textureOrTextureFile);
        }
        if(!texture) {
            throw new Error("Scale9 Sprite can not be inited with a null texture");
        }
        this._texture = texture;
        this._spriteRect = spriteRect || null;
        this._rotated = rotated || false;
        this._trimmedOffset = trimmedOffset || cc.p(0,0);
        this._originalSize = originalSize || null;
        if(texture) {
                var self = this;
                var textureLoadedCallback = function() {
                    self._loaded = true;
                    var texturesize = texture.getContentSize();
                    if(self._spriteRect === null) {
                        self._spriteRect = cc.rect(0,0, texturesize.width, texturesize.height);
                    }
                    if(self._originalSize === null) {
                        self._originalSize = cc.size(texturesize);
                    }
                    self.emit('load');
                };
            if(texture.isLoaded()) {
                textureLoadedCallback();
            } else {
                texture.once("load",textureLoadedCallback);
            }
            trimmedDirty = true;
        }
        return true;
    };

    this.initWithSpriteFrame = function(SpriteFrameOrSFName){
        var spriteFrame;
        if(SpriteFrameOrSFName instanceof cc.SpriteFrame) {
            spriteFrame = SpriteFrameOrSFName;
        }
        else {
            spriteFrame = cc.spriteFrameCache.getSpriteFrame(SpriteFrameOrSFName);
        }
        
        if(spriteFrame) {
            var self = this;
            var spriteFrameLoadedCallback = function() {
                self._loaded = true;
                self._texture = spriteFrame.getTexture();
                self._spriteRect = spriteFrame.getRect();
                self._rotated = spriteFrame.isRotated();
                self._trimmedOffset = spriteFrame.getOffset();
                self._originalSize = spriteFrame.getOriginalSize();
                self.emit('load');
            };
            if(spriteFrame.textureLoaded()){
                spriteFrameLoadedCallback();
            } else {
                spriteFrame.once("load",spriteFrameLoadedCallback);
            }
            trimmedDirty = true;
        }
        return true;
    };
};

cc.js.mixin(ccui.Scale9Sprite.Scale9ResourceData.prototype, cc.EventTarget.prototype);

var _p = ccui.Scale9Sprite.prototype;
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


ccui.Scale9Sprite.create = function (file) {
    return new cc.Scale9Sprite(file);
};

/**
 * create a ccui.Scale9Sprite with Sprite frame.
 * @deprecated since v3.0, please use "new ccui.Scale9Sprite(spriteFrame, capInsets)" instead.
 * @param {cc.SpriteFrame} spriteFrame
 * @param {cc.Rect} capInsets
 * @returns {ccui.Scale9Sprite}
 */
ccui.Scale9Sprite.createWithSpriteFrame = function (spriteFrame) {
    return new cc.Scale9Sprite(spriteFrame);
};

/**
 * create a ccui.Scale9Sprite with a Sprite frame name
 * @deprecated since v3.0, please use "new ccui.Scale9Sprite(spriteFrameName, capInsets)" instead.
 * @param {string} spriteFrameName
 * @param {cc.Rect} capInsets
 * @returns {Scale9Sprite}
 */
ccui.Scale9Sprite.createWithSpriteFrameName = function (spriteFrameName) {
    return new cc.Scale9Sprite(spriteFrameName);
};

ccui.Scale9Sprite.state = {NORMAL: 0, GRAY: 1};
ccui.Scale9Sprite.RenderingType = {SIMPLE: 0, SLICE: 1};
