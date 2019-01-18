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

import { ccclass, property } from '../core/data/class-decorator';
import EventTarget from '../core/event/event-target';
import { addon } from '../core/utils/js';
import Rect, { rect } from '../core/value-types/rect';
import Size, { size } from '../core/value-types/size';
import Vec2, { v2 } from '../core/value-types/vec2';
import { Asset } from './asset';
import Texture2D from './texture-2d';
import textureUtil from './texture-util';

const INSET_LEFT = 0;
const INSET_TOP = 1;
const INSET_RIGHT = 2;
const INSET_BOTTOM = 3;

export interface IUV {
    u: number;
    v: number;
}

interface IVertices {
    x: any;
    y: any;
    triangles: any;
    nu: number[];
    u: number[];
    nv: number[];
    v: number[];
}

const temp_uvs: IUV[] = [{ u: 0, v: 0 }, { u: 0, v: 0 }, { u: 0, v: 0 }, { u: 0, v: 0 }];

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
 * cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
 */
@ccclass('cc.SpriteFrame')
export class SpriteFrame extends Texture2D {
    // Use this property to set texture when loading dependency
    // @property
    // set _textureSetter(texture) {
    //     if (texture) {
    //         if (CC_EDITOR && !(texture instanceof cc.Texture2D)) {
    //             // just building
    //             this._texture = texture;
    //             return;
    //         }
    //         if (this._texture !== texture) {
    //             this._refreshTexture(texture);
    //         }
    //         this._textureFilename = texture.url;
    //     }
    // }

    // _textureFilename: {
    //     get () {
    //         return (this._texture && this._texture.url) || "";
    //     },
    //     set (url) {
    //         let texture = cc.textureCache.addImage(url);
    //         this._refreshTexture(texture);
    //     }
    // }

    /**
     * !#en Top border of the sprite
     * !#zh sprite 的顶部边框
     * @property insetTop
     * @type {Number}
     * @default 0
     */
    get insetTop () {
        return this._capInsets[INSET_TOP];
    }
    set insetTop (value) {
        this._capInsets[INSET_TOP] = value;
        // if (this._texture) {
        this._calculateSlicedUV();
        // }
    }

    /**
     * !#en Bottom border of the sprite
     * !#zh sprite 的底部边框
     * @property insetBottom
     * @type {Number}
     * @default 0
     */
    get insetBottom () {
        return this._capInsets[INSET_BOTTOM];
    }
    set insetBottom (value) {
        this._capInsets[INSET_BOTTOM] = value;
        // if (this._texture) {
        this._calculateSlicedUV();
        // }
    }

    /**
     * !#en Left border of the sprite
     * !#zh sprite 的左边边框
     * @property insetLeft
     * @type {Number}
     * @default 0
     */
    get insetLeft () {
        return this._capInsets[INSET_LEFT];
    }
    set insetLeft (value) {
        this._capInsets[INSET_LEFT] = value;
        // if (this._texture) {
        this._calculateSlicedUV();
        // }
    }

    /**
     * !#en Right border of the sprite
     * !#zh sprite 的左边边框
     * @property insetRight
     * @type {Number}
     * @default 0
     */
    get insetRight () {
        return this._capInsets[INSET_RIGHT];
    }
    set insetRight (value) {
        this._capInsets[INSET_RIGHT] = value;
        // if (this._texture) {
        this._calculateSlicedUV();
        // }
    }

    get atlasUuid () {
        return this._atlasUuid;
    }

    public vertices: IVertices | null = null;

    public uv: number[] = [];

    public uvSliced: IUV[] = [];

    // the location of the sprite on rendering texture
    private _rect = new Rect();

    // for trimming
    private _offset = new Vec2();

    // for trimming
    private _originalSize = new Size();

    private _rotated = false;

    private _capInsets = [0, 0, 0, 0];

    // store original info before packed to dynamic atlas
    private _original = null;

    private _atlasUuid?: string;

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
    constructor () {
        super();
        // Init EventTarget data
        EventTarget.call(this);

        // let filename = arguments[0];
        const rect = arguments[0];
        const rotated = arguments[1];
        const offset = arguments[2];
        const originalSize = arguments[3];

        // this._texture = null;
        // this._textureFilename = '';

        this._capInsets[INSET_BOTTOM] = 0;
        this._capInsets[INSET_LEFT] = 0;
        this._capInsets[INSET_RIGHT] = 1;
        this._capInsets[INSET_TOP] = 1;

        if (CC_EDITOR) {
            // Atlas asset uuid
            this._atlasUuid = '';
        }
        // if (filename !== undefined) {
        //     this.setTexture(filename, rect, rotated, offset, originalSize);
        // } else {
        //     //todo log Error
        // }
    }

