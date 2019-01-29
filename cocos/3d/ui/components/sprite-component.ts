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
import atlas from '../../../assets/CCSpriteAtlas';
import { SpriteFrame } from '../../../assets/CCSpriteFrame';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { clampf } from '../../../core/utils/misc';
import { Vec2 } from '../../../core/value-types';
import { ccenum } from '../../../core/value-types/enum';
import { UIRenderComponent } from './ui-render-component';
import { Node } from '../../../scene-graph/node';
import { UI } from '../../../renderer/ui/ui';
const EventType = Node.EventType;

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
    TILED =  2,
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
};

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
};

ccenum(FillType);

/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */
// var SizeMode = cc.Enum({
//     /**
//      * !#en Use the customized node size.
//      * !#zh 使用节点预设的尺寸
//      * @property {Number} CUSTOM
//      */
//     CUSTOM: 0,
//     /**
//      * !#en Match the trimmed size of the sprite frame automatically.
//      * !#zh 自动适配为精灵裁剪后的尺寸
//      * @property {Number} TRIMMED
//      */
//     TRIMMED: 1,
//     /**
//      * !#en Match the raw size of the sprite frame automatically.
//      * !#zh 自动适配为精灵原图尺寸
//      * @property {Number} RAW
//      */
//     RAW: 2
// });

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
@menu('UI/Sprite')
@executeInEditMode
export class SpriteComponent extends UIRenderComponent {

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

