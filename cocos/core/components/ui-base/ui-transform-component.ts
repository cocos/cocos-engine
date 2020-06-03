/*
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

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
 * @category ui
 */

import { Component } from '../component';
import { ccclass, help, executeInEditMode, executionOrder, menu, property } from '../../data/class-decorator';
import { SystemEventType } from '../../platform/event-manager/event-enum';
import { EventListener, IListenerMask } from '../../platform/event-manager/event-listener';
import { Mat4, Rect, Size, Vec2, Vec3 } from '../../math';
import { aabb } from '../../geometry';
import { CanvasComponent } from './canvas-component';
import { Node } from '../../scene-graph';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../global-exports';

const _vec2a = new Vec2();
const _vec2b = new Vec2();
const _mat4_temp = new Mat4();
const _matrix = new Mat4();
const _worldMatrix = new Mat4();
const _zeroMatrix = new Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
const _rect = new Rect();
/**
 * @en
 * The component of transform in UI.
 *
 * @zh
 * UI 变换组件。
 */
@ccclass('cc.UITransformComponent')
@help('i18n:cc.UITransformComponent')
@executionOrder(110)
@menu('UI/UITransform')
@executeInEditMode
export class UITransformComponent extends Component {

    /**
     * @en
     * Size of the UI node.
     *
     * @zh
     * 内容尺寸。
     */
    @property({
        displayOrder: 0,
        tooltip:'内容尺寸',
    })
    // @constget
    get contentSize (): Readonly<Size> {
        return this._contentSize;
    }

    set contentSize (value) {
        if (this._contentSize.equals(value)) {
            return;
        }

        let clone: Size;
        if (EDITOR) {
            clone = new Size(this._contentSize);
        }

        this._contentSize.set(value);
        if (EDITOR) {
            // @ts-ignore
            this.node.emit(SystemEventType.SIZE_CHANGED, clone);
        } else {
            this.node.emit(SystemEventType.SIZE_CHANGED);
        }

    }

    get width () {
        return this._contentSize.width;
    }

    set width (value) {
        if (this._contentSize.width === value) {
            return;
        }

        let clone: Size;
        if (EDITOR) {
            clone = new Size(this._contentSize);
        }

        this._contentSize.width = value;
        if (EDITOR) {
            // @ts-ignore
            this.node.emit(SystemEventType.SIZE_CHANGED, clone);
        } else {
            this.node.emit(SystemEventType.SIZE_CHANGED);
        }
    }

    get height () {
        return this._contentSize.height;
    }

    set height (value) {
        if (this.contentSize.height === value) {
            return;
        }

        let clone: Size;
        if (EDITOR) {
            clone = new Size(this._contentSize);
        }

        this._contentSize.height = value;
        if (EDITOR) {
            // @ts-ignore
            this.node.emit(SystemEventType.SIZE_CHANGED, clone);
        } else {
            this.node.emit(SystemEventType.SIZE_CHANGED);
        }
    }

    /**
     * @en
     * Anchor point of the UI node.
     *
     * @zh
     * 锚点位置。
     */
    @property({
        displayOrder: 1,
        tooltip:'锚点位置',
    })
    // @constget
    get anchorPoint (): Readonly<Vec2> {
        return this._anchorPoint;
    }