    /**
     * !#en Returns whether the texture have been loaded
     * !#zh 返回是否已加载纹理
     */
    public textureLoaded () {
        return this.loaded;
    }

    /**
     * !#en Returns whether the sprite frame is rotated in the texture.
     * !#zh 获取 SpriteFrame 是否旋转
     */
    public isRotated () {
        return this._rotated;
    }

    /**
     * !#en Set whether the sprite frame is rotated in the texture.
     * !#zh 设置 SpriteFrame 是否旋转
     * @param value
     */
    public setRotated (rotated: boolean) {
        this._rotated = rotated;
    }

    /**
     * !#en Returns the rect of the sprite frame in the texture.
     * !#zh 获取 SpriteFrame 的纹理矩形区域
     */
    public getRect () {
        return rect(this._rect);
    }

    /**
     * !#en Sets the rect of the sprite frame in the texture.
     * !#zh 设置 SpriteFrame 的纹理矩形区域
     */
    public setRect (rect: Rect) {
        this._rect = rect;
    }

    /**
     * !#en Returns the original size of the trimmed image.
     * !#zh 获取修剪前的原始大小
     */
    public getOriginalSize () {
        return size(this._originalSize);
    }

    /**
     * !#en Sets the original size of the trimmed image.
     * !#zh 设置修剪前的原始大小
     */
    public setOriginalSize (size: Size) {
        this._originalSize.set(size);
    }

    /**
     * !#en Returns the texture of the frame.
     * !#zh 获取使用的纹理实例
     * @method getTexture
     * @return {Texture2D}
     */
    // getTexture() {
    //     return this._texture;
    // }

    public _textureLoadedCallback () {
        const self = this;
        // let texture = this._texture;
        // if (!texture) {
        //     // clearTexture called while loading texture...
        //     return;
        // }
        // let w = texture.width, h = texture.height;
        let w = self.width;
        let h = self.height;

        if (self._rotated && cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            // TODO: rotate texture for canvas
            // self._texture = _ccsg.Sprite.CanvasRenderCmd._createRotatedTexture(texture, self.getRect());
            self._rotated = false;
            // w = self._texture.width;
            // h = self._texture.height;
            w = self.width;
            h = self.height;
            self.setRect(cc.rect(0, 0, w, h));
        }

        if (self._rect) {
            self._checkRect(/*self._texture*/);
        } else {
            self.setRect(cc.rect(0, 0, w, h));
        }

        if (!self._originalSize) {
            self.setOriginalSize(cc.size(w, h));
        }

        if (!self._offset) {
            self.setOffset(cc.v2(0, 0));
        }

        self._calculateUV();

        // dispatch 'load' event of cc.SpriteFrame
        // @ts-ignore
        self.emit('load');
    }

    /*
     * !#en Sets the texture of the frame.
     * !#zh 设置使用的纹理实例。
     * @method _refreshTexture
     * @param {Texture2D} texture
     */
    // _refreshTexture(/*texture*/) {
    //     // this._texture = texture;
    //     if (/*texture.loaded*/this.loaded) {
    //         this._textureLoadedCallback();
    //     }
    //     else {
    //         // texture.once('load', this._textureLoadedCallback, this);
    //         this.once('load', this._textureLoadedCallback, this);
    //     }
    // }

    /**
     * !#en Returns the offset of the frame in the texture.
     * !#zh 获取偏移量
     */
    public getOffset () {
        return v2(this._offset);
    }

    /**
     * !#en Sets the offset of the frame in the texture.
     * !#zh 设置偏移量
     * @param offsets
     */
    public setOffset (offsets: Vec2) {
        this._offset = cc.v2(offsets);
    }

    /**
     * !#en Clone the sprite frame.
     * !#zh 克隆 SpriteFrame
     * @method clone
     * @return {SpriteFrame}
     */
    // TODO
    // clone() {
    //     let cloneSprite = new SpriteFrame(/*this._texture || this._textureFilename,*/ this._rect, this._rotated, this._offset, this._originalSize);
    //     cloneSprite.setWrapMode(this._wrapS, this._wrapT);
    //     cloneSprite.setFilters(this._minFilter, this._magFilter);
    //     cloneSprite.setPremultiplyAlpha(this._premultiplyAlpha);
    //     cloneSprite.setAnisotropy(this._anisotropy);
    //     cloneSprite._mipmaps = this._mipmaps;
    //     return cloneSprite;
    // }

