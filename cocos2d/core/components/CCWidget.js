/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

var WidgetManager = require('../base-ui/CCWidgetManager');

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
var AlignMode = WidgetManager.AlignMode;

var AlignFlags = WidgetManager._AlignFlags;
var TOP     = AlignFlags.TOP;
var MID     = AlignFlags.MID;
var BOT     = AlignFlags.BOT;
var LEFT    = AlignFlags.LEFT;
var CENTER  = AlignFlags.CENTER;
var RIGHT   = AlignFlags.RIGHT;
var TOP_BOT = TOP | BOT;
var LEFT_RIGHT = LEFT | RIGHT;

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
var Widget = cc.Class({
    name: 'cc.Widget', extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Widget',
        help: 'i18n:COMPONENT.help_url.widget',
        inspector: 'packages://inspector/inspectors/comps/ccwidget.js',
        executeInEditMode: true,
        disallowMultiple: true,
    },

    properties: {

        /**
         * !#en Specifies an alignment target that can only be one of the parent nodes of the current node.
         * The default value is null, and when null, indicates the current parent.
         * !#zh 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。
         * @property {Node} target
         * @default null
         */
        target: {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
                if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
                    // adjust the offsets to keep the size and position unchanged after target chagned
                    WidgetManager.updateOffsetsToStayPut(this);
                }
            },
            type: cc.Node,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.target',
        },

        // ENABLE ALIGN ?

        /**
         * !#en Whether to align the top.
         * !#zh 是否对齐上边。
         * @property isAlignTop
         * @type {Boolean}
         * @default false
         */
        isAlignTop: {
            get: function () {
                return (this._alignFlags & TOP) > 0;
            },
            set: function (value) {
                this._setAlign(TOP, value);
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_top',
        },

        /**
         * !#en
         * Vertically aligns the midpoint, This will open the other vertical alignment options cancel.
         * !#zh
         * 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。
         * @property isAlignVerticalCenter
         * @type {Boolean}
         * @default false
         */
        isAlignVerticalCenter: {
            get: function () {
                return (this._alignFlags & MID) > 0;
            },
            set: function (value) {
                if (value) {
                    this.isAlignTop = false;
                    this.isAlignBottom = false;
                    this._alignFlags |= MID;
                }
                else {
                    this._alignFlags &= ~MID;
                }
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_v_center',
        },

        /**
         * !#en Whether to align the bottom.
         * !#zh 是否对齐下边。
         * @property isAlignBottom
         * @type {Boolean}
         * @default false
         */
        isAlignBottom: {
            get: function () {
                return (this._alignFlags & BOT) > 0;
            },
            set: function (value) {
                this._setAlign(BOT, value);
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_bottom',
        },

        /**
         * !#en Whether to align the left.
         * !#zh 是否对齐左边
         * @property isAlignLeft
         * @type {Boolean}
         * @default false
         */
        isAlignLeft: {
            get: function () {
                return (this._alignFlags & LEFT) > 0;
            },
            set: function (value) {
                this._setAlign(LEFT, value);
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_left',
        },

        /**
         * !#en
         * Horizontal aligns the midpoint. This will open the other horizontal alignment options canceled.
         * !#zh
         * 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。
         * @property isAlignHorizontalCenter
         * @type {Boolean}
         * @default false
         */
        isAlignHorizontalCenter: {
            get: function () {
                return (this._alignFlags & CENTER) > 0;
            },
            set: function (value) {
                if (value) {
                    this.isAlignLeft = false;
                    this.isAlignRight = false;
                    this._alignFlags |= CENTER;
                }
                else {
                    this._alignFlags &= ~CENTER;
                }
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_h_center',
        },

        /**
         * !#en Whether to align the right.
         * !#zh 是否对齐右边。
         * @property isAlignRight
         * @type {Boolean}
         * @default false
         */
        isAlignRight: {
            get: function () {
                return (this._alignFlags & RIGHT) > 0;
            },
            set: function (value) {
                this._setAlign(RIGHT, value);
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_right',
        },

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
        isStretchWidth: {
            get: function () {
                return (this._alignFlags & LEFT_RIGHT) === LEFT_RIGHT;
            },
            visible: false
        },
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
        isStretchHeight: {
            get: function () {
                return (this._alignFlags & TOP_BOT) === TOP_BOT;
            },
            visible: false
        },

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
        top: {
            get: function () {
                return this._top;
            },
            set: function (value) {
                this._top = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.top',
        },

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
        bottom: {
            get: function () {
                return this._bottom;
            },
            set: function (value) {
                this._bottom = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.bottom',
        },

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
        left: {
            get: function () {
                return this._left;
            },
            set: function (value) {
                this._left = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.left',
        },

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
        right: {
            get: function () {
                return this._right;
            },
            set: function (value) {
                this._right = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.right',
        },

        /**
         * !#en
         * Horizontal aligns the midpoint offset value,
         * the value can be negative, Only available in 'isAlignHorizontalCenter' open.
         * !#zh 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。
         * @property horizontalCenter
         * @type {Number}
         * @default 0
         */
        horizontalCenter: {
            get: function () {
                return this._horizontalCenter;
            },
            set: function (value) {
                this._horizontalCenter = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.horizontal_center',
        },

        /**
         * !#en
         * Vertical aligns the midpoint offset value,
         * the value can be negative, Only available in 'isAlignVerticalCenter' open.
         * !#zh 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。
         * @property verticalCenter
         * @type {Number}
         * @default 0
         */
        verticalCenter: {
            get: function () {
                return this._verticalCenter;
            },
            set: function (value) {
                this._verticalCenter = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.widget.vertical_center',
        },

        // PARCENTAGE OR ABSOLUTE

        /**
         * !#en If true, horizontalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
         * !#zh 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
         * @property isAbsoluteHorizontalCenter
         * @type {Boolean}
         * @default true
         */
        isAbsoluteHorizontalCenter: {
            get: function () {
                return this._isAbsHorizontalCenter;
            },
            set: function (value) {
                this._isAbsHorizontalCenter = value;
            },
            animatable: false
        },

        /**
         * !#en If true, verticalCenter is pixel margin, otherwise is percentage (0 - 1) margin.
         * !#zh 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。
         * @property isAbsoluteVerticalCenter
         * @type {Boolean}
         * @default true
         */
        isAbsoluteVerticalCenter: {
            get: function () {
                return this._isAbsVerticalCenter;
            },
            set: function (value) {
                this._isAbsVerticalCenter = value;
            },
            animatable: false
        },

        /**
         * !#en
         * If true, top is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
         * !#zh
         * 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
         * @property isAbsoluteTop
         * @type {Boolean}
         * @default true
         */
        isAbsoluteTop: {
            get: function () {
                return this._isAbsTop;
            },
            set: function (value) {
                this._isAbsTop = value;
            },
            animatable: false
        },

        /**
         * !#en
         * If true, bottom is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's height.
         * !#zh
         * 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。
         * @property isAbsoluteBottom
         * @type {Boolean}
         * @default true
         */
        isAbsoluteBottom: {
            get: function () {
                return this._isAbsBottom;
            },
            set: function (value) {
                this._isAbsBottom = value;
            },
            animatable: false
        },

        /**
         * !#en
         * If true, left is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
         * !#zh
         * 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
         * @property isAbsoluteLeft
         * @type {Boolean}
         * @default true
         */
        isAbsoluteLeft: {
            get: function () {
                return this._isAbsLeft;
            },
            set: function (value) {
                this._isAbsLeft = value;
            },
            animatable: false
        },

        /**
         * !#en
         * If true, right is pixel margin, otherwise is percentage (0 - 1) margin relative to the parent's width.
         * !#zh
         * 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。
         * @property isAbsoluteRight
         * @type {Boolean}
         * @default true
         */
        isAbsoluteRight: {
            get: function () {
                return this._isAbsRight;
            },
            set: function (value) {
                this._isAbsRight = value;
            },
            animatable: false
        },

        /**
         * !#en Specifies the alignment mode of the Widget, which determines when the widget should refresh.
         * !#zh 指定 Widget 的对齐模式，用于决定 Widget 应该何时刷新。
         * @property {Widget.AlignMode} alignMode
         * @example
         * widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
         */
        alignMode: {
           default: AlignMode.ON_WINDOW_RESIZE,
           type: AlignMode,
           tooltip: CC_DEV && 'i18n:COMPONENT.widget.align_mode',
        },

        //

        _wasAlignOnce: {
            default: undefined,
            formerlySerializedAs: 'isAlignOnce',
        },

        _target: null,

        /**
         * !#zh: 对齐开关，由 AlignFlags 组成
         *
         * @property _alignFlags
         * @type {Number}
         * @default 0
         * @private
         */
        _alignFlags: 0,

        _left: 0,
        _right: 0,
        _top: 0,
        _bottom: 0,
        _verticalCenter: 0,
        _horizontalCenter: 0,
        _isAbsLeft: true,
        _isAbsRight: true,
        _isAbsTop: true,
        _isAbsBottom: true,
        _isAbsHorizontalCenter: true,
        _isAbsVerticalCenter: true,

        // original size before align
        _originalWidth: 0,
        _originalHeight: 0
    },

    statics: {
        AlignMode: AlignMode,
    },

    onLoad: function () {
        if (this._wasAlignOnce !== undefined) {
            // migrate for old version
            this.alignMode = this._wasAlignOnce ? AlignMode.ONCE : AlignMode.ALWAYS;
            this._wasAlignOnce = undefined;
        }
    },

    onEnable: function () {
        WidgetManager.add(this);
    },

    onDisable: function () {
        WidgetManager.remove(this);
    },

    _validateTargetInDEV: CC_DEV && function () {
        var target = this._target;
        if (target) {
            var isParent = this.node !== target && this.node.isChildOf(target);
            if (!isParent) {
                cc.errorID(6500);
                this._target = null;
            }
        }

    },

    _setAlign: function (flag, isAlign) {
        var current = (this._alignFlags & flag) > 0;
        if (isAlign === current) {
            return;
        }
        var isHorizontal = (flag & LEFT_RIGHT) > 0;
        if (isAlign) {
            this._alignFlags |= flag;

            if (isHorizontal) {
                this.isAlignHorizontalCenter = false;
                if (this.isStretchWidth) {
                    // become stretch
                    this._originalWidth = this.node.width;
                    // test check conflict
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            }
            else {
                this.isAlignVerticalCenter = false;
                if (this.isStretchHeight) {
                    // become stretch
                    this._originalHeight = this.node.height;
                    // test check conflict
                    if (CC_EDITOR && !cc.engine.isPlaying) {
                        _Scene.DetectConflict.checkConflict_Widget(this);
                    }
                }
            }

            if (CC_EDITOR && !cc.engine._isPlaying && this.node._parent) {
                // adjust the offsets to keep the size and position unchanged after alignment chagned
                WidgetManager.updateOffsetsToStayPut(this, flag);
            }
        }
        else {
            if (isHorizontal) {
                if (this.isStretchWidth) {
                    // will cancel stretch
                    this.node.width = this._originalWidth;
                }
            }
            else {
                if (this.isStretchHeight) {
                    // will cancel stretch
                    this.node.height = this._originalHeight;
                }
            }

            this._alignFlags &= ~flag;
        }
    },

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
    updateAlignment: function () {
        WidgetManager.updateAlignment(this.node);
    },
});

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
Object.defineProperty(Widget.prototype, 'isAlignOnce', {
    get () {
        if (CC_DEBUG) {
            cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode === cc.Widget.AlignMode.ONCE` instead please.');
        }
        return this.alignMode === AlignMode.ONCE;
    },
    set (value) {
        if (CC_DEBUG) {
            cc.warn('`widget.isAlignOnce` is deprecated, use `widget.alignMode = cc.Widget.AlignMode.*` instead please.');
        }
        this.alignMode = value ? AlignMode.ONCE : AlignMode.ALWAYS;
    }
});


cc.Widget = module.exports = Widget;
