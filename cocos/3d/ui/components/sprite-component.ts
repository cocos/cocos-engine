/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
// @ts-check
import { SpriteFrame } from '../../../assets/CCSpriteFrame';
import { SpriteAtlas } from '../../../assets/sprite-atlas';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { EventType } from '../../../core/platform/event-manager/event-enum';
import { clampf } from '../../../core/utils/misc';
import { Vec2 } from '../../../core/value-types';
import { ccenum } from '../../../core/value-types/enum';
import { UI } from '../../../renderer/ui/ui';
import { InstanceMaterialType, UIRenderComponent } from './ui-render-component';

/**
 * !#en Enum for sprite type.
 * !#zh Sprite 类型
 * @enum Sprite.Type
 */
enum SpriteType {
    /**
     * !#en The simple type.
     * !#zh 普通类型
     * @property {Number} SIMPLE
     */
    SIMPLE = 0,
    /**
     * !#en The sliced type.
     * !#zh 切片（九宫格）类型
     * @property {Number} SLICED
     */
    SLICED = 1,
    // /**
    //  * !#en The tiled type.
    //  * !#zh 平铺类型
    //  * @property {Number} TILED
    //  */
    // TILED =  2,
    /**
     * !#en The filled type.
     * !#zh 填充类型
     * @property {Number} FILLED
     */
    FILLED = 3,
    // /**
    //  * !#en The mesh type.
    //  * !#zh 以 Mesh 三角形组成的类型
    //  * @property {Number} MESH
    //  */
    // MESH: 4
}

ccenum(SpriteType);

/**
 * !#en Enum for fill type.
 * !#zh 填充类型
 * @enum Sprite.FillType
 */
enum FillType {
    /**
     * !#en The horizontal fill.
     * !#zh 水平方向填充
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL = 0,
    /**
     * !#en The vertical fill.
     * !#zh 垂直方向填充
     * @property {Number} VERTICAL
     */
    VERTICAL = 1,
    // /**
    //  * !#en The radial fill.
    //  * !#zh 径向填充
    //  * @property {Number} RADIAL
    //  */
    RADIAL = 2,
}

ccenum(FillType);

/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */
enum SizeMode {
    /**
     * !#en Use the customized node size.
     * !#zh 使用节点预设的尺寸
     * @property {Number} CUSTOM
     */
    CUSTOM = 0,
    /**
     * !#en Match the trimmed size of the sprite frame automatically.
     * !#zh 自动适配为精灵裁剪后的尺寸
     * @property {Number} TRIMMED
     */
    TRIMMED = 1,
    /**
     * !#en Match the raw size of the sprite frame automatically.
     * !#zh 自动适配为精灵原图尺寸
     * @property {Number} RAW
     */
    RAW = 2,
}

ccenum(SizeMode);

// var State = cc.Enum({
//     /**
//      * !#en The normal state
//      * !#zh 正常状态
//      * @property {Number} NORMAL
//      */
//     NORMAL: 0,
//     /**
//      * !#en The gray state, all color will be modified to grayscale value.
//      * !#zh 灰色状态，所有颜色会被转换成灰度值
//      * @property {Number} GRAY
//      */
//     GRAY: 1
// });

@ccclass('cc.SpriteComponent')
@executionOrder(100)
@menu('UI/Render/Sprite')
export class SpriteComponent extends UIRenderComponent {

    /**
     * !#en The atlas of the sprite.
     * !#zh 精灵的图集
     * @return {SpriteAtlas}
     */
    @property({
        type: SpriteAtlas,
    })
    get spriteAtlas () {
        return this._atlas;
    }

    set spriteAtlas (value) {
        if (this._atlas === value) {
            return;
        }

        this._atlas = value;
        this.spriteFrame = null;
    }

