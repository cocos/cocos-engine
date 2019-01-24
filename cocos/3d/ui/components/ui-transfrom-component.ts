import { Component} from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, property } from '../../../core/data/class-decorator';
import Event from '../../../core/event/event';
import { Enum, Mat4 } from '../../../core/value-types';
import Size from '../../../core/value-types/size';
import Vec2 from '../../../core/value-types/vec2';
import * as math from '../../../core/vmath/index';

const _vec2a = cc.v2();
const _vec2b = cc.v2();
const _mat4_temp = cc.mat4();
const _worldMatrix = cc.mat4();

const EventType = Enum({
    /**
     * !#en The event type for size change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点尺寸改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} SIZE_CHANGED
     * @static
     */
    SIZE_CHANGED: 'size-changed',
    /**
     * !#en The event type for anchor point change events.
     * Performance note, this event will be triggered every time corresponding properties being changed,
     * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
     * !#zh 当节点锚点改变时触发的事件。
     * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
     * @property {String} ANCHOR_CHANGED
     * @static
     */
    ANCHOR_CHANGED: 'anchor-changed',
});

@ccclass('cc.UITransformComponent')
@executionOrder(100)
@executeInEditMode
export class UITransformComponent extends Component {

    @property
    get contentSize () {
        return this._contentSize;
    }

    set contentSize (value) {
        if (this._contentSize === value) {
            return;
        }

        this._contentSize = value;
        this.node.emit(EventType.SIZE_CHANGED);
    }

    get width () {
        return this._contentSize.width;
    }

    set width (value) {
        if (this._contentSize.width === value) {
            return;
        }

        this._contentSize.width = value;
        this.node.emit(EventType.SIZE_CHANGED);
    }

    get height () {
        return this._contentSize.height;
    }

    set height (value) {
        if (this._contentSize.height === value) {
            return;
        }

        this._contentSize.height = value;
        this.node.emit(EventType.SIZE_CHANGED);
    }

    @property
    get anchorPoint () {
        return this._anchorPoint;
    }

    set anchorPoint (value) {
        if (this._anchorPoint === value) {
            return;
        }

        this._anchorPoint = value;
        this.node.emit(EventType.ANCHOR_CHANGED);
    }

    get anchorX () {
        return this._anchorPoint.x;
    }

    set anchorX (value) {
        if (this._anchorPoint.x === value) {
            return;
        }

        this._anchorPoint.x = value;
        this.node.emit(EventType.ANCHOR_CHANGED);
    }

    get anchorY () {
        return this._anchorPoint.y;
    }

    set anchorY (value) {
        if (this._anchorPoint.y === value) {
            return;
        }

        this._anchorPoint.y = value;
        this.node.emit(EventType.ANCHOR_CHANGED);
    }

    public static EventType = EventType;
    @property
    public _contentSize = new cc.Size(100, 100);
    @property
    public _anchorPoint = cc.v2(0.5, 0.5);

    public __preload () {
        this.node.uiTransfromComp = this;
    }

    public onDestroy () {
        this.node.uiTransfromComp = null;
    }

    /**
     * !#en
     * Sets the untransformed size of the node.<br/>
     * The contentSize remains the same no matter the node is scaled or rotated.<br/>
     * All nodes has a size. Layer and Scene has the same size of the screen.
     * !#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
     * @method setContentSize
     * @param {Size|Number} size - The untransformed size of the node or The untransformed size's width of the node.
     * @param {Number} [height] - The untransformed size's height of the node.
     * @example
     * node.setContentSize(cc.size(100, 100));
     * node.setContentSize(100, 100);
     */
    public setContentSize (size: Size|number, height?: number) {
        const locContentSize = this._contentSize;
        // var clone;
        if (height === undefined) {
            size = size as Size;
            if ((size.width === locContentSize.width) && (size.height === locContentSize.height)) {
                return;
            }
            // if (CC_EDITOR) {
            //     clone = cc.size(locContentSize.width, locContentSize.height);
            // }
            locContentSize.width = size.width;
            locContentSize.height = size.height;
        } else {
            if ((size === locContentSize.width) && (height === locContentSize.height)) {
                return;
            }
            // if (CC_EDITOR) {
            //     clone = cc.size(locContentSize.width, locContentSize.height);
            // }
            locContentSize.width = size;
            locContentSize.height = height;
        }
        // if (CC_EDITOR) {
        //     this.emit(EventType.SIZE_CHANGED, clone);
        // }
        // else {
        this.node.emit(EventType.SIZE_CHANGED);
        // }
    }

