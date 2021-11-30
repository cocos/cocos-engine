/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass } from 'cc.decorator';
import { EDITOR, TEST, BUILD, UI_GPU_DRIVEN } from 'internal:constants';
import { Rect, Size, Vec2 } from '../../core/math';
import { murmurhash2_32_gc } from '../../core/utils/murmurhash2_gc';
import { Asset } from '../../core/assets/asset';
import { RenderTexture } from '../../core/assets/render-texture';
import { TextureBase } from '../../core/assets/texture-base';
import { legacyCC } from '../../core/global-exports';
import { ImageAsset, ImageSource } from '../../core/assets/image-asset';
import { Texture2D } from '../../core/assets/texture-2d';
import { errorID } from '../../core/platform/debug';
import { dynamicAtlasManager } from '../utils/dynamic-atlas/atlas-manager';
import { js } from '../../core/utils/js';

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

interface ISpriteFramesSerializeData {
    name: string;
    base: string;
    image: string;
    atlas: string | undefined;
    rect: Rect;
    offset: Vec2;
    originalSize: Size;
    rotated: boolean;
    capInsets: number[];
    vertices: IVertices;
    texture: string;
    packable: boolean;
}

interface ISpriteFrameOriginal {
    spriteframe: SpriteFrame;
    x: number;
    y: number;
}

/**
 * @en Information object interface for initialize a [[SpriteFrame]] asset
 * @zh 用于初始化 [[SpriteFrame]] 资源的对象接口描述
 */
interface ISpriteFrameInitInfo {
    /**
     * @en The texture of the sprite frame, could be [[TextureBase]]
     * @zh 贴图对象资源，可以是 [[TextureBase]] 类型
     */
    texture?: TextureBase;
    /**
     * @en The original size of the sprite frame
     * @zh 精灵帧原始尺寸。
     */
    originalSize?: Size;
    /**
     * @en The rect of the sprite frame in atlas texture
     * @zh 精灵帧裁切矩形。
     */
    rect?: Rect;
    /**
     * @en The offset of the sprite frame center from the original center of the original rect.
     * Sprite frame in an atlas texture could be trimmed for clipping the transparent pixels, so the trimmed rect is smaller than the original one,
     * the offset defines the distance from the original center to the trimmed center.
     * @zh 精灵帧偏移量。
     * 在图集中的精灵帧可能会被剔除透明像素以获得更高的空间利用李，剔除后的矩形尺寸比剪裁前更小，偏移量指的是从原始矩形的中心到剪裁后的矩形中心的距离。
     */
    offset?: Vec2;
    /**
     * @en Top side border for sliced 9 frame.
     * @zh 九宫格精灵帧的上边界。
     * @default 0
     */
    borderTop?: number;
    /**
     * @en Bottom side border for sliced 9 frame.
     * @zh 九宫格精灵帧的下边界。
     * @default 0
     */
    borderBottom?: number;
    /**
     * @en Left side border for sliced 9 frame.
     * @zh 九宫格精灵帧的左边界。
     * @default 0
     */
    borderLeft?: number;
    /**
     * @en Right side border for sliced 9 frame.
     * @zh 九宫格精灵帧的右边界。
     * @default 0
     */
    borderRight?: number;
    /**
     * @en Whether the content of sprite frame is rotated.
     * @zh 是否旋转。
     */
    isRotate?: boolean;
    /**
     * @en Whether the uv is flipped
     * @zh 是否转置 UV。
     */
    isFlipUv?: boolean;
}

const temp_uvs: IUV[] = [{ u: 0, v: 0 }, { u: 0, v: 0 }, { u: 0, v: 0 }, { u: 0, v: 0 }];

