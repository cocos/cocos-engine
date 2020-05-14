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
 * @category ui
 */

import { Component} from '../../core/components';
import { UITransformComponent } from '../../core/components/ui-base/ui-transform-component';
import { ccclass, help, executeInEditMode, executionOrder, menu, property, requireComponent } from '../../core/data/class-decorator';
import { Size, Vec3 } from '../../core/math';
import { errorID } from '../../core/platform/debug';
import { SystemEventType } from '../../core/platform/event-manager/event-enum';
import { View } from '../../core/platform/view';
import visibleRect from '../../core/platform/visible-rect';
import { Scene } from '../../core/scene-graph';
import { Node } from '../../core/scene-graph/node';
import { ccenum } from '../../core/value-types/enum';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { EDITOR, DEV } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';

const _zeroVec3 = new Vec3();

// returns a readonly size of the node
export function getReadonlyNodeSize (parent: Node) {
    if (parent instanceof Scene) {
        // @ts-ignore
        if (EDITOR) {
            // const canvasComp = parent.getComponentInChildren(CanvasComponent);
            if (!View.instance) {
                throw new Error('cc.view uninitiated');
            }

            return View.instance.getDesignResolutionSize();
        }

        return visibleRect;
    } else {
        return parent.getContentSize();
    }
}

export function computeInverseTransForTarget (widgetNode: Node, target: Node, out_inverseTranslate: Vec3, out_inverseScale: Vec3) {
    let scale = widgetNode.parent ? widgetNode.parent.getScale() : _zeroVec3;
    let scaleX = scale.x;
    let scaleY = scale.y;
    let translateX = 0;
    let translateY = 0;
    for (let node = widgetNode.parent; ;) {
        if (!node) {
            // ERROR: widgetNode should be child of target
            out_inverseTranslate.x = out_inverseTranslate.y = 0;
            out_inverseScale.x = out_inverseScale.y = 1;
            return;
        }

        const pos = node.getPosition();
        translateX += pos.x;
        translateY += pos.y;
        node = node.parent;    // loop increment

        if (node !== target) {
            scale = node ? node.getScale() : _zeroVec3;
            const sx = scale.x;
            const sy = scale.y;
            translateX *= sx;
            translateY *= sy;
            scaleX *= sx;
            scaleY *= sy;
        } else {
            break;
        }
    }
    out_inverseScale.x = scaleX !== 0 ? (1 / scaleX) : 1;
    out_inverseScale.y = scaleY !== 0 ? (1 / scaleY) : 1;
    out_inverseTranslate.x = -translateX;
    out_inverseTranslate.y = -translateY;
}

/**
 * @en Enum for Widget's alignment mode, indicating when the widget should refresh.
 *
 * @zh Widget 的对齐模式，表示 Widget 应该何时刷新。
 */
export enum AlignMode {
    /**
     * @en Only align once when the Widget is enabled for the first time.
     * This will allow the script or animation to continue controlling the current node.
     * It will only be aligned once before the end of frame when onEnable is called,then immediately disables the Widget.
     *
     * @zh 仅在 Widget 第一次激活时对齐一次，便于脚本或动画继续控制当前节点。<br/>
     * 开启后会在 onEnable 时所在的那一帧结束前对齐一次，然后立刻禁用该 Widget。
     */
    ONCE = 0,
    /**
     * @en Keep aligning all the way.
     *
     * @zh  始终保持对齐。
     */
    ALWAYS = 1,
    /**
     * @zh
     * 一开始会像 ONCE 一样对齐一次，之后每当窗口大小改变时还会重新对齐。
     */
    ON_WINDOW_RESIZE = 2,
}

ccenum(AlignMode);

/**
 * @en Enum for Widget's alignment flag, indicating when the widget select alignment.
 *
 * @zh Widget 的对齐标志，表示 Widget 选择对齐状态。
 */
export enum AlignFlags {
    /**
     * @en Align top.
     *
     * @zh 上边对齐。
     */
    TOP = 1 << 0,
    /**
     * @en Align middle.
     *
     * @zh 垂直中心对齐。
     */
    MID = 1 << 1,
    /**
     * @en Align bottom.
     *
     * @zh 下边对齐。
     */
    BOT = 1 << 2,
    /**
     * @en Align left.
     *
     * @zh 左边对齐。
     */
    LEFT = 1 << 3,
    /**
     * @en Align center.
     *
     * @zh 横向中心对齐。
     */
    CENTER = 1 << 4,
    /**
     * @en Align right.
     *
     * @zh 右边对齐。
     */
    RIGHT = 1 << 5,
    /**
     * @en Align horizontal.
     *
     * @zh 横向对齐。
     */
    HORIZONTAL = LEFT | CENTER | RIGHT,
    /**
     * @en Align vertical.
     *
     * @zh 纵向对齐。
     */
    VERTICAL = TOP | MID | BOT,
}

