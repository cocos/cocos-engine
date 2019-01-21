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
import {SpriteFrame} from '../../../assets/CCSpriteFrame';
import { ccclass, executeInEditMode, executionOrder,
    menu, property, requireComponent } from '../../../core/data/class-decorator';
import { ccenum } from '../../../core/value-types/enum';
import { clamp, vec3 } from '../../../core/vmath';
import { GFXPrimitiveMode } from '../../../gfx/define';
import { IUIRenderData, UI } from '../../../renderer/ui/ui';
import { Node } from '../../../scene-graph/node';
import { Material } from '../../assets/material';
import circle from '../../primitive/circle';
import { IGeometry } from '../../primitive/define';
import quad from '../../primitive/quad';
import { scale, translate } from '../../primitive/transform';
import { setupClearMaskMaterial, setupMaskMaterial } from '../assembler/mask-assembler';
import { MeshBuffer } from '../mesh-buffer';
import { UIRenderComponent } from './ui-render-component';
import { UITransformComponent } from './ui-transfrom-component';

/**
 * !#en the type for mask.
 * !#zh 遮罩组件类型
 */
export enum MaskType {
    /**
     * !#en Rect mask.
     * !#zh 使用矩形作为遮罩
     */
    RECT = 0,

    /**
     * !#en Ellipse Mask.
     * !#zh 使用椭圆作为遮罩
     */
    ELLIPSE = 1,

    /**
     * !#en Image Stencil Mask.
     * !#zh 使用图像模版作为遮罩
     */
    IMAGE_STENCIL = 2,
}

ccenum(MaskType);

const SEGEMENTS_MIN = 3;
const SEGEMENTS_MAX = 10000;

/**
 * !#en The Mask Component.
 * !#zh 遮罩组件。
 */
@ccclass('cc.Mask')
@executionOrder(100)
@menu('UI/Mask')
@requireComponent(UITransformComponent)
@executeInEditMode
export class MaskComponent extends UIRenderComponent {
    public static Type = MaskType;

    /**
     * !#en The mask type.
     * !#zh 遮罩类型。
     */
    public get type () {
        return this._type;
    }

    public set type (value) {
        this._type = value;
        if (this._type !== MaskType.IMAGE_STENCIL) {
            this.spriteFrame = null;
            this.alphaThreshold = 0;
            this._updateGraphics();
        }
        if (this._renderData) {
            this.destroyRenderData();
            this._renderData = null;
        }
        this._activateMaterial();
    }

    /**
     * !#en The mask image
     * !#zh 遮罩所需要的贴图
     */
    public get spriteFrame () {
        return this._spriteFrame;
    }

    public set spriteFrame (value) {
        if (this._spriteFrame === value) {
            return;
        }
        this._applySpriteFrame(value);
    }

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
    // @range: [0, 1, 0.1],
    // slide: true,
    @property({type: cc.Float})
    public get alphaThreshold () {
        return this._alphaThreshold;
    }

    public set alphaThreshold (value) {
        this._alphaThreshold = value;
    }

    /**
     * !#en Reverse mask(Not supported in Canvas Mode).
     * !#zh 反向遮罩（不支持 Canvas 模式）。
     */
    @property({type: Boolean})
    public get inverted () {
        return this._inverted;
    }

