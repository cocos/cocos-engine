/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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
 * @module ui
 */

import { ccclass, help, executionOrder, menu, tooltip, displayOrder, type, range, editable, serializable, visible, override, displayName } from 'cc.decorator';
import { EDITOR, UI_GPU_DRIVEN } from 'internal:constants';
import { SpriteAtlas } from '../assets/sprite-atlas';
import { SpriteFrame } from '../assets/sprite-frame';
import { Vec2, Vec4 } from '../../core/math';
import { ccenum } from '../../core/value-types/enum';
import { clamp } from '../../core/math/utils';
import { IBatcher } from '../renderer/i-batcher';
import { Renderable2D, InstanceMaterialType } from '../framework/renderable-2d';
import { legacyCC } from '../../core/global-exports';
import { PixelFormat } from '../../core/assets/asset-enum';
import { TextureBase } from '../../core/assets/texture-base';
import { director, Material, RenderTexture } from '../../core';
import { NodeEventType } from '../../core/scene-graph/node-event';

/**
 * @en
 * Enum for sprite type.
 *
 * @zh
 * Sprite 类型。
 */
export enum SpriteType {
    /**
     * @en
     * The simple type.
     *
     * @zh
     * 普通类型。
     */
    SIMPLE = 0,
    /**
     * @en
     * The sliced type.
     *
     * @zh
     * 切片（九宫格）类型。
     */
    SLICED = 1,
    /**
     * @en
     * The tiled type.
     *
     * @zh  平铺类型
     */
    TILED =  2,
    /**
     * @en
     * The filled type.
     *
     * @zh
     * 填充类型。
     */
    FILLED = 3,
    // /**
    //  * @en The mesh type.
    //  * @zh  以 Mesh 三角形组成的类型
    //  */
    // MESH: 4
}

ccenum(SpriteType);

/**
 * @en
 * Enum for fill type.
 *
 * @zh
 * 填充类型。
 */
enum FillType {
    /**
     * @en
     * The horizontal fill.
     *
     * @zh
     * 水平方向填充。
     */
    HORIZONTAL = 0,
    /**
     * @en
     * The vertical fill.
     *
     * @zh
     * 垂直方向填充。
     */
    VERTICAL = 1,
    /**
     * @en
     * The radial fill.
     *
     * @zh  径向填充
     */
    RADIAL = 2,
}

ccenum(FillType);

/**
 * @en
 * Sprite Size can track trimmed size, raw size or none.
 *
 * @zh
 * 精灵尺寸调整模式。
 */
enum SizeMode {
    /**
     * @en
     * Use the customized node size.
     *
     * @zh
     * 使用节点预设的尺寸。
     */
    CUSTOM = 0,
    /**
     * @en
     * Match the trimmed size of the sprite frame automatically.
     *
     * @zh
     * 自动适配为精灵裁剪后的尺寸。
     */
    TRIMMED = 1,
    /**
     * @en
     * Match the raw size of the sprite frame automatically.
     *
     * @zh
     * 自动适配为精灵原图尺寸。
     */
    RAW = 2,
}

ccenum(SizeMode);

enum EventType {
    SPRITE_FRAME_CHANGED = 'spriteframe-changed',
}

/**
 * @en
 * Renders a sprite in the scene.
 *
 * @zh
 * 渲染精灵组件。
 */
@ccclass('cc.Sprite')
@help('i18n:cc.Sprite')
@executionOrder(110)
@menu('2D/Sprite')
export class Sprite extends Renderable2D {
    /**
     * @en The customMaterial
     * @zh 用户自定材质
     */
    @type(Material)
    @displayOrder(0)
    @displayName('CustomMaterial')
    @override
    get customMaterial () {
        return this._customMaterial;
    }

    set customMaterial (val) {
        this._customMaterial = val;
        this.updateMaterial();
        if (UI_GPU_DRIVEN && !val) {
            this._canDrawByFourVertex = true;
        }
    }
    /**
     * @en
     * The sprite atlas where the sprite is.
     *
     * @zh
     * 精灵的图集。
     */
    @type(SpriteAtlas)
    @displayOrder(4)
    @tooltip('i18n:sprite.atlas')
    get spriteAtlas () {
        return this._atlas;
    }