    // /**
    //  * !#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
    //  * !#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
    //  * @method setTexture
    //  * @param {String|Texture2D} textureOrTextureFile
    //  * @param {Rect} [rect=null]
    //  * @param {Boolean} [rotated=false]
    //  * @param {Vec2} [offset=cc.v2(0,0)]
    //  * @param {Size} [originalSize=rect.size]
    //  * @return {Boolean}
    //  */
    // setTexture(textureOrTextureFile, rect, rotated, offset, originalSize) {
    //     if (rect) {
    //         this.setRect(rect);
    //     }
    //     else {
    //         this._rect = null;
    //     }

    //     if (offset) {
    //         this.setOffset(offset);
    //     }
    //     else {
    //         this._offset = null;
    //     }

    //     if (originalSize) {
    //         this.setOriginalSize(originalSize);
    //     }
    //     else {
    //         this._originalSize = null;
    //     }

    //     this._rotated = rotated || false;

    //     // loading texture
    //     let texture = textureOrTextureFile;
    //     if (typeof texture === 'string' && texture) {
    //         this._textureFilename = texture;
    //         this._loadTexture();
    //     }
    //     if (texture instanceof cc.Texture2D && this._texture !== texture) {
    //         this._refreshTexture(texture);
    //     }

    //     return true;
    // }

    // _loadTexture() {
    //     if (this._textureFilename) {
    //         let texture = textureUtil.loadImage(this._textureFilename);
    //         this._refreshTexture(texture);
    //     }
    // }

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
    public ensureLoadTexture () {
        // if (this._texture) {
        // if (!this._texture.loaded) {
        if (!this.loaded) {
            // load exists texture
            // this._refreshTexture(/*this._texture*/);
            textureUtil.postLoadTexture(/*this._texture*/this);
        }
        // }
        // else if (this._textureFilename) {
        //     // load new texture
        //     this._loadTexture();
        // }
    }

    // /**
    //  * !#en
    //  * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
    //  * !#zh
    //  * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
    //  *
    //  * @method clearTexture
    //  * @example
    //  * spriteFrame.clearTexture();
    //  * // when you need the SpriteFrame again...
    //  * spriteFrame.once('load', onSpriteFrameLoaded);
    //  * spriteFrame.ensureLoadTexture();
    //  */
    // clearTexture() {
    //     this._texture = null;   // TODO - release texture
    // }

    public _checkRect (/*texture*/) {
        const rect = this._rect;
        let maxX = rect.x;
        let maxY = rect.y;
        if (this._rotated) {
            maxX += rect.height;
            maxY += rect.width;
        } else {
            maxX += rect.width;
            maxY += rect.height;
        }
        // if (maxX > texture.width) {
        //     cc.errorID(3300, texture.url + '/' + this.name, maxX, texture.width);
        // }
        // if (maxY > texture.height) {
        //     cc.errorID(3400, texture.url + '/' + this.name, maxY, texture.height);
        // }
        if (maxX > this._originalSize.width) {
            cc.errorID(3300, /*this.url*/ + '/' + this.name, maxX, this._originalSize.width);
        }
        if (maxY > this._originalSize.height) {
            cc.errorID(3400, /*this.url +*/ '/' + this.name, maxY, this._originalSize.height);
        }
    }

