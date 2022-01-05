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

const NodeEvent = require('../CCNode').EventType;

/**
 * !#en Enum for Layout type
 * !#zh 布局类型
 * @enum Layout.Type
 */
var Type = cc.Enum({
    /**
     * !#en None Layout
     * !#zh 取消布局
     *@property {Number} NONE
     */
    NONE: 0,
    /**
     * !#en Horizontal Layout
     * !#zh 水平布局
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 1,

    /**
     * !#en Vertical Layout
     * !#zh 垂直布局
     * @property {Number} VERTICAL
     */
    VERTICAL: 2,
    /**
     * !#en Grid Layout
     * !#zh 网格布局
     * @property {Number} GRID
     */
    GRID: 3,
});

/**
 * !#en Enum for Layout Resize Mode
 * !#zh 缩放模式
 * @enum Layout.ResizeMode
 */
var ResizeMode = cc.Enum({
    /**
     * !#en Don't do any scale.
     * !#zh 不做任何缩放
     * @property {Number} NONE
     */
    NONE: 0,
    /**
     * !#en The container size will be expanded with its children's size.
     * !#zh 容器的大小会根据子节点的大小自动缩放。
     * @property {Number} CONTAINER
     */
    CONTAINER: 1,
    /**
     * !#en Child item size will be adjusted with the container's size.
     * !#zh 子节点的大小会随着容器的大小自动缩放。
     * @property {Number} CHILDREN
     */
    CHILDREN: 2
});

/**
 * !#en Enum for Grid Layout start axis direction.
 * The items in grid layout will be arranged in each axis at first.;
 * !#zh 布局轴向，只用于 GRID 布局。
 * @enum Layout.AxisDirection
 */