/**
 * @en
 * A `SpriteFrame` support several types
 *  1. Rectangle sprite frame
 *  2. Sliced 9 sprite frame
 *  3. Mesh sprite frame
 * It mainly contains:<br/>
 *  - texture: A [[TextureBase]] that will be used by render process<br/>
 *  - rectangle: A rectangle of the texture
 *  - Sliced 9 border insets: The distance of each side from the internal rect to the sprite frame rect
 *  - vertices: Vertex list for the mesh type sprite frame
 *  - uv: The quad uv
 *  - uvSliced: The sliced 9 uv
 *
 * @zh
 * 精灵帧资源。
 * 一个 SpriteFrame 支持多种类型
 *  1. 矩形精灵帧
 *  2. 九宫格精灵帧
 *  3. 网格精灵帧
 * 它主要包含下列数据：<br/>
 *  - 纹理：会被渲染流程使用的 [[TextureBase]] 资源。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *  - 九宫格信息：九宫格的内部矩形四个边距离 SpriteFrame 外部矩形的距离
 *  - 网格信息：网格类型精灵帧的所有顶点列表
 *  - uv: 四边形 UV
 *  - uvSliced: 九宫格 UV
 * 可通过 `SpriteFrame` 获取该组件。
 *
 * @example
 * ```ts
 * import { resources } from 'cc';
 * // First way to use a SpriteFrame
 * const url = "assets/PurpleMonster/icon/spriteFrame";
 * resources.load(url, (err, spriteFrame) => {
 *   const node = new Node("New Sprite");
 *   const sprite = node.addComponent(Sprite);
 *   sprite.spriteFrame = spriteFrame;
 *   node.parent = self.node;
 * });
 *
 * // Second way to use a SpriteFrame
 * const self = this;
 * const url = "test_assets/PurpleMonster";
 * resources.load(url, (err, imageAsset) => {
 *  if(err){
 *    return;
 *  }
 *
 *  const node = new Node("New Sprite");
 *  const sprite = node.addComponent(Sprite);
 *  const spriteFrame = new SpriteFrame();
 *  const tex = imageAsset._texture;
 *  spriteFrame.texture = tex;
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node;
 * });
 *
 * // Third way to use a SpriteFrame
 * const self = this;
 * const cameraComp = this.getComponent(Camera);
 * const renderTexture = new RenderTexture();
 * renderTexture.reset({
 *   width: 512,
 *   height: 512,
 *   depthStencilFormat: RenderTexture.DepthStencilFormat.DEPTH_24_STENCIL_8
 * });
 *
 * cameraComp.targetTexture = renderTexture;
 * const spriteFrame = new SpriteFrame();
 * spriteFrame.texture = renderTexture;
 * ```
 */
@ccclass('cc.SpriteFrame')
export class SpriteFrame extends Asset {
    /**
     * @en Create a SpriteFrame object by an image asset or an native image asset
     * @zh 通过 Image 资源或者平台相关 Image 对象创建一个 SpriteFrame 对象
     * @param imageSourceOrImageAsset ImageAsset or ImageSource, ImageSource support HTMLCanvasElement HTMLImageElement IMemoryImageSource
     */
    public static createWithImage (imageSourceOrImageAsset: ImageSource | ImageAsset) {
        const img = imageSourceOrImageAsset instanceof ImageAsset ? imageSourceOrImageAsset : new ImageAsset(imageSourceOrImageAsset);
        const tex = new Texture2D();
        tex.image = img;
        const spf = new SpriteFrame();
        spf.texture = tex;
        return spf;
    }

    /**
     * @en Top border distance of sliced 9 rect.
     * @zh 九宫格内部矩形顶部边框距离 SpriteFrame 矩形的距离。
     */
    get insetTop () {
        return this._capInsets[INSET_TOP];
    }

    set insetTop (value) {
        if (this._capInsets[INSET_TOP] === value) {
            return;
        }

        this._capInsets[INSET_TOP] = value;
        if (this._texture) {
            this._calculateSlicedUV();
        }
    }

    /**
     * @en Bottom border distance of sliced 9 rect.
     * @zh 九宫格内部矩形底部边框距离 SpriteFrame 矩形的距离。
     */
    get insetBottom () {
        return this._capInsets[INSET_BOTTOM];
    }

    set insetBottom (value) {
        if (this._capInsets[INSET_BOTTOM] === value) {
            return;
        }

        this._capInsets[INSET_BOTTOM] = value;
        if (this._texture) {
            this._calculateSlicedUV();
        }
    }

    /**
     * @en Left border distance of sliced 9 rect.
     * @zh 九宫格内部矩形左边框距离 SpriteFrame 矩形的距离。
     */
    get insetLeft () {
        return this._capInsets[INSET_LEFT];
    }

    set insetLeft (value) {
        if (this._capInsets[INSET_LEFT] === value) {
            return;
        }

        this._capInsets[INSET_LEFT] = value;
        if (this._texture) {
            this._calculateSlicedUV();
        }
    }

    /**
     * @en Right border distance of sliced 9 rect.
     * @zh 九宫格内部矩形右边框距离 SpriteFrame 矩形的距离。
     */
    get insetRight () {
        return this._capInsets[INSET_RIGHT];
    }