    /**
     * !#en The sprite frame of the sprite.
     * !#zh 精灵的精灵帧
     * @return {SpriteFrame}
     */
    @property({
        type: SpriteFrame,
    })
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
        if (CC_EDITOR) {
            // @ts-ignore
            this.node.emit('spriteframe-changed', this);
        }
    }

    /**
     * !#en The sprite render type.
     * !#zh 精灵渲染类型
     * @property type
     * @type {SpriteType}
     * @example
     * sprite.type = cc.Sprite.Type.SIMPLE;
     */
    @property({
        type: SpriteType,
    })
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
     * !#en
     * The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 精灵填充类型，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillType
     * @type {FillType}
     * @example
     * sprite.fillType = SpriteComponent.FillType.HORIZONTAL;
     */
    @property({
        type: FillType,
    })
    get fillType () {
        return this._fillType;
    }
    set fillType (value: FillType) {
        if (this._fillType !== value) {
            if (value === FillType.RADIAL || this._fillType === FillType.RADIAL) {
                this.destroyRenderData();
                this._renderData = null;
            } else {
                if (this._renderData) {
                    this.markForUpdateRenderData(true);
                }
            }
        }

        this._fillType = value;
        this._flushAssembler();
    }

    /**
     * !#en
     * The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充中心点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillCenter
     * @type {Vec2}
     * @example
     * sprite.fillCenter = new cc.v2(0, 0);
     */
    @property
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
     * !#en
     * The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充起始点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillStart
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillStart = 0.5;
     */
    @property
    get fillStart () {
        return this._fillStart;
    }

    set fillStart (value) {
        this._fillStart = clampf(value, -1, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData();
        }
    }

    /**
     * !#en
     * The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充范围，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillRange
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillRange = 1;
     */
    @property
    get fillRange () {
        return this._fillRange;
    }
    set fillRange (value) {
        // ??? -1 ~ 1
        // this._fillRange = cc.misc.clampf(value, -1, 1);
        this._fillRange = clampf(value, 0, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData();
        }
    }
    /**
     * !#en specify the frame is trimmed or not.
     * !#zh 是否使用裁剪模式
     * @property trim
     * @type {Boolean}
     * @example
     * sprite.trim = true;
     */
    @property
    get trim () {
        return this._isTrimmedMode;
    }

    set trim (value) {
        if (this._isTrimmedMode === value) {
            return;
        }

        this._isTrimmedMode = value;
        if ((this._type === SpriteType.SIMPLE /*|| this._type === SpriteType.MESH*/) &&
            this._renderData) {
            this.markForUpdateRenderData(true);
        }
    }

    /**
     * !#en specify the size tracing mode.
     * !#zh 精灵尺寸调整模式
     * @property sizeMode
     * @type {Sprite.SizeMode}
     * @example
     * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
     */
    @property({
        type: SizeMode,
    })
    get sizeMode () {
        return this._sizeMode;
    }
    set sizeMode (value) {
        if (this._sizeMode === value){
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
    @property
    private _spriteFrame: SpriteFrame | null = null;
    @property
    private _type = SpriteType.SIMPLE;
    @property
    private _fillType = FillType.HORIZONTAL;
    @property
    private _sizeMode = SizeMode.TRIMMED;
    @property
    private _fillCenter: Vec2 = new Vec2(0, 0);
    @property
    private _fillStart = 0;
    @property
    private _fillRange = 0;
    @property
    private _isTrimmedMode = true;
    // _state = 0;
    @property
    private _atlas: SpriteAtlas | null = null;
    // static State = State;

    public __preload () {
        if (super.__preload) {
            super.__preload();
        }

        if (CC_EDITOR) {
            this.node.on(EventType.SIZE_CHANGED, this._resized, this);
        }
    }

    // /**
    //  * Change the state of sprite.
    //  * @method setState
    //  * @see `SpriteComponent.State`
    //  * @param state {SpriteComponent.State} NORMAL or GRAY State.
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
        if (this._spriteFrame) {
            if (!this._spriteFrame.textureLoaded()) {
                // this._spriteFrame.once('load', this._onTextureLoaded, this);
                this._spriteFrame.ensureLoadTexture();
            }
        }

        this._flushAssembler();
        this._activateMaterial();
    }

    public updateAssembler (render: UI) {
        if (super.updateAssembler(render) && this._spriteFrame) {
            render.commitComp(this, this._spriteFrame, this._assembler!);
            return true;
        }

        return false;
    }

    public onDestroy () {
        super.onDestroy();
        this.destroyRenderData();
        if (CC_EDITOR) {
            this.node.off(EventType.SIZE_CHANGED, this._resized, this);
        }
    }

    public _applySpriteSize () {
        if (this._spriteFrame) {
            if (SizeMode.RAW === this._sizeMode) {
                const size = this._spriteFrame.getOriginalSize();
                this.node.setContentSize(size);
            } else if (SizeMode.TRIMMED === this._sizeMode) {
                const rect = this._spriteFrame.getRect();
                this.node.setContentSize(rect.width, rect.height);
            }

            this._activateMaterial();
        }
    }

    public _resized () {
        if (!CC_EDITOR) {
            return;
        }

        if (this._spriteFrame) {
            const actualSize = this.node.getContentSize();
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

    protected _canRender () {
        // if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        //     if (!this._enabled) { return false; }
        // } else {
        //     if (!this._enabled || !this._material) { return false; }
        // }

        // const spriteFrame = this._spriteFrame;
        // if (!spriteFrame || !spriteFrame.textureLoaded()) {
        //     return false;
        // }
        // return true;
        if (!super._canRender()){
            return false;
        }

        const spriteFrame = this._spriteFrame;
        if (!spriteFrame || !spriteFrame.textureLoaded()) {
            return false;
        }

        return true;
    }

    protected _flushAssembler () {
        const assembler = SpriteComponent.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this._material;
                this.markForUpdateRenderData();
            }
        }
    }

    private _activateMaterial () {
        const spriteFrame = this._spriteFrame;
        const material = this._material;
        // WebGL
        if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // if (!material) {
            //     this._material = cc.builtinResMgr.get('sprite-material');
            //     material = this._material;
            //     if (spriteFrame && spriteFrame.textureLoaded()) {
            //         material!.setProperty('mainTexture', spriteFrame);
            //         this.markForUpdateRenderData();
            //     }
            // }
            // TODO: use editor assets
            // else {
            if (spriteFrame && spriteFrame.textureLoaded()) {
                if (material) {
                    // const matTexture = material.getProperty('mainTexture');
                    // if (matTexture !== spriteFrame) {
                    material.setProperty('mainTexture', spriteFrame);
                    this.markForUpdateRenderData();
                    // }
                }

            }
            // }

            if (this._renderData) {
                this._renderData.material = material;
            }
        } else {
            this.markForUpdateRenderData(true);
            // this.markForRender(true);
        }
    }

    private _applyAtlas (spriteFrame: SpriteFrame | null) {
        if (!CC_EDITOR) {
            return;
        }
        // Set atlas
        if (spriteFrame) {
            if (spriteFrame.atlasUuid.length > 0) {
                if (!this._atlas || this._atlas._uuid !== spriteFrame.atlasUuid) {
                    const self = this;
                    cc.AssetLibrary.loadAsset(spriteFrame.atlasUuid, (err, asset) => {
                        self._atlas = asset;
                    });
                }
            }else{
                this._atlas = null;
            }
        }
    }

    // _onTextureLoaded() {
    //     if (!this.isValid) {
    //         return;
    //     }

    //     this._applySpriteSize();
    // }

    private _applySpriteFrame (oldFrame: SpriteFrame | null) {
        // if (oldFrame && oldFrame.off) {
        //     oldFrame.off('load', this._onTextureLoaded, this);
        // }

        const spriteFrame = this._spriteFrame;
        // if (!spriteFrame || (this._material && this._material._texture) !== (spriteFrame && spriteFrame._texture)) {
        //     // disable render flow until texture is loaded
        //     this.markForRender(false);
        // }

        if (spriteFrame) {
            if (!oldFrame || spriteFrame !== oldFrame) {
                // this._material.setProperty('mainTexture', spriteFrame);
                if (spriteFrame.textureLoaded()) {
                    // this._onTextureLoaded();
                    this._activateMaterial();
                } else {
                    // spriteFrame.once('load', this._onTextureLoaded, this);
                    spriteFrame.ensureLoadTexture();
                }
            }
            // else {
            //     this._applySpriteSize();
            // }
        }

        if (CC_EDITOR) {
            // Set atlas
            this._applyAtlas(spriteFrame);
        }
    }
}

cc.SpriteComponent = SpriteComponent;