    public _calculateSlicedUV () {
        const rect = this._rect;
        // let atlasWidth = this._texture.width;
        // let atlasHeight = this._texture.height;
        const atlasWidth = this._originalSize.width;
        const atlasHeight = this._originalSize.height;
        const leftWidth = this._capInsets[INSET_LEFT];
        const rightWidth = this._capInsets[INSET_RIGHT];
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = this._capInsets[INSET_TOP];
        const bottomHeight = this._capInsets[INSET_BOTTOM];
        const centerHeight = rect.height - topHeight - bottomHeight;

        const uvSliced = this.uvSliced;
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

            for (let row = 0; row < 4; ++row) {
                const rowD = temp_uvs[row];
                for (let col = 0; col < 4; ++col) {
                    const colD = temp_uvs[3 - col];
                    uvSliced.push({
                        u: rowD.u,
                        v: colD.v,
                    });
                }
            }
        } else {
            temp_uvs[0].u = (rect.x) / atlasWidth;
            temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
            temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
            temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
            temp_uvs[3].v = (rect.y) / atlasHeight;
            temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
            temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
            temp_uvs[0].v = (rect.y + rect.height) / atlasHeight;

            for (let row = 0; row < 4; ++row) {
                const rowD = temp_uvs[row];
                for (let col = 0; col < 4; ++col) {
                    const colD = temp_uvs[col];
                    uvSliced.push({
                        u: colD.u,
                        v: rowD.v,
                    });
                }
            }
        }
    }

    public _calculateUV () {
        const rect = this._rect;
        // texture = this._texture,
        const uv = this.uv;
        // texw = texture.width,
        // texh = texture.height;
        const texw = this._originalSize.width;
        const texh = this._originalSize.height;

        if (this._rotated) {
            const l = texw === 0 ? 0 : rect.x / texw;
            const r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
            const b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
            const t = texh === 0 ? 0 : rect.y / texh;
            uv[0] = l;
            uv[1] = t;
            uv[2] = l;
            uv[3] = b;
            uv[4] = r;
            uv[5] = t;
            uv[6] = r;
            uv[7] = b;
        } else {
            const l = texw === 0 ? 0 : rect.x / texw;
            const r = texw === 0 ? 0 : (rect.x + rect.width) / texw;
            const b = texh === 0 ? 0 : (rect.y + rect.height) / texh;
            const t = texh === 0 ? 0 : rect.y / texh;
            uv[0] = l;
            uv[1] = b;
            uv[2] = r;
            uv[3] = b;
            uv[4] = l;
            uv[5] = t;
            uv[6] = r;
            uv[7] = t;
        }

        const vertices = this.vertices;
        if (vertices) {
            vertices.nu.length = 0;
            vertices.nv.length = 0;
            for (let i = 0; i < vertices.u.length; i++) {
                vertices.nu[i] = vertices.u[i] / texw;
                vertices.nv[i] = vertices.v[i] / texh;
            }
        }

        this._calculateSlicedUV();
    }

    // SERIALIZATION

    // @ts-ignore
    // TODO:
    public _serialize (exporting) {
        const rect = this._rect;
        const offset = this._offset;
        const size = this._originalSize;
        let uuid = this._uuid;
        // let texture = this._texture;
        // if (texture) {
        //     uuid = texture._uuid;
        // }
        // if (!uuid) {
        //     let url = this._textureFilename;
        //     if (url) {
        //         uuid = Editor.Utils.UuidCache.urlToUuid(url);
        //     }
        // }
        if (uuid && exporting) {
            // @ts-ignore
            // TODO:
            uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
        }

        let vertices;
        if (this.vertices) {
            vertices = {
                triangles: this.vertices.triangles,
                x: this.vertices.x,
                y: this.vertices.y,
                u: this.vertices.u,
                v: this.vertices.v,
            };
        }

        return {
            base: super._serialize(),
            name: this._name,
            texture: uuid || undefined,
            atlas: exporting ? undefined : this._atlasUuid,  // strip from json if exporting
            rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
            offset: offset ? [offset.x, offset.y] : undefined,
            originalSize: size ? [size.width, size.height] : undefined,
            rotated: this._rotated ? 1 : undefined,
            capInsets: this._capInsets,
            vertices,
        };
    }

    public _deserialize (data, handle) {
        super._deserialize(data.base, handle);
        const rect = data.rect;
        if (rect) {
            this.setRect(new Rect(rect[0], rect[1], rect[2], rect[3]));
        }
        if (data.offset) {
            this.setOffset(new Vec2(data.offset[0], data.offset[1]));
        }
        if (data.originalSize) {
            this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
        }
        this._rotated = data.rotated === 1;
        this._name = data.name;

        const capInsets = data.capInsets;
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

        // load texture via _textureSetter
        // let textureUuid = data.texture;
        // if (textureUuid) {
        //     handle.result.push(this, '_textureSetter', textureUuid);
        // }
    }

    public onLoaded () {
        this.loaded = true;
        if (super.onLoaded) {
            super.onLoaded();
        }

        this._textureLoadedCallback();
    }

    public copyWithZone (...args: any[]) {
        // return this.clone(...args);
    }

    public copy (...args: any[]) {
        // return this.clone(...args);
    }

    // public initWithTexture (...args: any[]) {
    //     return this.setTexture(...args);
    // }
}

const proto = SpriteFrame.prototype;

addon(proto, EventTarget.prototype);

cc.SpriteFrame = SpriteFrame;