    set insetRight (value) {
        if (this._capInsets[INSET_RIGHT] === value) {
            return;
        }

        this._capInsets[INSET_RIGHT] = value;
        if (this._texture) {
            this._calculateSlicedUV();
        }
    }

    /**
     * @en Returns the rect of the sprite frame in the texture.
     * If it's an atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
     * @zh 获取 SpriteFrame 的纹理矩形区域。
     * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
     */
    get rect () {
        return this._rect;
    }

    set rect (value) {
        if (this._rect.equals(value)) {
            return;
        }

        this._rect.set(value);
        if (this._texture) {
            this._calculateUV();
        }
    }

    /**
     * @en The original size before trimmed.
     * @zh 修剪前的原始大小。
     */
    get originalSize () {
        return this._originalSize;
    }

    set originalSize (value) {
        if (this._originalSize.equals(value)) {
            return;
        }

        this._originalSize.set(value);
        if (this._texture) {
            this._calculateUV();
        }
    }

    /**
     * @en The offset of the sprite frame center.
     * Sprite frame in an atlas texture could be trimmed for clipping the transparent pixels, so the trimmed rect is smaller than the original one,
     * the offset defines the distance from the original center to the trimmed center.
     * @zh 精灵帧偏移量。
     * 在图集中的精灵帧可能会被剔除透明像素以获得更高的空间利用李，剔除后的矩形尺寸比剪裁前更小，偏移量指的是从原始矩形的中心到剪裁后的矩形中心的距离。
     */
    get offset () {
        return this._offset;
    }

    set offset (value) {
        this._offset.set(value);
    }

    /**
     * @en Whether the content of sprite frame is rotated.
     * @zh 是否旋转。
     */
    get rotated () {
        return this._rotated;
    }

    set rotated (rotated) {
        if (this._rotated === rotated) {
            return;
        }

        this._rotated = rotated;
        if (this._texture) {
            this._calculateUV();
        }
    }

    /**
     * @en The texture of the sprite frame, could be [[TextureBase]]
     * @zh 贴图对象资源，可以是 [[TextureBase]] 类型
     */
    get texture () {
        return this._texture;
    }

    set texture (value) {
        if (!value) {
            console.warn(`Error Texture in ${this.name}`);
            return;
        }

        if (value === this._texture) {
            console.warn(`set same texture ${this._texture.name}`);
            return;
        }

        this.reset({ texture: value }, true);
    }

    /**
     * @en The uuid of the atlas asset, if exist
     * @zh 图集资源的 uuid。
     */
    get atlasUuid () {
        return this._atlasUuid;
    }

    set atlasUuid (value: string) {
        this._atlasUuid = value;
    }

    /**
     * @en The pixel width of the sprite frame
     * @zh 精灵帧的像素宽度
     */
    get width () {
        return this._texture.width;
    }

    /**
     * @en The pixel height of the sprite frame
     * @zh 精灵帧的像素高度
     */
    get height () {
        return this._texture.height;
    }

    set _textureSource (value: TextureBase) {
        // Optimization for build
        if (window.Build) {
            this._texture = value;
            return;
        }
        if (value) {
            this._refreshTexture(value);
            this._calculateUV();
        }
    }

    /**
     * @en Whether flip the uv in X direction
     * @zh 延 X 轴方向, 翻转 UV
     */
    get flipUVX () {
        return this._isFlipUVX;
    }

    set flipUVX (value) {
        this._isFlipUVX = value;
        this._calculateUV();
    }

    /**
     * @en Whether flip the uv in Y direction
     * @zh 延 Y 轴方向, 翻转 UV
     */
    get flipUVY () {
        return this._isFlipUVY;
    }

    set flipUVY (value) {
        this._isFlipUVY = value;
        this._calculateUV();
    }

    get packable () {
        return this._packable;
    }
    set packable (value: boolean) {
        this._packable = value;
    }

    get original () {
        return this._original;
    }

    /**
     * @en Vertex list for the mesh type sprite frame
     * @zh 网格类型精灵帧的所有顶点列表
     */
    public vertices: IVertices | null = null;

    /**
     * @en UV for quad vertices
     * @zh 矩形的顶点 UV
     */
    public uv: number[] = [];
    public uvHash = 0;

    // macro.UI_GPU_DRIVEN
    public declare tillingOffset: number[];
    public declare slicedData: number[];

    public unbiasUV:number[] = [];

