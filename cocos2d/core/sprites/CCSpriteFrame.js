/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2015 Chukong Technologies Inc.

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

var EventTarget = require("../event/event-target");


/**
 * <p>
 *    A cc.SpriteFrame has:<br/>
 *      - texture: A cc.Texture2D that will be used by the _ccsg.Sprite<br/>
 *      - rectangle: A rectangle of the texture<br/>
 *    <br/>
 *    You can modify the frame of a _ccsg.Sprite by doing:<br/>
 * </p>
 * @class SpriteFrame
 * @extends Asset
 * @constructor
 * @param {String|Texture2D} filename
 * @param {Rect} rect - If parameters' length equal 2, rect in points, else rect in pixels
 * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
 * @param {Vec2} [offset] - The offset of the frame in the texture
 * @param {Size} [originalSize] - The size of the frame in the texture
 * @example {@link utils/api/engine/docs/cocos2d/core/sprites/SpriteFrame.js}
 */
cc.SpriteFrame = cc.Class(/** @lends cc.SpriteFrame# */{
    name: 'cc.SpriteFrame',
    extends: require('../assets/CCAsset'),
    mixins: [EventTarget],

    properties: {
        /**
         * Use this property to set raw texture url during loading
         * @property {String} _textureFilenameSetter
         * @readOnly
         * @private
         */
        _textureFilenameSetter: {
            set: function (url) {
                this._textureFilename = url;
                if (url) {
                    if (CC_EDITOR && url instanceof cc.Asset) {
                        // just packing
                        return;
                    }

                    var texture = cc.textureCache.addImage(url);
                    this._refreshTexture(texture);
                    if (this._textureLoaded) {
                        this._checkRect(texture);
                    }
                }
            }
        }
    },

    ctor: function () {
        var filename = arguments[0];
        var rect = arguments[1];
        var rotated = arguments[2];
        var offset = arguments[3];
        var originalSize = arguments[4];

        // the location of the sprite on rendering texture
        this._rect = null;
        this._rectInPixels = null;

        // for trimming
        this._offset = null;
        this._offsetInPixels = null;

        // for trimming
        this._originalSize = null;
        this._originalSizeInPixels = null;

        this._rotated = false;

        /**
         * Top border of the sprite
         * @property insetTop
         * @type {Number}
         * @default 0
         */
        this.insetTop = 0;

        /**
         * Bottom border of the sprite
         * @property insetBottom
         * @type {Number}
         * @default 0
         */
        this.insetBottom = 0;

        /**
         * Left border of the sprite
         * @property insetLeft
         * @type {Number}
         * @default 0
         */
        this.insetLeft = 0;

        /**
         * Right border of the sprite
         * @property insetRight
         * @type {Number}
         * @default 0
         */
        this.insetRight = 0;

        this._texture = null;
        this._textureFilename = '';
        this._textureLoaded = false;

        if (CC_EDITOR) {
            // Atlas asset uuid
            this._atlasUuid = '';
        }

        if (filename !== undefined) {
            this.initWithTexture(filename, rect, rotated, offset, originalSize);
        } else {
            //todo log Error
        }
    },

    /**
     * Returns whether the texture have been loaded
     * @method textureLoaded
     * @returns {boolean}
     */
    textureLoaded: function () {
        return this._textureLoaded;
    },

    /**
     * Add a event listener for texture loaded event.
     * @method addLoadedEventListener
     * @param {Function} callback
     * @param {Object} target
     * @deprecated since 3.1, please use EventTarget API instead
     */
    addLoadedEventListener: function (callback, target) {
        this.once("load", callback, target);
    },

    /**
     * Gets the rect of the frame in the texture.
     * @method getRectInPixels
     * @return {Rect}
     */
    getRectInPixels: function () {
        var locRectInPixels = this._rectInPixels;
        if (locRectInPixels) {
            return cc.rect(locRectInPixels);
        } else {
            return cc.rect(0, 0, 0, 0);
        }
    },

    /**
     * Sets the rect of the frame in the texture.
     * @method setRectInPixels
     * @param {Rect} rectInPixels
     */
    setRectInPixels: function (rectInPixels) {
        if (!this._rectInPixels) {
            this._rectInPixels = cc.rect(rectInPixels);
        } else {
            var rect = this._rectInPixels;
            rect.x = rectInPixels.x;
            rect.y = rectInPixels.y;
            rect.width = rectInPixels.width;
            rect.height = rectInPixels.height;
        }

        this._rect = cc.rectPixelsToPoints(rectInPixels);
    },

    /**
     * Returns whether the sprite frame is rotated in the texture.
     * @method isRotated
     * @return {Boolean}
     */
    isRotated: function () {
        return this._rotated;
    },

    /**
     * Set whether the sprite frame is rotated in the texture.
     * @method setRotated
     * @param {Boolean} bRotated
     */
    setRotated: function (bRotated) {
        this._rotated = bRotated;
    },

    /**
     * Returns the rect of the sprite frame in the texture.
     * @method getRect
     * @return {Rect}
     */
    getRect: function () {
        var locRect = this._rect;
        if (locRect) {
            return cc.rect(locRect);
        } else {
            return cc.rect(0, 0, 0, 0);
        }
    },

    /**
     * Sets the rect of the sprite frame in the texture.
     * @method setRect
     * @param {Rect} rect
     */
    setRect: function (rect) {
        if (!this._rect) {
            this._rect = cc.rect(rect);
        } else {
            var locRect = this._rect;
            locRect.x = rect.x;
            locRect.y = rect.y;
            locRect.width = rect.width;
            locRect.height = rect.height;
        }
        this._rectInPixels = cc.rectPointsToPixels(rect);
    },

    /**
     * Returns the offset of the sprite frame in the texture in pixel.
     * @method getOffsetInPixels
     * @return {Vec2}
     */
    getOffsetInPixels: function () {
        var offsetPixels = this._offsetInPixels;
        if (offsetPixels) {
            return cc.p(offsetPixels);
        } else {
            return cc.p(0, 0);
        }
    },

    /**
     * Sets the offset of the sprite frame in the texture in pixel.
     * @method setOffsetInPixels
     * @param {Vec2} offsetInPixels
     */
    setOffsetInPixels: function (offsetInPixels) {
        if (!this._offsetInPixels) {
            this._offsetInPixels = cc.p(offsetInPixels);
        } else {
            this._offsetInPixels.x = offsetInPixels.x;
            this._offsetInPixels.y = offsetInPixels.y;
        }

        this._offset = cc.pointPixelsToPoints(offsetInPixels);
    },

    /**
     * Returns the original size of the trimmed image.
     * @method getOriginalSizeInPixels
     * @return {Size}
     */
    getOriginalSizeInPixels: function () {
        var locSizeInPixels = this._originalSizeInPixels;
        if (locSizeInPixels) {
            return cc.size(locSizeInPixels);
        } else {
            return cc.size(0, 0);
        }
    },

    /**
     * Sets the original size of the trimmed image.
     * @method setOriginalSizeInPixels
     * @param {Size} sizeInPixels
     */
    setOriginalSizeInPixels: function (sizeInPixels) {
        if (!this._originalSizeInPixels) {
            this._originalSizeInPixels = cc.size(sizeInPixels);
        } else {
            this._originalSizeInPixels.width = sizeInPixels.width;
            this._originalSizeInPixels.height = sizeInPixels.height;
        }

        this._originalSize = cc.sizePixelsToPoints(sizeInPixels);
    },

    /**
     * Returns the original size of the trimmed image.
     * @method getOriginalSize
     * @return {Size}
     */
    getOriginalSize: function () {
        var locSize = this._originalSize;
        if (locSize) {
            return cc.size(locSize);
        } else {
            return cc.size(0, 0);
        }
    },

    /**
     * Sets the original size of the trimmed image.
     * @method setOriginalSize
     * @param {Size} size
     */
    setOriginalSize: function (size) {
        if (!this._originalSize) {
            this._originalSize = cc.size(size);
        } else {
            this._originalSize.width = size.width;
            this._originalSize.height = size.height;
        }

        this._originalSizeInPixels = cc.sizePointsToPixels(size);
    },

    /**
     * Returns the texture of the frame.
     * @method getTexture
     * @return {Texture2D}
     */
    getTexture: function () {
        return this._texture;
    },

    /**
     * Sets the texture of the frame, the texture is retained automatically.
     * @method _refreshTexture
     * @param {Texture2D} texture
     */
    _refreshTexture: function (texture) {
        if (this._texture !== texture) {
            var locLoaded = texture.isLoaded();
            this._textureLoaded = locLoaded;
            this._texture = texture;
            var self = this;
            var textureLoadedCallback = function () {
                self._textureLoaded = true;
                if (self._rotated && cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
                    var tempElement = sender.getHtmlElementObj();
                    tempElement = _ccsg.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(tempElement, self.getRect());
                    var tempTexture = new cc.Texture2D();
                    tempTexture.initWithElement(tempElement);
                    tempTexture.handleLoadedTexture();
                    self.setTexture(tempTexture);

                    var rect = self.getRect();
                    self.setRect(cc.rect(0, 0, rect.width, rect.height));
                }
                var w = texture.width, h = texture.height;
                if (!self._rect) {
                    self.setRect(cc.rect(0, 0, w, h));
                }
                if (!self._originalSize) {
                    self.setOriginalSize(cc.size(w, h));
                }
                if (!self._offset) {
                    self.setOffset(cc.p(0, 0));
                }
                //dispatch 'load' event of cc.SpriteFrame
                self.emit("load");
            };

            if (!locLoaded) {
                texture.once("load", textureLoadedCallback, this);
            } else {
                textureLoadedCallback();
            }
        }
    },

    /**
     * Returns the offset of the frame in the texture.
     * @method getOffset
     * @return {Vec2}
     */
    getOffset: function () {
        var offset = this._offset;
        if (offset) {
            return cc.p(offset);
        } else {
            return cc.p(0, 0);
        }
    },

    /**
     * Sets the offset of the frame in the texture.
     * @method setOffset
     * @param {Vec2} offsets
     */
    setOffset: function (offsets) {
        if (!this._offset) {
            this._offset = cc.p(offsets);
        } else {
            this._offset.x = offsets.x;
            this._offset.y = offsets.y;
        }
        this._offsetInPixels = cc.pointPointsToPixels(offsets);
    },

    /**
     * Clone the sprite frame.
     * @method clone
     * @return {SpriteFrame}
     */
    clone: function () {
        return new cc.SpriteFrame(this._textureFilename, this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels);
    },

    /**
     * Initializes SpriteFrame with Texture, rect, rotated, offset and originalSize in pixels.<br/>
     * Please pass parameters to the constructor to initialize the sprite, do not call this function yourself.
     * @method initWithTexture
     * @param {String|cc.Texture2D} texture
     * @param {Rect} rect - if parameters' length equal 2, rect in points, else rect in pixels
     * @param {Boolean} [rotated=false]
     * @param {Vec2} [offset=cc.p(0,0)]
     * @param {Size} [originalSize=rect.size]
     * @return {Boolean}
     */
    initWithTexture: function (textureOrTextureFile, rect, rotated, offset, originalSize) {
        this.setTexture(textureOrTextureFile, rect, rotated, offset, originalSize);
    },

    setTexture: function (textureOrTextureFile, rect, rotated, offset, originalSize) {

        if (rect) {
            this.setRectInPixels(rect);
        } else {
            this._rect = this._rectInPixels = null;
        }

        if (offset) {
            this.setOffsetInPixels(offset);
        } else {
            this._offset = this._offsetInPixels = null;
        }

        if (originalSize) {
            this.setOriginalSizeInPixels(originalSize);
        } else {
            this._originalSize = this._originalSizeInPixels = null;
        }

        this._rotated = rotated || false;

        //loading texture
        var texture = textureOrTextureFile;
        if (cc.js.isString(texture)) {
            this._textureFilename = texture;
            texture = cc.textureCache.addImage(texture);
        }
        if (texture instanceof cc.Texture2D) {
            this._refreshTexture(texture);
        } else {
            //todo log error
        }

        if (texture && texture.url && texture.isLoaded()) {
            this._checkRect(texture);
        }

        return true;
    },

    _checkRect: function (texture) {
        var rect = this._rectInPixels;
        var maxX = rect.x, maxY = rect.y;
        if (this._rotated) {
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
    },

    // SERIALIZATION

    _serialize: CC_EDITOR && function (exporting) {
        var rect = this._rect;
        var offset = this._offset;
        var size = this._originalSize;
        var uuid;
        var url = this._textureFilename;
        if (url) {
            if (url instanceof cc.Asset) {
                uuid = url._uuid;
            }
            else {
                uuid = Editor.urlToUuid(url);
            }
        }
        var capInsets = undefined;
        if (this.insetLeft !== 0 ||
            this.insetTop !== 0 ||
            this.insetRight !== 0 ||
            this.insetBottom !== 0) {
            capInsets = [this.insetLeft, this.insetTop, this.insetRight, this.insetBottom];
        }
        return {
            name: this._name,
            texture: uuid || undefined,
            atlas: exporting ? undefined : this._atlasUuid,  // strip from json if exporting
            rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
            offset: offset ? [offset.x, offset.y] : undefined,
            originalSize: size ? [size.width, size.height] : undefined,
            rotated: this._rotated ? 1 : 0,
            capInsets: capInsets
        };
    },

    _deserialize: function (data, handle) {
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
        this._rotated = data.rotated === 1;
        this._name = data.name;
        var capInsets = data.capInsets;
        if (capInsets) {
            this.insetLeft = capInsets[0];
            this.insetTop = capInsets[1];
            this.insetRight = capInsets[2];
            this.insetBottom = capInsets[3];
        }
        if (CC_EDITOR) {
            this._atlasUuid = data.atlas;
        }

        // load texture via _textureFilenameSetter
        var textureUuid = data.texture;
        if (textureUuid) {
            handle.result.push(this, '_textureFilenameSetter', textureUuid);
        }
    }
});

var proto = cc.SpriteFrame.prototype;

/**
 * Copy the sprite frame
 * @method copyWithZone
 * @return {SpriteFrame}
 */
proto.copyWithZone = proto.clone;

/**
 * Copy the sprite frame
 * @method copy
 * @returns {cc.SpriteFrame}
 */
proto.copy = proto.clone;

/**
 * <p>
 *    Create a cc.SpriteFrame with a texture filename, rect, rotated, offset and originalSize in pixels.<br/>
 *    The originalSize is the size in pixels of the frame before being trimmed.
 * </p>
 * since v3.0, please use new constructor {{#crossLink "SpriteFrame/SpriteFrame:method"}}SpriteFrame(){{/crossLink}} instead.
 * @method cc.SpriteFrame.create
 * @param {String|cc.Texture2D} filename
 * @param {cc.Rect} rect if parameters' length equal 2, rect in points, else rect in pixels
 * @param {Boolean} rotated
 * @param {cc.Vec2} offset
 * @param {cc.Size} originalSize
 * @return {cc.SpriteFrame}
 */
cc.SpriteFrame.create = function (filename, rect, rotated, offset, originalSize) {
    return new cc.SpriteFrame(filename, rect, rotated, offset, originalSize);
};

/**
 * deprecated since v3.0, please use new construction instead
 * @method cc.SpriteFrame.createWithTexture
 * @deprecated
 */
cc.SpriteFrame.createWithTexture = cc.SpriteFrame.create;

cc.SpriteFrame._frameWithTextureForCanvas = function (texture, rect, rotated, offset, originalSize) {
    return new cc.SpriteFrame(texture, rect, rotated, offset, originalSize);
};
