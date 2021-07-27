/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const EventTarget = require("../event/event-target");

const INSET_LEFT = 0;
const INSET_TOP = 1;
const INSET_RIGHT = 2;
const INSET_BOTTOM = 3;

let temp_uvs = [{u: 0, v: 0}, {u: 0, v: 0}, {u: 0, v: 0}, {u: 0, v: 0}];

/**
 * !#en
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by render components<br/>
 *  - rectangle: A rectangle of the texture
 *
 * !#zh
 * 一个 SpriteFrame 包含：<br/>
 *  - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *
 * @class SpriteFrame
 * @extends Asset
 * @uses EventTarget
 * @example
 * // load a cc.SpriteFrame with image path (Recommend)
 * var self = this;
 * var url = "test assets/PurpleMonster";
 * cc.resources.load(url, cc.SpriteFrame, null, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
 */
let SpriteFrame = cc.Class(/** @lends cc.SpriteFrame# */{
    name: 'cc.SpriteFrame',
    extends: require('../assets/CCAsset'),
    mixins: [EventTarget],

    properties: {
        // Use this property to set texture when loading dependency
        _textureSetter: {
            set: function (texture) {
                if (texture) {
                    if (CC_EDITOR && Editor.isBuilder) {
                        // just building
                        this._texture = texture;
                        return;
                    }
                    if (this._texture !== texture) {
                        this._refreshTexture(texture);
                    }
                }
            }
        },

        /**
         * !#en Top border of the sprite
         * !#zh sprite 的顶部边框
         * @property insetTop
         * @type {Number}
         * @default 0
         */
        insetTop: {
            get: function () {
                return this._capInsets[INSET_TOP];
            },
            set: function (value) {
                this._capInsets[INSET_TOP] = value;
                if (this._texture) {
                    this._calculateSlicedUV();
                }
            }
        },

        /**
         * !#en Bottom border of the sprite
         * !#zh sprite 的底部边框
         * @property insetBottom
         * @type {Number}
         * @default 0
         */
        insetBottom: {
            get: function () {
                return this._capInsets[INSET_BOTTOM];
            },
            set: function (value) {
                this._capInsets[INSET_BOTTOM] = value;
                if (this._texture) {
                    this._calculateSlicedUV();
                }
            }
        },

        /**
         * !#en Left border of the sprite
         * !#zh sprite 的左边边框
         * @property insetLeft
         * @type {Number}
         * @default 0
         */
        insetLeft: {
            get: function () {
                return this._capInsets[INSET_LEFT];
            },
            set: function (value) {
                this._capInsets[INSET_LEFT] = value;
                if (this._texture) {
                    this._calculateSlicedUV();
                }
            }
        },

        /**
         * !#en Right border of the sprite
         * !#zh sprite 的左边边框
         * @property insetRight
         * @type {Number}
         * @default 0
         */
        insetRight: {
            get: function () {
                return this._capInsets[INSET_RIGHT];
            },
            set: function (value) {
                this._capInsets[INSET_RIGHT] = value;
                if (this._texture) {
                    this._calculateSlicedUV();
                }
            }
        },
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
        // Init EventTarget data
        EventTarget.call(this);

        let filename = arguments[0];
        let rect = arguments[1];
        let rotated = arguments[2];
        let offset = arguments[3];
        let originalSize = arguments[4];

        // the location of the sprite on rendering texture
        this._rect = null;
        // uv data of frame
        this.uv = [];
        // texture of frame
        this._texture = null;
        // store original info before packed to dynamic atlas
        this._original = null;

        // for trimming
        this._offset = null;

        // for trimming
        this._originalSize = null;

        this._rotated = false;

        this._flipX = false;
        this._flipY = false;

        this.vertices = null;

        this._capInsets = [0, 0, 0, 0];

        this.uvSliced = [];

        if (CC_EDITOR) {
            // Atlas asset uuid
            this._atlasUuid = '';
        }

        if (filename !== undefined) {
            this.setTexture(filename, rect, rotated, offset, originalSize);
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
        return this._texture && this._texture.loaded;
    },

    onTextureLoaded (callback, target) {
        if (this.textureLoaded()) {
            callback.call(target);
        }
        else {
            this.once('load', callback, target);
            this.ensureLoadTexture();
            return false;
        }

        return true;
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
        if (this._texture)
            this._calculateUV();
    },

    /**
     * !#en Returns whether the sprite frame is flip x axis in the texture.
     * !#zh 获取 SpriteFrame 是否反转 x 轴
     * @method isFlipX
     * @return {Boolean}
     */
    isFlipX: function () {
        return this._flipX;
    },

    /**
     * !#en Returns whether the sprite frame is flip y axis in the texture.
     * !#zh 获取 SpriteFrame 是否反转 y 轴
     * @method isFlipY
     * @return {Boolean}
     */
    isFlipY: function () {
        return this._flipY;
    },

    /**
     * !#en Set whether the sprite frame is flip x axis in the texture.
     * !#zh 设置 SpriteFrame 是否翻转 x 轴
     * @method setFlipX
     * @param {Boolean} flipX
     */
    setFlipX: function (flipX) {
        this._flipX = flipX;
        if (this._texture) {
            this._calculateUV();
        }
    },

    /**
     * !#en Set whether the sprite frame is flip y axis in the texture.
     * !#zh 设置 SpriteFrame 是否翻转 y 轴
     * @method setFlipY
     * @param {Boolean} flipY
     */
    setFlipY: function (flipY) {
        this._flipY = flipY;
        if (this._texture) {
            this._calculateUV();
        }
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
        if (this._texture)
            this._calculateUV();
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

    _textureLoadedCallback () {
        let self = this;
        let texture = this._texture;
        if (!texture) {
            // clearTexture called while loading texture...
            return;
        }
        let w = texture.width, h = texture.height;

        if (self._rect) {
            self._checkRect(self._texture);
        }
        else {
            self._rect = cc.rect(0, 0, w, h);
        }

        if (!self._originalSize) {
            self.setOriginalSize(cc.size(w, h));
        }

        if (!self._offset) {
            self.setOffset(cc.v2(0, 0));
        }

        self._calculateUV();

        // dispatch 'load' event of cc.SpriteFrame
        self.emit("load");
    },

    /*
     * !#en Sets the texture of the frame.
     * !#zh 设置使用的纹理实例。
     * @method _refreshTexture
     * @param {Texture2D} texture
     */
    _refreshTexture: function (texture) {
        this._texture = texture;
        if (texture.loaded) {
            this._textureLoadedCallback();
        }
        else {
            texture.once('load', this._textureLoadedCallback, this);
        }
    },

    /**
     * !#en Sets the texture of the frame.
     * !#zh 设置使用的纹理实例。
     * @method refreshTexture
     * @param {Texture2D} texture
     */
    refreshTexture: function (texture) {
        this._refreshTexture(texture);
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
    clone: function() {
        return new SpriteFrame(this._texture, this.getRect(), this._rotated, this.getOffset(), this.getOriginalSize());
    },

    /**
     * !#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
     * !#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
     * @method setTexture
     * @param {Texture2D} texture
     * @param {Rect} [rect=null]
     * @param {Boolean} [rotated=false]
     * @param {Vec2} [offset=cc.v2(0,0)]
     * @param {Size} [originalSize=rect.size]
     * @return {Boolean}
     */
    setTexture: function (texture, rect, rotated, offset, originalSize) {
        if (arguments.length === 1 && texture === this._texture) return;

        if (rect) {
            this._rect = rect;
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

        if (typeof texture === 'string') {
            cc.errorID(3401);
            return;
        }
        if (texture instanceof cc.Texture2D) {
            this._refreshTexture(texture);
        }

        return true;
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
        if (this._texture) {
            if (!this._texture.loaded) {
                // load exists texture
                this._refreshTexture(this._texture);
                cc.assetManager.postLoadNative(this._texture);
            }
        }
    },

    /**
     * !#en
     * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
     * !#zh
     * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
     * @method clearTexture
     * @deprecated since 2.1
     */

    _checkRect: function (texture) {
        let rect = this._rect;
        let maxX = rect.x, maxY = rect.y;
        if (this._rotated) {
            maxX += rect.height;
            maxY += rect.width;
        }
        else {
            maxX += rect.width;
            maxY += rect.height;
        }
        if (maxX > texture.width) {
            cc.errorID(3300, texture.nativeUrl + '/' + this.name, maxX, texture.width);
        }
        if (maxY > texture.height) {
            cc.errorID(3400, texture.nativeUrl + '/' + this.name, maxY, texture.height);
        }
    },

    _flipXY (uvs) {
        if (this._flipX) {
            let tempVal = uvs[0];
            uvs[0] = uvs[1];
            uvs[1] = tempVal;

            tempVal = uvs[2];
            uvs[2] = uvs[3];
            uvs[3] = tempVal;
        }

        if (this._flipY) {
            let tempVal = uvs[0];
            uvs[0] = uvs[2];
            uvs[2] = tempVal;

            tempVal = uvs[1];
            uvs[1] = uvs[3];
            uvs[3] = tempVal;
        }
    },

    _calculateSlicedUV () {
        let rect = this._rect;
        let atlasWidth = this._texture.width;
        let atlasHeight = this._texture.height;
        let leftWidth = this._capInsets[INSET_LEFT];
        let rightWidth = this._capInsets[INSET_RIGHT];
        let centerWidth = rect.width - leftWidth - rightWidth;
        let topHeight = this._capInsets[INSET_TOP];
        let bottomHeight = this._capInsets[INSET_BOTTOM];
        let centerHeight = rect.height - topHeight - bottomHeight;

        let uvSliced = this.uvSliced;
        uvSliced.length = 0;
        if (this._rotated) {
            temp_uvs[0].u = (rect.x) / atlasWidth;
            temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
            temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
            temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
            temp_uvs[3].v = (rect.y) / atlasHeight;
            temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
            temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
            temp_uvs[0].v = (rect.y + rect.width) / atlasHeight;

            this._flipXY(temp_uvs);

            for (let row = 0; row < 4; ++row) {
                let rowD = temp_uvs[row];
                for (let col = 0; col < 4; ++col) {
                    let colD = temp_uvs[3 - col];
                    uvSliced.push({
                        u: rowD.u,
                        v: colD.v
                    });
                }
            }
        }
        else {
            temp_uvs[0].u = (rect.x) / atlasWidth;
            temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
            temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
            temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
            temp_uvs[3].v = (rect.y) / atlasHeight;
            temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
            temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
            temp_uvs[0].v = (rect.y + rect.height) / atlasHeight;

            this._flipXY(temp_uvs);

            for (let row = 0; row < 4; ++row) {
                let rowD = temp_uvs[row];
                for (let col = 0; col < 4; ++col) {
                    let colD = temp_uvs[col];
                    uvSliced.push({
                        u: colD.u,
                        v: rowD.v
                    });
                }
            }
        }
    },

    _setDynamicAtlasFrame (frame) {
        if (!frame) return;

        this._original = {
            _texture : this._texture,
            _x : this._rect.x,
            _y : this._rect.y
        }
        
        this._texture = frame.texture;
        this._rect.x = frame.x;
        this._rect.y = frame.y;
        this._calculateUV();
    },

    _resetDynamicAtlasFrame () {
        if (!this._original) return;
        this._rect.x = this._original._x;
        this._rect.y = this._original._y;
        this._texture = this._original._texture;
        this._original = null;
        if (this._texture.loaded) {
            this._calculateUV();
        } else {
            this.ensureLoadTexture()
        }
    },

    _calculateUV () {
        let rect = this._rect,
            texture = this._texture,
            uv = this.uv,
            texw = texture.width,
            texh = texture.height;

        if (this._rotated) {
            let l = texw === 0 ? 0 : rect.x / texw;
            let r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
            let b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
            let t = texh === 0 ? 0 : rect.y / texh;
            uv[0] = l;
            uv[1] = t;
            uv[2] = l;
            uv[3] = b;
            uv[4] = r;
            uv[5] = t;
            uv[6] = r;
            uv[7] = b;
        }
        else {
            let l = texw === 0 ? 0 : rect.x / texw;
            let r = texw === 0 ? 0 : (rect.x + rect.width) / texw;
            let b = texh === 0 ? 0 : (rect.y + rect.height) / texh;
            let t = texh === 0 ? 0 : rect.y / texh;
            uv[0] = l;
            uv[1] = b;
            uv[2] = r;
            uv[3] = b;
            uv[4] = l;
            uv[5] = t;
            uv[6] = r;
            uv[7] = t;
        }

        if (this._flipX) {
            let tempVal = uv[0];
            uv[0] = uv[2];
            uv[2] = tempVal;

            tempVal = uv[1];
            uv[1] = uv[3];
            uv[3] = tempVal;

            tempVal = uv[4];
            uv[4] = uv[6];
            uv[6] = tempVal;

            tempVal = uv[5];
            uv[5] = uv[7];
            uv[7] = tempVal;
        }

        if (this._flipY) {
            let tempVal = uv[0];
            uv[0] = uv[4];
            uv[4] = tempVal;

            tempVal = uv[1];
            uv[1] = uv[5];
            uv[5] = tempVal;

            tempVal = uv[2];
            uv[2] = uv[6];
            uv[6] = tempVal;

            tempVal = uv[3];
            uv[3] = uv[7];
            uv[7] = tempVal;
        }

        let vertices = this.vertices;
        if (vertices) {
            vertices.nu.length = 0;
            vertices.nv.length = 0;
            for (let i = 0; i < vertices.u.length; i++) {
                vertices.nu[i] = vertices.u[i]/texw;
                vertices.nv[i] = vertices.v[i]/texh;
            }
        }

        this._calculateSlicedUV();
    },

    // SERIALIZATION

    _serialize: (CC_EDITOR || CC_TEST) && function (exporting, ctx) {
        let rect = this._rect;
        let offset = this._offset;
        let size = this._originalSize;
        let uuid;
        let texture = this._texture;
        if (texture) {
            uuid = texture._uuid;
        }
        if (!uuid) {
            let url = this._textureFilename;
            if (url) {
                uuid = Editor.Utils.UuidCache.urlToUuid(url);
            }
        }
        if (uuid && exporting) {
            uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
            ctx.dependsOn('_textureSetter', uuid);
        }

        let vertices;
        if (this.vertices) {
            vertices = {
                triangles: this.vertices.triangles,
                x: this.vertices.x,
                y: this.vertices.y,
                u: this.vertices.u,
                v: this.vertices.v
            };
        }

        return {
            name: this._name,
            texture: (!exporting && uuid) || undefined,
            atlas: exporting ? undefined : this._atlasUuid,  // strip from json if exporting
            rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
            offset: offset ? [offset.x, offset.y] : undefined,
            originalSize: size ? [size.width, size.height] : undefined,
            rotated: this._rotated ? 1 : undefined,
            capInsets: this._capInsets,
            vertices: vertices
        };
    },

    _deserialize: function (data, handle) {
        let rect = data.rect;
        if (rect) {
            this._rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
        }
        if (data.offset) {
            this.setOffset(new cc.Vec2(data.offset[0], data.offset[1]));
        }
        if (data.originalSize) {
            this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
        }
        this._rotated = data.rotated === 1;
        this._name = data.name;

        let capInsets = data.capInsets;
        if (capInsets) {
            this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
            this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
            this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
            this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
        }

        if (CC_EDITOR) {
            this._atlasUuid = data.atlas;
        }

        this.vertices = data.vertices;
        if (this.vertices) {
            // initialize normal uv arrays
            this.vertices.nu = [];
            this.vertices.nv = [];
        }

        if (!CC_BUILD) {
            // manually load texture via _textureSetter
            let textureUuid = data.texture;
            if (textureUuid) {
                handle.result.push(this, '_textureSetter', textureUuid);
            }
        }
    }
});

let proto = SpriteFrame.prototype;

proto.copyWithZone = proto.clone;
proto.copy = proto.clone;
proto.initWithTexture = proto.setTexture;

cc.SpriteFrame = SpriteFrame;

module.exports = SpriteFrame;
