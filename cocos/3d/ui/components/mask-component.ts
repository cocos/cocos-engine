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
import { SpriteFrame } from '../../../assets/CCSpriteFrame';
import { Mat4, Vec2, Vec3 } from '../../../core';
import { ccclass, executionOrder, menu, property} from '../../../core/data/class-decorator';
import { EventType } from '../../../core/platform/event-manager/event-enum';
import { ccenum } from '../../../core/value-types/enum';
import * as vmath from '../../../core/vmath';
import { UI } from '../../../renderer/ui/ui';
import { Node } from '../../../scene-graph';
import { GraphicsComponent } from './graphics-component';
import { InstanceMaterialType, UIRenderComponent } from './ui-render-component';

const _worldMatrix = new Mat4();
const _vec2_temp = new Vec2();
const _mat4_temp = new Mat4();

const _circlepoints: Vec3[] = [];
function _calculateCircle (center: Vec3, radius: Vec3, segements: number) {
    _circlepoints.length = 0;
    const anglePerStep = Math.PI * 2 / segements;
    for (let step = 0; step < segements; ++step) {
        _circlepoints.push(cc.v3(radius.x * Math.cos(anglePerStep * step) + center.x,
            radius.y * Math.sin(anglePerStep * step) + center.y, 0));
    }

    return _circlepoints;
}
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
    // IMAGE_STENCIL = 2,
}

ccenum(MaskType);

const SEGEMENTS_MIN = 3;
const SEGEMENTS_MAX = 10000;

/**
 * !#en The Mask Component.
 * !#zh 遮罩组件。
 */
@ccclass('cc.MaskComponent')
@executionOrder(100)
@menu('UI/Render/Mask')
export class MaskComponent extends UIRenderComponent {
    /**
     * !#en The mask type.
     * !#zh 遮罩类型。
     */
    @property({
        type: MaskType,
    })
    get type () {
        return this._type;
    }

    set type (value: MaskType) {
        if (this._type === value){
            return;
        }

        this._type = value;
        // if (this._type !== MaskType.IMAGE_STENCIL) {
        //     this.spriteFrame = null;
        //     this.alphaThreshold = 0;
        this._updateGraphics();
        // }
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
    // @property({
    //     type: SpriteFrame,
    // })
    // get spriteFrame () {
    //     return this._spriteFrame;
    // }

    // set spriteFrame (value: SpriteFrame | null) {
    //     if (this._spriteFrame === value) {
    //         return;
    //     }

    //     this._spriteFrame = value;
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
    // @property({
    //     slide: true,
    //     range: [0, 1, 0.1],
    // })
    // get alphaThreshold () {
    //     return this._alphaThreshold;
    // }

    // set alphaThreshold (value) {
    //     this._alphaThreshold = value;
    // }

    /**
     * !#en Reverse mask(Not supported in Canvas Mode).
     * !#zh 反向遮罩（不支持 Canvas 模式）。
     */
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

    /**
     * TODO: remove segments, not supported by graphics
     * !#en The segements for ellipse mask.
     * !#zh 椭圆遮罩的曲线细分数
     */
    @property
    get segments () {
        return this._segments;
    }

    set segments (value) {
        this._segments = vmath.clamp(value, SEGEMENTS_MIN, SEGEMENTS_MAX);
        this._updateGraphics();
    }

    get graphics (){
        return this._graphics;
    }

    get clearGraphics (){
        return this._clearGraphics;
    }

    @property({
        visible: false,
        override: true,
    })
    get dstBlendFactor (){
        return this._dstBlendFactor;
    }

    @property({
        visible: false,
        override: true,
    })
    get srcBlendFactor () {
        return this._srcBlendFactor;
    }

    @property({
        visible: false,
        override: true,
    })
    get color () {
        return super.color;
    }

    public static Type = MaskType;

    // @property
    // private _spriteFrame: SpriteFrame | null = null;

    @property
    private _type = MaskType.RECT;

    // @property
    // private _alphaThreshold = 0;

    // @property
    // private _inverted = false;

    @property
    private _segments = 64;

    private _graphics: GraphicsComponent | null = null;
    private _clearGraphics: GraphicsComponent | null = null;

    constructor (){
        super();
        this._instanceMaterialType = InstanceMaterialType.ADDCOLOR;
    }

    public onLoad (){
        this._flushAssembler();
        this._createGraphics();
    }

    public onRestore () {
        this._createGraphics();
        // if (this._type !== MaskType.IMAGE_STENCIL) {
        this._updateGraphics();
        // }
        // else {
        //     this._applySpriteFrame(null);
        // }
    }

    public onEnable () {
        super.onEnable();
        // if (this._type === MaskType.IMAGE_STENCIL) {
        //     if (!this._spriteFrame || !this._spriteFrame.textureLoaded()) {
        //         if (this._spriteFrame) {
        //             this.markForUpdateRenderData(false);
        //             this._spriteFrame.once('load', this._onTextureLoaded, this);
        //             this._spriteFrame.ensureLoadTexture();
        //         }
        //     }
        // }
        // else {
        this._updateGraphics();
        // }

        this._activateMaterial();

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
        this._removeGraphics();
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
            return;
        }

        render.commitComp(this, null, this._postAssembler!);
    }