    /**
     * @en UV for sliced 9 vertices
     * @zh 九宫格的顶点 UV。
     */
    public uvSliced: IUV[] = [];

    // the location of the sprite on rendering texture
    protected _rect = new Rect();

    // for trimming
    protected _offset = new Vec2();

    // for trimming
    protected _originalSize = new Size();

    protected _rotated = false;

    protected _capInsets = [0, 0, 0, 0];

    protected _atlasUuid = '';
    // @ts-expect-error not set value at there
    protected _texture: TextureBase;

    protected _isFlipUVY = false;

    protected _isFlipUVX = false;

    // store original info before packed to dynamic atlas
    protected _original: {
        _texture: TextureBase,
        _x: number,
        _y: number,
    } | null = null;

    protected _packable = true;

    constructor () {
        super();
        if (UI_GPU_DRIVEN) {
            this.tillingOffset = [];
            this.slicedData = [];
        }

        if (EDITOR) {
            // Atlas asset uuid
            this._atlasUuid = '';
        }
    }

    /**
     * @en
     * Returns whether the texture have been loaded.
     * @zh
     * 返回是否已加载精灵帧。
     *
     * @deprecated since v3.3
     */
    public textureLoaded () {
        return !!this.texture;
    }

    /**
     * @en
     * Returns whether the sprite frame is rotated in the texture.
     * @zh
     * 获取 SpriteFrame 是否旋转。
     * @deprecated since v1.2, please use [[rotated]] instead
     */
    public isRotated () {
        return this._rotated;
    }

    /**
     * @en
     * Set whether the sprite frame is rotated in the texture.
     * @zh
     * 设置 SpriteFrame 是否旋转。
     * @param value
     * @deprecated since v1.2, please use [[rotated]] instead
     */
    public setRotated (rotated: boolean) {
        this.rotated = rotated;
    }

    /**
     * @en Returns the rect of the sprite frame in the texture.
     * If it's an atlas texture, a transparent pixel area is proposed for the actual mapping of the current texture.
     * @zh 获取 SpriteFrame 的纹理矩形区域。
     * 如果是一个 atlas 的贴图，则为当前贴图的实际剔除透明像素区域。
     * @deprecated since v1.2, please use [[rect]]
     */
    public getRect (out?: Rect) {
        if (out) {
            out.set(this._rect);
            return out;
        }

        return this._rect.clone();
    }

    /**
     * @en Sets the rect of the sprite frame in the texture.
     * @zh 设置 SpriteFrame 的纹理矩形区域。
     * @deprecated since v1.2, please use [[rect]]
     */
    public setRect (rect: Rect) {
        this.rect = rect;
    }

    /**
     * @en Returns the original size before trimmed.
     * @zh 获取修剪前的原始大小。
     * @deprecated since v1.2, please use [[originalSize]]
     */
    public getOriginalSize (out?: Size) {
        if (out) {
            out.set(this._originalSize);
            return out;
        }

        return this._originalSize.clone();
    }

    /**
     * @en Sets the original size before trimmed.
     * @zh 设置修剪前的原始大小。
     * @param size The new original size
     * @deprecated since v1.2, please use [[originalSize]]
     */
    public setOriginalSize (size: Size) {
        this.originalSize = size;
    }

    /**
     * @en Returns the offset of the frame
     * @zh 获取偏移量。
     * @param out The output offset object
     * @deprecated since v1.2, please use [[offset]]
     */
    public getOffset (out?: Vec2) {
        if (out) {
            out.set(this._offset);
            return out;
        }

        return this._offset.clone();
    }

    /**
     * @en Sets the offset of the frame
     * @zh 设置偏移量。
     * @param offset The new offset
     * @deprecated since v1.2, please use [[offset]]
     */
    public setOffset (offset: Vec2) {
        this.offset = offset;
    }

    /**
     * @en Gets the related GFX [[Texture]] resource
     * @zh 获取渲染贴图的 GFX 资源
     */
    public getGFXTexture () {
        return this._texture.getGFXTexture();
    }

    /**
     * @en Gets the sampler resource of its texture
     * @zh 贴图资源的采样器
     */
    public getGFXSampler () {
        return this._texture.getGFXSampler();
    }

    /**
     * @en Gets the hash of its texture
     * @zh 贴图资源的哈希值
     */
    public getHash () {
        return this._texture.getHash();
    }

    /**
     * @en Gets the sampler hash of its texture
     * @zh 贴图资源的采样器哈希值
     */
    public getSamplerInfo () {
        return this._texture.getSamplerInfo();
    }

