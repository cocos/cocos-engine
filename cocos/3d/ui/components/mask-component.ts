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
import { clamp } from '../../../core/vmath';
import { Node } from '../../../scene-graph/node';
import { UIRenderComponent } from './ui-render-component';
import { UITransformComponent } from './ui-transfrom-component';
const renderEngine = require('../../../2d/renderer/render-engine');
const math = renderEngine.math;
const StencilMaterial = renderEngine.StencilMaterial;
// const RenderFlow = require('../../../2d/renderer/render-flow');
const Graphics = require('../../../2d/graphics/graphics');

const _vec2_temp = cc.v2();
const _mat4_temp = math.mat4.create();

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
        const lastSprite = this._spriteFrame;
        if (CC_EDITOR) {
            if ((lastSprite && lastSprite._uuid) === (value && value._uuid)) {
                return;
            }
        } else {
            if (lastSprite === value) {
                return;
            }
        }
        this._spriteFrame = value;
        this._applySpriteFrame(lastSprite);
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
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.warnID(4201);
            return;
        }
        if (this._material) {
            this._material.alphaThreshold = this.alphaThreshold;
            this._material.updateHash();
        }
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

    // _resizeToTarget: {
    //     animatable: false,
    //     set (value) {
    //         if (value) {
    //             this._resizeNodeToTargetNode();
    //         }
    //     },
    // },

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

    private _graphics: Graphics | null = null;

    private _material: StencilMaterial | null = null;

    public onLoad () {
        this._graphics = new Graphics();
        this._graphics.node = this.node;
        this._graphics.lineWidth = 0;
        this._graphics.strokeColor = cc.color(0, 0, 0, 0);
    }

    public onRestore () {
        if (!this._graphics) {
            this._graphics = new Graphics();
            this._graphics.node = this.node;
            this._graphics.lineWidth = 0;
        }
        if (this._type !== MaskType.IMAGE_STENCIL) {
            this._updateGraphics();
        }
    }

    public onEnable () {
        super.onEnable();
        if (this._type === MaskType.IMAGE_STENCIL) {
            if (!this._spriteFrame || !this._spriteFrame.textureLoaded()) {
                // Do not render when sprite frame is not ready
                this.markForRender(false);
                if (this._spriteFrame) {
                    this._spriteFrame.once('load', this._onTextureLoaded, this);
                    this._spriteFrame.ensureLoadTexture();
                }
            }
        } else {
            this._updateGraphics();
        }

        this.node.on(Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
        this.node.on(Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
        this.node.on(Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
        this.node.on(Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
        this.node.on(Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);

        // this.node._renderFlag |= RenderFlow.FLAG_POST_RENDER;
        this._activateMaterial();
    }

    public onDisable () {
        super.onDisable();

        this.node.off(Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
        this.node.off(Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
        this.node.off(Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
        this.node.off(Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
        this.node.off(Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);

        // this.node._renderFlag &= ~RenderFlow.FLAG_POST_RENDER;
    }

    public onDestroy () {
        super.onDestroy();
        this._graphics.destroy();
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
            this.markForUpdateRenderData(true);
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
        // cannot be activated if texture not loaded yet
        if (this._type === MaskType.IMAGE_STENCIL && (!this.spriteFrame || !this.spriteFrame.textureLoaded())) {
            this.markForRender(false);
            return;
        }

        // WebGL
        if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
            // Init material
            if (!this._material) {
                this._material = new StencilMaterial();
            }

            // Reset material
            if (this._type === MaskType.IMAGE_STENCIL) {
                const texture = this._spriteFrame;
                this._material.useModel = false;
                this._material.useTexture = true;
                this._material.useColor = true;
                this._material.texture = texture;
                this._material.alphaThreshold = this.alphaThreshold;
            } else {
                this._material.useModel = true;
                this._material.useTexture = false;
                this._material.useColor = false;
            }
        }

        this.markForRender(true);
    }

    public _updateGraphics () {
        const node = this.node;
        const graphics = this._graphics;
        // Share render data with graphics content
        graphics.clear(false);
        const width = node._contentSize.width;
        const height = node._contentSize.height;
        const x = -width * node._anchorPoint.x;
        const y = -height * node._anchorPoint.y;
        if (this._type === MaskType.RECT) {
            graphics.rect(x, y, width, height);
        } else if (this._type === MaskType.ELLIPSE) {
            const cx = x + width / 2;
            const cy = y + height / 2;
            const rx = width / 2;
            const ry = height / 2;
            graphics.ellipse(cx, cy, rx, ry);
        }
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            graphics.stroke();
        } else {
            graphics.fill();
        }
    }

    public _hitTest (cameraPt) {
        const node = this.node;
        const size = node.getContentSize();
        const w = size.width;
        const h = size.height;
        const testPt = _vec2_temp;

        node._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, node._worldMatrix);
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += node._anchorPoint.x * w;
        testPt.y += node._anchorPoint.y * h;

        if (this.type === MaskType.RECT || this.type === MaskType.IMAGE_STENCIL) {
            return testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        } else if (this.type === MaskType.ELLIPSE) {
            const rx = w / 2;
            const ry = h / 2;
            const px = testPt.x - 0.5 * w;
            const py = testPt.y - 0.5 * h;
            return px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }
    }

    public markForUpdateRenderData (enable) {
        // if (enable && this.enabledInHierarchy) {
        //     this.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
        // } else if (!enable) {
        //     this.node._renderFlag &= ~RenderFlow.FLAG_UPDATE_RENDER_DATA;
        // }
    }

    public markForRender (enable) {
        // if (enable && this.enabledInHierarchy) {
        //     this.node._renderFlag |= (RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA |
        //         RenderFlow.FLAG_POST_RENDER);
        // } else if (!enable) {
        //     this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_POST_RENDER);
        // }
    }

    public disableRender () {
        // this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA |
        //     RenderFlow.FLAG_POST_RENDER);
    }
}

// tslint:disable-next-line
cc['MaskComponent'] = MaskComponent;
