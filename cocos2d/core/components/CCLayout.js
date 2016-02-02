/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


/**
 * Enum for Layout type
 * @enum Layout.Type
 */
var Type = cc.Enum({
    /**
     *@property {Number} NONE
     */
    NONE: 0,
    /**
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 1,

    /**
     * @property {Number} VERTICAL
     */
    VERTICAL: 2,
    /**
     * @property {Number} GRID
     */
    GRID: 3,
});

/**
 * Enum for Layout Resize Type
 * @enum Layout.ResizeType
 */
var ResizeType = cc.Enum({
    /**
     * @property {Number} NONE
     */
    NONE: 0,
    /**
     * @property {Number} CONTAINER
     */
    CONTAINER: 1,
    /**
     * @property {Number} CHILDREN
     */
    CHILDREN: 2
});

/**
 * Enum for Grid Layout start axis direction.
 * @enum Layout.AxisDirection
 */
var AxisDirection = cc.Enum({
    /**
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,
    /**
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
});

/**
 * Enum for vertical layout direction.
 * @enum Layout.VerticalDirection
 */
var VerticalDirection = cc.Enum({
    /**
     * @property {Number} BOTTOM_TO_TOP
     */
    BOTTOM_TO_TOP: 0,
    /**
     * @property {Number} TOP_TO_BOTTOM
     */
    TOP_TO_BOTTOM: 1,
});

/**
 * Enum for horizontal layout direction.
 * @enum Layout.HorizontalDirection
 */
var HorizontalDirection = cc.Enum({
    /**
     * @property {Number} LEFT_TO_RIGHT
     */
    LEFT_TO_RIGHT: 0,
    /**
     *@property {Number} RIGHT_TO_LEFT
     */
    RIGHT_TO_LEFT: 1,
});

/**
 * The Layout is a container component, use it to arrange child elements easily.
 *
 * @class Layout
 * @extends Component
 */
var Layout = cc.Class({
    name: 'cc.Layout',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/Layout',
        inspector: 'app://editor/page/inspector/cclayout.html',
        executeInEditMode: true,
    },

    properties: {
        _layoutSize: cc.size(300, 200),
        _layoutDirty: {
            default: true,
            serializable: false,
        },

        /**
         * The layout type.
         * @property {Layout.Type} layoutType
         * @default Layout.Type.NONE
         */
        layoutType: {
            default: Type.NONE,
            type: Type,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.layout.layout_type'
        },

        _resize: ResizeType.NONE,

        /**
         * The are three resize types for Layout.
         * None, resize Container and resize children.
         * @property {Layout.ResizeType} resize
         * @default ResizeType.NONE
         */
        resize: {
            type: ResizeType,
            tooltip: 'i18n:COMPONENT.layout.auto_resize',
            get: function() {
                return this._resize;
            },
            set: function(value) {
                if (this.layoutType === Type.NONE && value === ResizeType.CHILDREN) {
                    return;
                }

                this._doLayoutDirty();
                this._resize = value;
            },
            animatable: false
        },

        /**
         * The cell size for grid layout.
         * @property {cc.Size} cellSize
         * @default cc.size(40, 40)
         */
        cellSize: {
            default: cc.size(40, 40),
            type: cc.Size,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false
        },

        /**
         * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
         * and then break line on demand. Choose vertical if you want to layout vertically at first .
         * @property {Layout.AxisDirection} startAxis
         */
        startAxis: {
            default: AxisDirection.HORIZONTAL,
            type: AxisDirection,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false
        },
        /**
         * The padding of layout, it only effect the layout in one direction.
         * @property {Number} padding
         */
        padding: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
        },

        /**
         * The distance in x-axis between each element in layout.
         * @property {Number} spacingX
         */
        spacingX: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.layout.space_x'
        },

        /**
         * The distance in y-axis between each element in layout.
         * @property {Number} spacingY
         */
        spacingY: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.layout.space_y'
        },

        /**
         * Only take effect in Vertical layout mode.
         * This option changes the start element's positioning.
         * @property {Layout.VerticalDirection} verticalDirection
         */
        verticalDirection: {
            default: VerticalDirection.TOP_TO_BOTTOM,
            type: VerticalDirection,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.layout.vertical_direction'
        },

        /**
         * Only take effect in Horizontal layout mode.
         * This option changes the start element's positioning.
         * @property {Layout.HorizontalDirection} horizontalDirection
         */
        horizontalDirection: {
            default: HorizontalDirection.LEFT_TO_RIGHT,
            type: HorizontalDirection,
            notify: function() {
                this._doLayoutDirty();
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.layout.horizontal_direction'
        },
    },

    statics: {
        Type: Type,
        VerticalDirection: VerticalDirection,
        HorizontalDirection: HorizontalDirection,
        ResizeType: ResizeType,
        AxisDirection: AxisDirection,
    },

    onLoad: function() {
        this.node.setContentSize(this._layoutSize);

        this.node.on('size-changed', this._resized, this);
        this.node.on('anchor-changed', this._doLayoutDirty, this);
        this.node.on('child-added', this._childrenAddOrDeleted, this);
        this.node.on('child-removed', this._childrenAddOrDeleted, this);

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

    _childrenAddOrDeleted: function() {
        this._updateChildrenEventListener();
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
        var leftBoundaryOfLayout = -layoutAnchor.x * baseWidth;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * baseWidth;
        }

        var nextX = leftBoundaryOfLayout + sign * this.padding - sign * this.spacingX;
        var rowMaxHeight = 0;
        var tempMaxHeight = 0;
        var secondMaxHeight = 0;
        var row = 0;
        var containerResizeBoundary;

        var maxHeightChildAnchor;

        var newChildWidth = this.cellSize.width;
        if (this.layoutType !== Type.GRID && this.resize === ResizeType.CHILDREN) {
            newChildWidth = (baseWidth - 2 * this.padding - (children.length - 1) * this.spacingX) / children.length;
        }

        children.forEach(function(child) {
            if (!child.activeInHierarchy) {
                return;
            }
            //for resizing children
            if (this._resize === ResizeType.CHILDREN) {
                child.width = newChildWidth;
                if (this.layoutType === Type.GRID) {
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
                maxHeightChildAnchor = child.getAnchorPoint();
            }

            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - child.anchorX;
            }
            nextX = nextX + sign * anchorX * child.width + sign * this.spacingX;
            var rightBoundaryOfChild = sign * (1 - anchorX) * child.width;

            if (rowBreak) {
                var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * this.padding;
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
                    nextX = leftBoundaryOfLayout + sign * (this.padding  + anchorX * child.width);
                    row++;
                }
            }

            var finalPositionY = fnPositionY(child, rowMaxHeight, row);
            if(baseWidth >= (child.width + 2 * this.padding)) {
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
                tempFinalPositionY  = finalPositionY +  signX * (topMarign * maxHeightChildAnchor.y + this.padding);
                if (tempFinalPositionY < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.height;
                tempFinalPositionY  = finalPositionY +  signX * (topMarign * maxHeightChildAnchor.y + this.padding);
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
        if (this.resize === ResizeType.CONTAINER) {
            children.forEach(function(child) {
                newHeight += child.height;
            });

            newHeight += (children.length - 1) * this.spacingY + 2 * this.padding;
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
        var bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
        }

        var nextY = bottomBoundaryOfLayout + sign * this.padding - sign * this.spacingY;
        var columnMaxWidth = 0;
        var tempMaxWidth = 0;
        var secondMaxWidth = 0;
        var column = 0;
        var containerResizeBoundary;
        var maxWidthChildAnchor;

        var newChildHeight = this.cellSize.height;
        if (this.layoutType !== Type.GRID && this.resize === ResizeType.CHILDREN) {
            newChildHeight = (baseHeight - 2 * this.padding - (children.length - 1) * this.spacingY) / children.length;
        }

        children.forEach(function(child) {
            if (!child.activeInHierarchy) {
                return;
            }

            //for resizing children
            if (this.resize === ResizeType.CHILDREN) {
                child.height = newChildHeight;
                if (this.layoutType === Type.GRID) {
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
                maxWidthChildAnchor = child.getAnchorPoint();
            }

            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                anchorY = 1 - child.anchorY;
            }
            nextY = nextY + sign * anchorY * child.height + sign * this.spacingY;
            var topBoundaryOfChild = sign * (1 - anchorY) * child.height;

            if (columnBreak) {
                var columnBreakBoundary = nextY + topBoundaryOfChild + sign * this.padding;
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
                    nextY = bottomBoundaryOfLayout + sign * (this.padding + anchorY * child.height);
                    column++;
                }
            }

            var finalPositionX = fnPositionX(child, columnMaxWidth, column);
            if (baseHeight >= (child.height + 2 * this.padding)) {
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
                tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchor.x + this.padding);
                if (tempFinalPositionX < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionX;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node._contentSize.width;
                tempFinalPositionX = finalPositionX + signX * (rightMarign * maxWidthChildAnchor.x + this.padding);
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
            if(!allChildrenBoundingBox){
                allChildrenBoundingBox = child.getBoundingBoxToWorld();
            } else {
                allChildrenBoundingBox = cc.rectUnion(allChildrenBoundingBox, child.getBoundingBoxToWorld());
            }
        });

        if (allChildrenBoundingBox) {
            var leftBottomInParentSpace = this.node.parent.convertToNodeSpaceAR(cc.p(allChildrenBoundingBox.x, allChildrenBoundingBox.y));
            var rightTopInParentSpace = this.node.parent.convertToNodeSpaceAR(cc.p(allChildrenBoundingBox.x + allChildrenBoundingBox.width,
                                                                                   allChildrenBoundingBox.y + allChildrenBoundingBox.height));

            var newSize = cc.size(rightTopInParentSpace.x - leftBottomInParentSpace.x,
                                  rightTopInParentSpace.y - leftBottomInParentSpace.y);

            var layoutPosition = this.node.getPosition();
            var newAnchor = cc.p((layoutPosition.x - leftBottomInParentSpace.x) / newSize.width,
                                 (layoutPosition.y - leftBottomInParentSpace.y) / newSize.height);

            this.node.setAnchorPoint(newAnchor);
            this.node.setContentSize(newSize);
        }
    },

    _doLayoutGridAxisHorizontal: function (layoutAnchor, layoutSize) {
        var baseWidth = layoutSize.width;

        var sign = 1;
        var bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;

        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
        }

        var fnPositionY = function(child, topOffset, row) {
            return bottomBoundaryOfLayout + sign * (topOffset + child.anchorY * child.height + this.padding + row * this.spacingY);
        }.bind(this);


        var newHeight = 0;
        if (this.resize === ResizeType.CONTAINER) {
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

        if (this.resize === ResizeType.CONTAINER) {
            this.node.setContentSize(baseWidth, newHeight);
        }
    },

    _doLayoutGridAxisVertical: function (layoutAnchor, layoutSize) {
        var baseHeight = layoutSize.height;

        var sign = 1;
        var leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;

        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
        }

        var fnPositionX = function(child, leftOffset, column) {
            return leftBoundaryOfLayout + sign * (leftOffset + child.anchorX * child.width + this.padding + column * this.spacingX);
        }.bind(this);

        var newWidth = 0;
        if (this.resize === ResizeType.CONTAINER) {
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

        if (this.resize === ResizeType.CONTAINER) {
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
        if (this.resize === ResizeType.CONTAINER) {
            children.forEach(function(child) {
                newWidth += child.width;
            });
            newWidth += (children.length - 1) * this.spacingX + 2 * this.padding;
        }
        else {
            newWidth = this.node.getContentSize().width;
        }
        return newWidth;
    },

    _doLayout: function() {

        if (this.layoutType === Type.HORIZONTAL) {
            var newWidth = this._getHorizontalBaseWidth(this.node.children);

            var fnPositionY = function(child) {
                return child.y;
            };

            this._doLayoutHorizontally( newWidth, false, fnPositionY, true);

            this.node.width = newWidth;
        }
        else if (this.layoutType === Type.VERTICAL) {
            var newHeight = this._getVerticalBaseHeight(this.node.children);

            var fnPositionX = function(child) {
                return child.x;
            };

            this._doLayoutVertically(newHeight, false, fnPositionX, true);

            this.node.height = newHeight;
        }
        else if (this.layoutType === Type.NONE) {
            if (this.resize === ResizeType.CONTAINER) {
                this._doLayoutBasic();
            }
        }
        else if(this.layoutType === Type.GRID) {
            this._doLayoutGrid();
        }
    },

    lateUpdate: function() {
        if (this._layoutDirty && this.node.children.length > 0) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

});


cc.Layout = module.exports = Layout;