    /**
     * @en Resets the sprite frame data
     * @zh 重置 SpriteFrame 数据。
     * @param info SpriteFrame initialization information
     */
    public reset (info?: ISpriteFrameInitInfo, clearData = false) {
        let calUV = false;
        if (clearData) {
            this._originalSize.set(0, 0);
            this._rect.set(0, 0, 0, 0);
            this._offset.set(0, 0);
            this._capInsets = [0, 0, 0, 0];
            this._rotated = false;
            calUV = true;
        }

        if (info) {
            if (info.texture) {
                this._rect.x = this._rect.y = 0;
                this._rect.width = info.texture.width;
                this._rect.height = info.texture.height;
                this._refreshTexture(info.texture);
                this.checkRect(this._texture);
            }

            if (info.originalSize) {
                this._originalSize.set(info.originalSize);
            }

            if (info.rect) {
                this._rect.set(info.rect);
            }

            if (info.offset) {
                this._offset.set(info.offset);
            }

            if (info.borderTop !== undefined) {
                this._capInsets[INSET_TOP] = info.borderTop;
            }

            if (info.borderBottom !== undefined) {
                this._capInsets[INSET_BOTTOM] = info.borderBottom;
            }

            if (info.borderLeft !== undefined) {
                this._capInsets[INSET_LEFT] = info.borderLeft;
            }

            if (info.borderRight !== undefined) {
                this._capInsets[INSET_RIGHT] = info.borderRight;
            }

            if (info.isRotate !== undefined) {
                this._rotated = !!info.isRotate;
            }

            if (info.isFlipUv !== undefined) {
                this._isFlipUVY = !!info.isFlipUv;
            }

            calUV = true;
        }

        if (calUV && this.texture) {
            this._calculateUV();
        }
    }

    /**
     * @en Check whether the rect of the sprite frame is out of the texture boundary
     * @zh 判断精灵计算的矩形区域是否越界。
     * @param texture
     */
    public checkRect (texture: TextureBase) {
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

        if (maxX > texture.width) {
            errorID(3300, `${this.name}/${texture.name}`, maxX, texture.width);
            return false;
        }

        if (maxY > texture.height) {
            errorID(3301, `${this.name}/${texture.name}`, maxY, texture.height);
            return false;
        }

        return true;
    }

    public destroy () {
        if (this._packable && dynamicAtlasManager) {
            dynamicAtlasManager.deleteAtlasSpriteFrame(this);
        }
        return super.destroy();
    }

