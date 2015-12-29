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
            }
        },

        /**
         * Whether allow layout to adjust size.
         * @property {Boolean} autoResize
         * @default true
         * @readonly
         */
        autoResize: {
            default: true,
            readonly: true
        },

        /**
         * The margin of layout, it only effect the layout in one direction.
         * @property {Number} margin
         */
        margin: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            }
        },

        /**
         * The distance in x-axis between each element in layout.
         * @property {Number} spacingX
         */
        spacingX: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            }
        },

        /**
         * The distance in y-axis between each element in layout.
         * @property {Number} spacingY
         */
        spacingY: {
            default: 0,
            notify: function() {
                this._doLayoutDirty();
            }
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
            }
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
            }
        },
    },

    statics: {
        Type: Type,
        VerticalDirection: VerticalDirection,
        HorizontalDirection: HorizontalDirection
    },

    onLoad: function() {
        this.node.setContentSize(this._layoutSize);

        this.node.on('size-changed', this._resized, this);
        this.node.on('anchor-changed', this._doLayoutDirty, this);
        this.node.on('child-added', this._childrenAddOrDeleted, this);
        this.node.on('child-removed', this._childrenAddOrDeleted, this);;
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
        }.bind(this));
    },

    _childrenAddOrDeleted: function(event) {
        this._updateChildrenEventListener();
        this._doLayoutDirty();
    },

    _resized: function() {
        this._layoutSize = this.node.getContentSize();
        this._doLayoutDirty();
    },

    _doLayoutHorizontally: function(layoutAnchor, layoutSize, children) {
        var newWidth = 0;
        var sign = 1;

        children.forEach(function(child) {
            newWidth += child.width;
        });

        newWidth += (children.length - 1) * this.spacingX + 2 * this.margin;
        this.node.setContentSize(newWidth, layoutSize.height);

        var leftBoundaryOfLayout = -layoutAnchor.x * newWidth;
        if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * newWidth;
        }

        var nextX = leftBoundaryOfLayout + sign * this.margin - sign * this.spacingX;

        children.forEach(function(child) {
            var anchorX = child.anchorX;
            if (this.horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - child.anchorX;
            }
            nextX = nextX + sign * anchorX * child.width + sign * this.spacingX;

            child.setPosition(cc.p(nextX, child.y));

            nextX += sign * (1 - anchorX) * child.width;
        }.bind(this));
    },

    _doLayoutVertically: function(layoutAnchor, layoutSize, children) {
        var newHeight = 0;
        var sign = 1;

        children.forEach(function(child) {
            newHeight += child.height;
        });

        newHeight += (children.length - 1) * this.spacingY + 2 * this.margin;
        this.node.setContentSize(layoutSize.width, newHeight);

        var bottomBoundaryOfLayout = -layoutAnchor.y * newHeight;
        if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * newHeight;
        }

        var nextY = bottomBoundaryOfLayout + sign * this.margin - sign * this.spacingY;

        children.forEach(function(child) {
            var anchorY = child.anchorY;
            if (this.verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                anchorY = 1 - child.anchorY;
            }
            nextY = nextY + sign * anchorY * child.height + sign * this.spacingY;

            child.setPosition(cc.p(child.x, nextY));

            nextY += sign * (1 - anchorY) * child.height;
        }.bind(this));
    },

    _doLayoutBasic: function(layoutAnchor, layoutSize, children) {
        var allChildrenBoundingBox = null;

        children.forEach(function(child){
            if(!allChildrenBoundingBox){
                allChildrenBoundingBox = child.getBoundingBoxToWorld();
            } else {
                allChildrenBoundingBox = cc.rectUnion(allChildrenBoundingBox, child.getBoundingBoxToWorld());
            }
        });
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
    },

    _doLayout: function() {
        var children = this.node.children;
        var layoutAnchor = this.node.getAnchorPoint();
        var layoutSize = this.node.getContentSize();

        if (this.layoutType === Type.HORIZONTAL) {
            this._doLayoutHorizontally(layoutAnchor, layoutSize, children);
        } else if (this.layoutType === Type.VERTICAL) {
            this._doLayoutVertically(layoutAnchor, layoutSize, children);
        } else if (this.layoutType === Type.NONE) {
            this._doLayoutBasic(layoutAnchor, layoutSize, children);
        }
    },

    lateUpdate: function() {
        if (this._layoutDirty) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

});


cc.Layout = module.exports = Layout;
