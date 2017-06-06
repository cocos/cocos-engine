/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


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
 * !#en The Layout is a container component, use it to arrange child elements easily.
 * !#zh Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。
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
            get: function() {
                return this._N$layoutType;
            },
            set: function(value) {
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
            get: function() {
                return this._resize;
            },
            set: function(value) {
                if (this.type === Type.NONE && value === ResizeMode.CHILDREN) {
                    return;
                }

                this._resize = value;
                if (CC_EDITOR && this.type !== Type.NONE && value === ResizeMode.CONTAINER && !cc.engine.isPlaying) {
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
            notify: function() {
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
            notify: function() {
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

        _N$padding: {
            default: 0
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
            notify: function() {
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
            notify: function() {
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
            notify: function() {
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
            notify: function() {
                this._doLayoutDirty();
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.layout.horizontal_direction',
            animatable: false
        },
    },

    statics: {
        Type: Type,
        VerticalDirection: VerticalDirection,
        HorizontalDirection: HorizontalDirection,
        ResizeMode: ResizeMode,
        AxisDirection: AxisDirection,
    },

    _migratePaddingData: function () {
        this.paddingLeft = this._N$padding;
        this.paddingRight = this._N$padding;
        this.paddingTop = this._N$padding;
        this.paddingBottom = this._N$padding;
        this._N$padding = 0;
    },

    __preload: function() {
        if(cc.sizeEqualToSize(this.node.getContentSize(), cc.size(0, 0))) {
            this.node.setContentSize(this._layoutSize);
        }

        if(this._N$padding !== 0) {
            this._migratePaddingData();
        }

        this.node.on('size-changed', this._resized, this);

        this.node.on('anchor-changed', this._doLayoutDirty, this);
        this.node.on('child-added', this._childAdded, this);
        this.node.on('child-removed', this._childRemoved, this);
        this.node.on('child-reorder', this._doLayoutDirty, this);

        this._updateChildrenEventListener();
    },

    _doLayoutDirty : function() {
        this._layoutDirty = true;
    },

    _updateChildrenEventListener: function() {
        var children = this.node.children;
        children.forEach(function(child) {
            child.on('size-changed', this._doLayoutDirty, this);
            child.on('position-changed', this._doLayoutDirty, this);
            child.on('anchor-changed', this._doLayoutDirty, this);
            child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }.bind(this));
    },

    _childAdded: function(event) {
        var child = event.detail;
        child.on('size-changed', this._doLayoutDirty, this);
        child.on('position-changed', this._doLayoutDirty, this);
        child.on('anchor-changed', this._doLayoutDirty, this);
        child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    },

    _childRemoved: function(event) {
        var child = event.detail;
        child.off('size-changed', this._doLayoutDirty, this);
        child.off('position-changed', this._doLayoutDirty, this);
        child.off('anchor-changed', this._doLayoutDirty, this);
        child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    },

    _resized: function() {
        this._layoutSize = this.node.getContentSize();
        this._doLayoutDirty();
    },

    _doLayoutHorizontally: function(baseWidth, rowBreak, fnPositionY, applyChildren) {
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

        var newChildWidth = this.cellSize.width;
        if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
            newChildWidth = (baseWidth - (this.paddingLeft + this.paddingRight) - (children.length - 1) * this.spacingX) / children.length;
        }

        children.forEach(function(child) {
            if (!child.activeInHierarchy) {
                return;
            }
            //for resizing children
            if (this._resize === ResizeMode.CHILDREN) {
                child.width = newChildWidth;
                if (this.type === Type.GRID) {
                    child.height = this.cellSize.height;
                }
            }

            var anchorX = child.anchorX;

            if (secondMaxHeight > tempMaxHeight) {
                tempMaxHeight = secondMaxHeight;
            }

            if (child.height >= tempMaxHeight) {
                secondMaxHeight = tempMaxHeight;
                tempMaxHeight = child.height;
                maxHeightChildAnchorY = child.getAnchorPoint().y;
            }

            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - child.anchorX;
            }
            nextX = nextX + sign * anchorX * child.width + sign * this.spacingX;
            var rightBoundaryOfChild = sign * (1 - anchorX) * child.width;

            if (rowBreak) {
                var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this.paddingRight : this.paddingLeft);
                var leftToRightRowBreak = this.horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth;
                var rightToLeftRowBreak = this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth;

                if (leftToRightRowBreak || rightToLeftRowBreak) {

                    if (child.height >= tempMaxHeight) {
                        if (secondMaxHeight === 0) {
                            secondMaxHeight = tempMaxHeight;
                        }
                        rowMaxHeight += secondMaxHeight;
                        secondMaxHeight = tempMaxHeight;
                    }
                    else {
                        rowMaxHeight += tempMaxHeight;
                        secondMaxHeight = child.height;
                        tempMaxHeight = 0;
                    }
                    nextX = leftBoundaryOfLayout + sign * (paddingX  + anchorX * child.width);
                    row++;
                }
            }

            var finalPositionY = fnPositionY(child, rowMaxHeight, row);
            if(baseWidth >= (child.width + this.paddingLeft + this.paddingRight)) {
                if (applyChildren) {
                    child.setPosition(cc.p(nextX, finalPositionY));
                }
            }

            var signX = 1;
            var tempFinalPositionY;
            var topMarign = (tempMaxHeight === 0) ? child.height : tempMaxHeight;

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                containerResizeBoundary = containerResizeBoundary || this.node._contentSize.height;
                signX = -1;
                tempFinalPositionY  = finalPositionY +  signX * (topMarign * maxHeightChildAnchorY + this.paddingBottom);
                if (tempFinalPositionY < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.height;
                tempFinalPositionY  = finalPositionY +  signX * (topMarign * maxHeightChildAnchorY + this.paddingTop);
                if (tempFinalPositionY > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }

            nextX += rightBoundaryOfChild;
        }.bind(this));

        return containerResizeBoundary;
    },

    _getVerticalBaseHeight: function (children) {
        var newHeight = 0;
        var activeChildCount = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            children.forEach(function(child) {
                if (!child.activeInHierarchy) {
                    return;
                }
                activeChildCount++;
                newHeight += child.height;
            });

            newHeight += (activeChildCount - 1) * this.spacingY + this.paddingBottom + this.paddingTop;
        }
        else {
            newHeight = this.node.getContentSize().height;
        }
        return newHeight;
    },

    _doLayoutVertically: function(baseHeight, columnBreak, fnPositionX, applyChildren) {
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

        var newChildHeight = this.cellSize.height;
        if (this.type !== Type.GRID && this.resizeMode === ResizeMode.CHILDREN) {
            newChildHeight = (baseHeight - (this.paddingTop + this.paddingBottom) - (children.length - 1) * this.spacingY) / children.length;
        }

        children.forEach(function(child) {
            if (!child.activeInHierarchy) {
                return;
            }

            //for resizing children
            if (this.resizeMode === ResizeMode.CHILDREN) {
                child.height = newChildHeight;
                if (this.type === Type.GRID) {
                    child.width = this.cellSize.width;
                }
            }

            var anchorY = child.anchorY;

            if (secondMaxWidth > tempMaxWidth) {
                tempMaxWidth = secondMaxWidth;
            }

            if (child.width >= tempMaxWidth) {
                secondMaxWidth = tempMaxWidth;
                tempMaxWidth = child.width;
                maxWidthChildAnchorX = child.getAnchorPoint().x;
            }

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                anchorY = 1 - child.anchorY;
            }
            nextY = nextY + sign * anchorY * child.height + sign * this.spacingY;
            var topBoundaryOfChild = sign * (1 - anchorY) * child.height;

            if (columnBreak) {
                var columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this.paddingTop : this.paddingBottom);
                var bottomToTopColumnBreak = this.verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight;
                var topToBottomColumnBreak = this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight;

                if (bottomToTopColumnBreak || topToBottomColumnBreak) {
                    if (child.width >= tempMaxWidth) {
                        if (secondMaxWidth === 0) {
                            secondMaxWidth = tempMaxWidth;
                        }
                        columnMaxWidth += secondMaxWidth;
                        secondMaxWidth = tempMaxWidth;
                    }
                    else {
                        columnMaxWidth += tempMaxWidth;
                        secondMaxWidth = child.width;
                        tempMaxWidth = 0;
                    }
                    nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * child.height);
                    column++;
                }
            }

            var finalPositionX = fnPositionX(child, columnMaxWidth, column);
            if (baseHeight >= (child.height + (this.paddingTop + this.paddingBottom))) {
                if (applyChildren) {
                    child.setPosition(cc.p(finalPositionX, nextY));
                }
            }

            var signX = 1;
            var tempFinalPositionX;
            //when the item is the last column break item, the tempMaxWidth will be 0.
            var rightMarign = (tempMaxWidth === 0) ? child.width : tempMaxWidth;

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
        }.bind(this));

        return containerResizeBoundary;
    },

    _doLayoutBasic: function() {
        var children = this.node.children;

        var allChildrenBoundingBox = null;

        children.forEach(function(child){
            if (!child.activeInHierarchy) {
                return;
            }

            if(!allChildrenBoundingBox){
                allChildrenBoundingBox = child.getBoundingBoxToWorld();
            } else {
                allChildrenBoundingBox = cc.rectUnion(allChildrenBoundingBox, child.getBoundingBoxToWorld());
            }
        });

        if (allChildrenBoundingBox) {
            var leftBottomInParentSpace = this.node.parent.convertToNodeSpaceAR(cc.p(allChildrenBoundingBox.x, allChildrenBoundingBox.y));
            leftBottomInParentSpace = cc.pAdd(leftBottomInParentSpace, cc.p(-this.paddingLeft, -this.paddingBottom));

            var rightTopInParentSpace = this.node.parent.convertToNodeSpaceAR(cc.p(allChildrenBoundingBox.x + allChildrenBoundingBox.width,
                                                                                   allChildrenBoundingBox.y + allChildrenBoundingBox.height));
            rightTopInParentSpace = cc.pAdd(rightTopInParentSpace, cc.p(this.paddingRight, this.paddingTop));

            var newSize = cc.size(parseFloat((rightTopInParentSpace.x - leftBottomInParentSpace.x).toFixed(2)),
                                  parseFloat((rightTopInParentSpace.y - leftBottomInParentSpace.y).toFixed(2)));

            var layoutPosition = this.node.getPosition();
            var newAnchorX = (layoutPosition.x - leftBottomInParentSpace.x) / newSize.width;
            var newAnchorY = (layoutPosition.y - leftBottomInParentSpace.y) / newSize.height;
            var newAnchor = cc.p(parseFloat(newAnchorX.toFixed(2)), parseFloat(newAnchorY.toFixed(2)));

            this.node.setAnchorPoint(newAnchor);
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

        var fnPositionY = function(child, topOffset, row) {
            return bottomBoundaryOfLayout + sign * (topOffset + child.anchorY * child.height + paddingY + row * this.spacingY);
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

        var fnPositionX = function(child, leftOffset, column) {
            return leftBoundaryOfLayout + sign * (leftOffset + child.anchorX * child.width + paddingX + column * this.spacingX);
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

    _doLayoutGrid: function() {
        var layoutAnchor = this.node.getAnchorPoint();
        var layoutSize = this.node.getContentSize();

        if (this.startAxis === AxisDirection.HORIZONTAL) {
            this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);

        }
        else if(this.startAxis === AxisDirection.VERTICAL) {
            this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
        }

    },

    _getHorizontalBaseWidth: function (children) {
        var newWidth = 0;
        var activeChildCount = 0;
        if (this.resizeMode === ResizeMode.CONTAINER) {
            children.forEach(function(child) {
                if(!child.activeInHierarchy) {
                    return;
                }
                activeChildCount++;
                newWidth += child.width;
            });
            newWidth += (activeChildCount - 1) * this.spacingX + this.paddingLeft + this.paddingRight;
        }
        else {
            newWidth = this.node.getContentSize().width;
        }
        return newWidth;
    },

    _doLayout: function() {

        if (this.type === Type.HORIZONTAL) {
            var newWidth = this._getHorizontalBaseWidth(this.node.children);

            var fnPositionY = function(child) {
                return child.y;
            };

            this._doLayoutHorizontally( newWidth, false, fnPositionY, true);

            this.node.width = newWidth;
        }
        else if (this.type === Type.VERTICAL) {
            var newHeight = this._getVerticalBaseHeight(this.node.children);

            var fnPositionX = function(child) {
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
        else if(this.type === Type.GRID) {
            this._doLayoutGrid();
        }
    },

    onEnable: function () {
        cc.director.on(cc.Director.EVENT_BEFORE_VISIT, this._updateLayout, this);
    },

    onDisable: function () {
        cc.director.off(cc.Director.EVENT_BEFORE_VISIT, this._updateLayout, this);
    },

    _updateLayout: function() {
        if (this._layoutDirty && this.node.children.length > 0) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

});

/**
 * !#en The padding of layout, it effects the layout in four direction.
 * !#zh 容器内边距，该属性会在四个布局方向上生效。
 * @property {Number} padding
 */
Object.defineProperty(Layout.prototype, "padding", {
    get: function () {
        cc.warnID(4100);
        return this.paddingLeft;
    },
    set: function (value) {
        this._N$padding = value;

        this._migratePaddingData();
        this._doLayoutDirty();
    }
});

cc.Layout = module.exports = Layout;
