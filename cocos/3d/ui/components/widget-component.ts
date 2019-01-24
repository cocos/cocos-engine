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

import { widgetManager } from '../../../2d/base-ui/widget-manager';
import { Component} from '../../../components/component';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { Node } from '../../../scene-graph/index';
/**
 * !#en Enum for Widget's alignment mode, indicating when the widget should refresh.
 * !#zh Widget 的对齐模式，表示 Widget 应该何时刷新。
 * @enum Widget.AlignMode
 */
/**
 * !#en
 * Only align once when the Widget is enabled for the first time.
 * This will allow the script or animation to continue controlling the current node.
 * It will only be aligned once before the end of frame when onEnable is called,
 * then immediately disables the Widget.
 * !#zh
 * 仅在 Widget 第一次激活时对齐一次，便于脚本或动画继续控制当前节点。
 * 开启后会在 onEnable 时所在的那一帧结束前对齐一次，然后立刻禁用该 Widget。
 * @property {Number} ONCE
 */
/**
 * !#en Align first from the beginning as ONCE, and then realign it every time the window is resized.
 * !#zh 一开始会像 ONCE 一样对齐一次，之后每当窗口大小改变时还会重新对齐。
 * @property {Number} ON_WINDOW_RESIZE
 */
/**
 * !#en Keep aligning all the way.
 * !#zh 始终保持对齐。
 * @property {Number} ALWAYS
 */
const AlignMode = widgetManager.AlignMode;

const AlignFlags = widgetManager._AlignFlags;
const TOP = AlignFlags.TOP;
const MID = AlignFlags.MID;
const BOT = AlignFlags.BOT;
const LEFT = AlignFlags.LEFT;
const CENTER = AlignFlags.CENTER;
const RIGHT = AlignFlags.RIGHT;
const TOP_BOT = TOP | BOT;
const LEFT_RIGHT = LEFT | RIGHT;

/**
 * !#en
 * Stores and manipulate the anchoring based on its parent.
 * Widget are used for GUI but can also be used for other things.
 * Widget will adjust current node's position and size automatically, but the results after adjustment can not be obtained until the next frame unless you call {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}} manually.
 * !#zh
 * Widget 组件，用于设置和适配其相对于父节点的边距，Widget 通常被用于 UI 界面，也可以用于其他地方。
 * Widget 会自动调整当前节点的坐标和宽高，不过目前调整后的结果要到下一帧才能在脚本里获取到，除非你先手动调用 {{#crossLink "Widget/updateAlignment:method"}}{{/crossLink}}。
 *
 * @class Widget
 * @extends Component
 */
@ccclass('cc.WidgetComponent')
@executionOrder(100)
@menu('UI/Widget')
@executeInEditMode
export class WidgetComponent extends Component {

    /**
     * !#en Specifies an alignment target that can only be one of the parent nodes of the current node.
     * The default value is null, and when null, indicates the current parent.
     * !#zh 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
     * @property {Node} target
     * @default null
     */
    @property({
        type: Node,
    })
    get target () {
        return this._target;
    }