const TOP_BOT = AlignFlags.TOP | AlignFlags.BOT;
const LEFT_RIGHT = AlignFlags.LEFT | AlignFlags.RIGHT;

/**
 * @en
 * Stores and manipulate the anchoring based on its parent.
 * Widget are used for GUI but can also be used for other things.
 * Widget will adjust current node's position and size automatically,
 * but the results after adjustment can not be obtained until the next frame unless you call [[updateAlignment]] manually.
 *
 * @zh Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。<br/>
 * Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 [[updateAlignment]]。
 */
@ccclass('cc.WidgetComponent')
@help('i18n:cc.WidgetComponent')
@executionOrder(110)
@menu('UI/Widget')
@requireComponent(UITransformComponent)
@executeInEditMode
export class WidgetComponent extends Component {
    /**
     * @en
     * Specifies an alignment target that can only be one of the parent nodes of the current node.
     * The default value is null, and when null, indicates the current parent.
     *
     * @zh
     * 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
     */
    @property({
        type: Node,
        tooltip:'对齐目标',
    })
    get target () {
        return this._target;
    }

    set target (value) {
        if (this._target === value){
            return;
        }

        this._unregisterTargetEvents();
        this._target = value;
        this._registerTargetEvents();
        if (EDITOR /*&& !cc.engine._isPlaying*/ && this.node.parent) {
            // adjust the offsets to keep the size and position unchanged after target changed
            legacyCC._widgetManager.updateOffsetsToStayPut(this);
        }

        this._validateTargetInDEV();

        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align to the top.
     *
     * @zh
     * 是否对齐上边。
     */
    @property({
        tooltip:'是否对齐上边',
    })
    get isAlignTop () {
        return (this._alignFlags & AlignFlags.TOP) > 0;
    }
    set isAlignTop (value) {
        this._setAlign(AlignFlags.TOP, value);
        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align to the bottom.
     *
     * @zh
     * 是否对齐下边。
     */
    @property({
        tooltip:'是否对齐下边',
    })
    get isAlignBottom () {
        return (this._alignFlags & AlignFlags.BOT) > 0;
    }
    set isAlignBottom (value) {
        this._setAlign(AlignFlags.BOT, value);
        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align to the left.
     *
     * @zh
     * 是否对齐左边。
     */
    @property({
        tooltip:'是否对齐左边',
    })
    get isAlignLeft () {
        return (this._alignFlags & AlignFlags.LEFT) > 0;
    }
    set isAlignLeft (value) {
        this._setAlign(AlignFlags.LEFT, value);
        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align to the right.
     *
     * @zh
     * 是否对齐右边。
     */
    @property({
        tooltip:'是否对齐右边',
    })
    get isAlignRight () {
        return (this._alignFlags & AlignFlags.RIGHT) > 0;
    }
    set isAlignRight (value) {
        this._setAlign(AlignFlags.RIGHT, value);
        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align vertically.
     *
     * @zh
     * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
     */
    @property({
        tooltip:'是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消',
    })
    get isAlignVerticalCenter () {
        return (this._alignFlags & AlignFlags.MID) > 0;
    }
    set isAlignVerticalCenter (value) {
        if (value) {
            this.isAlignTop = false;
            this.isAlignBottom = false;
            this._alignFlags |= AlignFlags.MID;
        } else {
            this._alignFlags &= ~AlignFlags.MID;
        }

        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to align horizontally.
     *
     * @zh
     * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
     */
    @property({
        tooltip:'是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消',
    })
    get isAlignHorizontalCenter () {
        return (this._alignFlags & AlignFlags.CENTER) > 0;
    }
    set isAlignHorizontalCenter (value) {
        if (value) {
            this.isAlignLeft = false;
            this.isAlignRight = false;
            this._alignFlags |= AlignFlags.CENTER;
        } else {
            this._alignFlags &= ~AlignFlags.CENTER;
        }
        this._recursiveDirty();
    }

    /**
     * @en
     * Whether to stretch horizontally, when enable the left and right alignment will be stretched horizontally,
     * the width setting is invalid (read only).
     *
     * @zh
     * 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸。此时节点的宽度（只读）。
     */
    @property({
        visible: false,
    })
    get isStretchWidth () {
        return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
    }

    /**
     * @en
     * Whether to stretch vertically, when enable the left and right alignment will be stretched vertically,
     * then height setting is invalid (read only).
     *
     * @zh
     * 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度（只读）。
     */
    @property({
        visible: false,
    })
    get isStretchHeight () {
        return (this._alignFlags & TOP_BOT) === TOP_BOT;
    }

    // ALIGN MARGINS

    /**
     * @en
     * The margins between the top of this node and the top of parent node,
     * the value can be negative, Only available in 'isAlignTop' open.
     *
     * @zh
     * 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。
     */
    get top () {
        return this._top;
    }
    set top (value) {
        this._top = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorTop () {
        return this._isAbsTop ? this._top : (this._top * 100);
    }
    set editorTop (value) {
        this._top = this._isAbsTop ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * The margins between the bottom of this node and the bottom of parent node,
     * the value can be negative, Only available in 'isAlignBottom' open.
     *
     * @zh
     * 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。
     */
    get bottom () {
        return this._bottom;
    }
    set bottom (value) {
        this._bottom = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorBottom () {
        return this._isAbsBottom ? this._bottom : (this._bottom * 100);
    }
    set editorBottom (value) {
        this._bottom = this._isAbsBottom ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * The margins between the left of this node and the left of parent node,
     * the value can be negative, Only available in 'isAlignLeft' open.
     *
     * @zh
     * 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。
     */
    get left () {
        return this._left;
    }
    set left (value) {
        this._left = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorLeft () {
        return this._isAbsLeft ? this._left : (this._left * 100);
    }
    set editorLeft (value) {
        this._left = this._isAbsLeft ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * The margins between the right of this node and the right of parent node,
     * the value can be negative, Only available in 'isAlignRight' open.
     *
     * @zh
     * 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。
     */
    get right () {
        return this._right;
    }
    set right (value) {
        this._right = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorRight () {
        return this._isAbsRight ? this._right : (this._right * 100);
    }
    set editorRight (value) {
        this._right = this._isAbsRight ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * Horizontally aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
     *
     * @zh
     * 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
     */
    get horizontalCenter () {
        return this._horizontalCenter;
    }
    set horizontalCenter (value) {
        this._horizontalCenter = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorHorizontalCenter () {
        return this._isAbsHorizontalCenter ? this._horizontalCenter : (this._horizontalCenter * 100);
    }
    set editorHorizontalCenter (value) {
        this._horizontalCenter = this._isAbsHorizontalCenter ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * Vertically aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignVerticalCenter' open.
     *
     * @zh
     * 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
     */
    get verticalCenter () {
        return this._verticalCenter;
    }
    set verticalCenter (value) {
        this._verticalCenter = value;
        this._recursiveDirty();
    }

    /**
     * @EditorOnly Not for user
     */
    @property
    get editorVerticalCenter () {
        return this._isAbsVerticalCenter ? this._verticalCenter : (this._verticalCenter * 100);
    }
    set editorVerticalCenter (value) {
        this._verticalCenter = this._isAbsVerticalCenter ? value : (value / 100);
        this._recursiveDirty();
    }

    /**
     * @en
     * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     *
     * @zh
     * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
     */
    @property
    get isAbsoluteTop () {
        return this._isAbsTop;
    }
    set isAbsoluteTop (value) {
        if (this._isAbsTop === value){
            return;
        }

        this._isAbsTop = value;
        this._autoChangedValue(AlignFlags.TOP, this._isAbsTop);
    }

    /**
     * @en
     * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     *
     * @zh
     * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的比例（0 到 1）作为边距。
     */
    @property
    get isAbsoluteBottom () {
        return this._isAbsBottom;
    }
    set isAbsoluteBottom (value) {
        if (this._isAbsBottom === value){
            return;
        }

        this._isAbsBottom = value;
        this._autoChangedValue(AlignFlags.BOT, this._isAbsBottom);
    }

    /**
     * @en
     * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     *
     * @zh
     * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
     */
    @property
    get isAbsoluteLeft () {
        return this._isAbsLeft;
    }
    set isAbsoluteLeft (value) {
        if (this._isAbsLeft === value) {
            return;
        }

        this._isAbsLeft = value;
        this._autoChangedValue(AlignFlags.LEFT, this._isAbsLeft);
    }

    /**
     * @en
     * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     *
     * @zh
     * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的比例（0 到 1）作为边距。
     */
    @property
    get isAbsoluteRight () {
        return this._isAbsRight;
    }
    set isAbsoluteRight (value) {
        if (this._isAbsRight === value){
            return;
        }

        this._isAbsRight = value;
        this._autoChangedValue(AlignFlags.RIGHT, this._isAbsRight);
    }

    /**
     * @en
     * Specifies the alignment mode of the Widget, which determines when the widget should refresh.
     *
     * @zh
     * 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
     *
     * @example
     * ```
     * widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
     * ```
     */
    @property({
        type: AlignMode,
        tooltip:'指定 widget 的对齐方式，用于决定运行时 widget 应何时更新',
    })
    get alignMode () {
        return this._alignMode;
    }

    set alignMode (value) {
        this._alignMode = value;
        this._recursiveDirty();
    }

    /**
     * @en
     * If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     *
     * @zh
     * 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
     */
    @property
    get isAbsoluteHorizontalCenter () {
        return this._isAbsHorizontalCenter;
    }

    set isAbsoluteHorizontalCenter (value) {
        if (this._isAbsHorizontalCenter === value) {
            return;
        }

        this._isAbsHorizontalCenter = value;
        this._autoChangedValue(AlignFlags.CENTER, this._isAbsHorizontalCenter);
    }

    /**
     * @en
     * If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     *
     * @zh
     * 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为比例（0 到 1）。
     */
    @property
    get isAbsoluteVerticalCenter () {
        return this._isAbsVerticalCenter;
    }
    set isAbsoluteVerticalCenter (value) {
        if (this._isAbsVerticalCenter === value){
            return;
        }

        this._isAbsVerticalCenter = value;
        this._autoChangedValue(AlignFlags.MID, this._isAbsVerticalCenter);
    }

    /**
     * @zh
     * 对齐开关，由 AlignFlags 组成
     */
    @property
    get alignFlags () {
        return this._alignFlags;
    }

    set alignFlags (value) {
        if (this._alignFlags === value) {
            return;
        }

        this._alignFlags = value;
        this._recursiveDirty();
    }

    public static AlignMode = AlignMode;

    public _lastPos = new Vec3();
    public _lastSize = new Size();
    public _dirty = true;

    @property
    private _alignFlags = 0;
    @property
    private _target: Node | null = null;
    @property
    private _left = 0;
    @property
    private _right = 0;
    @property
    private _top = 0;
    @property
    private _bottom = 0;
    @property
    private _horizontalCenter = 0;
    @property
    private _verticalCenter = 0;
    @property
    private _isAbsLeft = true;
    @property
    private _isAbsRight = true;
    @property
    private _isAbsTop = true;
    @property
    private _isAbsBottom = true;
    @property
    private _isAbsHorizontalCenter = true;
    @property
    private _isAbsVerticalCenter = true;
    // original size before align
    @property
    private _originalWidth = 0;
    @property
    private _originalHeight = 0;
    @property
    private _alignMode = AlignMode.ON_WINDOW_RESIZE;

    /**
     * @en
     * Immediately perform the widget alignment. You need to manually call this method only if
     * you need to get the latest results after the alignment before the end of current frame.
     *
     * @zh
     * 立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
     * 只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
     *
     * @example
     * ```typescript
     * widget.top = 10;       // change top margin
     * cc.log(widget.node.y); // not yet changed
     * widget.updateAlignment();
     * cc.log(widget.node.y); // changed
     * ```
     */
    public updateAlignment () {
        legacyCC._widgetManager.updateAlignment(this.node as Node);
    }

    public _validateTargetInDEV () {
        if (!DEV) {
            return;
        }

        const target = this._target;
        if (target) {
            const isParent = this.node !== target && this.node.isChildOf(target);
            if (!isParent) {
                errorID(6500);
                this.target = null;
            }
        }

    }

    public setDirty (){
        this._recursiveDirty();
    }

    public onEnable () {
        this.node.getPosition(this._lastPos);
        this.node.getContentSize(this._lastSize);
        legacyCC._widgetManager.add(this);
        this._registerEvent();
        this._registerTargetEvents();
    }

    public onDisable () {
        legacyCC._widgetManager.remove(this);
        this._unregisterEvent();
        this._unregisterTargetEvents();
    }

    public onDestroy () {
        this._removeParentEvent();
    }

    public _adjustWidgetToAllowMovingInEditor (eventType: TransformBit) {
        if (/*!EDITOR ||*/ !(eventType & TransformBit.POSITION)) {
            return;
        }

        if (legacyCC._widgetManager.isAligning) {
            return;
        }

        const self = this;
        const newPos = self.node.getPosition();
        const oldPos = this._lastPos;
        const delta = new Vec3(newPos);
        delta.subtract(oldPos);

        let target = self.node.parent;
        const inverseScale = new Vec3(1, 1, 1);

        if (self.target) {
            target = self.target;
            computeInverseTransForTarget(self.node, target, new Vec3(), inverseScale);
        }
        if (!target) {
            return;
        }

        const targetSize = getReadonlyNodeSize(target);
        const deltaInPercent = new Vec3();
        if (targetSize.width !== 0 && targetSize.height !== 0) {
            Vec3.set(deltaInPercent, delta.x / targetSize.width, delta.y / targetSize.height, deltaInPercent.z);
        }

        if (self.isAlignTop) {
            self._top -= (self._isAbsTop ? delta.y : deltaInPercent.y) * inverseScale.y;
        }
        if (self.isAlignBottom) {
            self._bottom += (self._isAbsBottom ? delta.y : deltaInPercent.y) * inverseScale.y;
        }
        if (self.isAlignLeft) {
            self._left += (self._isAbsLeft ? delta.x : deltaInPercent.x) * inverseScale.x;
        }
        if (self.isAlignRight) {
            self._right -= (self._isAbsRight ? delta.x : deltaInPercent.x) * inverseScale.x;
        }
        if (self.isAlignHorizontalCenter) {
            self._horizontalCenter += (self._isAbsHorizontalCenter ? delta.x : deltaInPercent.x) * inverseScale.x;
        }
        if (self.isAlignVerticalCenter) {
            self._verticalCenter += (self._isAbsVerticalCenter ? delta.y : deltaInPercent.y) * inverseScale.y;
        }
        this._recursiveDirty();
    }

    public _adjustWidgetToAllowResizingInEditor () {
        // if (!EDITOR) {
        //     return;
        // }

        if (legacyCC._widgetManager.isAligning) {
            return;
        }

        this.setDirty();

        const self = this;
        const newSize = self.node.getContentSize();
        const oldSize = this._lastSize;
        const delta = new Vec3(newSize.width - oldSize.width, newSize.height - oldSize.height, 0);

        let target = self.node.parent;
        const inverseScale = new Vec3(1, 1, 1);
        if (self.target) {
            target = self.target;
            computeInverseTransForTarget(self.node, target, new Vec3(), inverseScale);
        }
        if (!target) {
            return;
        }

        const targetSize = getReadonlyNodeSize(target);
        const deltaInPercent = new Vec3();
        if (targetSize.width !== 0 && targetSize.height !== 0) {
            Vec3.set(deltaInPercent, delta.x / targetSize.width , delta.y / targetSize.height, deltaInPercent.z);
        }

        const anchor = self.node.getAnchorPoint();

        if (self.isAlignTop) {
            self._top -= (self._isAbsTop ? delta.y : deltaInPercent.y) * (1 - anchor.y) * inverseScale.y;
        }
        if (self.isAlignBottom) {
            self._bottom -= (self._isAbsBottom ? delta.y : deltaInPercent.y) * anchor.y * inverseScale.y;
        }
        if (self.isAlignLeft) {
            self._left -= (self._isAbsLeft ? delta.x : deltaInPercent.x) * anchor.x * inverseScale.x;
        }
        if (self.isAlignRight) {
            self._right -= (self._isAbsRight ? delta.x : deltaInPercent.x) * (1 - anchor.x) * inverseScale.x;
        }
        this._recursiveDirty();
    }

    public _adjustWidgetToAnchorChanged () {
        this.setDirty();
    }

    public _adjustTargetToParentChanged (oldParent: Node) {
        if (oldParent) {
            this._unregisterOldParentEvents(oldParent);
        }
        if (this.node.getParent()) {
            this._registerTargetEvents();
        }
    }

    protected _registerEvent () {
        this.node.on(SystemEventType.TRANSFORM_CHANGED, this._adjustWidgetToAllowMovingInEditor, this);
        this.node.on(SystemEventType.SIZE_CHANGED, this._adjustWidgetToAllowResizingInEditor, this);
        this.node.on(SystemEventType.ANCHOR_CHANGED, this._adjustWidgetToAnchorChanged, this);
        this.node.on(SystemEventType.PARENT_CHANGED, this._adjustTargetToParentChanged, this);
    }

    protected _unregisterEvent () {
        this.node.off(SystemEventType.TRANSFORM_CHANGED, this._adjustWidgetToAllowMovingInEditor, this);
        this.node.off(SystemEventType.SIZE_CHANGED, this._adjustWidgetToAllowResizingInEditor, this);
        this.node.off(SystemEventType.ANCHOR_CHANGED, this._adjustWidgetToAnchorChanged, this);
    }

    protected _removeParentEvent () {
        this.node.off(SystemEventType.PARENT_CHANGED, this._adjustTargetToParentChanged, this);
    }

    protected _autoChangedValue (flag: AlignFlags, isAbs: boolean){
        const current = (this._alignFlags & flag) > 0;
        if (!current || !this.node.parent || !this.node.parent._uiProps.uiTransformComp){
            return;
        }

        const size = this.node.parent!.getContentSize();
        if (this.isAlignLeft && flag === AlignFlags.LEFT) {
            this._left = isAbs ? this._left * size.width : this._left / size.width;
        } else if (this.isAlignRight && flag === AlignFlags.RIGHT) {
            this._right = isAbs ? this._right * size.width : this._right / size.width;
        } else if (this.isAlignHorizontalCenter && flag === AlignFlags.CENTER) {
            this._horizontalCenter = isAbs ? this._horizontalCenter * size.width : this._horizontalCenter / size.width;
        } else if (this.isAlignTop && flag === AlignFlags.TOP) {
            this._top = isAbs ? this._top * size.height : this._top / size.height;
        } else if (this.isAlignBottom && flag === AlignFlags.BOT) {
            this._bottom = isAbs ? this._bottom * size.height : this._bottom / size.height;
        } else if (this.isAbsoluteVerticalCenter && flag === AlignFlags.MID) {
            this._verticalCenter = isAbs ? this._verticalCenter / size.height : this._verticalCenter / size.height;
        }

        this._recursiveDirty();
    }

    protected _registerTargetEvents () {
        const target = this._target || this.node.parent;
        if (target) {
            if (target.getComponent(UITransformComponent)) {
                target.on(SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
                target.on(SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
            } else {
                legacyCC.warnID(6501, this.node.name);
            }
        }
    }

    protected _unregisterTargetEvents () {
        const target = this._target || this.node.parent;
        if (target) {
            target.off(SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
            target.off(SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
        }
    }

    protected _unregisterOldParentEvents ( oldParent: Node ) {
        const target = this._target || oldParent;
        if (target) {
            target.off(SystemEventType.TRANSFORM_CHANGED, this._targetChangedOperation, this);
            target.off(SystemEventType.SIZE_CHANGED, this._targetChangedOperation, this);
        }
    }

    protected _targetChangedOperation (){
        this._recursiveDirty();
    }

    private _setAlign (flag: AlignFlags, isAlign: boolean) {
        const current = (this._alignFlags & flag) > 0;
        if (isAlign === current) {
            return;
        }
        const isHorizontal = (flag & LEFT_RIGHT) > 0;
        if (isAlign) {
            this._alignFlags |= flag;

            if (isHorizontal) {
                this.isAlignHorizontalCenter = false;
                if (this.isStretchWidth) {
                    // become stretch
                    this._originalWidth = this.node.width!;
                    // test check conflict
                    if (EDITOR /*&& !cc.engine.isPlaying*/) {
                        // TODO:
                        // _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            } else {
                this.isAlignVerticalCenter = false;
                if (this.isStretchHeight) {
                    // become stretch
                    this._originalHeight = this.node.height!;
                    // test check conflict
                    if (EDITOR /*&& !cc.engine.isPlaying*/) {
                        // TODO:
                        // _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            }

            if (EDITOR && this.node.parent) {
                // adjust the offsets to keep the size and position unchanged after alignment changed
                legacyCC._widgetManager.updateOffsetsToStayPut(this, flag);
            }
        } else {
            if (isHorizontal) {
                if (this.isStretchWidth) {
                    // will cancel stretch
                    this.node.width = this._originalWidth;
                }
            } else {
                if (this.isStretchHeight) {
                    // will cancel stretch
                    this.node.height = this._originalHeight;
                }
            }

            this._alignFlags &= ~flag;
        }
    }

    private _recursiveDirty () {
        if (this._dirty){
            return;
        }

        this._dirty = true;
    }
}

// @ts-ignore
legacyCC.WidgetComponent = WidgetComponent;

// cc.Widget = module.exports = Widget;