    // Calculate UV for sliced
    public _calculateSlicedUV () {
        if (UI_GPU_DRIVEN) {
            this._calculateSlicedData();
        }
        const rect = this._rect;
        // const texture = this._getCalculateTarget()!;
        const tex = this.texture;
        const atlasWidth = tex.width;
        const atlasHeight = tex.height;
        const leftWidth = this._capInsets[INSET_LEFT];
        const rightWidth = this._capInsets[INSET_RIGHT];
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = this._capInsets[INSET_TOP];
        const bottomHeight = this._capInsets[INSET_BOTTOM];
        const centerHeight = rect.height - topHeight - bottomHeight;

        const uvSliced = this.uvSliced;
        uvSliced.length = 0;
        if (this._rotated) {
            temp_uvs[0].u = rect.x / atlasWidth;
            temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
            temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
            temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
            temp_uvs[3].v = rect.y / atlasHeight;
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
            temp_uvs[0].u = rect.x / atlasWidth;
            temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
            temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
            temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
            temp_uvs[3].v = rect.y / atlasHeight;
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

    // Calculate UV
    public _calculateUV () {
        const rect = this._rect;
        const uv = this.uv;
        const unbiasUV = this.unbiasUV;
        const tex = this.texture;
        const texw = tex.width;
        const texh = tex.height;

        if (this._rotated) {
            const l = texw === 0 ? 0 : rect.x / texw;
            const r = texw === 0 ? 1 : (rect.x + rect.height) / texw;
            const t = texh === 0 ? 0 : rect.y / texh;
            const b = texh === 0 ? 1 : (rect.y + rect.width) / texh;

            if (this._isFlipUVX && this._isFlipUVY) {
                /*
                3 - 1
                |   |
                2 - 0
                */
                uv[0] = r;
                uv[1] = b;
                uv[2] = r;
                uv[3] = t;
                uv[4] = l;
                uv[5] = b;
                uv[6] = l;
                uv[7] = t;
            } else if (this._isFlipUVX) {
                /*
                2 - 0
                |   |
                3 - 1
                */
                uv[0] = r;
                uv[1] = t;
                uv[2] = r;
                uv[3] = b;
                uv[4] = l;
                uv[5] = t;
                uv[6] = l;
                uv[7] = b;
            } else if (this._isFlipUVY) {
                /*
                1 - 3
                |   |
                0 - 2
                */
                uv[0] = l;
                uv[1] = b;
                uv[2] = l;
                uv[3] = t;
                uv[4] = r;
                uv[5] = b;
                uv[6] = r;
                uv[7] = t;
            } else {
                /*
                0 - 2
                |   |
                1 - 3
                */
                uv[0] = l;
                uv[1] = t;
                uv[2] = l;
                uv[3] = b;
                uv[4] = r;
                uv[5] = t;
                uv[6] = r;
                uv[7] = b;
            }

            const ul = texw === 0 ? 0 : rect.x / texw;
            const ur = texw === 0 ? 1 : (rect.x + rect.height) / texw;
            const ut = texh === 0 ? 0 : rect.y / texh;
            const ub = texh === 0 ? 1 : (rect.y + rect.width) / texh;
            if (this._isFlipUVX && this._isFlipUVY) {
                unbiasUV[0] = ur;
                unbiasUV[1] = ub;
                unbiasUV[2] = ur;
                unbiasUV[3] = ut;
                unbiasUV[4] = ul;
                unbiasUV[5] = ub;
                unbiasUV[6] = ul;
                unbiasUV[7] = ut;
            } else if (this._isFlipUVX) {
                unbiasUV[0] = ur;
                unbiasUV[1] = ut;
                unbiasUV[2] = ur;
                unbiasUV[3] = ub;
                unbiasUV[4] = ul;
                unbiasUV[5] = ut;
                unbiasUV[6] = ul;
                unbiasUV[7] = ub;
            } else if (this._isFlipUVY) {
                unbiasUV[0] = ul;
                unbiasUV[1] = ub;
                unbiasUV[2] = ul;
                unbiasUV[3] = ut;
                unbiasUV[4] = ur;
                unbiasUV[5] = ub;
                unbiasUV[6] = ur;
                unbiasUV[7] = ut;
            } else {
                unbiasUV[0] = ul;
                unbiasUV[1] = ut;
                unbiasUV[2] = ul;
                unbiasUV[3] = ub;
                unbiasUV[4] = ur;
                unbiasUV[5] = ut;
                unbiasUV[6] = ur;
                unbiasUV[7] = ub;
            }
        } else {
            const l = texw === 0 ? 0 : rect.x / texw;
            const r = texw === 0 ? 1 : (rect.x + rect.width) / texw;
            const b = texh === 0 ? 1 : (rect.y + rect.height) / texh;
            const t = texh === 0 ? 0 : rect.y / texh;
            if (this._isFlipUVX && this._isFlipUVY) {
                /*
                1 - 0
                |   |
                3 - 2
                */
                uv[0] = r;
                uv[1] = t;
                uv[2] = l;
                uv[3] = t;
                uv[4] = r;
                uv[5] = b;
                uv[6] = l;
                uv[7] = b;
            } else if (this._isFlipUVX) {
                /*
                3 - 2
                |   |
                1 - 0
                */
                uv[0] = r;
                uv[1] = b;
                uv[2] = l;
                uv[3] = b;
                uv[4] = r;
                uv[5] = t;
                uv[6] = l;
                uv[7] = t;
            } else if (this._isFlipUVY) {
                /*
                0 - 1
                |   |
                2 - 3
                */
                uv[0] = l;
                uv[1] = t;
                uv[2] = r;
                uv[3] = t;
                uv[4] = l;
                uv[5] = b;
                uv[6] = r;
                uv[7] = b;
            } else {
                /*
                2 - 3
                |   |
                0 - 1
                */
                uv[0] = l;
                uv[1] = b;
                uv[2] = r;
                uv[3] = b;
                uv[4] = l;
                uv[5] = t;
                uv[6] = r;
                uv[7] = t;
            }
            const ul = texw === 0 ? 0 : rect.x / texw;
            const ur = texw === 0 ? 1 : (rect.x + rect.width) / texw;
            const ub = texh === 0 ? 1 : (rect.y + rect.height) / texh;
            const ut = texh === 0 ? 0 : rect.y / texh;
            if (this._isFlipUVX && this._isFlipUVY) {
                unbiasUV[0] = ur;
                unbiasUV[1] = ut;
                unbiasUV[2] = ul;
                unbiasUV[3] = ut;
                unbiasUV[4] = ur;
                unbiasUV[5] = ub;
                unbiasUV[6] = ul;
                unbiasUV[7] = ub;
            } else if (this._isFlipUVX) {
                unbiasUV[0] = ur;
                unbiasUV[1] = ub;
                unbiasUV[2] = ul;
                unbiasUV[3] = ub;
                unbiasUV[4] = ur;
                unbiasUV[5] = ut;
                unbiasUV[6] = ul;
                unbiasUV[7] = ut;
            } else if (this._isFlipUVY) {
                unbiasUV[0] = ul;
                unbiasUV[1] = ut;
                unbiasUV[2] = ur;
                unbiasUV[3] = ut;
                unbiasUV[4] = ul;
                unbiasUV[5] = ub;
                unbiasUV[6] = ur;
                unbiasUV[7] = ub;
            } else {
                unbiasUV[0] = ul;
                unbiasUV[1] = ub;
                unbiasUV[2] = ur;
                unbiasUV[3] = ub;
                unbiasUV[4] = ul;
                unbiasUV[5] = ut;
                unbiasUV[6] = ur;
                unbiasUV[7] = ut;
            }
        }

        let uvHashStr = '';
        for (let i = 0; i < uv.length; i++) {
            uvHashStr += uv[i];
        }
        this.uvHash = murmurhash2_32_gc(uvHashStr, 666);

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
        if (UI_GPU_DRIVEN) {
            this._calculateTillingOffset();
        }
    }

    public _setDynamicAtlasFrame (frame) {
        if (!frame) return;

        this._original = {
            _texture: this._texture,
            _x: this._rect.x,
            _y: this._rect.y,
        };

        this._texture = frame.texture;
        this._rect.x = frame.x;
        this._rect.y = frame.y;
        this._calculateUV();
    }

    public _resetDynamicAtlasFrame () {
        if (!this._original) return;
        this._rect.x = this._original._x;
        this._rect.y = this._original._y;
        this._texture = this._original._texture;
        this._original = null;
        this._calculateUV();
    }

    public _checkPackable () {
        const dynamicAtlas = dynamicAtlasManager;
        if (!dynamicAtlas) return;
        const texture = this._texture;

        if (!(texture instanceof Texture2D) || texture.isCompressed) {
            this._packable = false;
            return;
        }

        const w = this.width;
        const h = this.height;
        if (!texture.image
            || w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize) {
            this._packable = false;
            return;
        }

        if (texture.image && texture.image instanceof HTMLCanvasElement) {
            this._packable = true;
        }
    }

    // SERIALIZATION
    public _serialize (ctxForExporting: any): any {
        if (EDITOR || TEST) {
            const rect = { x: this._rect.x, y: this._rect.y, width: this._rect.width, height: this._rect.height };
            const offset = { x: this._offset.x, y: this._offset.y };
            const originalSize = this._originalSize;
            let texture;
            if (this._texture) {
                texture = this._texture._uuid;
                if (ctxForExporting) {
                    ctxForExporting.dependsOn('_textureSource', texture);
                }
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

            const serialize = {
                name: this._name,
                atlas: ctxForExporting ? undefined : this._atlasUuid,  // strip from json if exporting
                rect,
                offset,
                originalSize,
                rotated: this._rotated,
                capInsets: this._capInsets,
                vertices,
                texture: (!ctxForExporting && texture) || undefined,
                packable: this._packable,
            };

            // 为 underfined 的数据则不在序列化文件里显示
            return serialize;
        }
        return null;
    }

    public _deserialize (serializeData: any, handle: any) {
        const data = serializeData as ISpriteFramesSerializeData;
        const rect = data.rect;
        if (rect) {
            this._rect = new Rect(rect.x, rect.y, rect.width, rect.height);
        }

        const offset = data.offset;
        if (data.offset) {
            this._offset = new Vec2(offset.x, offset.y);
        }

        const originalSize = data.originalSize;
        if (data.originalSize) {
            this._originalSize = new Size(originalSize.width, originalSize.height);
        }
        this._rotated = !!data.rotated;
        this._name = data.name;
        this._packable = !!data.packable;

        const capInsets = data.capInsets;
        if (capInsets) {
            this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
            this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
            this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
            this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
        }

        if (!BUILD) {
            // manually load texture via _textureSetter
            if (data.texture) {
                handle.result.push(this, '_textureSource', data.texture, js._getClassId(Texture2D));
            }
        }

        if (EDITOR) {
            this._atlasUuid = data.atlas ? data.atlas : '';
        }

        this.vertices = data.vertices;
        if (this.vertices) {
            // initialize normal uv arrays
            this.vertices.nu = [];
            this.vertices.nv = [];
        }
    }

    public clone (): SpriteFrame {
        const sp = new SpriteFrame();
        const v = this.vertices;
        sp.vertices = v ? {
            x: v.x,
            y: v.y,
            triangles: v.triangles, /* need clone ? */
            nu: v.nu?.slice(0),
            u: v.u?.slice(0),
            nv: v.nv?.slice(0),
            v: v.v?.slice(0),
        } : null as any;
        sp.uv.splice(0, sp.uv.length, ...this.uv);
        sp.uvHash = this.uvHash;
        sp.unbiasUV.splice(0, sp.unbiasUV.length, ...this.unbiasUV);
        sp.uvSliced.splice(0, sp.uvSliced.length, ...this.uvSliced);
        sp._rect.set(this._rect);
        sp._offset.set(this._offset);
        sp._originalSize.set(this._originalSize);
        sp._rotated = this._rotated;
        sp._capInsets.splice(0, sp._capInsets.length, ...this._capInsets);
        sp._atlasUuid = this._atlasUuid;
        sp._texture = this._texture;
        sp._isFlipUVX = this._isFlipUVX;
        sp._isFlipUVY = this._isFlipUVY;
        return sp;
    }

    protected _refreshTexture (texture: TextureBase) {
        this._texture = texture;
        const tex = this._texture;
        const config: ISpriteFrameInitInfo = {};
        let isReset = false;
        if (this._rect.width === 0 || this._rect.height === 0 || !this.checkRect(tex)) {
            config.rect = new Rect(0, 0, tex.width, tex.height);
            isReset = true;
        }

        // If original size is not set or rect check failed, we should reset the original size
        if (this._originalSize.width === 0
            || this._originalSize.height === 0
            || isReset
        ) {
            config.originalSize = new Size(tex.width, tex.height);
            isReset = true;
        }

        if (isReset) {
            this.reset(config);
            this.onLoaded();
        }

        this._checkPackable();
    }

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        const texture = new Texture2D();
        texture.initDefault();
        this._refreshTexture(texture);
        this._calculateUV();
    }

    public validate () {
        return this._texture && this._rect && this._rect.width !== 0 && this._rect.height !== 0;
    }

    // macro.UI_GPU_DRIVEN
    private _calculateTillingOffset () {
        if (this._rotated) {
            this.tillingOffset[0] = (this.uv[4] - this.uv[0]);//r-l
            this.tillingOffset[1] = (this.uv[3] - this.uv[5]);//b-t
            this.tillingOffset[2] = (this.uv[0]);//l
            this.tillingOffset[3] = (this.uv[5]);//t
            this.tillingOffset[0] = -this.tillingOffset[0];// For rotation
        } else {
            this.tillingOffset[0] = (this.uv[2] - this.uv[0]);//r-l
            this.tillingOffset[1] = (this.uv[1] - this.uv[5]);//b-t
            this.tillingOffset[2] = (this.uv[4]);//l
            this.tillingOffset[3] = (this.uv[5]);//t
        }
    }

    // macro.UI_GPU_DRIVEN
    private _calculateSlicedData () {
        const rect = this._rect;

        const leftWidth = this._capInsets[INSET_LEFT];
        const rightWidth = this._capInsets[INSET_RIGHT];
        const centerWidth = rect.width - leftWidth - rightWidth;
        const topHeight = this._capInsets[INSET_TOP];
        const bottomHeight = this._capInsets[INSET_BOTTOM];
        const centerHeight = rect.height - topHeight - bottomHeight;

        const uvSliced = this.slicedData;
        uvSliced.length = 0;

        // In the algorithm in the shader, it is always for the renderable region (i.e. after trim, for the sliced point)
        uvSliced[0] = leftWidth / rect.width;
        uvSliced[1] = topHeight / rect.height;
        uvSliced[2] = (leftWidth + centerWidth) / rect.width;
        uvSliced[3] = (topHeight + centerHeight) / rect.height;
    }
}

legacyCC.SpriteFrame = SpriteFrame;
