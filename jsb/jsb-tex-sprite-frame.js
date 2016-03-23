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

// cc.spriteFrameAnimationCache = cc.animationCache;
// cc.SpriteFrameAnimation = cc.Animation;

// cc.textureCache.cacheImage
cc.textureCache._textures = {};
cc.textureCache.cacheImage = function (key, texture) {
    if (texture instanceof cc.Texture2D) {
        this._textures[key] = texture;
    }
};
cc.textureCache._getTextureForKey = cc.textureCache.getTextureForKey;
cc.textureCache.getTextureForKey = function (key) {
    var tex = this._getTextureForKey(key);
    if (!tex)
        tex = this._textures[key];
    return tex || null;
};

// cc.Texture2D
cc.Texture2D.prototype.isLoaded = function () {
    return true;
};
cc.Texture2D.prototype.getPixelWidth = cc.Texture2D.prototype.getPixelsWide;
cc.Texture2D.prototype.getPixelHeight = cc.Texture2D.prototype.getPixelsHigh;

// cc.SpriteFrame
cc.js.mixin(cc.SpriteFrame.prototype, cc.EventTarget.prototype);
cc.SpriteFrame.prototype.textureLoaded = function () {
    return this.getTexture() !== null;
};
cc.SpriteFrame.prototype._initWithTexture = cc.SpriteFrame.prototype.initWithTexture;
cc.SpriteFrame.prototype.initWithTexture = function (texture, rect, rotated, offset, originalSize, _uuid) {
    function check(texture) {
        if (texture && texture.isLoaded()) {
            var _x, _y;
            if (rotated) {
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            }
            else {
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if (_x > texture.getPixelWidth()) {
                cc.error(cc._LogInfos.RectWidth, _uuid);
            }
            if (_y > texture.getPixelHeight()) {
                cc.error(cc._LogInfos.RectHeight, _uuid);
            }
        }
    }

    offset = offset || cc.p(0, 0);
    originalSize = originalSize || rect;
    rotated = rotated || false;

    if (this.insetTop === undefined) {
        this.insetTop = 0;
        this.insetBottom = 0;
        this.insetLeft = 0;
        this.insetRight = 0;
    }

    var locTexture;
    if (!texture && _uuid) {
        // deserialize texture from uuid
        var info = cc.AssetLibrary._getAssetInfoInRuntime(_uuid);
        if (!info) {
            cc.error('SpriteFrame: Failed to load sprite texture "%s"', _uuid);
            return;
        }

        this._textureFilename = info.url;

        locTexture = cc.textureCache.addImage(info.url);
        this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
    }
    else {
        if (cc.js.isString(texture)){
            this._textureFilename = texture;
            locTexture = cc.textureCache.addImage(this._textureFilename);
            this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
        } else if (texture instanceof cc.Texture2D) {
            this._textureFilename = '';
            this._initWithTexture(texture, rect, rotated, offset, originalSize);
        }
    }
    this.emit('load');
    check(this.getTexture());
    return true;
};
cc.SpriteFrame.prototype._deserialize = function (data, handle) {
    var rect = data.rect ? new cc.Rect(data.rect[0], data.rect[1], data.rect[2], data.rect[3]) : undefined;
    var offset = data.offset ? new cc.Vec2(data.offset[0], data.offset[1]) : undefined;
    var size = data.originalSize ? new cc.Size(data.originalSize[0], data.originalSize[1]) : undefined;
    var rotated = data.rotated === 1;
    // init properties not included in this._initWithTexture()
    this._name = data.name;
    var capInsets = data.capInsets;
    if (capInsets) {
        this.insetLeft = capInsets[0];
        this.insetTop = capInsets[1];
        this.insetRight = capInsets[2];
        this.insetBottom = capInsets[3];
    }

    // load texture via _textureFilenameSetter
    var textureUuid = data.texture;
    if (textureUuid) {
        handle.result.push(this, '_textureFilenameSetter', textureUuid);
    }

    this.initWithTexture(null, rect, rotated, offset, size, textureUuid);
};
cc.SpriteFrame.prototype._checkRect = function (texture) {
    var rect = this.getRect();
    var maxX = rect.x, maxY = rect.y;
    if (this.isRotated()) {
        maxX += rect.height;
        maxY += rect.width;
    }
    else {
        maxX += rect.width;
        maxY += rect.height;
    }
    if (maxX > texture.getPixelWidth()) {
        cc.error(cc._LogInfos.RectWidth, texture.url);
    }
    if (maxY > texture.getPixelHeight()) {
        cc.error(cc._LogInfos.RectHeight, texture.url);
    }
};
var getTextureJSB = cc.SpriteFrame.prototype.getTexture;
cc.SpriteFrame.prototype.getTexture = function () {
    var tex = getTextureJSB.call(this);
    this._texture = tex;
    return tex;
};
cc.js.set(cc.SpriteFrame.prototype, '_textureFilenameSetter', function (url) {
    this._textureFilename = url;
    if (url) {
        cc.textureCache.addImage(url, function (texture) {
            if (this.getTexture() !== texture) {
                this.setTexture(texture);
                var w = texture.getPixelWidth(), h = texture.getPixelHeight();
                if (this.getRect().width === 0) {
                    this.setRect(cc.rect(0, 0, w, h));
                }
                if (this.getOriginalSize().width === 0) {
                    this.setOriginalSize(cc.size(w, h));
                }
                if (this.getOffset().width === 0) {
                    this.setOffset(cc.v2(0, 0));
                }

                this._texture = texture;
            }
            this._checkRect(texture);
            this.emit('load');
        }, this);
    }
});

// Assets
cc.js.setClassName('cc.SpriteFrame', cc.SpriteFrame);
