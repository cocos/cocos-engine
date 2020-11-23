/*
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
*/

/**
 * @packageDocumentation
 * @module ui
 */

import { ccclass, help, executionOrder, menu, tooltip, displayOrder, type, visible, override, editable, serializable } from 'cc.decorator';
import { InstanceMaterialType, UIRenderable } from '../../core/components/ui-base/ui-renderable';
import { clamp, Color, Mat4, Vec2, Vec3 } from '../../core/math';
import { view, warnID } from '../../core/platform';
import visibleRect from '../../core/platform/visible-rect';
import { UI } from '../../core/renderer/ui/ui';
import { Node } from '../../core/scene-graph';
import { ccenum } from '../../core/value-types/enum';
import { Graphics } from './graphics';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Game } from '../../core';
import { legacyCC } from '../../core/global-exports';

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
     * @en Ellipse Mask.
     *
     * @zh
     * 使用图像模版作为遮罩。
     */
    GRAPHICS_STENCIL = 2,
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
@menu('UI/Render/Mask')
export class Mask extends UIRenderable {
    /**
     * @en
     * The mask type.
     *
     * @zh
     * 遮罩类型。
     */
    @type(MaskType)
    @displayOrder(4)
    @tooltip('遮罩类型')
    get type () {
        return this._type;
    }

    set type (value: MaskType) {
        if (this._type === value) {
            return;
        }

        this._type = value;
        this._updateGraphics();
        if (this._renderData) {
            this.destroyRenderData();
            this._renderData = null;
        }
    }

    /**
     * @en
     * Reverse mask (Not supported Canvas Mode)
     * .
     * @zh
     * 反向遮罩（不支持 Canvas 模式）。
     */
    @tooltip('反向遮罩')
    get inverted () {
        return this._inverted;
    }

    set inverted (value) {
        if (legacyCC.game.renderType === Game.RENDER_TYPE_CANVAS) {
            warnID(4202);
            return;
        }

        this._inverted = value;
    }

    /**
     * @en
     * The segments for ellipse mask.
     *
     * TODO: remove segments, not supported by graphics
     * @zh
     * 椭圆遮罩的曲线细分数。
     */
    @editable
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

    get graphics () {
        return this._graphics;
    }

    get clearGraphics () {
        return this._clearGraphics;
    }

    @override
    @visible(false)
    get dstBlendFactor () {
        return this._dstBlendFactor;
    }

    set dstBlendFactor (value) {
        if (this._dstBlendFactor === value) {
            return;
        }

        this._dstBlendFactor = value;
        this._updateBlendFunc();
    }

    @override
    @visible(false)
    get srcBlendFactor () {
        return this._srcBlendFactor;
    }

    set srcBlendFactor (value) {
        if (this._srcBlendFactor === value) {
            return;
        }

        this._srcBlendFactor = value;
        this._updateBlendFunc();
    }

    @override
    @visible(false)
    // @constget
    get color (): Readonly<Color> {
        return this._color;
    }

    set color (value) {
        if (this._color === value) {
            return;
        }

        this._color.set(value);
        this.markForUpdateRenderData();
    }

    public static Type = MaskType;

    @serializable
    protected _type = MaskType.RECT;

    @serializable
    protected _inverted = false;

    @serializable
    protected _segments = 64;

    protected _graphics: Graphics | null = null;
    protected _clearGraphics: Graphics | null = null;

    constructor () {
        super();
        this._instanceMaterialType = InstanceMaterialType.ADD_COLOR;
        this._uiMaterialDirty = true;
    }

    public onLoad () {
        this._createGraphics();
        if (this._clearGraphics) {
            this._clearGraphics.onLoad();
        }

        if (this._graphics) {
            this._graphics.onLoad();
        }
    }

    /**
     * @zh
     * 图形内容重塑。
     */
    public onRestore () {
        this._createGraphics();
        this._updateGraphics();
    }

    public onEnable () {
        super.onEnable();
        this._enableGraphics();

        view.on('design-resolution-changed', this._updateClearGraphics, this);
    }

    public onDisable () {
        super.onDisable();
        this._disableGraphics();
        view.off('design-resolution-changed', this._updateClearGraphics, this);
    }

    public onDestroy () {
        super.onDestroy();
        this._removeGraphics();
    }

    /**
     * @zh
     * 根据屏幕坐标计算点击事件。
     *
     * @param cameraPt  屏幕点转换到相机坐标系下的点。
     */
    public isHit (cameraPt: Vec2) {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const size = uiTrans.contentSize;
        const w = size.width;
        const h = size.height;
        const testPt = _vec2_temp;

        this.node.getWorldMatrix(_worldMatrix);
        Mat4.invert(_mat4_temp, _worldMatrix);
        Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        const ap = uiTrans.anchorPoint;
        testPt.x += ap.x * w;
        testPt.y += ap.y * h;

        let result = false;
        if (this.type === MaskType.RECT || this.type === MaskType.GRAPHICS_STENCIL) {
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

    protected _render (render: UI) {
        render.commitComp(this, null, this._assembler!);
    }

    protected _postRender (render: UI) {
        if (!this._postAssembler) {
            return;
        }

        render.commitComp(this, null, this._postAssembler!);
    }

    protected _nodeStateChange (type: TransformBit) {
        super._nodeStateChange(type);

        this._updateGraphics();
    }

    protected _resolutionChanged () {
        this._updateClearGraphics();
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        return this._clearGraphics !== null && this._graphics !== null;
    }

    protected _flushAssembler () {
        const assembler = Mask.Assembler!.getAssembler(this);
        const posAssembler = Mask.PostAssembler!.getAssembler(this);

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

    protected _createGraphics () {
        if (!this._clearGraphics) {
            const node = new Node('clear-graphics');
            const clearGraphics = this._clearGraphics = node.addComponent(Graphics)!;
            clearGraphics.delegateSrc = this.node;
            clearGraphics.lineWidth = 0;
            const color = Color.WHITE.clone();
            color.a = 0;
            clearGraphics.fillColor = color;
        }

        if (!this._graphics) {
            const graphics = this._graphics = new Graphics();
            graphics.node = this.node;
            graphics.node.getWorldMatrix();
            graphics.lineWidth = 0;
            const color = Color.WHITE.clone();
            color.a = 0;
            graphics.fillColor = color;
        }
    }

    protected _updateClearGraphics () {
        if (!this._clearGraphics) {
            return;
        }

        const size = visibleRect;
        this._clearGraphics.node.setWorldPosition(size.width / 2, size.height / 2, 0);
        this._clearGraphics.clear();
        this._clearGraphics.rect(-size.width / 2, -size.height / 2, size.width, size.height);
        this._clearGraphics.fill();
    }

    protected _updateGraphics () {
        if (!this._graphics) {
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
            const radius = new Vec3(width / 2, height / 2, 0,
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

    protected _enableGraphics () {
        if (this._clearGraphics) {
            this._clearGraphics.onEnable();
            this._updateClearGraphics();
        }

        if (this._graphics) {
            this._graphics.onEnable();
            this._updateGraphics();
        }
    }

    protected _disableGraphics () {
        if (this._graphics) {
            this._graphics.onDisable();
        }

        if (this._clearGraphics) {
            this._clearGraphics.onDisable();
        }
    }

    protected _removeGraphics () {
        if (this._graphics) {
            this._graphics.destroy();
        }

        if (this._clearGraphics) {
            this._clearGraphics.destroy();
        }
    }
}

// tslint:disable-next-line
legacyCC.Mask = Mask;
