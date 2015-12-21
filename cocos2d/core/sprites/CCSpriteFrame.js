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
    name:'cc.SpriteFrame',
    extends:require('../assets/CCAsset'),
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
                    // texture will be init in getTexture()
                    var texture = this.getTexture();
                    if (this._textureLoaded) {
                        this._checkRect(texture);
                        this.emit('load');
                    }
                    else {
                        // register event in setTexture()
                        this._texture = null;
                        this.setTexture(texture);
                    }
                }
            }
        },
    },

    ctor:function () {
        var filename = arguments[0];
        var rect = arguments[1];
        var rotated = arguments[2];
        var offset = arguments[3];
        var originalSize = arguments[4];

        // the location of the sprite on rendering texture
        this._rect = new cc.Rect();
        this._rectInPixels = new cc.Rect();

        // for trimming
        this._offset = new cc.Vec2();
        this._offsetInPixels = new cc.Vec2();

        // for trimming
        this._originalSize = new cc.Size();
        this._originalSizeInPixels = new cc.Size();

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

        if(filename !== undefined && rect !== undefined ){
            if(rotated === undefined || offset === undefined || originalSize === undefined)
                this.initWithTexture(filename, rect);
            else
                this.initWithTexture(filename, rect, rotated, offset, originalSize)
        }
    },

    /**
     * Returns whether the texture have been loaded
     * @method textureLoaded
     * @returns {boolean}
     */
    textureLoaded:function(){
        return this._textureLoaded;
    },

    /**
     * Add a event listener for texture loaded event.
     * @method addLoadedEventListener
     * @param {Function} callback
     * @param {Object} target
     * @deprecated since 3.1, please use EventTarget API instead
     */
    addLoadedEventListener:function(callback, target){
        this.once("load", callback, target);
    },

    /**
     * Gets the rect of the frame in the texture.
     * @method getRectInPixels
     * @return {Rect}
     */
    getRectInPixels:function () {
        var locRectInPixels = this._rectInPixels;
        return cc.rect(locRectInPixels.x, locRectInPixels.y, locRectInPixels.width, locRectInPixels.height);
    },

    /**
     * Sets the rect of the frame in the texture.
     * @method setRectInPixels
     * @param {Rect} rectInPixels
     */
    setRectInPixels:function (rectInPixels) {
        var rect = this._rectInPixels;
        if (!rect){
            this._rectInPixels = rect = cc.rect();
        }
        rect.x = rectInPixels.x;
        rect.y = rectInPixels.y;
        rect.width = rectInPixels.width;
        rect.height = rectInPixels.height;
        this._rect = cc.rectPixelsToPoints(rectInPixels);
    },

    /**
     * Returns whether the sprite frame is rotated in the texture.
     * @method isRotated
     * @return {Boolean}
     */
    isRotated:function () {
        return this._rotated;
    },

    /**
     * Set whether the sprite frame is rotated in the texture.
     * @method setRotated
     * @param {Boolean} bRotated
     */
    setRotated:function (bRotated) {
        this._rotated = bRotated;
    },

    /**
     * Returns the rect of the sprite frame in the texture.
     * @method getRect
     * @return {Rect}
     */
    getRect:function () {
        return this._rect.clone();
    },

    /**
     * Sets the rect of the sprite frame in the texture.
     * @method setRect
     * @param {Rect} rect
     */
    setRect:function (rect) {
        if (!this._rect){
            this._rect = cc.rect(0,0,0,0);
        }
        this._rect.x = rect.x;
        this._rect.y = rect.y;
        this._rect.width = rect.width;
        this._rect.height = rect.height;
        this._rectInPixels = cc.rectPointsToPixels(this._rect);
    },

    /**
     * Returns the offset of the sprite frame in the texture in pixel.
     * @method getOffsetInPixels
     * @return {Vec2}
     */
    getOffsetInPixels:function () {
        return cc.p(this._offsetInPixels);
    },

    /**
     * Sets the offset of the sprite frame in the texture in pixel.
     * @method setOffsetInPixels
     * @param {Vec2} offsetInPixels
     */
    setOffsetInPixels:function (offsetInPixels) {
        this._offsetInPixels.x = offsetInPixels.x;
        this._offsetInPixels.y = offsetInPixels.y;
        cc._pointPixelsToPointsOut(this._offsetInPixels, this._offset);
    },

    /**
     * Returns the original size of the trimmed image.
     * @method getOriginalSizeInPixels
     * @return {Size}
     */
    getOriginalSizeInPixels:function () {
        return cc.size(this._originalSizeInPixels);
    },

    /**
     * Sets the original size of the trimmed image.
     * @method setOriginalSizeInPixels
     * @param {Size} sizeInPixels
     */
    setOriginalSizeInPixels:function (sizeInPixels) {
        this._originalSizeInPixels.width = sizeInPixels.width;
        this._originalSizeInPixels.height = sizeInPixels.height;
    },

    /**
     * Returns the original size of the trimmed image.
     * @method getOriginalSize
     * @return {Size}
     */
    getOriginalSize:function () {
        return cc.size(this._originalSize);
    },

    /**
     * Sets the original size of the trimmed image.
     * @method setOriginalSize
     * @param {Size} size
     */
    setOriginalSize:function (size) {
        this._originalSize.width = size.width;
        this._originalSize.height = size.height;
    },

    /**
     * Returns the texture of the frame.
     * @method getTexture
     * @return {Texture2D}
     */
    getTexture:function () {
        if (this._texture)
            return this._texture;
        if (this._textureFilename) {
            var locTexture = this._texture = cc.textureCache.addImage(this._textureFilename);
            if (locTexture)
                this._textureLoaded = locTexture.isLoaded();
            return locTexture;
        }
        return null;
    },

    /**
     * Sets the texture of the frame, the texture is retained automatically.
     * @method setTexture
     * @param {Texture2D} texture
     */
    setTexture:function (texture) {
        if (this._texture !== texture) {
            var locLoaded = texture.isLoaded();
            this._textureLoaded = locLoaded;
            this._texture = texture;
            if(!locLoaded){
                texture.once("load", function (event) {
                    var sender = event.currentTarget;
                    this._textureLoaded = true;
                    if(this._rotated && cc._renderType === cc.game.RENDER_TYPE_CANVAS){
                        var tempElement = sender.getHtmlElementObj();
                        tempElement = _ccsg.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(tempElement, this.getRect());
                        var tempTexture = new cc.Texture2D();
                        tempTexture.initWithElement(tempElement);
                        tempTexture.handleLoadedTexture();
                        this.setTexture(tempTexture);

                        var rect = this.getRect();
                        this.setRect(cc.rect(0, 0, rect.width, rect.height));
                    }
                    var locRect = this._rect;
                    if(locRect.width === 0 && locRect.height === 0){
                        var w = sender.width, h = sender.height;
                        this._rect.width = w;
                        this._rect.height = h;
                        this._rectInPixels = cc.rectPointsToPixels(this._rect);
                        this._originalSizeInPixels.width = this._rectInPixels.width;
                        this._originalSizeInPixels.height = this._rectInPixels.height;
                        this._originalSize.width = w;
                        this._originalSize.height =  h;
                    }
                    //dispatch 'load' event of cc.SpriteFrame
                    this.emit("load");
                }, this);
            }
        }
    },

    /**
     * Returns the offset of the frame in the texture.
     * @method getOffset
     * @return {Vec2}
     */
    getOffset:function () {
        return cc.p(this._offset);
    },

    /**
     * Sets the offset of the frame in the texture.
     * @method setOffset
     * @param {Vec2} offsets
     */
    setOffset:function (offsets) {
        this._offset.x = offsets.x;
        this._offset.y = offsets.y;
    },

    /**
     * Clone the sprite frame.
     * @method clone
     * @return {SpriteFrame}
     */
    clone:function(){
        var frame = new cc.SpriteFrame();
        frame.initWithTexture(this._textureFilename, this._rectInPixels, this._rotated, this._offsetInPixels, this._originalSizeInPixels);
        frame.setTexture(this._texture);
        return frame;
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
    initWithTexture:function (texture, rect, rotated, offset, originalSize) {
        if(arguments.length === 2)
            rect = cc.rectPointsToPixels(rect);

        offset = offset || cc.p(0, 0);
        originalSize = originalSize || rect;
        rotated = rotated || false;

        if (cc.js.isString(texture)){
            this._texture = null;
            this._textureFilename = texture;
        } else if (texture instanceof cc.Texture2D) {
            this.setTexture(texture);
        }

        // texture will be init in getTexture()
        texture = this.getTexture();

        this._rectInPixels = rect;
        this._rect = cc.rectPixelsToPoints(rect);
        this._offsetInPixels.x = offset.x;
        this._offsetInPixels.y = offset.y;
        cc._pointPixelsToPointsOut(offset, this._offset);
        this._originalSizeInPixels.width = originalSize.width;
        this._originalSizeInPixels.height = originalSize.height;
        cc._sizePixelsToPointsOut(originalSize, this._originalSize);
        this._rotated = rotated;

        if(texture && texture.url && texture.isLoaded()) {
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
            rect: [rect.x, rect.y, rect.width, rect.height],
            offset: [offset.x, offset.y],
            originalSize: [size.width, size.height],
            rotated: this._rotated ? 1 : 0,
            capInsets: capInsets
        };
    },

    _deserialize: function (data, handle) {
        var rect = data.rect;
        this._rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
        this._rectInPixels = cc.rectPointsToPixels(this._rect);
        this._offset = new cc.Vec2(data.offset[0], data.offset[1]);
        this._offsetInPixels = cc.pointPointsToPixels(this._offset);
        this._originalSize = new cc.Size(data.originalSize[0], data.originalSize[1]);
        this._originalSizeInPixels = cc.sizePointsToPixels(this._originalSize);
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
    },
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
    return new cc.SpriteFrame(filename,rect,rotated,offset,originalSize);
};

/**
 * deprecated since v3.0, please use new construction instead
 * @method cc.SpriteFrame.createWithTexture
 * @deprecated
 */
cc.SpriteFrame.createWithTexture = cc.SpriteFrame.create;

cc.SpriteFrame._frameWithTextureForCanvas = function (texture, rect, rotated, offset, originalSize) {
    var spriteFrame = new cc.SpriteFrame();
    spriteFrame._texture = texture;
    spriteFrame._rectInPixels = rect;
    spriteFrame._rect = cc.rectPixelsToPoints(rect);
    spriteFrame._offsetInPixels.x = offset.x;
    spriteFrame._offsetInPixels.y = offset.y;
    cc._pointPixelsToPointsOut(spriteFrame._offsetInPixels, spriteFrame._offset);
    spriteFrame._originalSizeInPixels.width = originalSize.width;
    spriteFrame._originalSizeInPixels.height = originalSize.height;
    cc._sizePixelsToPointsOut(spriteFrame._originalSizeInPixels, spriteFrame._originalSize);
    spriteFrame._rotated = rotated;
    return spriteFrame;
};
