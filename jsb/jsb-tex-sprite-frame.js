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

require('../cocos2d/core/platform/CCClass');
require('../cocos2d/core/assets/CCAsset');
var WebTexture = require('../cocos2d/core/textures/CCTexture2D');
var WebSpriteFrame = require('../cocos2d/core/sprites/CCSpriteFrame');

cc.js.unregisterClass(WebTexture, WebSpriteFrame);

// TextureCache addImage/addImageAsync

var prototype = cc.TextureCache.prototype;

if (!prototype._addImageAsync) {
    prototype._addImageAsync = prototype.addImageAsync;
}
prototype.addImageAsync = function (url, cb, target) {
    var localTex = null;
    cc.loader.load(url, function(err, tex) {
        if (err) tex = null;
        if (cb) {
            cb.call(target, tex);
        }
        localTex = tex;
    });
    return localTex;
};
if (!prototype._addImage) {
    prototype._addImage = prototype.addImage;
}
prototype.addImage = function (url, cb, target) {
    if (CC_DEBUG && url instanceof cc.Texture2D) {
        // TODO - remove at 2.0
        cc.warn('textureCache.addImage(url) - The type of the url should be string, not Texture2D. You don\'t need to call addImage if you already have the texture object.');
        url = url.url;
    }
    if (typeof cb === "function") {
        return this.addImageAsync(url, cb, target);
    }
    else {
        if (cb) {
            return this._addImage(url, cb);
        }
        else {
            return this._addImage(url);
        }
    }
};

// cc.textureCache

cc.textureCache._textures = {};
cc.textureCache.cacheImage = function (key, texture) {
    if (texture instanceof cc.Texture2D) {
        this._textures[key] = texture;
    }
};
cc.textureCache._getTextureForKey = cc.textureCache.getTextureForKey;
cc.textureCache.getTextureForKey = function (key) {
    return this._getTextureForKey(key) || this._textures[key] || null;
};
cc.textureCache._removeTextureForKey = cc.textureCache.removeTextureForKey;
cc.textureCache.removeTextureForKey = function (key) {
    if (CC_DEBUG && key instanceof cc.Texture2D) {
        // TODO - remove at 2.0
        cc.warn('textureCache.removeTextureForKey(key) - The type of the key should be string, not Texture2D. You should call texture.destroy() if you already have the texture object.');
        key = key.url;
    }

    delete this._textures[key];
    this._removeTextureForKey(key);
};

// cc.Texture2D

cc.Class._fastDefine('cc.Texture2D', cc.Texture2D, []);
cc.Texture2D.$super = cc.Asset;

[
    'WrapMode',
    'PixelFormat',
    'Filter',
    'extnames',
    'preventDeferredLoadDependents',
    'preventPreloadNativeObject',
].forEach(function (key) {
    cc.Texture2D[key] = WebTexture[key];
});

prototype = cc.Texture2D.prototype;
prototype._releaseTexture = prototype.releaseTexture;

cc.js.addon(prototype, WebTexture.prototype);

prototype._ctor = function () {
    cc.Asset.call(this);
    this.url = "";
};

prototype.loaded = true;
prototype.update = function (options) {
    var updateTexParam = false;
    var genMipmap = false;
    if (options) {
        if (options.minFilter !== undefined) {
            this._minFilter = options.minFilter;
            updateTexParam = true;
        }
        if (options.magFilter !== undefined) {
            this._magFilter = options.magFilter;
            updateTexParam = true;
        }
        if (options.wrapS !== undefined) {
            this._wrapS = options.wrapS;
            updateTexParam = true;
        }
        if (options.wrapT !== undefined) {
            this._wrapT = options.wrapT;
            updateTexParam = true;
        }
        if (options.mipmap !== undefined) {
            genMipmap = this._hasMipmap = options.mipmap;
        }
    }
    if (updateTexParam) {
        this.setTexParameters(options);
    }
    if (genMipmap) {
        this.generateMipmap();
    }
};
prototype.isLoaded = function () {
    return true;
};
cc.js.getset(prototype, '_nativeAsset',
    function () {
        return this;
    },
    function (item) {
    }
);

prototype.getPixelWidth = prototype.getPixelsWide;
prototype.getPixelHeight = prototype.getPixelsHigh;
prototype.description = prototype.getDescription;
cc.js.get(prototype, 'pixelWidth', prototype.getPixelWidth);
cc.js.get(prototype, 'pixelHeight', prototype.getPixelHeight);

