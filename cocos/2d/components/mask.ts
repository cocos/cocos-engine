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

import { ccclass, help, executionOrder, menu, tooltip, displayOrder, type, visible, override, serializable, range, slide } from 'cc.decorator';
import { JSB } from 'internal:constants';
import { InstanceMaterialType, UIRenderer } from '../framework/ui-renderer';
import { clamp, Color, Mat4, Vec2, Vec3 } from '../../core/math';
import { warnID } from '../../core/platform';
import { IBatcher } from '../renderer/i-batcher';
import { ccenum } from '../../core/value-types/enum';
import { Graphics } from './graphics';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { SpriteFrame } from '../assets/sprite-frame';
import { Game, Material, builtinResMgr, director, CCObject, Node, NodeEventType } from '../../core';
import { Device, BufferInfo, BufferUsageBit, MemoryUsageBit, PrimitiveMode, deviceManager } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';
import { MaterialInstance, scene } from '../../core/renderer';
import { Model } from '../../core/renderer/scene';
import { vfmt, getAttributeStride } from '../renderer/vertex-format';
import { Stage } from '../renderer/stencil-manager';
import { NodeEventProcessor } from '../../core/scene-graph/node-event-processor';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { IAssemblerManager } from '../renderer/base';
import { MaskMode, RenderEntity, RenderEntityType } from '../renderer/render-entity';
import { RenderDrawInfoType } from '../renderer/render-draw-info';
import { Sprite } from './sprite';

const _worldMatrix = new Mat4();
const _vec2_temp = new Vec2();
const _mat4_temp = new Mat4();

const _circlePoints: Vec3[] = [];
function _calculateCircle (center: Vec3, radius: Vec3, segments: number) {
    _circlePoints.length = 0;
    const anglePerStep = Math.PI * 2 / segments;
    for (let step = 0; step < segments; ++step) {
        _circlePoints.push(new Vec3(radius.x * Math.cos(anglePerStep * step) + center.x,
            radius.y * Math.sin(anglePerStep * step) + center.y, 0));
    }

    return _circlePoints;
}
/**
 * @en The type for mask.
 *
 * @zh 遮罩组件类型。
 */
export enum MaskType {
    /**
     * @en Rect mask.
     *
     * @zh
     * 使用矩形作为遮罩。
     */
    RECT = 0,

    /**
     * @en Ellipse Mask.
     *
     * @zh
     * 使用椭圆作为遮罩。
     */
    ELLIPSE = 1,

    /**
     * @en Graphics Mask.
     *
     * @zh
     * 使用图像模版作为遮罩。
     */
    GRAPHICS_STENCIL = 2,

    /**
     * @en SpriteFrame Mask.
     *
     * @zh
     * 使用图片模版作为遮罩。
     */
    IMAGE_STENCIL = 3,
}

ccenum(MaskType);

const SEGMENTS_MIN = 3;
const SEGMENTS_MAX = 10000;

/**
 * @en
 * The Mask Component.
 *
 * @zh
 * 遮罩组件。
 */
@ccclass('cc.Mask')
@help('i18n:cc.Mask')
@executionOrder(110)
@menu('2D/Mask')
export class Mask extends UIRenderer {
    // only for the mask use to reset stage
    public static ChildPostAssembler: IAssemblerManager | null = null;
    /**
     * @en
     * The mask type.
     *
     * @zh
     * 遮罩类型。
     */
    @type(MaskType)
    @tooltip('i18n:mask.type')
    get type () {
        return this._type;
    }

    set type (value: MaskType) {
        if (this._type === value) {
            return;
        }

        this._type = value;
        this.markForUpdateRenderData(false);
        this._updateMaterial();

        if (this._type !== MaskType.IMAGE_STENCIL) {
            if (this._sprite) {
                this._sprite = null;
            }
            this._spriteFrame = null;
            this._maskNode!.parent = null;
            this._changeRenderType();
            this._updateGraphics();
            if (JSB) {
                this.subComp!.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
            }
        } else {
            if (this._graphics) {
                this._graphics.clear();
                this._graphics = null;
            }
            this._maskNode!.parent = null;
            this._changeRenderType();
            if (JSB) {
                this.subComp!.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
            }
        }
    }