    set spriteAtlas (value) {
        if (this._atlas === value) {
            return;
        }

        this._atlas = value;
        //        this.spriteFrame = null;
    }

    /**
     * @en
     * The sprite frame of the sprite.
     *
     * @zh
     * 精灵的精灵帧。
     */
    @type(SpriteFrame)
    @displayOrder(5)
    @tooltip('i18n:sprite.sprite_frame')
    get spriteFrame () {
        return this._spriteFrame;
    }

    set spriteFrame (value) {
        if (this._spriteFrame === value) {
            return;
        }

        const lastSprite = this._spriteFrame;
        this._spriteFrame = value;
        // render & update render data flag will be triggered while applying new sprite frame
        this.markForUpdateRenderData(false);
        this._applySpriteFrame(lastSprite);
        if (EDITOR) {
            this.node.emit(EventType.SPRITE_FRAME_CHANGED, this);
        }
    }

    /**
     * @en
     * The sprite render type.
     *
     * @zh
     * 精灵渲染类型。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.type = Sprite.Type.SIMPLE;
     * ```
     */
    @type(SpriteType)
    @displayOrder(6)
    @tooltip('i18n:sprite.type')
    get type () {
        return this._type;
    }
    set type (value: SpriteType) {
        if (this._type !== value) {
            this._type = value;
            this._flushAssembler();
        }
    }

    /**
     * @en
     * The fill type, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 精灵填充类型，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.fillType = Sprite.FillType.HORIZONTAL;
     * ```
     */
    @type(FillType)
    @tooltip('i18n:sprite.fill_type')
    get fillType () {
        return this._fillType;
    }
    set fillType (value: FillType) {
        if (this._fillType !== value) {
            if (value === FillType.RADIAL || this._fillType === FillType.RADIAL) {
                this.destroyRenderData();
                this._renderData = null;
            } else if (this._renderData) {
                this.markForUpdateRenderData(true);
            }
        }

        this._fillType = value;
        this._flushAssembler();
    }