// cc.SpriteFrame

cc.Class._fastDefine('cc.SpriteFrame', cc.SpriteFrame, []);
cc.SpriteFrame.$super = cc.Asset;

prototype = cc.SpriteFrame.prototype;
prototype._setTexture = prototype.setTexture;

cc.js.mixin(prototype, cc.EventTarget.prototype);

prototype._ctor = function (filename, rect, rotated, offset, originalSize) {
    this.insetTop = 0;
    this.insetBottom = 0;
    this.insetLeft = 0;
    this.insetRight = 0;
    this._name = '';
    this._texture = null;
    if (filename !== undefined) {
        this.initWithTexture(filename, rect, rotated, offset, originalSize);
    }
};

prototype.textureLoaded = function () {
    return this.getTexture() !== null;
};

prototype.setTexture = function (textureOrTextureFile, rect, rotated, offset, originalSize) {
    if (rect) {
        this.setRect(rect);
    }
    if (offset) {
        this.setOffset(offset);
    }
    if (originalSize) {
        this.setOriginalSize(originalSize);
    }

    this.setRotated(rotated || false);

    // loading texture
    var texture = textureOrTextureFile;
    if (typeof texture === 'string' && texture) {
        texture = cc.textureCache.addImage(texture);
    }
    if (texture instanceof cc.Texture2D && this.getTexture() !== texture) {
        this._refreshTexture(texture);
    }

    return true;
};

prototype.initWithTexture = prototype.setTexture;

prototype.ensureLoadTexture = function () {
    if (this._texture) {
        if (!this._texture.isLoaded()) {
            // load exists texture
            this._refreshTexture(this._texture);
            this._texture.load();
        }
    }
    else if (this._textureFilename) {
        // load new texture
        var texture = cc.textureCache.addImage(this._textureFilename);
        this._refreshTexture(texture);
    }
};

prototype.clearTexture = function () {
    this._setTexture(null);
};

prototype._refreshTexture = function (texture) {
    var w = texture.width, h = texture.height;

    var rect = this.getRect();
    if (rect.width === 0 || rect.height === 0) {
        this.setRect(cc.rect(0, 0, w, h));
    }
    else {
        this._checkRect(texture);
    }

    var originalSize = this.getOriginalSize();
    if (originalSize.width === 0 || originalSize.height === 0) {
        this.setOriginalSize(cc.size(w, h));
    }

    this._setTexture(texture);

    //dispatch 'load' event of cc.SpriteFrame
    this.emit("load");
};

prototype._deserialize = function (data, handle) {
    var rect = data.rect;
    if (rect) {
        this.setRect(new cc.Rect(rect[0], rect[1], rect[2], rect[3]));
    }
    if (data.offset) {
        this.setOffset(new cc.Vec2(data.offset[0], data.offset[1]));
    }
    if (data.originalSize) {
        this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
    }

    this.setRotated(data.rotated === 1);

    this._name = data.name;
    var capInsets = data.capInsets;
    if (capInsets) {
        this.insetLeft = capInsets[0];
        this.insetTop = capInsets[1];
        this.insetRight = capInsets[2];
        this.insetBottom = capInsets[3];
    }

    // load texture via _textureSetter
    var textureUuid = data.texture;
    if (textureUuid) {
        handle.result.push(this, '_textureSetter', textureUuid);
    }
};
prototype._checkRect = function (texture) {
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
        cc.errorID(3300, texture.url);
    }
    if (maxY > texture.getPixelHeight()) {
        cc.errorID(3400, texture.url);
    }
};

prototype._getTexture = prototype.getTexture;
prototype.getTexture = function () {
    var tex = this._getTexture();
    this._texture = tex;
    return tex;
};

prototype._clone = prototype.clone;
prototype.clone = function () {
    var cloned = this._clone();
    cloned._name = this._name;
    cloned.insetTop = this.insetTop;
    cloned.insetBottom = this.insetBottom;
    cloned.insetLeft = this.insetLeft;
    cloned.insetRight = this.insetRight;
    return cloned;
};

cc.js.getset(prototype, 'texture', prototype.getTexture, prototype.setTexture);
cc.js.addon(prototype, WebSpriteFrame.prototype);