    /**
     * @en
     * Reverse mask (Not supported Canvas Mode)
     * .
     * @zh
     * 反向遮罩（不支持 Canvas 模式）。
     */
    @displayOrder(14)
    @tooltip('i18n:mask.inverted')
    get inverted () {
        return this._inverted;
    }

    set inverted (value) {
        this._inverted = value;
        this.stencilStage = Stage.DISABLED;
        if (this._graphics) {
            this._graphics.stencilStage = Stage.DISABLED;
        } else if (this._sprite) {
            this._sprite.stencilStage = Stage.DISABLED;
        }

        if (JSB) {
            this._renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_INVERTED : MaskMode.MASK);
        }
    }

    /**
     * @en
     * The segments for ellipse mask.
     *
     * TODO: remove segments, not supported by graphics
     * @zh
     * 椭圆遮罩的曲线细分数。
     */
    @visible(function (this: Mask) {
        return this.type === MaskType.ELLIPSE;
    })
    get segments () {
        return this._segments;
    }

    set segments (value) {
        if (this._segments === value) {
            return;
        }

        this._segments = clamp(value, SEGMENTS_MIN, SEGMENTS_MAX);
        this._updateGraphics();
    }

    /**
     * @en
     * The mask image.
     *
     * @zh
     * 遮罩所需要的贴图。
     */
    @type(SpriteFrame)
    @visible(function (this: Mask) {
        return this.type === MaskType.IMAGE_STENCIL;
    })
    get spriteFrame () {
        return this._spriteFrame;
    }

    set spriteFrame (value) {
        if (this._spriteFrame === value) {
            return;
        }

        this._spriteFrame = value;

        if (this._sprite) {
            this._sprite.spriteFrame = value;
        }
        this._updateMaterial();
    }

    /**
     * @en
     * The alpha threshold.(Not supported Canvas Mode) <br/>
     * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
     * Should be a float between 0 and 1. <br/>
     * This default to 0.1.
     * When it's set to 1, the stencil will discard all pixels, nothing will be shown.
     * @zh
     * Alpha 阈值（不支持 Canvas 模式）<br/>
     * 只有当模板的像素的 alpha 大于等于 alphaThreshold 时，才会绘制内容。<br/>
     * 该数值 0 ~ 1 之间的浮点数，默认值为 0.1
     * 当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容
     */
    @visible(function (this: Mask) {
        return this.type === MaskType.IMAGE_STENCIL;
    })
    @range([0, 1, 0.1])
    @slide
    get alphaThreshold () {
        return this._alphaThreshold;
    }

    set alphaThreshold (value) {
        if (this._alphaThreshold === value) {
            return;
        }

        this._alphaThreshold = value;
        if (this.type === MaskType.IMAGE_STENCIL && this._sprite) {
            const mat = this._sprite.getMaterialInstance(0)!;
            mat.setProperty('alphaThreshold', this._alphaThreshold);
        }
    }

    get subComp () {
        return this._graphics || this._sprite;
    }

    @override
    @visible(false)
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        super.color = value;
    }

    @override
    @visible(false)
    get customMaterial () {
        return this._customMaterial;
    }

    set customMaterial (val) {
        // mask don`t support customMaterial
    }

    public static Type = MaskType;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _clearStencilMtl: Material | null = null;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _clearModel: Model | null = null;

    @serializable
    protected _type = MaskType.RECT;

    @serializable
    protected _inverted = false;

    @serializable
    protected _segments = 64;

    // for image stencil
    @serializable
    protected _spriteFrame: SpriteFrame | null = null;

    @serializable
    protected _alphaThreshold = 0.1;

    protected _sprite: Sprite | null = null;
    protected _graphics: Graphics | null = null;
    protected _maskNode: Node | null = null; // child node,is graphics or sprite

    // always use
    private _clearModelMesh: RenderingSubMesh | null = null;

    constructor () {
        super();
        this._instanceMaterialType = InstanceMaterialType.ADD_COLOR;
    }

    public onLoad () {
        super.onLoad();
        this._createClearModel();
        this._changeRenderType();

        if (JSB) {
            if (this.renderData && this.subComp) {
                this._renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_INVERTED : MaskMode.MASK);
                this.subComp.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
                // hack for isMeshBuffer flag
                this.renderData.renderDrawInfo.setIsMeshBuffer(true);
                this.renderData.drawInfoType = RenderDrawInfoType.MODEL;
            }
        }
    }

    public onEnable () {
        super.onEnable();
        this._updateGraphics();
        this._enableGraphics();
        this._changeRenderType();
        this.node.on(NodeEventType.SIZE_CHANGED, this._sizeChange, this);
        this.node.on(NodeEventType.ANCHOR_CHANGED, this._anchorChange, this);
        this.node.on(NodeEventType.SIBLING_ORDER_CHANGED, this._siblingChange, this);
        this.node.on(NodeEventType.LAYER_CHANGED, this._layerChange, this);
        this._sizeChange();
        this._siblingChange();
        this._layerChange();
    }

    /**
     * @zh
     * 图形内容重塑。
     */
    public onRestore () {
        this._changeRenderType();
        super.updateMaterial();
        this._updateGraphics();
        this.markForUpdateRenderData();
    }

    public onDisable () {
        super.onDisable();
        this._disableGraphics();
        this.node.off(NodeEventType.SIZE_CHANGED, this._sizeChange, this);
        this.node.off(NodeEventType.ANCHOR_CHANGED, this._anchorChange, this);
        this.node.off(NodeEventType.SIBLING_ORDER_CHANGED, this._siblingChange, this);
        this.node.off(NodeEventType.LAYER_CHANGED, this._layerChange, this);
    }

    public onDestroy () {
        if (this._clearModel && this._clearModelMesh) {
            director.root!.destroyModel(this._clearModel);
            this._clearModelMesh.destroy();
        }

        if (this._clearStencilMtl) {
            this._clearStencilMtl.destroy();
        }

        this._removeMaskNode();
        super.onDestroy();
    }

    /**
     * Hit test with point in World Space.
     *
     * @param worldPt point in World Space.
     */
    public isHit (worldPt: Vec2) {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const size = uiTrans.contentSize;
        const w = size.width;
        const h = size.height;
        const testPt = _vec2_temp;

        this.node.getWorldMatrix(_worldMatrix);
        Mat4.invert(_mat4_temp, _worldMatrix);
        Vec2.transformMat4(testPt, worldPt, _mat4_temp);
        const ap = uiTrans.anchorPoint;
        testPt.x += ap.x * w;
        testPt.y += ap.y * h;

        let result = false;
        if (this.type === MaskType.RECT || this.type === MaskType.GRAPHICS_STENCIL || this.type === MaskType.IMAGE_STENCIL) {
            result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        } else if (this.type === MaskType.ELLIPSE) {
            const rx = w / 2;
            const ry = h / 2;
            const px = testPt.x - 0.5 * w;
            const py = testPt.y - 0.5 * h;
            result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }

        if (this._inverted) {
            result = !result;
        }

        return result;
    }

    protected _render (render: IBatcher) {
        render.commitComp(this, this.renderData, null, this._assembler!, null);
    }

    protected _postRender (render: IBatcher) {
        if (!this._postAssembler) {
            return;
        }

        render.commitComp(this, null, null, this._postAssembler, null);
    }

    protected _nodeStateChange (type: TransformBit) {
        super._nodeStateChange(type);

        this._updateGraphics();
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        if (this._type !== MaskType.IMAGE_STENCIL) {
            return this._graphics !== null;
        } else {
            return this._sprite !== null && this._spriteFrame !== null; // Or use sprite canRender
        }
    }

    protected _flushAssembler () {
        const assembler = Mask.Assembler.getAssembler(this);
        const posAssembler = Mask.PostAssembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (this._postAssembler !== posAssembler) {
            this._postAssembler = posAssembler;
        }

        this._useRenderData();
    }

    private _changeRenderType () {
        const isGraphics = (this._type !== MaskType.IMAGE_STENCIL);
        if (isGraphics) {
            this._createGraphics();
        } else {
            this._createSprite();
        }
    }

    private _initSpriteNode () {
        const node = new Node('MASK_CHILD');
        node.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
        node.addComponent(Sprite);
        node.setPosition(0, 0, 0);
        node.layer = this.node.layer;
        this._maskNode = node;
        this.node.insertChild(node, 0);
    }

    private _sizeChange () {
        if (this._sprite) {
            this._maskNode!._uiProps.uiTransformComp!.setContentSize(this.node._uiProps.uiTransformComp!.contentSize);
        }
    }

    private _anchorChange () {
        if (this._sprite) {
            this._maskNode!._uiProps.uiTransformComp!.setAnchorPoint(this.node._uiProps.uiTransformComp!.anchorPoint);
        }
    }

    private _siblingChange () {
        if (this._maskNode && this._maskNode.getSiblingIndex() !== 0) {
            this._maskNode.setSiblingIndex(0);
        }
    }

    private _layerChange () {
        if (this._maskNode) {
            this._maskNode.layer = this.node.layer;
        }
    }

    protected _createSprite () {
        if (!this._sprite) {
            this._initSpriteNode();
            const sprite = this._sprite = this._maskNode!.getComponent(Sprite)!;
            sprite.color = Color.WHITE.clone();
            // @ts-expect-error Mask hack
            sprite._postAssembler = Mask.ChildPostAssembler!.getAssembler(this);
            sprite.sizeMode = 0;
            this._sizeChange();
            this._anchorChange();
        }
        this._sprite.spriteFrame = this._spriteFrame;
        this._updateMaterial();
    }

    private _initGraphicsNode () {
        const node = new Node('MASK_CHILD');
        node.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
        node.addComponent(Graphics);
        node.setPosition(0, 0, 0);
        node.layer = this.node.layer;
        this._maskNode = node;
        this.node.insertChild(node, 0);
    }

    protected _createGraphics () {
        if (!this._graphics) {
            this._initGraphicsNode();
            const graphics = this._graphics = this._maskNode!.getComponent(Graphics)!;
            graphics._objFlags |= CCObject.Flags.IsOnLoadCalled;// hack for destroy
            graphics.node.getWorldMatrix();
            graphics.lineWidth = 0;
            const color = Color.WHITE.clone();
            color.a = 0;
            graphics.fillColor = color;
            // @ts-expect-error hack for graphics protected attributes
            graphics._postAssembler = Mask.ChildPostAssembler!.getAssembler(this);
        }
        this.node.insertChild(this._maskNode!, 0);
        this._updateMaterial();
    }

    protected _updateGraphics () {
        if (!this._graphics || (this._type !== MaskType.RECT && this._type !== MaskType.ELLIPSE)) {
            return;
        }

        const uiTrans = this.node._uiProps.uiTransformComp!;
        const graphics = this._graphics;
        // Share render data with graphics content
        graphics.clear();
        const size = uiTrans.contentSize;
        const width = size.width;
        const height = size.height;
        const ap = uiTrans.anchorPoint;
        const x = -width * ap.x;
        const y = -height * ap.y;
        if (this._type === MaskType.RECT) {
            graphics.rect(x, y, width, height);
        } else if (this._type === MaskType.ELLIPSE) {
            const center = new Vec3(x + width / 2, y + height / 2, 0);
            const radius = new Vec3(width / 2, height / 2, 0);
            const points = _calculateCircle(center, radius, this._segments);
            for (let i = 0; i < points.length; ++i) {
                const point = points[i];
                if (i === 0) {
                    graphics.moveTo(point.x, point.y);
                } else {
                    graphics.lineTo(point.x, point.y);
                }
            }
            graphics.close();
        }

        graphics.fill();
    }

    protected _createClearModel () {
        if (!this._clearModel) {
            const mtl = builtinResMgr.get<Material>('default-clear-stencil');
            this._clearStencilMtl = new MaterialInstance({
                parent: mtl,
                owner: this,
                subModelIdx: 0,
            });

            this._clearModel = director.root!.createModel(scene.Model);
            this._clearModel.node = this._clearModel.transform = this.node;
            const stride = getAttributeStride(vfmt);
            const gfxDevice: Device = deviceManager.gfxDevice;
            const vertexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                4 * stride,
                stride,
            ));

            const vb = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
            vertexBuffer.update(vb);
            const indexBuffer = gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                6 * Uint16Array.BYTES_PER_ELEMENT,
                Uint16Array.BYTES_PER_ELEMENT,
            ));

            const ib = new Uint16Array([0, 1, 2, 2, 1, 3]);
            indexBuffer.update(ib);
            this._clearModelMesh = new RenderingSubMesh([vertexBuffer], vfmt, PrimitiveMode.TRIANGLE_LIST, indexBuffer);
            this._clearModelMesh.subMeshIdx = 0;

            this._clearModel.initSubModel(0, this._clearModelMesh, this._clearStencilMtl);

            // sync to native
            if (JSB) {
                if (this._renderData) {
                    const drawInfo = this._renderData.renderDrawInfo;
                    drawInfo.setModel(this._clearModel);
                    drawInfo.setMaterial(this._clearStencilMtl);
                }
            }
        }
    }

    protected _updateBuiltinMaterial (): Material {
        return builtinResMgr.get<Material>('default-clear-stencil');
    }

    protected _updateMaterial () {
        if (this._graphics) {
            const target = this._graphics;
            target.stencilStage = Stage.DISABLED;
            const mat = builtinResMgr.get<Material>('ui-graphics-material');
            target.setMaterial(mat, 0);
            target.getMaterialInstance(0);
        } else if (this._sprite) {
            const target = this._sprite;
            target.stencilStage = Stage.DISABLED;
            let mat = builtinResMgr.get<Material>('ui-alpha-test-material');
            target.setMaterial(mat, 0);
            mat = target.getMaterialInstance(0)!;
            mat.setProperty('alphaThreshold', this._alphaThreshold);
        }
    }

    protected _enableGraphics () {
        if (this.subComp) {
            this.subComp.enabled = true;
        }
    }

    protected _disableGraphics () {
        if (this.subComp) {
            this.subComp.enabled = false;
        }
    }

    protected _removeMaskNode () {
        if (this._maskNode && this._maskNode.isValid) {
            this._maskNode.destroy();
            // this._graphics._destroyImmediate(); // FIX: cocos-creator/2d-tasks#2511. TODO: cocos-creator/2d-tasks#2516
            this._sprite = null;
            this._graphics = null;
        }
    }

    protected _useRenderData () {
        //if (this._type === MaskType.IMAGE_STENCIL && !this.renderData) {
        if (!this.renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this.markForUpdateRenderData();
            }
        }
    }

    // RenderEntity
    // it should be overwritten by inherited classes
    protected createRenderEntity () {
        return new RenderEntity(RenderEntityType.DYNAMIC);
    }
}

NodeEventProcessor._maskComp = Mask;

legacyCC.Mask = Mask;
