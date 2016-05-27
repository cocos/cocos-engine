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
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by the _ccsg.Sprite<br/>
 *  - rectangle: A rectangle of the texture<br/>
 * <br/>
 * You can modify the frame of a _ccsg.Sprite by doing:<br/>
 *
 * @class SpriteFrame
 * @extends Asset
 * @constructor
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
                }
            }
        }
    },

    /**
     * Constructor of SpriteFrame class
     * @method SpriteFrame
     * @param {String|Texture2D} [filename]
     * @param {Rect} [rect]
     * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
     * @param {Vec2} [offset] - The offset of the frame in the texture
     * @param {Size} [originalSize] - The size of the frame in the texture
     * @example {@link utils/api/engine/docs/cocos2d/core/sprites/SpriteFrame.js}
     */
    ctor: function () {
        var filename = arguments[0];
        var rect = arguments[1];
        var rotated = arguments[2];
        var offset = arguments[3];
        var originalSize = arguments[4];

        // the location of the sprite on rendering texture
        this._rect = null;

        // for trimming
        this._offset = null;

        // for trimming
        this._originalSize = null;

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
        return cc.rect(this._rect);
    },

    /**
     * Sets the rect of the sprite frame in the texture.
     * @method setRect
     * @param {Rect} rect
     */
    setRect: function (rect) {
        this._rect = rect;
    },

    /**
     * Returns the original size of the trimmed image.
     * @method getOriginalSize
     * @return {Size}
     */
    getOriginalSize: function () {
        return cc.size(this._originalSize);
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
        var self = this;
        if (self._texture !== texture) {
            var locLoaded = texture.isLoaded();
            this._textureLoaded = locLoaded;
            this._texture = texture;
            function textureLoadedCallback () {
                self._textureLoaded = true;
                if (self._rotated && cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
                    var tempElement = texture.getHtmlElementObj();
                    tempElement = _ccsg.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(tempElement, self.getRect());
                    var tempTexture = new cc.Texture2D();
                    tempTexture.initWithElement(tempElement);
                    tempTexture.handleLoadedTexture();
                    // _refreshTexture will be recalled in setTexture
                    self.setTexture(tempTexture);
                    return;
                }
                var w = texture.width, h = texture.height;

                if (self._rect) {
                    self._checkRect(texture);
                }
                else {
                    self.setRect(cc.rect(0, 0, w, h));
                }

                if (!self._originalSize) {
                    self.setOriginalSize(cc.size(w, h));
                }

                if (!self._offset) {
                    self.setOffset(cc.v2(0, 0));
                }

                //dispatch 'load' event of cc.SpriteFrame
                self.emit("load");
            }

            if (locLoaded) {
                textureLoadedCallback();
            }
            else {
                texture.once("load", textureLoadedCallback);
            }
        }
        //if (texture && texture.url && texture.isLoaded()) {
        //    if (self._rect) {
        //        self._checkRect(texture);
        //    }
        //    else {
        //        self.setRect(cc.rect(0, 0, texture.width, texture.height));
        //    }
        //}
    },

    /**
     * Returns the offset of the frame in the texture.
     * @method getOffset
     * @return {Vec2}
     */
    getOffset: function () {
        return cc.v2(this._offset);
    },

    /**
     * Sets the offset of the frame in the texture.
     * @method setOffset
     * @param {Vec2} offsets
     */
    setOffset: function (offsets) {
        this._offset = cc.v2(offsets);
    },

    /**
     * Clone the sprite frame.
     * @method clone
     * @return {SpriteFrame}
     */
    clone: function () {
        return new cc.SpriteFrame(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
    },

    /**
     * Initializes SpriteFrame with Texture, rect, rotated, offset and originalSize in pixels.<br/>
     * Please pass parameters to the constructor to initialize the sprite, do not call this function yourself.
     * @method initWithTexture
     * @param {String|Texture2D} texture
     * @param {Rect} [rect=null]
     * @param {Boolean} [rotated=false]
     * @param {Vec2} [offset=cc.v2(0,0)]
     * @param {Size} [originalSize=rect.size]
     * @return {Boolean}
     */
    initWithTexture: function (textureOrTextureFile, rect, rotated, offset, originalSize) {
        this.setTexture(textureOrTextureFile, rect, rotated, offset, originalSize);
    },

    setTexture: function (textureOrTextureFile, rect, rotated, offset, originalSize) {

        if (rect) {
            this.setRect(rect);
        } else {
            this._rect = null;
        }

        if (offset) {
            this.setOffset(offset);
        } else {
            this._offset = null;
        }

        if (originalSize) {
            this.setOriginalSize(originalSize);
        } else {
            this._originalSize = null;
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

        return true;
    },

    _checkRect: function (texture) {
        var rect = this._rect;
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
            cc.error(cc._LogInfos.RectWidth, texture.url + '/' + this.name);
        }
        if (maxY > texture.getPixelHeight()) {
            cc.error(cc._LogInfos.RectHeight, texture.url + '/' + this.name);
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
                uuid = Editor.UuidCache.urlToUuid(url);
            }
        }
        var capInsets;
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
            rotated: this._rotated ? 1 : undefined,
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
 * @returns {SpriteFrame}
 */
proto.copy = proto.clone;