    /**
     * !#en
     * Sets the anchor point in percent. <br/>
     * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
     * It's like a pin in the node where it is "attached" to its parent. <br/>
     * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
     * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
     * The default anchor point is (0.5,0.5), so it starts at the center of the node.
     * !#zh
     * 设置锚点的百分比。<br/>
     * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
     * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
     * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
     * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
     * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
     * @method setAnchorPoint
     * @param {Vec2|Number} point - The anchor point of node or The x axis anchor of node.
     * @param {Number} [y] - The y axis anchor of node.
     * @example
     * node.setAnchorPoint(cc.v2(1, 1));
     * node.setAnchorPoint(1, 1);
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
            locAnchorPoint.x = point;
            locAnchorPoint.y = y;
        }
        // this.setLocalDirty(LocalDirtyFlag.POSITION);
        // if (this._eventMask & ANCHOR_ON) {
        this.node.emit(EventType.ANCHOR_CHANGED);
        // }
    }

    public isHit (point: Vec2, listener: Event|null = null) {
        const w = this._contentSize.width;
        const h = this._contentSize.height;
        const cameraPt = _vec2a;
        const testPt = _vec2b;

        const renderComp = this.node.getComponent(cc.RenderComponent);
        if (!renderComp) {
            return false;
        }
        const canvas = cc.CanvasComponent.findView(renderComp);
        if (!canvas) {
            return;
        }

        canvas.node.getWorldRT(_mat4_temp);

        const m12 = _mat4_temp.m12;
        const m13 = _mat4_temp.m13;

        const center = cc.visibleRect.center;
        // let size = cc.view.getFrameSize();
        // let center = cc.v2(size.width / 2, size.height / 2);
        // let center = cc.v2(cc.game._renderer._device._gl.canvas.width / 2, cc.game._renderer._device._gl.canvas.height / 2);
        _mat4_temp.m12 = center.x - (_mat4_temp.m00 * m12 + _mat4_temp.m04 * m13);
        _mat4_temp.m13 = center.y - (_mat4_temp.m01 * m12 + _mat4_temp.m05 * m13);

        // if (out !== _mat4_temp) {
        //     mat4.copy(out, _mat4_temp);
        // }
        math.mat4.invert(_mat4_temp, _mat4_temp);
        math.vec2.transformMat4(cameraPt, point, _mat4_temp);
        // let camera = cc.Camera.findCamera(this);
        // if (camera) {
        //     camera.getCameraToWorldPoint(point, cameraPt);
        // }
        // else {
        //     cameraPt.set(point);
        // }

        this.node.getWorldMatrix(_worldMatrix);
        math.mat4.invert(_mat4_temp, _worldMatrix);
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                const mask = listener.mask;
                const parent = this;
                // find mask parent, should hit test it
                if (parent === mask.node) {
                    const comp = parent.getComponent(cc.Mask);
                    return (comp && comp.enabledInHierarchy) ? comp.node.uiTransfromComp!.isHit(cameraPt) : true;
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
     * !#en
     * Converts a Point to node (local) space coordinates in which the anchor point is the origin position.
     * !#zh
     * 将一个点转换到节点 (局部) 空间坐标系，这个坐标系以锚点为原点。
     * @method convertToNodeSpaceAR
     * @param {Vec2} worldPoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
     */
    public convertToNodeSpaceAR (worldPoint) {
        const matrix = new Mat4();
        this.node.getWorldMatrix(matrix);
        math.mat4.invert(_mat4_temp, matrix);
        const out = new cc.Vec2();
        return math.vec2.transformMat4(out, worldPoint, _mat4_temp);
    }

    /**
     * !#en
     * Converts a Point in node coordinates to world space coordinates.
     * !#zh
     * 将节点坐标系下的一个点转换到世界空间坐标系。
     * @method convertToWorldSpaceAR
     * @param {Vec2} nodePoint
     * @return {Vec2}
     * @example
     * var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
     */
    public convertToWorldSpaceAR (nodePoint) {
        this.node.getWorldMatrix(_worldMatrix);
        const out = new cc.Vec2();
        return math.vec2.transformMat4(out, nodePoint, _worldMatrix);
    }
}