    /**
     * @en
     * The fill Center, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充中心点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * import { Vec2 } from 'cc';
     * sprite.fillCenter = new Vec2(0, 0);
     * ```
     */
    @tooltip('i18n:sprite.fill_center')
    get fillCenter () {
        return this._fillCenter;
    }
    set fillCenter (value) {
        this._fillCenter.x = value.x;
        this._fillCenter.y = value.y;
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData();
        }
    }

    /**
     * @en
     * The fill Start, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充起始点，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * // -1 To 1 between the numbers
     * sprite.fillStart = 0.5;
     * ```
     */
    @range([0, 1, 0.1])
    @tooltip('i18n:sprite.fill_start')
    get fillStart () {
        return this._fillStart;
    }

    set fillStart (value) {
        this._fillStart = clamp(value, 0, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData();
            this._renderData.uvDirty = true;
        }
    }

    /**
     * @en
     * The fill Range, This will only have any effect if the "type" is set to “Sprite.Type.FILLED”.
     *
     * @zh
     * 填充范围，仅渲染类型设置为 Sprite.Type.FILLED 时有效。
     *
     * @example
     * ```ts
     * // -1 To 1 between the numbers
     * sprite.fillRange = 1;
     * ```
     */
    @range([-1, 1, 0.1])
    @tooltip('i18n:sprite.fill_range')
    get fillRange () {
        return this._fillRange;
    }
    set fillRange (value) {
        // positive: counterclockwise, negative: clockwise
        this._fillRange = clamp(value, -1, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData();
            this._renderData.uvDirty = true;
        }
    }
    /**
     * @en
     * specify the frame is trimmed or not.
     *
     * @zh
     * 是否使用裁剪模式。
     *
     * @example
     * ```ts
     * sprite.trim = true;
     * ```
     */
    @visible(function (this: Sprite) {
        return this._type === SpriteType.SIMPLE;
    })
    @displayOrder(8)
    @tooltip('i18n:sprite.trim')
    get trim () {
        return this._isTrimmedMode;
    }

    set trim (value) {
        if (this._isTrimmedMode === value) {
            return;
        }

        this._isTrimmedMode = value;
        if ((this._type === SpriteType.SIMPLE /* || this._type === SpriteType.MESH */)
            && this._renderData) {
            this.markForUpdateRenderData(true);
        }
        if (UI_GPU_DRIVEN && this._canDrawByFourVertex) {
            this._updateUVWithTrim();
        }
    }

    @editable
    @tooltip('i18n:sprite.gray_scale')
    get grayscale () {
        return this._useGrayscale;
    }
    set grayscale (value) {
        if (this._useGrayscale === value) {
            return;
        }
        this._useGrayscale = value;
        if (value === true) {
            this._instanceMaterialType = InstanceMaterialType.GRAYSCALE;
        } else {
            this._instanceMaterialType = InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
        }
        this.updateMaterial();
    }

    /**
     * @en
     * Specify the size tracing mode.
     *
     * @zh
     * 精灵尺寸调整模式。
     *
     * @example
     * ```ts
     * import { Sprite } from 'cc';
     * sprite.sizeMode = Sprite.SizeMode.CUSTOM;
     * ```
     */
    @type(SizeMode)
    @displayOrder(7)
    @tooltip('i18n:sprite.size_mode')
    get sizeMode () {
        return this._sizeMode;
    }
    set sizeMode (value) {
        if (this._sizeMode === value) {
            return;
        }

        this._sizeMode = value;
        if (value !== SizeMode.CUSTOM) {
            this._applySpriteSize();
        }
    }

    public static FillType = FillType;
    public static Type = SpriteType;
    public static SizeMode = SizeMode;
    public static EventType = EventType;

    @serializable
    protected _spriteFrame: SpriteFrame | null = null;
    @serializable
    protected _type = SpriteType.SIMPLE;
    @serializable
    protected _fillType = FillType.HORIZONTAL;
    @serializable
    protected _sizeMode = SizeMode.TRIMMED;
    @serializable
    protected _fillCenter: Vec2 = new Vec2(0, 0);
    @serializable
    protected _fillStart = 0;
    @serializable
    protected _fillRange = 0;
    @serializable
    protected _isTrimmedMode = true;
    @serializable
    protected _useGrayscale = false;
    // _state = 0;
    @serializable
    protected _atlas: SpriteAtlas | null = null;
    // static State = State;

    // macro.UI_GPU_DRIVEN
    public declare tillingOffsetWithTrim: number[];

    constructor () {
        super();
        if (UI_GPU_DRIVEN) {
            this._canDrawByFourVertex = true;
        }
    }

    public __preload () {
        this.changeMaterialForDefine();

        super.__preload();

        if (EDITOR) {
            this._resized();
            this.node.on(NodeEventType.SIZE_CHANGED, this._resized, this);
        }
    }

    // /**
    //  * Change the state of sprite.
    //  * @method setState
    //  * @see `Sprite.State`
    //  * @param state {Sprite.State} NORMAL or GRAY State.
    //  */
    // getState() {
    //     return this._state;
    // }

    // setState(state) {
    //     if (this._state === state) return;
    //     this._state = state;
    //     this._activateMaterial();
    // }

    // onLoad() {}

    public onEnable () {
        super.onEnable();

        // this._flushAssembler();
        this._activateMaterial();
        this._markForUpdateUvDirty();
        if (UI_GPU_DRIVEN) {
            this.tillingOffsetWithTrim = [];
        }
    }

    public onDestroy () {
        this.destroyRenderData();
        if (EDITOR) {
            this.node.off(NodeEventType.SIZE_CHANGED, this._resized, this);
        }
        super.onDestroy();
    }

    /**
     * @en
     * Quickly switch to other sprite frame in the sprite atlas.
     * If there is no atlas, the switch fails.
     *
     * @zh
     * 精灵图集内的精灵替换
     *
     * @returns
     */
    public changeSpriteFrameFromAtlas (name: string) {
        if (!this._atlas) {
            console.warn('SpriteAtlas is null.');
            return;
        }
        const sprite = this._atlas.getSpriteFrame(name);
        this.spriteFrame = sprite;
    }

    public changeMaterialForDefine () {
        let texture;
        const lastInstanceMaterialType = this._instanceMaterialType;
        if (this._spriteFrame) {
            texture = this._spriteFrame.texture;
        }
        let value = false;
        if (texture instanceof TextureBase) {
            const format = texture.getPixelFormat();
            value = (format === PixelFormat.RGBA_ETC1 || format === PixelFormat.RGB_A_PVRTC_4BPPV1 || format === PixelFormat.RGB_A_PVRTC_2BPPV1);
        }

        if (value && this.grayscale) {
            this._instanceMaterialType = InstanceMaterialType.USE_ALPHA_SEPARATED_AND_GRAY;
        } else if (value) {
            this._instanceMaterialType = InstanceMaterialType.USE_ALPHA_SEPARATED;
        } else if (this.grayscale) {
            this._instanceMaterialType = InstanceMaterialType.GRAYSCALE;
        } else {
            this._instanceMaterialType = InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
        }
        if (lastInstanceMaterialType !== this._instanceMaterialType) {
            this.updateMaterial();
        }
    }

    protected _updateBuiltinMaterial () {
        let mat = super._updateBuiltinMaterial();
        if (this.spriteFrame && this.spriteFrame.texture instanceof RenderTexture) {
            const defines = { SAMPLE_FROM_RT: true, ...mat.passes[0].defines };
            const renderMat = new Material();
            renderMat.initialize({
                effectAsset: mat.effectAsset,
                defines,
            });
            mat = renderMat;
        }
        return mat;
    }

    protected _render (render: IBatcher) {
        render.commitComp(this, this._spriteFrame, this._assembler!, null);
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        const spriteFrame = this._spriteFrame;
        if (!spriteFrame || !spriteFrame.texture) {
            return false;
        }

        return true;
    }

    protected _flushAssembler () {
        // macro.UI_GPU_DRIVEN
        const assembler = Sprite.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                if (this._assembler.createBuffer) {
                    this._assembler.createBuffer(this, director.root!.batcher2D);
                }
                this._renderData!.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                this._colorDirty = true;
                this._updateColor();
            }
        }
    }

    private _applySpriteSize () {
        if (this._spriteFrame) {
            if (!this._spriteFrame.isDefault) {
                if (SizeMode.RAW === this._sizeMode) {
                    const size = this._spriteFrame.originalSize;
                    this.node._uiProps.uiTransformComp!.setContentSize(size);
                } else if (SizeMode.TRIMMED === this._sizeMode) {
                    const rect = this._spriteFrame.getRect();
                    this.node._uiProps.uiTransformComp!.setContentSize(rect.width, rect.height);
                }
            }

            this._activateMaterial();
        }
    }

    private _resized () {
        if (!EDITOR) {
            return;
        }

        if (this._spriteFrame) {
            const actualSize = this.node._uiProps.uiTransformComp!.contentSize;
            let expectedW = actualSize.width;
            let expectedH = actualSize.height;
            if (this._sizeMode === SizeMode.RAW) {
                const size = this._spriteFrame.getOriginalSize();
                expectedW = size.width;
                expectedH = size.height;
            } else if (this._sizeMode === SizeMode.TRIMMED) {
                const rect = this._spriteFrame.getRect();
                expectedW = rect.width;
                expectedH = rect.height;
            }

            if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
                this._sizeMode = SizeMode.CUSTOM;
            }
        }
    }

    private _activateMaterial () {
        const spriteFrame = this._spriteFrame;
        const material = this.getRenderMaterial(0);
        if (spriteFrame) {
            if (material) {
                this.markForUpdateRenderData();
            }
        }

        if (this._renderData) {
            this._renderData.material = material;
        }
    }

    private _applySpriteFrame (oldFrame: SpriteFrame | null) {
        const spriteFrame = this._spriteFrame;

        if (this._renderData) {
            if (!this._renderData.uvDirty) {
                if (oldFrame && spriteFrame) {
                    this._renderData.uvDirty = oldFrame.uvHash !== spriteFrame.uvHash;
                } else {
                    this._renderData.uvDirty = true;
                }
            }

            this._renderDataFlag = this._renderData.uvDirty;
        }

        let textureChanged = false;
        if (spriteFrame) {
            if (!oldFrame || oldFrame.texture !== spriteFrame.texture) {
                textureChanged = true;
            }
            if (textureChanged) {
                if (this._renderData) this._renderData.textureDirty = true;
                this.changeMaterialForDefine();
            }
            this._applySpriteSize();
        }
        /*
        if (EDITOR) {
            // Set atlas
            this._applyAtlas(spriteFrame);
        }
*/
    }

    /**
     * 强制刷新 uv。
     */
    private _markForUpdateUvDirty () {
        if (this._renderData) {
            this._renderData.uvDirty = true;
            this._renderDataFlag = true;
        }
    }

    // macro.UI_GPU_DRIVEN
    public _calculateSlicedData (out: number[]) {
        const content = this.node._uiProps.uiTransformComp!.contentSize;

        const spriteWidth = content.width;
        const spriteHeight = content.height;
        const leftWidth = this.spriteFrame!.insetLeft;
        const rightWidth = this.spriteFrame!.insetRight;
        const centerWidth = spriteWidth - leftWidth - rightWidth;
        const topHeight = this.spriteFrame!.insetTop;
        const bottomHeight = this.spriteFrame!.insetBottom;
        const centerHeight = spriteHeight - topHeight - bottomHeight;

        out.length = 0;
        out[0] = (leftWidth) / spriteWidth;
        out[1] = (topHeight) / spriteHeight;
        out[2] = (leftWidth + centerWidth) / spriteWidth;
        out[3] = (topHeight + centerHeight) / spriteHeight;
        return out;
    }

    // macro.UI_GPU_DRIVEN
    public calculateTiledData (out: Vec4) {
        const content = this.node._uiProps.uiTransformComp!.contentSize;
        const rect = this.spriteFrame!.rect;

        out.x = content.width / rect.width;
        out.y = content.height / rect.height;
    }

    // macro.UI_GPU_DRIVEN
    public _updateUVWithTrim () {
        this.tillingOffsetWithTrim.length = 0;
        const frame = this.spriteFrame!;
        const originSize = frame.originalSize;
        const rect = frame.rect;
        const tex = frame.texture;
        const texw = tex.width;
        const texh = tex.height;
        let x = 0;
        let y = 0;
        if (frame.original) {
            x = rect.x - frame.original._x;
            y = rect.y - frame.original._y;
        }
        let l = texw === 0 ? 0 : x / texw;
        let r = texw === 0 ? 1 : (x + originSize.width) / texw;
        let b = texh === 0 ? 1 : (y + originSize.height) / texh;
        let t = texh === 0 ? 0 : y / texh;
        if (frame.rotated) {
            l = texw === 0 ? 0 : x / texw;
            r = texw === 0 ? 1 : (x + originSize.height) / texw;
            t = texh === 0 ? 0 : y / texh;
            b = texh === 0 ? 1 : (y + originSize.width) / texh;
        }
        this.tillingOffsetWithTrim[0] = r - l;//r-l
        this.tillingOffsetWithTrim[1] = b - t;//b-t
        this.tillingOffsetWithTrim[2] = l;//l
        this.tillingOffsetWithTrim[3] = t;//t
        if (frame.rotated) {
            this.tillingOffsetWithTrim[0] = -this.tillingOffsetWithTrim[0];
        }
    }
}
