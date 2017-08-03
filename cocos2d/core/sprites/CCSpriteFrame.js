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
 * !#en
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by the _ccsg.Sprite<br/>
 *  - rectangle: A rectangle of the texture
 *
 * !#zh
 * 一个 SpriteFrame 包含：<br/>
 *  - 纹理：会被 Sprite 使用的 Texture2D 对象。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *
 * @class SpriteFrame
 * @extends Asset
 * @uses EventTarget
 * @example
 * // load a cc.SpriteFrame with image path (Recommend)
 * var self = this;
 * var url = "test assets/PurpleMonster";
 * cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
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
                    this._loadTexture();
                }
            }
        }
    },

    /**
     * !#en
     * Constructor of SpriteFrame class.
     * !#zh
     * SpriteFrame 类的构造函数。
     * @method constructor
     * @param {String|Texture2D} [filename]
     * @param {Rect} [rect]
     * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
     * @param {Vec2} [offset] - The offset of the frame in the texture
     * @param {Size} [originalSize] - The size of the frame in the texture
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
         * !#en Top border of the sprite
         * !#zh sprite 的顶部边框
         * @property insetTop
         * @type {Number}
         * @default 0
         */
        this.insetTop = 0;

        /**
         * !#en Bottom border of the sprite
         * !#zh sprite 的底部边框
         * @property insetBottom
         * @type {Number}
         * @default 0
         */
        this.insetBottom = 0;

        /**
         * !#en Left border of the sprite
         * !#zh sprite 的左边边框
         * @property insetLeft
         * @type {Number}
         * @default 0
         */
        this.insetLeft = 0;

        /**
         * !#en Right border of the sprite
         * !#zh sprite 的左边边框
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
     * !#en Returns whether the texture have been loaded
     * !#zh 返回是否已加载纹理
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
     * !#en Returns whether the sprite frame is rotated in the texture.
     * !#zh 获取 SpriteFrame 是否旋转
     * @method isRotated
     * @return {Boolean}
     */
    isRotated: function () {
        return this._rotated;
    },

    /**
     * !#en Set whether the sprite frame is rotated in the texture.
     * !#zh 设置 SpriteFrame 是否旋转
     * @method setRotated
     * @param {Boolean} bRotated
     */
    setRotated: function (bRotated) {
        this._rotated = bRotated;
    },

    /**
     * !#en Returns the rect of the sprite frame in the texture.
     * !#zh 获取 SpriteFrame 的纹理矩形区域
     * @method getRect
     * @return {Rect}
     */
    getRect: function () {
        return cc.rect(this._rect);
    },

    /**
     * !#en Sets the rect of the sprite frame in the texture.
     * !#zh 设置 SpriteFrame 的纹理矩形区域
     * @method setRect
     * @param {Rect} rect
     */
    setRect: function (rect) {
        this._rect = rect;
    },

    /**
     * !#en Returns the original size of the trimmed image.
     * !#zh 获取修剪前的原始大小
     * @method getOriginalSize
     * @return {Size}
     */
    getOriginalSize: function () {
        return cc.size(this._originalSize);
    },

    /**
     * !#en Sets the original size of the trimmed image.
     * !#zh 设置修剪前的原始大小
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
     * !#en Returns the texture of the frame.
     * !#zh 获取使用的纹理实例
     * @method getTexture
     * @return {Texture2D}
     */
    getTexture: function () {
        return this._texture;
    },

    /*
     * !#en Sets the texture of the frame, the texture is retained automatically.
     * !#zh 设置使用的纹理实例，会被 retain。
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
                if (!self._texture) {
                    // clearTexture called while loading texture...
                    return;
                }
                self._textureLoaded = true;
                var w = texture.width, h = texture.height;

                if (self._rotated && cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
                    var tempElement = texture.getHtmlElementObj();
                    tempElement = _ccsg.Sprite.CanvasRenderCmd._cutRotateImageToCanvas(tempElement, self.getRect());
                    var tempTexture = new cc.Texture2D();
                    tempTexture.initWithElement(tempElement);
                    tempTexture.handleLoadedTexture();
                    self._texture = tempTexture;
                    self._rotated = false;
                    w = self._texture.width;
                    h = self._texture.height;
                    self.setRect(cc.rect(0, 0, w, h));
                }

                if (self._rect) {
                    self._checkRect(self._texture);
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

                // dispatch 'load' event of cc.SpriteFrame
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
     * !#en Returns the offset of the frame in the texture.
     * !#zh 获取偏移量
     * @method getOffset
     * @return {Vec2}
     */
    getOffset: function () {
        return cc.v2(this._offset);
    },

    /**
     * !#en Sets the offset of the frame in the texture.
     * !#zh 设置偏移量
     * @method setOffset
     * @param {Vec2} offsets
     */
    setOffset: function (offsets) {
        this._offset = cc.v2(offsets);
    },

    /**
     * !#en Clone the sprite frame.
     * !#zh 克隆 SpriteFrame
     * @method clone
     * @return {SpriteFrame}
     */
    clone: function () {
        return new cc.SpriteFrame(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
    },

    /**
     * #en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
     * #zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame
     * @method setTexture
     * @param {String|Texture2D} textureOrTextureFile
     * @param {Rect} [rect=null]
     * @param {Boolean} [rotated=false]
     * @param {Vec2} [offset=cc.v2(0,0)]
     * @param {Size} [originalSize=rect.size]
     * @return {Boolean}
     */
    setTexture: function (textureOrTextureFile, rect, rotated, offset, originalSize) {
        if (rect) {
            this.setRect(rect);
        }
        else {
            this._rect = null;
        }

        if (offset) {
            this.setOffset(offset);
        }
        else {
            this._offset = null;
        }

        if (originalSize) {
            this.setOriginalSize(originalSize);
        }
        else {
            this._originalSize = null;
        }

        this._rotated = rotated || false;

        // loading texture
        var texture = textureOrTextureFile;
        if (cc.js.isString(texture)) {
            this._textureFilename = texture;
            this._loadTexture();
        }
        else if (texture instanceof cc.Texture2D) {
            this._refreshTexture(texture);
        }
        else {
            // todo log error
        }

        return true;
    },

    _loadTexture: function () {
        if (this._textureFilename) {
            var texture = cc.textureCache.addImage(this._textureFilename);
            this._refreshTexture(texture);
        }
    },

    /**
     * !#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the textures of the SpriteFrame which
     * associated by user's custom Components in the scene, will not preload automatically.
     * These textures will be load when Sprite component is going to render the SpriteFrames.
     * You can call this method if you want to load the texture early.
     * !#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 SpriteFrame 的贴图都不会被提前加载。
     * 只有当 Sprite 组件要渲染这些 SpriteFrame 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
     *
     * @method ensureLoadTexture
     * @example
     * if (spriteFrame.textureLoaded()) {
     *     this._onSpriteFrameLoaded();
     * }
     * else {
     *     spriteFrame.once('load', this._onSpriteFrameLoaded, this);
     *     spriteFrame.ensureLoadTexture();
     * }
     */
    ensureLoadTexture: function () {
        if (!this._texture) {
            this._loadTexture();
        }
    },

    /**
     * !#en
     * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
     * !#zh
     * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
     *
     * @method clearTexture
     * @example
     * spriteFrame.clearTexture();
     * // when you need the SpriteFrame again...
     * spriteFrame.once('load', onSpriteFrameLoaded);
     * spriteFrame.ensureLoadTexture();
     */
    clearTexture: function () {
        this._textureLoaded = false;
        this._texture = null;
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
            cc.errorID(3300, texture.url + '/' + this.name);
        }
        if (maxY > texture.getPixelHeight()) {
            cc.errorID(3400, texture.url + '/' + this.name);
        }
    },

    // _instantiate () {
    //     var clone = new cc.SpriteFrame();
    // },

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
                uuid = Editor.Utils.UuidCache.urlToUuid(url);
            }
            if (exporting) {
                uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
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
            var dontLoadTexture = (handle.customEnv && handle.customEnv.deferredLoadRaw);
            var receiver = dontLoadTexture ? '_textureFilename' : '_textureFilenameSetter';
            handle.result.push(this, receiver, textureUuid);
        }
    }
});

var proto = cc.SpriteFrame.prototype;

proto.copyWithZone = proto.clone;
proto.copy = proto.clone;
proto.initWithTexture = proto.setTexture;