    public isHit (cameraPt: Vec2){
        const node = this.node;
        const size = node.getContentSize();
        const w = size.width;
        const h = size.height;
        const testPt = _vec2_temp;

        this.node.getWorldMatrix(_worldMatrix);
        vmath.mat4.invert(_mat4_temp, _worldMatrix);
        vmath.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        const ap = node.getAnchorPoint();
        testPt.x += ap.x * w;
        testPt.y += ap.y * h;

        let result = false;
        if (this.type === MaskType.RECT /*|| this.type === MaskType.IMAGE_STENCIL*/) {
            result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        }
        else if (this.type === MaskType.ELLIPSE) {
            const rx = w / 2;
            const ry = h / 2;
            const px = testPt.x - 0.5 * w;
            const py = testPt.y - 0.5 * h;
            result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }
        // if (this.inverted) {
        //     result = !result;
        // }
        return result;
    }

    public _resizeNodeToTargetNode () {
        // if (!CC_EDITOR){
        //     return;
        // }
        // if (this.spriteFrame) {
        //     const rect = this.spriteFrame.getRect();
        //     this.node.setContentSize(rect.width, rect.height);
        // }
    }

    protected _nodeStateChange () {
        super._nodeStateChange();
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        return this._clearGraphics !== null && this._graphics !== null && this._renderPermit;
    }

    protected _flushAssembler (){
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
                this._renderData!.material = this.sharedMaterial;
                this.markForUpdateRenderData();
            }
        }
    }

    private _onTextureLoaded () {
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

    private _applySpriteFrame (oldFrame: SpriteFrame | null) {
        // if (oldFrame && oldFrame.off) {
        //     oldFrame.off('load', this._onTextureLoaded, this);
        // }
        // const spriteFrame = this._spriteFrame;
        // if (spriteFrame) {
        //     if (spriteFrame.textureLoaded()) {
        //         this._onTextureLoaded();
        //     } else {
        //         spriteFrame.once('load', this._onTextureLoaded, this);
        //         spriteFrame.ensureLoadTexture();
        //     }
        // }
    }

    private _createGraphics () {
        if (!this._clearGraphics) {
            this._clearGraphics = new GraphicsComponent();
            this._clearGraphics.node = new Node('clear-graphics');
            this._clearGraphics.helpInstanceMaterial();
            this._clearGraphics._activateMaterial();
            this._clearGraphics.lineWidth = 0;
            this._clearGraphics.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
            this._clearGraphics.fill();
        }

        if (!this._graphics) {
            this._graphics = new GraphicsComponent();
            this._graphics.node = this.node;
            this._graphics.helpInstanceMaterial();
            this._graphics.lineWidth = 0;
            this._graphics.strokeColor = cc.color(0, 0, 0, 0);
        }
    }

    private _updateGraphics () {
        if (!this._graphics){
            return;
        }

        const node = this.node;
        const graphics = this._graphics;
        // Share render data with graphics content
        graphics.clear();
        const size = node.getContentSize();
        const width = size.width;
        const height = size.height;
        const ap = node.getAnchorPoint();
        const x = -width * ap.x;
        const y = -height * ap.y;
        if (this._type === MaskType.RECT) {
            graphics.rect(x, y, width, height);
        } else if (this._type === MaskType.ELLIPSE) {
            const center = cc.v3(x + width / 2, y + height / 2, 0);
            const radius = cc.v3(width / 2, height / 2, 0,
            );
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

    private _removeGraphics () {
        if (this._graphics) {
            this._graphics.destroy();
        }

        if (this._clearGraphics) {
            this._clearGraphics.destroy();
        }
    }

    private _activateMaterial () {
        // if (this._type === MaskType.IMAGE_STENCIL && (!this.spriteFrame || !this.spriteFrame.textureLoaded())) {
        //     this._renderPermit = false;
        //     return;
        // }

        // if (this._sharedMaterial){
        //     return;
        // }

        // this._instanceMaterial();
    }
}

// tslint:disable-next-line
cc.MaskComponent = MaskComponent;