    set spriteFrame (value: SpriteFrame | null) {
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
    set type(value: SpriteType) {
        if (this._type !== value) {
            this._type = value;
            this._updateAssembler();
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
        if (value !== this._fillType) {
            if (value === FillType.RADIAL || this._fillType === FillType.RADIAL) {
                // this.destroyRenderData(/*this._renderData*/);
                this._renderData = null;
            } else if (this._renderData) {
                this.markForUpdateRenderData(true);
            }
            this._fillType = value;
            this._updateAssembler();
        }
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
    set fillCenter (value: Vec2) {
        this._fillCenter.x = value.x;
        this._fillCenter.y = value.y;
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData(true);
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

    set fillStart (value: number) {
        this._fillStart = clampf(value, -1, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData(true);
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
    set fillRange (value: number) {
        // ??? -1 ~ 1
        // this._fillRange = cc.misc.clampf(value, -1, 1);
        this._fillRange = clampf(value, 0, 1);
        if (this._type === SpriteType.FILLED && this._renderData) {
            this.markForUpdateRenderData(true);
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
    get trim () {
        // return this._isTrimmedMode;
        return false;
    }

    set trim (value: boolean) {
        // if (this._isTrimmedMode !== value) {
        //     this._isTrimmedMode = value;
        //     if ((this._type === SpriteType.SIMPLE || this._type === SpriteType.MESH) &&
        //         this._renderData) {
        //         this.markForUpdateRenderData(true);
        //     }
        // }
        if (this._spriteFrame) {
            this.node.setContentSize(this._spriteFrame.getOriginalSize());
        }
    }

    // /**
    //  * !#en specify the size tracing mode.
    //  * !#zh 精灵尺寸调整模式
    //  * @property sizeMode
    //  * @type {Sprite.SizeMode}
    //  * @example
    //  * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    //  */
    // get sizeMode() {
    //     return this._sizeMode;
    // }
    // set sizeMode(value) {
    //     // this._sizeMode = value;
    //     // if (value !== SizeMode.CUSTOM) {
    //     //     this._applySpriteSize();
    //     // }
    // }

    public static FillType = FillType;
    public static Type = SpriteType;
    @property
    public _spriteFrame: SpriteFrame | null = null;
    @property
    public _type: number = SpriteType.SIMPLE;
    @property
    public _fillType: number = FillType.HORIZONTAL;
    // @property
    // _sizeMode = SizeMode.TRIMMED;
    @property
    public _fillCenter: Vec2 = cc.v2(0, 0);
    @property
    public _fillStart: number = 0;
    @property
    public _fillRange: number = 0;
    // @property
    // _isTrimmedMode = true;
    // _state = 0;
    // TODO:
    @property
    public _atlas: atlas | null = null;
    public _spriteWidget = null;
    // static SizeMode = SizeMode;
    // static State = State;

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

        this._updateAssembler();
        this._activateMaterial();

        // if (!this._spriteFrame) {
        //     this.spriteFrame = cc.builtinResMgr.get('default-spriteframe');
        // }

        this.node.on(EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
        this.node.on(EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
    }

    public updateAssembler (render: UI) {
        if (!this._spriteFrame || !this.material) {
            return;
        }
        super.updateAssembler(render);
    }

    public onDestroy () {
        super.onDestroy();
        this.destroyRenderData();
    }

    public onDisable () {
        // this._super();
        super.onDisable();

        this.node.off(EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
        this.node.off(EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
    }

    public _onNodeSizeDirty () {
        if (!this._renderData) { return; }
        this.markForUpdateRenderData(true);
    }

    public _updateAssembler () {
        const assembler = SpriteComponent.Assembler.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler) {
                this._renderData = this._assembler.createData(this);
                this._renderData.material = this.material;
                this.markForUpdateRenderData(true);
            }
        }
    }

    public _activateMaterial () {
        const spriteFrame = this._spriteFrame;
        let material = this.material;
        // WebGL
        if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // if (!material) {
            //     this.material = cc.builtinResMgr.get('sprite-material');
            //     material = this.material;
            //     if (spriteFrame && spriteFrame.textureLoaded()) {
            //         material!.setProperty('u_texSampler', spriteFrame);
            //         this.markForUpdateRenderData(true);
            //     }
            // }
            // TODO:
            // else {
                if (spriteFrame && spriteFrame.textureLoaded()) {
                    if (material){
                        // const matTexture = material.getProperty('u_texSampler');
                        // if (matTexture !== spriteFrame) {
                            material.setProperty('u_texSampler', spriteFrame);
                            this.markForUpdateRenderData(true);
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

    public _applyAtlas (spriteFrame: SpriteFrame | null) {
        if (!CC_EDITOR) {
            return;
        }
        // Set atlas
        if (spriteFrame && spriteFrame.atlasUuid) {
            const self = this;
            cc.AssetLibrary.loadAsset(spriteFrame.atlasUuid, (err, asset) => {
                self._atlas = asset;
            });
        } else {
            this._atlas = null;
        }
    }

    public _canRender () {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            if (!this._enabled) { return false; }
        } else {
            if (!this._enabled || !this.material) { return false; }
        }

        const spriteFrame = this._spriteFrame;
        if (!spriteFrame || !spriteFrame.textureLoaded()) {
            return false;
        }
        return true;
    }

    public markForUpdateRenderData (enable: boolean) {
        if (enable /*&& this._canRender()*/) {
            // this.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

            const renderData = this._renderData;
            if (renderData) {
                renderData.uvDirty = true;
                renderData.vertDirty = true;
            }
        }
        // else if (!enable) {
        //     this.node._renderFlag &= ~RenderFlow.FLAG_UPDATE_RENDER_DATA;
        // }
    }

    // _applySpriteSize() {
    //     if (this._spriteFrame) {
    //         if (SizeMode.RAW === this._sizeMode) {
    //             var size = this._spriteFrame.getOriginalSize();
    //             this.node.setContentSize(size);
    //         } else if (SizeMode.TRIMMED === this._sizeMode) {
    //             var rect = this._spriteFrame.getRect();
    //             this.node.setContentSize(rect.width, rect.height);
    //         }

    //         this._activateMaterial();
    //     }
    // }

    // _onTextureLoaded() {
    //     if (!this.isValid) {
    //         return;
    //     }

    //     this._applySpriteSize();
    // }

    public _applySpriteFrame (oldFrame: SpriteFrame | null) {
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
                // this.material.setProperty('mainTexture', spriteFrame);
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

    // _resized() {
    //     if (!CC_EDITOR) {
    //         return;
    //     }

    //     if (this._spriteFrame) {
    //         var actualSize = this.node.getContentSize();
    //         var expectedW = actualSize.width;
    //         var expectedH = actualSize.height;
    //         if (this._sizeMode === SizeMode.RAW) {
    //             var size = this._spriteFrame.getOriginalSize();
    //             expectedW = size.width;
    //             expectedH = size.height;
    //         } else if (this._sizeMode === SizeMode.TRIMMED) {
    //             var rect = this._spriteFrame.getRect();
    //             expectedW = rect.width;
    //             expectedH = rect.height;

    //         }

    //         if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
    //             this._sizeMode = SizeMode.CUSTOM;
    //         }
    //     }
    // }
}

// if (CC_EDITOR) {
//     // override __preload
//     Sprite.prototype.__superPreload = cc.Component.prototype.__preload;
//     Sprite.prototype.__preload = function () {
//         if (this.__superPreload) this.__superPreload();
//         this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
//     };
//     // override onDestroy
//     Sprite.prototype.__superOnDestroy = cc.Component.prototype.onDestroy;
//     Sprite.prototype.onDestroy = function () {
//         if (this.__superOnDestroy) this.__superOnDestroy();
//         this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
//     };
// }

// cc.Sprite = module.exports = Sprite;