    public set inverted (value) {
        this._inverted = value;
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.warnID(4202);
            return;
        }
    }

    /**
     * TODO: remove segments, not supported by graphics
     * !#en The segements for ellipse mask.
     * !#zh 椭圆遮罩的曲线细分数
     */
    public get segments () {
        return this._segments;
    }

    public set segments (value) {
        this._segments = clamp(value, SEGEMENTS_MIN, SEGEMENTS_MAX);
    }

    @property
    private _spriteFrame: SpriteFrame | null = null;

    @property
    private _type = MaskType.RECT;

    @property
    private _alphaThreshold: number = 0;

    @property
    private _inverted: boolean = false;

    @property
    private _segments: number = 64;

    private _maskMaterial: Material | null = null;

    private _clearMaskMaterial: Material | null = null;

    private _maskGeometry: IGeometry | null = null;

    public onLoad () {
        this._activateMaterial();
    }

    public onEnable () {
        super.onEnable();
        this._activateMaterial();
    }

    public onDisable () {
        super.onDisable();

        // this.node.off(Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
        // this.node.off(Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
        // this.node.off(Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
        // this.node.off(Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
        // this.node.off(Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);

        // this.node._renderFlag &= ~RenderFlow.FLAG_POST_RENDER;
    }

    public onDestroy () {
        super.onDestroy();
    }

    // _resizeNodeToTargetNode: CC_EDITOR && function () {
    //     if (this.spriteFrame) {
    //         const rect = this.spriteFrame.getRect();
    //         this.node.setContentSize(rect.width, rect.height);
    //     }
    // }

    public _onTextureLoaded () {
        // Mark render data dirty
        if (this._renderData) {
            this._renderData.uvDirty = true;
            this._renderData.vertDirty = true;
        }
        // Reactivate material
        if (this.enabledInHierarchy) {
            this._activateMaterial();
        }
    }

    public _applySpriteFrame (oldFrame) {
        if (oldFrame && oldFrame.off) {
            oldFrame.off('load', this._onTextureLoaded, this);
        }
        const spriteFrame = this._spriteFrame;
        if (spriteFrame) {
            if (spriteFrame.textureLoaded()) {
                this._onTextureLoaded();
            } else {
                spriteFrame.once('load', this._onTextureLoaded, this);
                spriteFrame.ensureLoadTexture();
            }
        }
    }

    public _activateMaterial () {
        if (!this._maskMaterial) {
            this._maskMaterial = Material.getInstantiatedMaterial(cc.BuiltinResMgr['sprite-material'], this);
            setupMaskMaterial(this._maskMaterial);
        }

        if (!this._clearMaskMaterial) {
            this._clearMaskMaterial = Material.getInstantiatedMaterial(cc.BuiltinResMgr['sprite-material'], this);
            setupClearMaskMaterial(this._clearMaskMaterial);
        }
    }

    public _createRenderData (ui: UI) {
        if (!this._maskGeometry || !this._maskMaterial || !this._clearMaskMaterial) {
            return null;
        }

        const maskMeshBuffer = this._createMeshBuffer(ui, this._maskGeometry);
        this._fillMaskMeshBuffer(maskMeshBuffer, this._maskGeometry);
        const maskRenderData = ui.createUIRenderData() as IUIRenderData;
        maskRenderData.meshBuffer = maskMeshBuffer;
        maskRenderData.material = this._maskMaterial;

        const clearMaskGeometry = this._drawRect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
        const clearMaskMeshBuffer = this._createMeshBuffer(ui, clearMaskGeometry);
        this._fillClearMaskMeshBuffer(clearMaskMeshBuffer, clearMaskGeometry);
        const clearMaskRenderData = ui.createUIRenderData() as IUIRenderData;
        clearMaskRenderData.meshBuffer = clearMaskMeshBuffer;
        clearMaskRenderData.material = this._clearMaskMaterial;
    }

    public _getMaskMaterial (): Material | null {
        return this._maskMaterial;
    }

    public _getClearMaterial (): Material | null {
        return this._clearMaskMaterial;
    }

    private _updateGraphics () {
        this._maskGeometry = this._getGraphics();
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
        switch (this._type) {
            case MaskType.RECT:
            case MaskType.IMAGE_STENCIL:
                return this._drawRect(x, y, width, height);
            case MaskType.ELLIPSE:
                const cx = x + width / 2;
                const cy = y + height / 2;
                const rx = width / 2;
                const ry = height / 2;
                return this._drawEllipse(cx, cy, rx, ry);
        }
        return null;
    }

    private _fillMaskMeshBuffer (meshBuffer: MeshBuffer, geometry: IGeometry) {
        const nVert = Math.floor(geometry.positions.length / 3);
        const v = new vec3();
        const worldMatrix = this.node.getWorldMatrix();
        for (let i = 0; i < nVert; ++i) {
            vec3.set(v, geometry.positions[3 * i + 0], geometry.positions[3 * i + 1], geometry.positions[3 * i + 2]);
            vec3.transformMat4(v, v, worldMatrix);
            meshBuffer.vData![3 * i + 0] = v.x;
            meshBuffer.vData![3 * i + 1] = v.y;
            meshBuffer.vData![3 * i + 2] = v.z;
        }
    }

    private _fillClearMaskMeshBuffer (meshBuffer: MeshBuffer, geometry: IGeometry) {
        meshBuffer.vData!.set(geometry.positions);
    }

    private _createMeshBuffer (ui: UI, geometry: IGeometry) {
        const nVert = Math.floor(geometry.positions.length / 3);
        const meshBuffer =  ui.createBuffer(nVert, geometry.indices ? geometry.indices.length : 0);
        if (geometry.indices) {
            meshBuffer.iData!.set(geometry.indices);
        }
        // geometry.primitiveMode === undefined ? GFXPrimitiveMode.TRIANGLE_LIST : geometry.primitiveMode;
        return meshBuffer;
    }

    private _drawRect (x: number, y: number, width: number, height: number) {
        const geometry = quad({ includeNormal: false, includeUV: false });
        scale(geometry, { x: width, y: height });
        translate(geometry, { x: x + width / 2, y: y + height / 2 });
        return geometry;
    }

    private _drawEllipse (cx: number, cy: number, rx: number, ry: number) {
        const geometry = circle({ includeNormal: false, includeUV: false });
        scale(geometry, { x: rx, y: ry });
        translate(geometry, { x: cx, y: cy });
        return geometry;
    }
}

// tslint:disable-next-line
cc['MaskComponent'] = MaskComponent;