    set anchorPoint (value) {
        if (this._anchorPoint.equals(value)) {
            return;
        }

        this._anchorPoint.set(value);
        this.node.emit(SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
    }

    get anchorX () {
        return this._anchorPoint.x;
    }

    set anchorX (value) {
        if (this._anchorPoint.x === value) {
            return;
        }

        this._anchorPoint.x = value;
        this.node.emit(SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
    }

    get anchorY () {
        return this._anchorPoint.y;
    }

    set anchorY (value) {
        if (this._anchorPoint.y === value) {
            return;
        }

        this._anchorPoint.y = value;
        this.node.emit(SystemEventType.ANCHOR_CHANGED, this._anchorPoint);
    }

    /**
     * @en
     * Render sequence.
     * Note: UI rendering is only about priority.
     *
     * @zh
     * 渲染先后顺序，按照广度渲染排列，按同级节点下进行一次排列。
     */
    @property({
        tooltip: '渲染排序优先级'
    })
    get priority() {
        return this._priority;
    }

    set priority(value) {
        if (this._priority === value) {
            return;
        }

        if (this._canvas && this._canvas.node === this.node) {
            legacyCC.warn(9200);
            return;
        }

        this._priority = value;
        this._sortSiblings();
    }

    @property
    protected _priority = 0;

    /**
     * @zh
     * 查找被渲染相机。
     */
    get visibility () {
        if (!this._canvas) {
            return -1;
        }

        return this._canvas.visibility;
    }

    public static EventType = SystemEventType;

    public _canvas: CanvasComponent | null = null;

    @property
    protected _contentSize = new Size(100, 100);
    @property
    protected _anchorPoint = new Vec2(0.5, 0.5);

    public __preload () {
        this.node._uiProps.uiTransformComp = this;
    }

    public onEnable(){
        this._updateVisibility();

        this.node.on(SystemEventType.PARENT_CHANGED, this._parentChanged, this);

        this._sortSiblings();
    }

    public onDisable(){
        this.node.off(SystemEventType.PARENT_CHANGED, this._parentChanged, this);
        this._canvas = null;
    }

    public onDestroy () {
        this.node._uiProps.uiTransformComp = null;
    }

    /**
     * @en
     * Sets the untransformed size of the node.<br/>
     * The contentSize remains the same no matter if the node is scaled or rotated.<br/>
     * All nodes have a size. Layer and Scene have the same size of the screen.
     *
     * @zh
     * 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
     *
     * @param size - 节点内容变换的尺寸或者宽度。
     * @param height - 节点内容未变换的高度。
     * @example
     * ```typescript
     * node.setContentSize(cc.size(100, 100));
     * node.setContentSize(100, 100);
     * ```
     */
    public setContentSize (size: Size | number, height?: number) {
        const locContentSize = this._contentSize;
        let clone: Size;
        if (height === undefined) {
            size = size as Size;
            if ((size.width === locContentSize.width) && (size.height === locContentSize.height)) {
                return;
            }

            if (EDITOR) {
                clone = new Size(this._contentSize);
            }

            locContentSize.width = size.width;
            locContentSize.height = size.height;
        } else {
            if ((size === locContentSize.width) && (height === locContentSize.height)) {
                return;
            }

            if (EDITOR) {
                clone = new Size(this._contentSize);
            }

            locContentSize.width = size as number;
            locContentSize.height = height;
        }

        if (EDITOR) {
            // @ts-ignore
            this.node.emit(SystemEventType.SIZE_CHANGED, clone);
        } else {
            this.node.emit(SystemEventType.SIZE_CHANGED);
        }
    }

    /**
     * @en
     * Sets the anchor point in percent. <br/>
     * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
     * It's like a pin in the node where it is "attached" to its parent. <br/>
     * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
     * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
     * The default anchor point is (0.5,0.5), so it starts at the center of the node.
     *
     * @zh
     * 设置锚点的百分比。<br>
     * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br>
     * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br>
     * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br>
     * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br>
     * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
     *
     * @param point - 节点锚点或节点 x 轴锚。
     * @param y - 节点 y 轴锚。
     * @example
     * ```typescript
     * node.setAnchorPoint(cc.v2(1, 1));
     * node.setAnchorPoint(1, 1);
     * ```
     */
    public setAnchorPoint (point: Vec2 | number, y?: number) {
        const locAnchorPoint = this._anchorPoint;
        if (y === undefined) {
            point = point as Vec2;
            if ((point.x === locAnchorPoint.x) && (point.y === locAnchorPoint.y)) {
                return;
            }
            locAnchorPoint.x = point.x;
            locAnchorPoint.y = point.y;
        } else {
            if ((point === locAnchorPoint.x) && (y === locAnchorPoint.y)) {
                return;
            }
            locAnchorPoint.x = point as number;
            locAnchorPoint.y = y;
        }

        // this.setLocalDirty(LocalDirtyFlag.POSITION);
        // if (this._eventMask & ANCHOR_ON) {
        this.node.emit(SystemEventType.ANCHOR_CHANGED, this._anchorPoint);

        // }
    }

    /**
     * @zh
     * 当前节点的点击计算。
     *
     * @param point - 屏幕点。
     * @param listener - 事件监听器。
     */
    public isHit (point: Vec2, listener?: EventListener) {
        const w = this._contentSize.width;
        const h = this._contentSize.height;
        const cameraPt = _vec2a;
        const testPt = _vec2b;

        const canvas = this._canvas;
        if (!canvas) {
            return;
        }

        // 将一个摄像机坐标系下的点转换到世界坐标系下
        canvas.node.getWorldRT(_mat4_temp);
        const m12 = _mat4_temp.m12;
        const m13 = _mat4_temp.m13;
        const center = legacyCC.visibleRect.center;
        _mat4_temp.m12 = center.x - (_mat4_temp.m00 * m12 + _mat4_temp.m04 * m13);
        _mat4_temp.m13 = center.y - (_mat4_temp.m01 * m12 + _mat4_temp.m05 * m13);
        Mat4.invert(_mat4_temp, _mat4_temp);
        Vec2.transformMat4(cameraPt, point, _mat4_temp);

        this.node.getWorldMatrix(_worldMatrix);
        Mat4.invert(_mat4_temp, _worldMatrix);
        if (Mat4.strictEquals(_mat4_temp, _zeroMatrix)) {
            return false;
        }
        Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                const mask = listener.mask as IListenerMask;
                let parent: any = this.node;
                // find mask parent, should hit test it
                for (let i = 0; parent && i < mask.index; ++i, parent = parent.parent) {
                }
                if (parent === mask.node) {
                    const comp = parent.getComponent(legacyCC.MaskComponent);
                    return (comp && comp.enabledInHierarchy) ? comp.isHit(cameraPt) : true;
                } else {
                    listener.mask = null;
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * @en
     * Converts a Point to node (local) space coordinates.
     *
     * @zh
     * 将一个 UI 节点世界坐标系下点转换到另一个 UI 节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
     * 非 UI 节点转换到 UI 节点(局部) 空间坐标系，请走 CameraComponent 的 `convertToUINode`。
     *
     * @param worldPoint - 世界坐标点。
     * @param out - 转换后坐标。
     * @returns - 返回与目标节点的相对位置。
     * @example
     * ```typescript
     * const newVec3 = uiTransform.convertToNodeSpaceAR(cc.v3(100, 100, 0));
     * ```
     */
    public convertToNodeSpaceAR (worldPoint: Vec3, out?: Vec3) {
        this.node.getWorldMatrix(_worldMatrix);
        Mat4.invert(_mat4_temp, _worldMatrix);
        if (!out) {
            out = new Vec3();
        }

        return Vec3.transformMat4(out, worldPoint, _mat4_temp);
    }

    /**
     * @en
     * Converts a Point in node coordinates to world space coordinates.
     *
     * @zh
     * 将距当前节点坐标系下的一个点转换到世界坐标系。
     *
     * @param nodePoint - 节点坐标。
     * @param out - 转换后坐标。
     * @returns - 返回 UI 世界坐标系。
     * @example
     * ```typescript
     * const newVec3 = uiTransform.convertToWorldSpaceAR(3(100, 100, 0));
     * ```
     */
    public convertToWorldSpaceAR (nodePoint: Vec3, out?: Vec3) {
        this.node.getWorldMatrix(_worldMatrix);
        if (!out) {
            out = new Vec3();
        }

        return Vec3.transformMat4(out, nodePoint, _worldMatrix);
    }

    /**
     * @en
     * Returns a "local" axis aligned bounding box of the node. <br/>
     * The returned box is relative only to its parent.
     *
     * @zh
     * 返回父节坐标系下的轴向对齐的包围盒。
     *
     * @return - 节点大小的包围盒
     * @example
     * ```typescript
     * const boundingBox = uiTransform.getBoundingBox();
     * ```
     */
    public getBoundingBox () {
        Mat4.fromRTS(_matrix, this.node.getRotation(), this.node.getPosition(), this.node.getScale());
        const width = this._contentSize.width;
        const height = this._contentSize.height;
        const rect = new Rect(
            -this._anchorPoint.x * width,
            -this._anchorPoint.y * height,
            width,
            height);
        rect.transformMat4(_matrix);
        return rect;
    }

    /**
     * @en
     * Returns a "world" axis aligned bounding box of the node.<br/>
     * The bounding box contains self and active children's world bounding box.
     *
     * @zh
     * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。
     * 该边框包含自身和已激活的子节点的世界边框。
     *
     * @returns - 返回世界坐标系下包围盒。
     * @example
     * ```typescript
     * const newRect = uiTransform.getBoundingBoxToWorld();
     * ```
     */
    public getBoundingBoxToWorld () {
        if (this.node.parent) {
            this.node.parent.getWorldMatrix(_worldMatrix);
            return this.getBoundingBoxTo(_worldMatrix);
        } else {
            return this.getBoundingBox();
        }
    }

    /**
     * @en
     * Returns the minimum bounding box containing the current bounding box and its child nodes.
     *
     * @zh
     * 返回包含当前包围盒及其子节点包围盒的最小包围盒。
     *
     * @param parentMat - 父节点矩阵。
     * @returns
     */
    public getBoundingBoxTo (parentMat: Mat4) {
        Mat4.fromRTS(_matrix, this.node.getRotation(), this.node.getPosition(), this.node.getScale());
        const width = this._contentSize.width;
        const height = this._contentSize.height;
        const rect = new Rect(
            -this._anchorPoint.x * width,
            -this._anchorPoint.y * height,
            width,
            height);

        Mat4.multiply(_worldMatrix, parentMat, _matrix);
        rect.transformMat4(_worldMatrix);

        // query child's BoundingBox
        if (!this.node.children) {
            return rect;
        }

        const locChildren = this.node.children;
        for (const child of locChildren) {
            if (child && child.active) {
                const uiTransform = child.getComponent(UITransformComponent);
                if (uiTransform) {
                    const childRect = uiTransform.getBoundingBoxTo(parentMat);
                    if (childRect) {
                        Rect.union(rect, rect, childRect);
                    }
                }
            }
        }

        return rect;
    }

    /**
     * @en
     * Compute the corresponding aabb in world space for raycast.
     *
     * @zh
     * 计算出此 UI_2D 节点在世界空间下的 aabb 包围盒
     */
    public getComputeAABB (out?: aabb) {
        const width = this._contentSize.width;
        const height = this._contentSize.height;
        _rect.set(
            -this._anchorPoint.x * width,
            -this._anchorPoint.y * height,
            width,
            height);
        _rect.transformMat4(this.node.worldMatrix);
        const px = _rect.x + _rect.width * 0.5;
        const py = _rect.y + _rect.height * 0.5;;
        const pz = this.node.worldPosition.z;
        const w = _rect.width / 2;
        const h = _rect.height / 2;
        const l = 0.001;
        if (out != null) {
            aabb.set(out, px, py, pz, w, h, l);
        } else {
            return new aabb(px, py, pz, w, h, l);
        }
    }

    public _updateVisibility() {
        let parent = this.node;
        // 获取被渲染相机的 visibility
        while (parent) {
            if (parent) {
                const canvasComp = parent.getComponent('cc.CanvasComponent') as CanvasComponent;
                if (canvasComp) {
                    this._canvas = canvasComp;
                    break;
                }
            }

            // @ts-ignore
            parent = parent.parent;
        }
    }

    protected _parentChanged(node: Node) {
        if (this._canvas && this._canvas.node === this.node) {
            return;
        }

        this._sortSiblings();
    }

    protected _sortSiblings() {
        const siblings = this.node.parent && this.node.parent.children as Mutable<Node[]>;
        if (siblings) {
            siblings.sort((a, b) => {
                const aComp = a._uiProps.uiTransformComp;
                const bComp = b._uiProps.uiTransformComp;
                const ca = aComp ? aComp.priority : 0;
                const cb = bComp ? bComp.priority : 0;
                const diff = ca - cb;
                if (diff === 0) {
                    return a.getSiblingIndex() - b.getSiblingIndex();
                }
                return diff;
            });

            this.node.parent!._updateSiblingIndex();
        }
    }
}

legacyCC.UITransformComponent = UITransformComponent;
