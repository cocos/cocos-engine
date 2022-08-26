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
import { Game, Material, builtinResMgr, director, CCObject, Node, NodeEventType, Component } from '../../core';
import { Device, BufferInfo, BufferUsageBit, MemoryUsageBit, PrimitiveMode, deviceManager } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';
import { MaterialInstance, scene } from '../../core/renderer';
import { Model } from '../../core/renderer/scene';
import { vfmt, getAttributeStride } from '../renderer/vertex-format';
import { Stage, StencilManager } from '../renderer/stencil-manager';
import { NodeEventProcessor } from '../../core/scene-graph/node-event-processor';
import { RenderingSubMesh } from '../../core/assets/rendering-sub-mesh';
import { IAssembler, IAssemblerManager } from '../renderer/base';
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
export class Mask extends Component {
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
        this._updateMaterial();// 材质同步时机，可能是重复操作

        if (this._type !== MaskType.IMAGE_STENCIL) {
            if (this._sprite) {
                this.node.removeComponent(Sprite);
                this._sprite = null;
            }
            this._spriteFrame = null;
            this._changeRenderType();
            this._updateGraphics();
            if (JSB) {
                // 原生同步需要考虑
                // 如何传递下去
                this.subComp!.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
            }
        } else {
            if (this._graphics) {
                this._graphics.clear();
                this.node.removeComponent(Graphics);
                this._graphics = null;
            }
            this._changeRenderType();
            if (JSB) {
                // 同样缺少同步机制
                this.subComp!.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
            }
        }
    }

    /**
     * @en
     * Reverse mask
     * @zh
     * 反向遮罩
     */
    @displayOrder(14)
    @tooltip('i18n:mask.inverted')
    get inverted () {
        return this._inverted;
    }

    set inverted (value) {
        this._inverted = value;
        this.stencilStage = Stage.DISABLED;//决定自身的清屏数据，反向遮罩 // 有点问题，invert 决定了 stage
        if (this._graphics) {
            this._graphics.stencilStage = Stage.DISABLED;
        } else if (this._sprite) {
            this._sprite.stencilStage = Stage.DISABLED;
        }

        // todo native
        // if (JSB) {
        //     // 同步到原生的机制
        //     this._renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_INVERTED : MaskMode.MASK);
        //     this.subComp!.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
        // }
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
        this._updateGraphics();//工具函数
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

    set spriteFrame (value) { // 核心功能为转调
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

    set alphaThreshold (value) { // 核心功能为转调
        if (this._alphaThreshold === value) {
            return;
        }

        this._alphaThreshold = value;
        if (this.type === MaskType.IMAGE_STENCIL && this._sprite) {
            const mat = this._sprite.getMaterialInstance(0)!;
            mat.setProperty('alphaThreshold', this._alphaThreshold);
        }
    }

    get subComp () { //看看是否要暴露个 渲染节点出来
        return this._graphics || this._sprite;
    }

    /**
     * @internal
     */
    get stencilStage (): Stage {
        return this._stencilStage;
    }
    set stencilStage (val: Stage) {
        this._stencilStage = val;
        // todo native
        // this._renderEntity.setStencilStage(val);
    }

    // 这些序列化的属性实际应该生效于 init 上
    @serializable
    protected _type = MaskType.RECT;

    @serializable
    protected _inverted = false; // 最麻烦

    @serializable
    protected _segments = 64;

    // for image stencil
    @serializable
    protected _spriteFrame: SpriteFrame | null = null;

    @serializable
    protected _alphaThreshold = 0.1;

    // 引用，是否需要，或者说是否只用于检查？
    protected _sprite: Sprite | null = null;
    protected _graphics: Graphics | null = null;

    protected _stencilStage: Stage = Stage.DISABLED;

    public onLoad () {
        this._changeRenderType(); // 主要用于，创建组件？

        // todo native
        // if (JSB) {
        //     // 主要需要同步标签以便于处理
        //     if (this.renderData && this.subComp) {
        //         this._renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_INVERTED : MaskMode.MASK);
        //         this.subComp.renderEntity.setMaskMode(this._inverted ? MaskMode.MASK_NODE_INVERTED : MaskMode.MASK_NODE);
        //         // hack for isMeshBuffer flag
        //         this.renderData.renderDrawInfo.setIsMeshBuffer(true);
        //         this.renderData.drawInfoType = RenderDrawInfoType.MODEL;
        //     }
        // }
    }

    public onEnable () {
        this._changeRenderType();// 可能会覆盖用户设置
        this._updateGraphics();
        this._enableGraphics();
        this.node.on(NodeEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.on(NodeEventType.SIZE_CHANGED, this._nodeStateChange, this);
    }

    /**
     * @zh
     * 图形内容重塑。
     */
    public onRestore () {
        this._changeRenderType(); // 执行时序问题，restore 到底是谁先执行
        this._updateGraphics();
    }

    public onDisable () {
        this._disableGraphics();
        this.node.off(NodeEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.off(NodeEventType.SIZE_CHANGED, this._nodeStateChange, this);
    }

    public onDestroy () {
        this._removeMaskNode();
    }

    // hit 得再考虑，比较麻烦
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

    // 用于在节点状态变化时触发graphics更新
    protected _nodeStateChange (type: TransformBit) {
        this._updateGraphics();
    }

    private _changeRenderType () {
        const isGraphics = (this._type !== MaskType.IMAGE_STENCIL);
        if (isGraphics) {
            this._createGraphics();
        } else {
            this._createSprite();
        }
        this.subComp!.isForMask = true;
    }

    private _initSpriteNode () {
        const node = this.node;
        node.addComponent(Sprite);
    }

    protected _createSprite () {
        if (!this._sprite) {
            this._initSpriteNode();
            const sprite = this._sprite = this.node.getComponent(Sprite)!;
            sprite.color = Color.WHITE.clone();
            // 这儿要处理下怎么触发
            // 流程问题，要去除，但是要怎么触发
            sprite.sizeMode = 0;
            // @ts-expect-error Mask hack
            sprite._postAssembler = PostAssembler.getAssembler(sprite);
        }
        // 可能需要转调，工作流更顺畅
        this._sprite.spriteFrame = this._spriteFrame;
        // 材质不确定有没有时机问题
        this._updateMaterial();
    }

    private _initGraphicsNode () {
        const node = this.node;
        node.addComponent(Graphics);
    }

    protected _createGraphics () {
        if (!this._graphics) {
            this._initGraphicsNode();
            const graphics = this._graphics = this.node.getComponent(Graphics)!;
            graphics.lineWidth = 1;
            const color = Color.WHITE.clone();
            color.a = 0;
            graphics.fillColor = color;
            // @ts-expect-error Mask hack
            graphics._postAssembler = PostAssembler.getAssembler(graphics);
        }
        // 材质时机可能有问题
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

    // protected _createClearModel () {
    //     if (!this._clearModel) {
    //         // 这个挪到公用里。一个清全屏的 batch，包括材质等都可以
    //         // 但是可能材质实例化有问题
    //         // 那如果是特殊处理的，就不用走通用流程了
    //         // 不共用，自有的一个batch
    //         const mtl = builtinResMgr.get<Material>('default-clear-stencil');
    //         this._clearStencilMtl = new MaterialInstance({
    //             parent: mtl,
    //             owner: this,
    //             subModelIdx: 0,
    //         });

    //         this._clearModel = director.root!.createModel(scene.Model);
    //         this._clearModel.node = this._clearModel.transform = this.node;
    //         const stride = getAttributeStride(vfmt);
    //         const gfxDevice: Device = deviceManager.gfxDevice;
    //         const vertexBuffer = gfxDevice.createBuffer(new BufferInfo(
    //             BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
    //             MemoryUsageBit.DEVICE,
    //             4 * stride,
    //             stride,
    //         ));

    //         const vb = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
    //         vertexBuffer.update(vb);
    //         const indexBuffer = gfxDevice.createBuffer(new BufferInfo(
    //             BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
    //             MemoryUsageBit.DEVICE,
    //             6 * Uint16Array.BYTES_PER_ELEMENT,
    //             Uint16Array.BYTES_PER_ELEMENT,
    //         ));

    //         const ib = new Uint16Array([0, 1, 2, 2, 1, 3]);
    //         indexBuffer.update(ib);
    //         this._clearModelMesh = new RenderingSubMesh([vertexBuffer], vfmt, PrimitiveMode.TRIANGLE_LIST, indexBuffer);
    //         this._clearModelMesh.subMeshIdx = 0;

    //         this._clearModel.initSubModel(0, this._clearModelMesh, this._clearStencilMtl);
    //         //上述逻辑都有些浪费，但是单独处理可能存在 updateGFXBuffer 的问题
    //         // 不用同步，但是需要在原生也有一份
    //         // sync to native
    //         if (JSB) {
    //             if (this._renderData) {
    //                 const drawInfo = this._renderData.renderDrawInfo;
    //                 drawInfo.setModel(this._clearModel);
    //                 drawInfo.setMaterial(this._clearStencilMtl);
    //             }
    //         }
    //     }
    // }

    // 很可能会出现时机问题
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
            target.customMaterial = mat;
            // target.setMaterial(mat, 0);
            mat = target.getMaterialInstance(0)!;
            mat.setProperty('alphaThreshold', this._alphaThreshold);
        }
    }

    // 问题是怎么不允许删除呢？
    protected _enableGraphics () {
        // 引用组件的声明周期控制
        // 可能还是要交给 mask
        if (this.subComp) {
            this.subComp.enabled = true;
        }
    }

    protected _disableGraphics () {
        // 引用组件的声明周期控制
        // 可能还是要交给 mask
        if (this.subComp) {
            this.subComp.enabled = false;
        }
    }

    protected _removeMaskNode () {
        if (this._sprite) {
            this._sprite.destroy();
            this._sprite = null;
        }
        if (this._graphics) {
            this._graphics.destroy();
            this._graphics = null;
        }
    }
}

// 这个改法是为了利用现有的 postAssembler 机制
// 亦可以直接在 batcher 中根据 isMask 标签在 postAss 处进行调用
// 目的是为了 exitMask
const maskEndAssembler: IAssembler = {
    fillBuffers (mask: Mask, ui: IBatcher) {
        StencilManager.sharedManager!.exitMask();
    },
};

const PostAssembler: IAssemblerManager = {
    getAssembler () {
        return maskEndAssembler;
    },
};

NodeEventProcessor._maskComp = Mask;

legacyCC.Mask = Mask;
