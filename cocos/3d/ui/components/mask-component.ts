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
// import {SpriteFrame} from '../../../assets/CCSpriteFrame';
import { ccclass/*, executeInEditMode*/, executionOrder,
    menu/*, property*/ } from '../../../core/data/class-decorator';
// import { ccenum } from '../../../core/value-types/enum';
// import { clamp } from '../../../core/vmath';
import { EventType } from '../../../core/platform/event-manager/event-enum';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets/material';
import { RenderableComponent } from '../../framework/renderable-component';
// import circle from '../../primitive/circle';
import { IGeometry } from '../../primitive/define';
import quad from '../../primitive/quad';
import { scale, translate } from '../../primitive/transform';
import { UIRenderComponent } from './ui-render-component';
import { UITransformComponent } from './ui-transfrom-component';

// /**
//  * !#en the type for mask.
//  * !#zh 遮罩组件类型
//  */
// export enum MaskType {
//     /**
//      * !#en Rect mask.
//      * !#zh 使用矩形作为遮罩
//      */
//     RECT = 0,

//     /**
//      * !#en Ellipse Mask.
//      * !#zh 使用椭圆作为遮罩
//      */
//     ELLIPSE = 1,

//     /**
//      * !#en Image Stencil Mask.
//      * !#zh 使用图像模版作为遮罩
//      */
//     IMAGE_STENCIL = 2,
// }

// ccenum(MaskType);

const SEGEMENTS_MIN = 3;
const SEGEMENTS_MAX = 10000;

/**
 * !#en The Mask Component.
 * !#zh 遮罩组件。
 */
@ccclass('cc.MaskComponent')
@executionOrder(100)
@menu('UI/Mask')
export class MaskComponent extends UIRenderComponent {
    // public static Type = MaskType;

    // /**
    //  * !#en The mask type.
    //  * !#zh 遮罩类型。
    //  */
    // @property({
    //     type: MaskType
    // })
    // get type () {
    //     return this._type;
    // }

    // set type(value: MaskType) {
    //     this._type = value;
    //     if (this._type !== MaskType.IMAGE_STENCIL) {
    //         this.spriteFrame = null;
    //         this.alphaThreshold = 0;
    //         this._updateGraphics();
    //     }
    //     if (this._renderData) {
    //         this.destroyRenderData();
    //         this._renderData = null;
    //     }
    //     this._activateMaterial();
    // }

    // /**
    //  * !#en The mask image
    //  * !#zh 遮罩所需要的贴图
    //  */
    // @property({
    //     type: SpriteFrame
    // })
    // get spriteFrame () {
    //     return this._spriteFrame;
    // }

    // set spriteFrame (value: SpriteFrame | null) {
    //     if (this._spriteFrame === value) {
    //         return;
    //     }
    //     this._applySpriteFrame(value);
    // }

    /**
     * !#en
     * The alpha threshold.(Not supported in Canvas Mode) <br/>
     * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
     * Should be a float between 0 and 1. <br/>
     * This default to 0 (so alpha test is disabled).
     * When it's set to 1, the stencil will discard all pixels, nothing will be shown,
     * In previous version, it act as if the alpha test is disabled, which is incorrect.
     * !#zh
     * Alpha 阈值（不支持 Canvas 模式）<br/>
     * 只有当模板的像素的 alpha 大于 alphaThreshold 时，才会绘制内容。<br/>
     * 该数值 0 ~ 1 之间的浮点数，默认值为 0（因此禁用 alpha 测试）
     * 当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容，在之前的版本中，设置为 1 等同于 0，这种效果其实是不正确的
     */
    // // @range: [0, 1, 0.1],
    // // slide: true,
    // @property({
    //     slide: true,
    //     range:[0, 1, 0.1]
    // })
    // get alphaThreshold () {
    //     return this._alphaThreshold;
    // }

    // set alphaThreshold (value) {
    //     this._alphaThreshold = value;
    // }

    // /**
    //  * !#en Reverse mask(Not supported in Canvas Mode).
    //  * !#zh 反向遮罩（不支持 Canvas 模式）。
    //  */
    // @property()
    // get inverted () {
    //     return this._inverted;
    // }

    // set inverted (value) {
    //     this._inverted = value;
    //     if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
    //         cc.warnID(4202);
    //         return;
    //     }
    // }

    // /**
    //  * TODO: remove segments, not supported by graphics
    //  * !#en The segements for ellipse mask.
    //  * !#zh 椭圆遮罩的曲线细分数
    //  */
    // @property
    // get segments () {
    //     return this._segments;
    // }

    // set segments (value) {
    //     this._segments = clamp(value, SEGEMENTS_MIN, SEGEMENTS_MAX);
    // }

    // @property
    // private _spriteFrame: SpriteFrame | null = null;

    // @property
    // private _type = MaskType.RECT;

    // @property
    // private _alphaThreshold = 0;

    // @property
    // private _inverted = false;

    // @property
    // private _segments = 64;

    private _maskMaterial: Material | null = null;

    private _clearMaskMaterial: Material | null = null;

    private _maskGeometry: IGeometry | null = null;

    private _clearGeometry: IGeometry | null = null;

    public onEnable () {
        super.onEnable();
        this._flushAssembler();
        this._activateMaterial();
        this._updateGeometry();

        this.node.on(EventType.ROTATION_PART, this._nodeStateChange, this);
        this.node.on(EventType.SCALE_PART, this._nodeStateChange, this);
    }

    public onDisable () {
        super.onDisable();

        this.node.off(EventType.ROTATION_PART, this._nodeStateChange, this);
        this.node.off(EventType.SCALE_PART, this._nodeStateChange, this);
    }