    set target (value) {
        this._target = value;
        if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
            // adjust the offsets to keep the size and position unchanged after target chagned
            // widgetManager.updateOffsetsToStayPut(this);
        }
    }

    // ENABLE ALIGN ?

    /**
     * !#en Whether to align the top.
     * !#zh 是否对齐上边。
     * @property isAlignTop
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignTop () {
        return (this._alignFlags & TOP) > 0;
    }
    set isAlignTop (value) {
        this._setAlign(TOP, value);
    }

    /**
     * !#en Whether to align the bottom.
     * !#zh 是否对齐下边。
     * @property isAlignBottom
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignBottom () {
        return (this._alignFlags & BOT) > 0;
    }
    set isAlignBottom (value) {
        this._setAlign(BOT, value);
    }

    /**
     * !#en Whether to align the left.
     * !#zh 是否对齐左边
     * @property isAlignLeft
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignLeft () {
        return (this._alignFlags & LEFT) > 0;
    }
    set isAlignLeft (value) {
        this._setAlign(LEFT, value);
    }

    /**
     * !#en Whether to align the right.
     * !#zh 是否对齐右边。
     * @property isAlignRight
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignRight () {
        return (this._alignFlags & RIGHT) > 0;
    }
    set isAlignRight (value) {
        this._setAlign(RIGHT, value);
    }

    /**
     * !#en
     * Vertically aligns the midpoint, This will open the other vertical alignment options cancel.
     * !#zh
     * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
     * @property isAlignVerticalCenter
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignVerticalCenter () {
        return (this._alignFlags & MID) > 0;
    }
    set isAlignVerticalCenter (value) {
        if (value) {
            this.isAlignTop = false;
            this.isAlignBottom = false;
            this._alignFlags |= MID;
        } else {
            this._alignFlags &= ~MID;
        }
    }

    /**
     * !#en
     * Horizontal aligns the midpoint. This will open the other horizontal alignment options canceled.
     * !#zh
     * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
     * @property isAlignHorizontalCenter
     * @type {Boolean}
     * @default false
     */
    @property
    get isAlignHorizontalCenter () {
        return (this._alignFlags & CENTER) > 0;
    }
    set isAlignHorizontalCenter (value) {
        if (value) {
            this.isAlignLeft = false;
            this.isAlignRight = false;
            this._alignFlags |= CENTER;
        } else {
            this._alignFlags &= ~CENTER;
        }
    }

    /**
     * !#en
     * Whether the stretched horizontally, when enable the left and right alignment will be stretched horizontally,
     * the width setting is invalid (read only).
     * !#zh
     * 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸，此时节点的宽度只读。
     * @property isStretchWidth
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    @property({
        visible: false,
    })
    get isStretchWidth () {
        return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
    }

    /**
     * !#en
     * Whether the stretched vertically, when enable the left and right alignment will be stretched vertically,
     * then height setting is invalid (read only)
     * !#zh
     * 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度只读。
     * @property isStretchHeight
     * @type {Boolean}
     * @default false
     * @readOnly
     */
    @property({
        visible: false,
    })
    get isStretchHeight () {
        return (this._alignFlags & TOP_BOT) === TOP_BOT;
    }

    // ALIGN MARGINS

    /**
     * !#en
     * The margins between the top of this node and the top of parent node,
     * the value can be negative, Only available in 'isAlignTop' open.
     * !#zh
     * 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。
     * @property top
     * @type {Number}
     * @default 0
     */
    @property
    get top () {
        return this._top;
    }
    set top (value) {
        this._top = value;
    }

    /**
     * !#en
     * The margins between the bottom of this node and the bottom of parent node,
     * the value can be negative, Only available in 'isAlignBottom' open.
     * !#zh
     * 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。
     * @property bottom
     * @type {Number}
     * @default 0
     */
    @property
    get bottom () {
        return this._bottom;
    }
    set bottom (value) {
        this._bottom = value;
    }

    /**
     * !#en
     * The margins between the left of this node and the left of parent node,
     * the value can be negative, Only available in 'isAlignLeft' open.
     * !#zh
     * 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。
     * @property left
     * @type {Number}
     * @default 0
     */
    @property
    get left () {
        return this._left;
    }
    set left (value) {
        this._left = value;
    }

    /**
     * !#en
     * The margins between the right of this node and the right of parent node,
     * the value can be negative, Only available in 'isAlignRight' open.
     * !#zh
     * 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。
     * @property right
     * @type {Number}
     * @default 0
     */
    @property
    get right () {
        return this._right;
    }
    set right (value) {
        this._right = value;
    }

    /**
     * !#en
     * Horizontal aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
     * !#zh 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
     * @property horizontalCenter
     * @type {Number}
     * @default 0
     */
    @property
    get horizontalCenter () {
        return this._horizontalCenter;
    }
    set horizontalCenter (value) {
        this._horizontalCenter = value;
    }

    /**
     * !#en
     * Vertical aligns the midpoint offset value,
     * the value can be negative, Only available in 'isAlignVerticalCenter' open.
     * !#zh 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
     * @property verticalCenter
     * @type {Number}
     * @default 0
     */
    @property
    get verticalCenter () {
        return this._verticalCenter;
    }
    set verticalCenter (value) {
        this._verticalCenter = value;
    }

    /**
     * !#en
     * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     * !#zh
     * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
     * @property isAbsoluteTop
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteTop () {
        return this._isAbsTop;
    }
    set isAbsoluteTop (value) {
        this._isAbsTop = value;
    }

    /**
     * !#en
     * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
     * !#zh
     * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
     * @property isAbsoluteBottom
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteBottom () {
        return this._isAbsBottom;
    }
    set isAbsoluteBottom (value) {
        this._isAbsBottom = value;
    }

    /**
     * !#en
     * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     * !#zh
     * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
     * @property isAbsoluteLeft
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteLeft () {
        return this._isAbsLeft;
    }
    set isAbsoluteLeft (value) {
        this._isAbsLeft = value;
    }

    /**
     * !#en
     * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
     * !#zh
     * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
     * @property isAbsoluteRight
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteRight () {
        return this._isAbsRight;
    }
    set isAbsoluteRight (value) {
        this._isAbsRight = value;
    }

    /**
     * !#en Specifies the alignment mode of the Widget, which determines when the widget should refresh.
     * !#zh 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
     * @property {Widget.AlignMode} alignMode
     * @example
     * widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
     */
    @property({
        type: AlignMode,
    })
    get alignMode () {
        return this._alignMode;
    }

    set alignMode (value) {
        this._alignMode = value;
    }

    /**
     * !#en If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     * !#zh 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
     * @property isAbsoluteHorizontalCenter
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteHorizontalCenter () {
        return this._isAbsHorizontalCenter;
    }

    set isAbsoluteHorizontalCenter (value) {
        this._isAbsHorizontalCenter = value;
    }

    /**
     * !#en If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
     * !#zh 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
     * @property isAbsoluteVerticalCenter
     * @type {Boolean}
     * @default true
     */
    @property
    get isAbsoluteVerticalCenter () {
        return this._isAbsVerticalCenter;
    }
    set isAbsoluteVerticalCenter (value) {
        this._isAbsVerticalCenter = value;
    }

    public static AlignMode = AlignMode;
    /**
     * !#zh: 对齐开关，由 AlignFlags 组成
     *
     * @property _alignFlags
     * @type {Number}
     * @default 0
     * @private
     */
    private _alignFlags = 0;
    private _wasAlignOnce = false;
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
     * !#en
     * Immediately perform the widget alignment. You need to manually call this method only if
     * you need to get the latest results after the alignment before the end of current frame.
     * !#zh
     * 立刻执行 widget 对齐操作。这个接口一般不需要手工调用。
     * 只有当你需要在当前帧结束前获得 widget 对齐后的最新结果时才需要手动调用这个方法。
     *
     * @method updateAlignment
     *
     * @example
     * widget.top = 10;       // change top margin
     * cc.log(widget.node.y); // not yet changed
     * widget.updateAlignment();
     * cc.log(widget.node.y); // changed
     */
    public updateAlignment () {
        widgetManager.updateAlignment(this.node);
    }

    protected onLoad () {
        // TODO:
        // if (this._wasAlignOnce) {
        //     // migrate for old version
        //     this.alignMode = this._wasAlignOnce ? AlignMode.ONCE : AlignMode.ALWAYS;
        //     this._wasAlignOnce = false;
        // }
        if(this._alignMode === AlignMode.ONCE){
            this._wasAlignOnce = true;
        }
    }

    protected onEnable () {
        widgetManager.add(this);
    }

    protected onDisable () {
        widgetManager.remove(this);
    }

    private _setAlign (flag, isAlign) {
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
                    this._originalWidth = this.node.width;
                    // test check conflict
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        // _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            } else {
                this.isAlignVerticalCenter = false;
                if (this.isStretchHeight) {
                    // become stretch
                    this._originalHeight = this.node.height;
                    // test check conflict
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        // _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            }

            if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
                // adjust the offsets to keep the size and position unchanged after alignment chagned
                // widgetManager.updateOffsetsToStayPut(this, flag);
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
}

/**
 * !#en
 * When turned on, it will only be aligned once at the end of the onEnable frame,
 * then immediately disables the current component.
 * This will allow the script or animation to continue controlling the current node.
 * Note: It will still be aligned at the frame when onEnable is called.
 * !#zh
 * 开启后仅会在 onEnable 的当帧结束时对齐一次，然后立刻禁用当前组件。
 * 这样便于脚本或动画继续控制当前节点。
 * 注意：onEnable 时所在的那一帧仍然会进行对齐。
 * @property {Boolean} isAlignOnce
 * @default false
 * @deprecated
 */
// Object.defineProperty(Widget.prototype, 'isAlignOnce', {
//     get() {
//         if (CC_DEBUG) {
//             cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode === cc.Widget.AlignMode.ONCE` instead please.');
//         }
//         return this.alignMode === AlignMode.ONCE;
//     }
//     set(value) {
//         if (CC_DEBUG) {
//             cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode = cc.Widget.AlignMode.*` instead please.');
//         }
//         this.alignMode = value ? AlignMode.ONCE : AlignMode.ALWAYS;
//     }
// });

// cc.Widget = module.exports = Widget;