var AxisDirection = cc.Enum({
    /**
     * !#en The horizontal axis.
     * !#zh 进行水平方向布局
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,
    /**
     * !#en The vertical axis.
     * !#zh 进行垂直方向布局
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
});

/**
 * !#en Enum for vertical layout direction.
 *  Used in Grid Layout together with AxisDirection is VERTICAL
 * !#zh 垂直方向布局方式
 * @enum Layout.VerticalDirection
 */
var VerticalDirection = cc.Enum({
    /**
     * !#en Items arranged from bottom to top.
     * !#zh 从下到上排列
     * @property {Number} BOTTOM_TO_TOP
     */
    BOTTOM_TO_TOP: 0,
    /**
     * !#en Items arranged from top to bottom.
     * !#zh 从上到下排列
     * @property {Number} TOP_TO_BOTTOM
     */
    TOP_TO_BOTTOM: 1,
});

/**
 * !#en Enum for horizontal layout direction.
 *  Used in Grid Layout together with AxisDirection is HORIZONTAL
 * !#zh 水平方向布局方式
 * @enum Layout.HorizontalDirection
 */
var HorizontalDirection = cc.Enum({
    /**
     * !#en Items arranged from left to right.
     * !#zh 从左往右排列
     * @property {Number} LEFT_TO_RIGHT
     */
    LEFT_TO_RIGHT: 0,
    /**
     * !#en Items arranged from right to left.
     * !#zh 从右往左排列
     *@property {Number} RIGHT_TO_LEFT
     */
    RIGHT_TO_LEFT: 1,
});

/**
 * !#en
 * The Layout is a container component, use it to arrange child elements easily.<br>
 * Note：<br>
 * 1.Scaling and rotation of child nodes are not considered.<br>
 * 2.After setting the Layout, the results need to be updated until the next frame,
 * unless you manually call {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * !#zh
 * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * 注意：<br>
 * 1.不会考虑子节点的缩放和旋转。<br>
 * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用 {{#crossLink "Layout/updateLayout:method"}}{{/crossLink}}。
 * @class Layout
 * @extends Component
 */
var Layout = cc.Class({
    name: 'cc.Layout',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Layout',
        help: 'i18n:COMPONENT.help_url.layout',
        inspector: 'packages://inspector/inspectors/comps/cclayout.js',
        executeInEditMode: true,
    },

    properties: {
        _layoutSize: cc.size(300, 200),
        _layoutDirty: {
            default: true,
            serializable: false,
        },

        _resize: ResizeMode.NONE,

        //TODO: refactoring this name after data upgrade machanism is out.
        _N$layoutType: Type.NONE,
        /**
         * !#en The layout type.
         * !#zh 布局类型
         * @property {Layout.Type} type
         * @default Layout.Type.NONE
         */
        type: {
            type: Type,
            get: function () {
                return this._N$layoutType;
            },
            set: function (value) {
                this._N$layoutType = value;

                if (CC_EDITOR && this.type !== Type.NONE && this._resize === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
                    var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
                    if (reLayouted) {
                        return;
                    }
                }
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.layout_type',
            animatable: false,
        },


        /**
         * !#en
         * The are three resize modes for Layout.
         * None, resize Container and resize children.
         * !#zh 缩放模式
         * @property {Layout.ResizeMode} resizeMode
         * @default ResizeMode.NONE
         */
        resizeMode: {
            type: ResizeMode,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.resize_mode',
            animatable: false,
            get: function () {
                return this._resize;
            },
            set: function (value) {
                if (this.type === Type.NONE && value === ResizeMode.CHILDREN) {
                    return;
                }

                this._resize = value;
                if (CC_EDITOR && value === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
                    var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
                    if (reLayouted) {
                        return;
                    }
                }
                this._doLayoutDirty();
            },
        },

        /**
         * !#en The cell size for grid layout.
         * !#zh 每个格子的大小，只有布局类型为 GRID 的时候才有效。
         * @property {Size} cellSize
         * @default cc.size(40, 40)
         */
        cellSize: {
            default: cc.size(40, 40),
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.cell_size',
            type: cc.Size,
            notify: function () {
                this._doLayoutDirty();
            },
        },

        /**
         * !#en
         * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
         * and then break line on demand. Choose vertical if you want to layout vertically at first .
         * !#zh 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
         * @property {Layout.AxisDirection} startAxis
         */
        startAxis: {
            default: AxisDirection.HORIZONTAL,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.start_axis',
            type: AxisDirection,
            notify: function () {
                if (CC_EDITOR && this._resize === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
                    var reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
                    if (reLayouted) {
                        return;
                    }
                }
                this._doLayoutDirty();
            },
            animatable: false
        },

        /**
         * !#en The left padding of layout, it only effect the layout in one direction.
         * !#zh 容器内左边距，只会在一个布局方向上生效。
         * @property {Number} paddingLeft
         */
        paddingLeft: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_left',
            notify: function () {
                this._doLayoutDirty();
            },
        },

        /**
         * !#en The right padding of layout, it only effect the layout in one direction.
         * !#zh 容器内右边距，只会在一个布局方向上生效。
         * @property {Number} paddingRight
         */
        paddingRight: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_right',
            notify: function () {
                this._doLayoutDirty();
            },
        },

        /**
         * !#en The top padding of layout, it only effect the layout in one direction.
         * !#zh 容器内上边距，只会在一个布局方向上生效。
         * @property {Number} paddingTop
         */
        paddingTop: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_top',
            notify: function () {
                this._doLayoutDirty();
            },
        },

        /**
         * !#en The bottom padding of layout, it only effect the layout in one direction.
         * !#zh 容器内下边距，只会在一个布局方向上生效。
         * @property {Number} paddingBottom
         */
        paddingBottom: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.padding_bottom',
            notify: function () {
                this._doLayoutDirty();
            },
        },

        /**
         * !#en The distance in x-axis between each element in layout.
         * !#zh 子节点之间的水平间距。
         * @property {Number} spacingX
         */
        spacingX: {
            default: 0,
            notify: function () {
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_x'
        },

        /**
         * !#en The distance in y-axis between each element in layout.
         * !#zh 子节点之间的垂直间距。
         * @property {Number} spacingY
         */
        spacingY: {
            default: 0,
            notify: function () {
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.space_y'
        },

        /**
         * !#en
         * Only take effect in Vertical layout mode.
         * This option changes the start element's positioning.
         * !#zh 垂直排列子节点的方向。
         * @property {Layout.VerticalDirection} verticalDirection
         */
        verticalDirection: {
            default: VerticalDirection.TOP_TO_BOTTOM,
            type: VerticalDirection,
            notify: function () {
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.vertical_direction',
            animatable: false
        },

        /**
         * !#en
         * Only take effect in Horizontal layout mode.
         * This option changes the start element's positioning.
         * !#zh 水平排列子节点的方向。
         * @property {Layout.HorizontalDirection} horizontalDirection
         */
        horizontalDirection: {
            default: HorizontalDirection.LEFT_TO_RIGHT,
            type: HorizontalDirection,
            notify: function () {
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.horizontal_direction',
            animatable: false
        },

        /**
         * !#en Adjust the layout if the children scaled.
         * !#zh 子节点缩放比例是否影响布局。
         * @property affectedByScale
         * @type {Boolean}
         * @default false
         */
        affectedByScale: {
            default: false,
            notify: function () {
                // every time you switch this state, the layout will be calculated.
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.affected_by_scale'
        }
    },

    statics: {
        Type: Type,
        VerticalDirection: VerticalDirection,
        HorizontalDirection: HorizontalDirection,
        ResizeMode: ResizeMode,
        AxisDirection: AxisDirection,
    },

    onEnable: function () {
        this._addEventListeners();

        if (this.node.getContentSize().equals(cc.size(0, 0))) {
            this.node.setContentSize(this._layoutSize);
        }

        this._doLayoutDirty();
    },

    onDisable: function () {
        this._removeEventListeners();
    },

    _doLayoutDirty: function () {
        this._layoutDirty = true;
    },

    _doScaleDirty: function () {
        this._layoutDirty = this._layoutDirty || this.affectedByScale;
    },

    _addEventListeners: function () {
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.on(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
        this.node.on(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);
        this._addChildrenEventListeners();
    },

    _removeEventListeners: function () {
        cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.off(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
        this.node.off(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);
        this._removeChildrenEventListeners();
    },

    _addChildrenEventListeners: function () {
        var children = this.node.children;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.on(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
            child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
            child.on(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
            child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    },

    _removeChildrenEventListeners: function () {
        var children = this.node.children;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            child.off(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
            child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
            child.off(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
            child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    },

    _childAdded: function (child) {
        child.on(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
        child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    },

    _childRemoved: function (child) {
        child.off(NodeEvent.SCALE_CHANGED, this._doScaleDirty, this);
        child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEvent.POSITION_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    },

    _resized: function () {
        this._layoutSize = this.node.getContentSize();
        this._doLayoutDirty();
    },

    _doLayoutHorizontally: function (baseWidth, rowBreak, fnPositionY, applyChildren) {
        var layoutAnchor = this.node.getAnchorPoint();
        var children = this.node.children;

        var sign = 1;
        var paddingX = this.paddingLeft;
        var leftBoundaryOfLayout = -layoutAnchor.x * baseWidth;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * baseWidth;
            paddingX = this.paddingRight;
        }

        var nextX = leftBoundaryOfLayout + sign * paddingX - sign * this.spacingX;
        var rowMaxHeight = 0;
        var tempMaxHeight = 0;
        var secondMaxHeight = 0;
        var row = 0;
        var containerResizeBoundary = 0;

        var maxHeightChildAnchorY = 0;

        var activeChildCount = 0;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.activeInHierarchy) {
                activeChildCount++;
            }
        }

        var newChildWidth = this.cellSize.width;
        if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
            newChildWidth = (baseWidth - (this.paddingLeft + this.paddingRight) - (activeChildCount - 1) * this.spacingX) / activeChildCount;
        }

        var hasCalculatedcontainerResizeBoundaryOnce = false;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            let childScaleX = this._getUsedScaleValue(child.scaleX);
            let childScaleY = this._getUsedScaleValue(child.scaleY);
            if (!child.activeInHierarchy) {
                continue;
            }

            //for resizing children
            if (this._resize === ResizeMode.CHILDREN) {
                child.width = newChildWidth / childScaleX;
                if (this.type === Type.GRID) {
                    child.height = this.cellSize.height / childScaleY;
                }
            }

            var anchorX = child.anchorX;
            var childBoundingBoxWidth = child.width * childScaleX;
            var childBoundingBoxHeight = child.height * childScaleY;

            if (secondMaxHeight > tempMaxHeight) {
                tempMaxHeight = secondMaxHeight;
            }

            if (childBoundingBoxHeight >= tempMaxHeight) {
                secondMaxHeight = tempMaxHeight;
                tempMaxHeight = childBoundingBoxHeight;
                maxHeightChildAnchorY = child.getAnchorPoint().y;
            }

            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - child.anchorX;
            }
            nextX = nextX + sign * anchorX * childBoundingBoxWidth + sign * this.spacingX;
            var rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

            if (rowBreak) {
                var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this.paddingRight : this.paddingLeft);
                var leftToRightRowBreak = this.horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth;
                var rightToLeftRowBreak = this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth;

                if (leftToRightRowBreak || rightToLeftRowBreak) {

                    if (childBoundingBoxHeight >= tempMaxHeight) {
                        if (secondMaxHeight === 0) {
                            secondMaxHeight = tempMaxHeight;
                        }
                        rowMaxHeight += secondMaxHeight;
                        secondMaxHeight = tempMaxHeight;
                    }
                    else {
                        rowMaxHeight += tempMaxHeight;
                        secondMaxHeight = childBoundingBoxHeight;
                        tempMaxHeight = 0;
                    }
                    nextX = leftBoundaryOfLayout + sign * (paddingX + anchorX * childBoundingBoxWidth);
                    row++;
                }
            }

            var finalPositionY = fnPositionY(child, rowMaxHeight, row);
            if (baseWidth >= (childBoundingBoxWidth + this.paddingLeft + this.paddingRight)) {
                if (applyChildren) {
                    child.setPosition(cc.v2(nextX, finalPositionY));
                }
            }

            var signX = 1;
            var tempFinalPositionY;
            var topMarign = (tempMaxHeight === 0) ? childBoundingBoxHeight : tempMaxHeight;

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                containerResizeBoundary = containerResizeBoundary || this.node._contentSize.height;
                signX = -1;
                tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingBottom);
                if (tempFinalPositionY < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.height;
                tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingTop);
                if (tempFinalPositionY > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }
            hasCalculatedcontainerResizeBoundaryOnce = true;

            nextX += rightBoundaryOfChild;
        }

        return containerResizeBoundary;
    },

    _getVerticalBaseHeight: function (children) {
        var newHeight = 0;
        var activeChildCount = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                if (child.activeInHierarchy) {
                    activeChildCount++;
                    newHeight += child.height * this._getUsedScaleValue(child.scaleY);
                }
            }

            newHeight += (activeChildCount - 1) * this.spacingY + this.paddingBottom + this.paddingTop;
        }
        else {
            newHeight = this.node.getContentSize().height;
        }
        return newHeight;
    },

    _doLayoutVertically: function (baseHeight, columnBreak, fnPositionX, applyChildren) {
        var layoutAnchor = this.node.getAnchorPoint();
        var children = this.node.children;

        var sign = 1;
        var paddingY = this.paddingBottom;
        var bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
            paddingY = this.paddingTop;
        }

        var nextY = bottomBoundaryOfLayout + sign * paddingY - sign * this.spacingY;
        var columnMaxWidth = 0;
        var tempMaxWidth = 0;
        var secondMaxWidth = 0;
        var column = 0;
        var containerResizeBoundary = 0;
        var maxWidthChildAnchorX = 0;

        var activeChildCount = 0;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.activeInHierarchy) {
                activeChildCount++;
            }
        }

        var newChildHeight = this.cellSize.height;
        if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
            newChildHeight = (baseHeight - (this.paddingTop + this.paddingBottom) - (activeChildCount - 1) * this.spacingY) / activeChildCount;
        }

        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            let childScaleX = this._getUsedScaleValue(child.scaleX);
            let childScaleY = this._getUsedScaleValue(child.scaleY);
            if (!child.activeInHierarchy) {
                continue;
            }

            //for resizing children
            if (this.resizeMode === ResizeMode.CHILDREN) {
                child.height = newChildHeight / childScaleY;
                if (this.type === Type.GRID) {
                    child.width = this.cellSize.width / childScaleX;
                }
            }

            var anchorY = child.anchorY;
            var childBoundingBoxWidth = child.width * childScaleX;
            var childBoundingBoxHeight = child.height * childScaleY;

            if (secondMaxWidth > tempMaxWidth) {
                tempMaxWidth = secondMaxWidth;
            }

            if (childBoundingBoxWidth >= tempMaxWidth) {
                secondMaxWidth = tempMaxWidth;
                tempMaxWidth = childBoundingBoxWidth;
                maxWidthChildAnchorX = child.getAnchorPoint().x;
            }

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                anchorY = 1 - child.anchorY;
            }
            nextY = nextY + sign * anchorY * childBoundingBoxHeight + sign * this.spacingY;
            var topBoundaryOfChild = sign * (1 - anchorY) * childBoundingBoxHeight;

            if (columnBreak) {
                var columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this.paddingTop : this.paddingBottom);
                var bottomToTopColumnBreak = this.verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight;
                var topToBottomColumnBreak = this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight;

                if (bottomToTopColumnBreak || topToBottomColumnBreak) {
                    if (childBoundingBoxWidth >= tempMaxWidth) {
                        if (secondMaxWidth === 0) {
                            secondMaxWidth = tempMaxWidth;
                        }
                        columnMaxWidth += secondMaxWidth;
                        secondMaxWidth = tempMaxWidth;
                    }
                    else {
                        columnMaxWidth += tempMaxWidth;
                        secondMaxWidth = childBoundingBoxWidth;
                        tempMaxWidth = 0;
                    }
                    nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * childBoundingBoxHeight);
                    column++;
                }
            }

            var finalPositionX = fnPositionX(child, columnMaxWidth, column);
            if (baseHeight >= (childBoundingBoxHeight + (this.paddingTop + this.paddingBottom))) {
                if (applyChildren) {
                    child.setPosition(cc.v2(finalPositionX, nextY));
                }
            }

            var signX = 1;
            var tempFinalPositionX;
            //when the item is the last column break item, the tempMaxWidth will be 0.
            var rightMarign = (tempMaxWidth === 0) ? childBoundingBoxWidth : tempMaxWidth;

            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                signX = -1;
                containerResizeBoundary = containerResizeBoundary || this.node._contentSize.width;
                tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchorX + this.paddingLeft);
                if (tempFinalPositionX < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionX;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.width;
                tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchorX + this.paddingRight);
                if (tempFinalPositionX > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionX;
                }
            }

            nextY += topBoundaryOfChild;
        }

        return containerResizeBoundary;
    },

    _doLayoutBasic: function () {
        var children = this.node.children;

        var allChildrenBoundingBox = null;

        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.activeInHierarchy) {
                if (!allChildrenBoundingBox) {
                    allChildrenBoundingBox = child.getBoundingBoxToWorld();
                } else {
                    allChildrenBoundingBox.union(allChildrenBoundingBox, child.getBoundingBoxToWorld());
                }
            }
        }

        if (allChildrenBoundingBox) {
            var leftBottomSpace = this.node.convertToNodeSpaceAR(cc.v2(allChildrenBoundingBox.x, allChildrenBoundingBox.y));
            leftBottomSpace = cc.v2(leftBottomSpace.x - this.paddingLeft, leftBottomSpace.y - this.paddingBottom);

            var rightTopSpace = this.node.convertToNodeSpaceAR(cc.v2(allChildrenBoundingBox.xMax, allChildrenBoundingBox.yMax));
            rightTopSpace = cc.v2(rightTopSpace.x + this.paddingRight, rightTopSpace.y + this.paddingTop);

            var newSize = rightTopSpace.sub(leftBottomSpace);
            newSize = cc.size(parseFloat(newSize.x.toFixed(2)), parseFloat(newSize.y.toFixed(2)));

            if (newSize.width !== 0) {
                // Invert is to get the coordinate point of the child node in the parent coordinate system
                var newAnchorX = (-leftBottomSpace.x) / newSize.width;
                this.node.anchorX = parseFloat(newAnchorX.toFixed(2));
            }
            if (newSize.height !== 0) {
                // Invert is to get the coordinate point of the child node in the parent coordinate system
                var newAnchorY = (-leftBottomSpace.y) / newSize.height;
                this.node.anchorY = parseFloat(newAnchorY.toFixed(2));
            }
            this.node.setContentSize(newSize);
        }
    },

    _doLayoutGridAxisHorizontal: function (layoutAnchor, layoutSize) {
        var baseWidth = layoutSize.width;

        var sign = 1;
        var bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
        var paddingY = this.paddingBottom;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
            paddingY = this.paddingTop;
        }

        var fnPositionY = function (child, topOffset, row) {
            return bottomBoundaryOfLayout + sign * (topOffset + child.anchorY * child.height * this._getUsedScaleValue(child.scaleY) + paddingY + row * this.spacingY);
        }.bind(this);


        var newHeight = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            //calculate the new height of container, it won't change the position of it's children
            var boundary = this._doLayoutHorizontally(baseWidth, true, fnPositionY, false);
            newHeight = bottomBoundaryOfLayout - boundary;
            if (newHeight < 0) {
                newHeight *= -1;
            }

            bottomBoundaryOfLayout = -layoutAnchor.y * newHeight;

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                sign = -1;
                bottomBoundaryOfLayout = (1 - layoutAnchor.y) * newHeight;
            }
        }

        this._doLayoutHorizontally(baseWidth, true, fnPositionY, true);

        if (this.resizeMode === ResizeMode.CONTAINER) {
            this.node.setContentSize(baseWidth, newHeight);
        }
    },

    _doLayoutGridAxisVertical: function (layoutAnchor, layoutSize) {
        var baseHeight = layoutSize.height;

        var sign = 1;
        var leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
        var paddingX = this.paddingLeft;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
            paddingX = this.paddingRight;
        }

        var fnPositionX = function (child, leftOffset, column) {
            return leftBoundaryOfLayout + sign * (leftOffset + child.anchorX * child.width * this._getUsedScaleValue(child.scaleX) + paddingX + column * this.spacingX);
        }.bind(this);

        var newWidth = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            var boundary = this._doLayoutVertically(baseHeight, true, fnPositionX, false);
            newWidth = leftBoundaryOfLayout - boundary;
            if (newWidth < 0) {
                newWidth *= -1;
            }

            leftBoundaryOfLayout = -layoutAnchor.x * newWidth;

            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                sign = -1;
                leftBoundaryOfLayout = (1 - layoutAnchor.x) * newWidth;
            }
        }

        this._doLayoutVertically(baseHeight, true, fnPositionX, true);

        if (this.resizeMode === ResizeMode.CONTAINER) {
            this.node.setContentSize(newWidth, baseHeight);
        }
    },

    _doLayoutGrid: function () {
        var layoutAnchor = this.node.getAnchorPoint();
        var layoutSize = this.node.getContentSize();

        if (this.startAxis === AxisDirection.HORIZONTAL) {
            this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);

        }
        else if (this.startAxis === AxisDirection.VERTICAL) {
            this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
        }

    },

    _getHorizontalBaseWidth: function (children) {
        var newWidth = 0;
        var activeChildCount = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            for (var i = 0; i < children.length; ++i) {
                var child = children[i];
                if (child.activeInHierarchy) {
                    activeChildCount++;
                    newWidth += child.width * this._getUsedScaleValue(child.scaleX);
                }
            }
            newWidth += (activeChildCount - 1) * this.spacingX + this.paddingLeft + this.paddingRight;
        }
        else {
            newWidth = this.node.getContentSize().width;
        }
        return newWidth;
    },

    _doLayout: function () {
        if (this.type === Type.HORIZONTAL) {
            var newWidth = this._getHorizontalBaseWidth(this.node.children);

            var fnPositionY = function (child) {
                return child.y;
            };

            this._doLayoutHorizontally(newWidth, false, fnPositionY, true);

            this.node.width = newWidth;
        }
        else if (this.type === Type.VERTICAL) {
            var newHeight = this._getVerticalBaseHeight(this.node.children);

            var fnPositionX = function (child) {
                return child.x;
            };

            this._doLayoutVertically(newHeight, false, fnPositionX, true);

            this.node.height = newHeight;
        }
        else if (this.type === Type.NONE) {
            if (this.resizeMode === ResizeMode.CONTAINER) {
                this._doLayoutBasic();
            }
        }
        else if (this.type === Type.GRID) {
            this._doLayoutGrid();
        }
    },

    _getUsedScaleValue (value) {
        return this.affectedByScale ? Math.abs(value) : 1;
    },

    /**
     * !#en Perform the layout update
     * !#zh 立即执行更新布局
     *
     * @method updateLayout
     *
     * @example
     * layout.type = cc.Layout.HORIZONTAL;
     * layout.node.addChild(childNode);
     * cc.log(childNode.x); // not yet changed
     * layout.updateLayout();
     * cc.log(childNode.x); // changed
     */
    updateLayout: function () {
        if (this._layoutDirty && this.node.children.length > 0) {
            var needToLayout = false;
            for(let i = 0; i < this.node.children.length; i++) {
                if(this.node.children[i].activeInHierarchy) {
                    needToLayout = true;
                    break;
                }
            }
            if(needToLayout) {
                this._doLayout();
                this._layoutDirty = false;
            }
        }
    }
});

cc.Layout = module.exports = Layout;