    public onDestroy () {
        super.onDestroy();
    }

    public getMaskGeometry () {
        return this._maskGeometry;
    }

    public getClearGeometry () {
        return this._clearGeometry;
    }

    public getMaskMaterial (): Material | null {
        return this._maskMaterial;
    }

    public getClearMaterial (): Material | null {
        return this._clearMaskMaterial;
    }

    public updateAssembler (render: UI) {
        if (super.updateAssembler(render)) {
            render.commitComp(this, null, this._assembler!);
            return true;
        }

        return false;
    }

    public postUpdateAssembler (render: UI) {
        if (!this._canRender() || !this._postAssembler) {
            return null;
        }

        render.commitComp(this, null, this._postAssembler!);
    }

    protected _nodeStateChange () {
        super._nodeStateChange();
        this._updateGeometry();
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        return this._maskMaterial !== null && this._clearMaskMaterial !== null && this._renderPermit;
    }

    protected _instanceMaterial () {
        if (this._sharedMaterial) {
            this._updateMaterial(
                Material.getInstantiatedMaterial(this._sharedMaterial,
                    new RenderableComponent(),
                    CC_EDITOR ? true : false,
                ));
        } else {
            this._updateMaterial(
                Material.getInstantiatedMaterial(cc.builtinResMgr.get('sprite-base'),
                    new RenderableComponent(),
                    CC_EDITOR ? true : false,
                ));
        }
    }

    // _resizeNodeToTargetNode: CC_EDITOR && function () {
    //     if (this.spriteFrame) {
    //         const rect = this.spriteFrame.getRect();
    //         this.node.setContentSize(rect.width, rect.height);
    //     }
    // }

    // private _onTextureLoaded () {
    //     // Mark render data dirty
    //     if (this._renderData) {
    //         this._renderData.uvDirty = true;
    //         this._renderData.vertDirty = true;
    //     }
    //     // Reactivate material
    //     if (this.enabledInHierarchy) {
    //         this._activateMaterial();
    //     }
    // }

    // private _applySpriteFrame (oldFrame) {
    //     if (oldFrame && oldFrame.off) {
    //         oldFrame.off('load', this._onTextureLoaded, this);
    //     }
    //     const spriteFrame = this._spriteFrame;
    //     if (spriteFrame) {
    //         if (spriteFrame.textureLoaded()) {
    //             this._onTextureLoaded();
    //         } else {
    //             spriteFrame.once('load', this._onTextureLoaded, this);
    //             spriteFrame.ensureLoadTexture();
    //         }
    //     }
    // }

    private _updateGeometry (){
        this._maskGeometry = this._getGraphics();
        this._clearGeometry = this._drawRect(
            0, 0, cc.visibleRect.width, cc.visibleRect.height);
    }

    private _activateMaterial () {
        // if (!this._maskMaterial) {
        //     this._maskMaterial = Material.getInstantiatedMaterial(cc.builtinResMgr.get('sprite-material'), this, CC_EDITOR ? true : false);
        //     setupMaskMaterial(this._maskMaterial);
        // }

        // if (!this._clearMaskMaterial) {
        //     this._clearMaskMaterial = Material.getInstantiatedMaterial(cc.builtinResMgr.get('sprite-material'), this, CC_EDITOR ? true : false);
        //     setupClearMaskMaterial(this._clearMaskMaterial);
        // }

        if (this._sharedMaterial) {
            if (!this._maskMaterial) {
                this._maskMaterial = Material.getInstantiatedMaterial(this._sharedMaterial, new RenderableComponent(), CC_EDITOR ? true : false);
                // setupMaskMaterial(this._maskMaterial);
            }

            if (!this._clearMaskMaterial) {
                this._clearMaskMaterial = Material.getInstantiatedMaterial(this._sharedMaterial, new RenderableComponent(), CC_EDITOR ? true : false);
                // setupClearMaskMaterial(this._maskMaterial);
            }
        }
    }

    private _getGraphics () {
        const uiTransform = this.node.getComponent(UITransformComponent);
        if (!uiTransform) {
            return null;
        }
        const width = uiTransform.width;
        const height = uiTransform.height;
        const x = -width * uiTransform.anchorPoint.x;
        const y = -height * uiTransform.anchorPoint.y;
        return this._drawRect(x, y, width, height);
        // switch (this._type) {
        //     case MaskType.RECT:
        //     case MaskType.IMAGE_STENCIL:
        //         return this._drawRect(x, y, width, height);
        //     case MaskType.ELLIPSE:
        //         const cx = x + width / 2;
        //         const cy = y + height / 2;
        //         const rx = width / 2;
        //         const ry = height / 2;
        //         return this._drawEllipse(cx, cy, rx, ry);
        // }
        // return null;
    }

    private _drawRect (x: number, y: number, width: number, height: number) {
        const geometry = quad({ includeNormal: false, includeUV: false });
        scale(geometry, { x: width, y: height });
        translate(geometry, { x: x + width / 2, y: y + height / 2 });
        return geometry;
    }

    // private _drawEllipse (cx, cy, rx, ry) {
    //     const geometry = circle({ includeNormal: false, includeUV: false });
    //     scale(geometry, { x: rx, y: ry });
    //     translate(geometry, { x: cx, y: cy });
    //     return geometry;
    // }

    private _flushAssembler (){
        const assembler = MaskComponent.Assembler!.getAssembler(this);
        const posAssembler = MaskComponent.PostAssembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (this._postAssembler !== posAssembler) {
            this._postAssembler = posAssembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData.material = this.sharedMaterial;
                this.markForUpdateRenderData();
            }
        }
    }
}

// tslint:disable-next-line
cc.MaskComponent = MaskComponent;
