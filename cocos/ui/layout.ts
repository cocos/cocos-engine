/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, help, executeInEditMode, executionOrder, menu, requireComponent, tooltip, type, serializable, visible, displayName } from 'cc.decorator';
import { Component } from '../core/components/component';
import { Rect, Size, Vec2, Vec3 } from '../core/math';
import { ccenum } from '../core/value-types/enum';
import { UITransform } from '../2d/framework/ui-transform';
import { director, Director } from '../core/director';
import { TransformBit } from '../core/scene-graph/node-enum';
import { Node, warn } from '../core';
import { NodeEventType } from '../core/scene-graph/node-event';
import { legacyCC } from '../core/global-exports';

/**
 * @en Layout type.
 *
 * @zh 布局类型。
 */
enum Type {
    /**
     * @en No layout.
     *
     * @zh 禁用布局。
     */
    NONE = 0,
    /**
     * @en Horizontal layout.
     *
     * @zh 水平布局。
     */
    HORIZONTAL = 1,

    /**
     * @en Vertical layout.
     *
     * @zh 垂直布局。
     */
    VERTICAL = 2,
    /**
     * @en Grid layout.
     *
     * @zh 网格布局。
     */
    GRID = 3,
}

ccenum(Type);

/**
 * @en Layout Resize Mode.
 *
 * @zh 缩放模式。
 */
enum ResizeMode {
    /**
     * @en Don't scale.
     *
     * @zh 不做任何缩放。
     */
    NONE = 0,
    /**
     * @en The container size will be expanded with its children's size.
     *
     * @zh 容器的大小会根据子节点的大小自动缩放。
     */
    CONTAINER = 1,
    /**
     * @en Child item size will be adjusted with the container's size.
     *
     * @zh 子节点的大小会随着容器的大小自动缩放。
     */
    CHILDREN = 2,
}

ccenum(ResizeMode);

/**
 * @en Grid Layout start axis direction.
 *
 * @zh 布局轴向，只用于 GRID 布局。
 */
enum AxisDirection {
    /**
     * @en The horizontal axis.
     *
     * @zh 进行水平方向布局。
     */
    HORIZONTAL = 0,
    /**
     * @en The vertical axis.
     *
     * @zh 进行垂直方向布局。
     */
    VERTICAL = 1,
}

ccenum(AxisDirection);

/**
 * @en Vertical layout direction.
 *
 * @zh 垂直方向布局方式。
 */
enum VerticalDirection {
    /**
     * @en Items arranged from bottom to top.
     *
     * @zh 从下到上排列。
     */
    BOTTOM_TO_TOP = 0,
    /**
     * @en Items arranged from top to bottom.
     * @zh 从上到下排列。
     */
    TOP_TO_BOTTOM = 1,
}

ccenum(VerticalDirection);

/**
 * @en Horizontal layout direction.
 *
 * @zh 水平方向布局方式。
 */
enum HorizontalDirection {
    /**
     * @en Items arranged from left to right.
     *
     * @zh 从左往右排列。
     */
    LEFT_TO_RIGHT = 0,
    /**
     * @en Items arranged from right to left.
     * @zh 从右往左排列。
     */
    RIGHT_TO_LEFT = 1,
}

ccenum(HorizontalDirection);

/**
 * @en Layout constraint.
 *
 * @zh 布局约束。
 */
enum Constraint {
    /**
     * @en Constraint free.
     *
     * @zh 自由排布。
     */
    NONE = 0,
    /**
     * @en Keep the number of rows fixed.
     *
     * @zh 固定行。
     */
    FIXED_ROW = 1,
    /**
     * @en Keep the number of rows fixed columns.
     *
     * @zh 固定列。
     */
    FIXED_COL = 2,
}

ccenum(Constraint);

const _tempVec3 = new Vec3();

/**
 * @en
 * The Layout is a container component, use it to arrange child elements easily.<br>
 * Note：<br>
 * 1.Scaling and rotation of child nodes are not considered.<br>
 * 2.After setting the Layout, the results need to be updated until the next frame,unless you manually call.[[updateLayout]]
 *
 * @zh
 * Layout 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * 注意：<br>
 * 1.不会考虑子节点的缩放和旋转。<br>
 * 2.对 Layout 设置后结果需要到下一帧才会更新，除非你设置完以后手动调用。[[updateLayout]]
 */
@ccclass('cc.Layout')
@help('i18n:cc.Layout')
@executionOrder(110)
@menu('UI/Layout')
@requireComponent(UITransform)
@executeInEditMode
export class Layout extends Component {
    /**
     * @en
     * Alignment horizontal. Fixed starting position in the same direction when Type is Horizontal.
     *
     * @zh
     * 横向对齐。在 Type 为 Horizontal 时按同个方向固定起始位置排列。
     */
    @visible(function (this: Layout) {
        return this._layoutType === Type.HORIZONTAL;
    })
    @tooltip('i18n:layout.align_horizontal')
    get alignHorizontal () {
        return this._isAlign;
    }

    set alignHorizontal (value) {
        if (this._layoutType !== Type.HORIZONTAL) {
            return;
        }

        this._isAlign = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * Alignment vertical. Fixed starting position in the same direction when Type is Vertical.
     *
     * @zh
     * 纵向对齐。在 Type 为 Horizontal 或 Vertical 时按同个方向固定起始位置排列。
     */
    @visible(function (this: Layout) {
        return this._layoutType === Type.VERTICAL;
    })
    @tooltip('i18n:layout.align_vertical')
    get alignVertical () {
        return this._isAlign;
    }

    set alignVertical (value) {
        if (this._layoutType !== Type.VERTICAL) {
            return;
        }

        this._isAlign = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The layout type.
     *
     * @zh
     * 布局类型。
     */
    @type(Type)
    @tooltip('i18n:layout.layout_type')
    get type () {
        return this._layoutType;
    }

    set type (value: Type) {
        this._layoutType = value;
        this._doLayoutDirty();
    }
    /**
     * @en
     * The are three resize modes for Layout. None, resize Container and resize children.
     *
     * @zh
     * 缩放模式。
     */
    @type(ResizeMode)
    @visible(function (this: Layout) {
        return this._layoutType !== Type.NONE;
    })
    @tooltip('i18n:layout.resize_mode')
    get resizeMode () {
        return this._resizeMode;
    }
    set resizeMode (value) {
        if (this._layoutType === Type.NONE) {
            return;
        }

        this._resizeMode = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The cell size for grid layout.
     *
     * @zh
     * 每个格子的大小，只有布局类型为 GRID 的时候才有效。
     */
    @visible(function (this: Layout) {
        if (this.type === Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
            return true;
        }

        return false;
    })
    @tooltip('i18n:layout.cell_size')
    get cellSize (): Readonly<Size> {
        return this._cellSize;
    }

    set cellSize (value) {
        if (this._cellSize === value) {
            return;
        }

        this._cellSize.set(value);
        this._doLayoutDirty();
    }

    /**
     * @en
     * The start axis for grid layout. If you choose horizontal, then children will layout horizontally at first,
     * and then break line on demand. Choose vertical if you want to layout vertically at first .
     *
     * @zh
     * 起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效。
     */
    @type(AxisDirection)
    @tooltip('i18n:layout.start_axis')
    get startAxis () {
        return this._startAxis;
    }

    set startAxis (value) {
        if (this._startAxis === value) {
            return;
        }

        this._startAxis = value;
        this._doLayoutDirty();
    }
    /**
     * @en
     * The left padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内左边距，只会在一个布局方向上生效。
     */
    @tooltip('i18n:layout.padding_left')
    get paddingLeft () {
        return this._paddingLeft;
    }
    set paddingLeft (value) {
        if (this._paddingLeft === value) {
            return;
        }

        this._paddingLeft = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The right padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内右边距，只会在一个布局方向上生效。
     */
    @tooltip('i18n:layout.padding_right')
    get paddingRight () {
        return this._paddingRight;
    }
    set paddingRight (value) {
        if (this._paddingRight === value) {
            return;
        }

        this._paddingRight = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The top padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内上边距，只会在一个布局方向上生效。
     */
    @tooltip('i18n:layout.padding_top')
    get paddingTop () {
        return this._paddingTop;
    }
    set paddingTop (value) {
        if (this._paddingTop === value) {
            return;
        }

        this._paddingTop = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The bottom padding of layout, it only effect the layout in one direction.
     *
     * @zh
     * 容器内下边距，只会在一个布局方向上生效。
     */
    @tooltip('i18n:layout.padding_bottom')
    get paddingBottom () {
        return this._paddingBottom;
    }
    set paddingBottom (value) {
        if (this._paddingBottom === value) {
            return;
        }

        this._paddingBottom = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The distance in x-axis between each element in layout.
     *
     * @zh
     * 子节点之间的水平间距。
     */
    @tooltip('i18n:layout.space_x')
    get spacingX () {
        return this._spacingX;
    }

    set spacingX (value) {
        if (this._spacingX === value) {
            return;
        }

        this._spacingX = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The distance in y-axis between each element in layout.
     *
     * @zh
     * 子节点之间的垂直间距。
     */
    @tooltip('i18n:layout.space_y')
    get spacingY () {
        return this._spacingY;
    }

    set spacingY (value) {
        if (this._spacingY === value) {
            return;
        }

        this._spacingY = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * Only take effect in Vertical layout mode.
     * This option changes the start element's positioning.
     *
     * @zh
     * 垂直排列子节点的方向。
     */
    @type(VerticalDirection)
    @tooltip('i18n:layout.vertical_direction')
    get verticalDirection () {
        return this._verticalDirection;
    }

    set verticalDirection (value: VerticalDirection) {
        if (this._verticalDirection === value) {
            return;
        }

        this._verticalDirection = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * Only take effect in horizontal layout mode.
     * This option changes the start element's positioning.
     *
     * @zh
     * 水平排列子节点的方向。
     */
    @type(HorizontalDirection)
    @tooltip('i18n:layout.horizontal_direction')
    get horizontalDirection () {
        return this._horizontalDirection;
    }

    set horizontalDirection (value: HorizontalDirection) {
        if (this._horizontalDirection === value) {
            return;
        }

        this._horizontalDirection = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The padding of layout, it will effect the layout in horizontal and vertical direction.
     *
     * @zh
     * 容器内边距，该属性会在四个布局方向上生效。
     */
    get padding () {
        return this._paddingLeft;
    }

    set padding (value) {
        if (this.paddingLeft !== value || this._paddingRight !== value || this._paddingTop !== value || this._paddingBottom !== value) {
            this._paddingLeft = this._paddingRight = this._paddingTop = this._paddingBottom = value;
            this._doLayoutDirty();
        }
    }

    /**
     * @en
     * The layout constraint inside the container.
     *
     * @zh
     * 容器内布局约束。
     */
    @type(Constraint)
    @visible(function (this: Layout) {
        return this.type === Type.GRID;
    })
    @tooltip('i18n:layout.constraint')
    get constraint () {
        return this._constraint;
    }

    set constraint (value: Constraint) {
        if (this._layoutType === Type.NONE || this._constraint === value) {
            return;
        }

        this._constraint = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * The limit value used by the layout constraint inside the container.
     *
     * @zh
     * 容器内布局约束使用的限定值。
     */
    @visible(function (this: Layout) {
        return this._constraint !== Constraint.NONE;
    })
    @tooltip('i18n:layout.constraint_number')
    get constraintNum () {
        return this._constraintNum;
    }

    set constraintNum (value) {
        if (this._constraint === Constraint.NONE || this._constraintNum === value) {
            return;
        }

        if (value <= 0) {
            warn('Limit values to be greater than 0');
        }

        this._constraintNum = value;
        this._doLayoutDirty();
    }

    /**
     * @en
     * Adjust the layout if the children scaled.
     *
     * @zh
     * 子节点缩放比例是否影响布局。
     */
    @tooltip('i18n:layout.affected_scale')
    get affectedByScale () {
        return this._affectedByScale;
    }

    set affectedByScale (value) {
        this._affectedByScale = value;
        this._doLayoutDirty();
    }

    public static Type = Type;
    public static VerticalDirection = VerticalDirection;
    public static HorizontalDirection = HorizontalDirection;
    public static ResizeMode = ResizeMode;
    public static AxisDirection = AxisDirection;
    public static Constraint = Constraint;

    @serializable
    protected _resizeMode = ResizeMode.NONE;
    @serializable
    protected _layoutType = Type.NONE;
    @serializable
    protected _cellSize = new Size(40, 40);
    @serializable
    protected _startAxis = AxisDirection.HORIZONTAL;
    @serializable
    protected _paddingLeft = 0;
    @serializable
    protected _paddingRight = 0;
    @serializable
    protected _paddingTop = 0;
    @serializable
    protected _paddingBottom = 0;
    @serializable
    protected _spacingX = 0;
    @serializable
    protected _spacingY = 0;
    @serializable
    protected _verticalDirection = VerticalDirection.TOP_TO_BOTTOM;
    @serializable
    protected _horizontalDirection = HorizontalDirection.LEFT_TO_RIGHT;
    @serializable
    protected _constraint = Constraint.NONE;
    @serializable
    protected _constraintNum = 2;
    @serializable
    protected _affectedByScale = false;
    @serializable
    protected _isAlign = false;

    protected _layoutSize = new Size(300, 200);
    protected _layoutDirty = true;
    protected _childrenDirty = false;
    protected _usefulLayoutObj: UITransform[] = [];
    protected _init = false;

    /**
     * @en
     * Perform the layout update.
     *
     * @zh
     * 立即执行更新布局。
     *
     * @example
     * ```ts
     * import { Layout, log } from 'cc';
     * layout.type = Layout.Type.HORIZONTAL;
     * layout.node.addChild(childNode);
     * log(childNode.x); // not yet changed
     * layout.updateLayout();
     * log(childNode.x); // changed
     * ```
     */
    public updateLayout (force = false) {
        if ((this._layoutDirty || force) && this.node.children.length > 0) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

    protected onEnable () {
        this._addEventListeners();

        const trans = this.node._uiProps.uiTransformComp!;
        if (trans.contentSize.equals(Size.ZERO)) {
            trans.setContentSize(this._layoutSize);
        }

        this._childrenChanged();
    }

    protected onDisable () {
        this._usefulLayoutObj.length = 0;
        this._removeEventListeners();
    }

    protected _checkUsefulObj () {
        this._usefulLayoutObj.length = 0;
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            const uiTrans = child._uiProps.uiTransformComp;
            if (child.activeInHierarchy && uiTrans) {
                this._usefulLayoutObj.push(uiTrans);
            }
        }
    }

    protected _addEventListeners () {
        director.on(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(NodeEventType.SIZE_CHANGED, this._resized, this);
        this.node.on(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(NodeEventType.CHILD_ADDED, this._childAdded, this);
        this.node.on(NodeEventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.on(NodeEventType.SIBLING_ORDER_CHANGED, this._childrenChanged, this);
        this.node.on('childrenSiblingOrderChanged', this.updateLayout, this);
        this._addChildrenEventListeners();
    }

    protected _removeEventListeners () {
        director.off(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(NodeEventType.SIZE_CHANGED, this._resized, this);
        this.node.off(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(NodeEventType.CHILD_ADDED, this._childAdded, this);
        this.node.off(NodeEventType.CHILD_REMOVED, this._childRemoved, this);
        this.node.off(NodeEventType.SIBLING_ORDER_CHANGED, this._childrenChanged, this);
        this.node.off('childrenSiblingOrderChanged', this.updateLayout, this);
        this._removeChildrenEventListeners();
    }

    protected _addChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.on(NodeEventType.SIZE_CHANGED, this._doLayoutDirty, this);
            child.on(NodeEventType.TRANSFORM_CHANGED, this._transformDirty, this);
            child.on(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.on(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        }
    }

    protected _removeChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.off(NodeEventType.SIZE_CHANGED, this._doLayoutDirty, this);
            child.off(NodeEventType.TRANSFORM_CHANGED, this._transformDirty, this);
            child.off(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.off(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        }
    }

    protected _childAdded (child: Node) {
        child.on(NodeEventType.SIZE_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEventType.TRANSFORM_CHANGED, this._transformDirty, this);
        child.on(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        this._childrenChanged();
    }

    protected _childRemoved (child: Node) {
        child.off(NodeEventType.SIZE_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEventType.TRANSFORM_CHANGED, this._transformDirty, this);
        child.off(NodeEventType.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEventType.ACTIVE_IN_HIERARCHY_CHANGED, this._childrenChanged, this);
        this._childrenChanged();
    }

    protected _resized () {
        this._layoutSize.set(this.node._uiProps.uiTransformComp!.contentSize);
        this._doLayoutDirty();
    }

    protected _doLayoutHorizontally (baseWidth: number, rowBreak: boolean, fnPositionY: (...args: any[]) => number, applyChildren: boolean) {
        const trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const limit = this._getFixedBreakingNum();

        let sign = 1;
        let paddingX = this._paddingLeft;
        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            paddingX = this._paddingRight;
        }

        const startPos = (this._horizontalDirection - layoutAnchor.x) * baseWidth + sign * paddingX;
        let nextX = startPos - sign * this._spacingX;
        let totalHeight = 0; // total content height (not including spacing)
        let rowMaxHeight = 0; // maximum height of a single line
        let tempMaxHeight = 0; //
        let maxHeight = 0;
        let isBreak = false;
        const activeChildCount = this._usefulLayoutObj.length;
        let newChildWidth = this._cellSize.width;
        const paddingH = this._getPaddingH();
        if (this._layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
            newChildWidth = (baseWidth - paddingH - (activeChildCount - 1) * this._spacingX) / activeChildCount;
        }

        const children = this._usefulLayoutObj;
        for (let i = 0; i < children.length; ++i) {
            const childTrans = children[i];
            const child = childTrans.node;
            const scale =  child.scale;
            const childScaleX = this._getUsedScaleValue(scale.x);
            const childScaleY = this._getUsedScaleValue(scale.y);
            // for resizing children
            if (this._resizeMode === ResizeMode.CHILDREN) {
                childTrans.width = newChildWidth / childScaleX;
                if (this._layoutType === Type.GRID) {
                    childTrans.height = this._cellSize.height / childScaleY;
                }
            }

            const anchorX = Math.abs(this._horizontalDirection - childTrans.anchorX);
            const childBoundingBoxWidth = childTrans.width * childScaleX;
            const childBoundingBoxHeight = childTrans.height * childScaleY;

            if (childBoundingBoxHeight > tempMaxHeight) {
                maxHeight = Math.max(tempMaxHeight, maxHeight);
                rowMaxHeight = tempMaxHeight || childBoundingBoxHeight;
                tempMaxHeight = childBoundingBoxHeight;
            }

            nextX += sign * (anchorX * childBoundingBoxWidth + this._spacingX);
            const rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

            if (rowBreak) {
                if (limit > 0) {
                    isBreak = (i / limit) > 0 && (i % limit === 0);
                    if (isBreak) {
                        rowMaxHeight = tempMaxHeight > childBoundingBoxHeight ? tempMaxHeight : rowMaxHeight;
                    }
                } else if (childBoundingBoxWidth > baseWidth - paddingH) {
                    if (nextX > startPos + sign * (anchorX * childBoundingBoxWidth)) {
                        isBreak = true;
                    }
                } else {
                    const boundary = (1 - this._horizontalDirection - layoutAnchor.x) * baseWidth;
                    const rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this._paddingRight : this._paddingLeft);
                    isBreak = Math.abs(rowBreakBoundary) > Math.abs(boundary);
                }

                if (isBreak) {
                    nextX = startPos + sign * (anchorX * childBoundingBoxWidth);
                    if (childBoundingBoxHeight !== tempMaxHeight) {
                        rowMaxHeight = tempMaxHeight;
                    }
                    // In unconstrained mode, the second height size is always what we need when a line feed condition is required to trigger
                    totalHeight += rowMaxHeight + this._spacingY;
                    rowMaxHeight = tempMaxHeight = childBoundingBoxHeight;
                }
            }

            const finalPositionY = fnPositionY(child, childTrans, totalHeight);
            if (applyChildren) {
                child.setPosition(nextX, finalPositionY);
            }

            nextX += rightBoundaryOfChild;
        }

        rowMaxHeight = Math.max(rowMaxHeight, tempMaxHeight);
        const containerResizeBoundary = Math.max(maxHeight, totalHeight + rowMaxHeight) + this._getPaddingV();
        return containerResizeBoundary;
    }

    protected _doLayoutVertically (baseHeight: number, columnBreak: boolean, fnPositionX: (...args: any[]) => number, applyChildren: boolean) {
        const trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const limit = this._getFixedBreakingNum();

        let sign = 1;
        let paddingY = this._paddingBottom;
        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            paddingY = this._paddingTop;
        }

        const startPos = (this._verticalDirection - layoutAnchor.y) * baseHeight + sign * paddingY;
        let nextY = startPos - sign * this._spacingY;
        let tempMaxWidth = 0;
        let maxWidth = 0;
        let colMaxWidth = 0;
        let totalWidth = 0;
        let isBreak = false;
        const activeChildCount = this._usefulLayoutObj.length;
        let newChildHeight = this._cellSize.height;
        const paddingV = this._getPaddingV();
        if (this._layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
            newChildHeight = (baseHeight - paddingV - (activeChildCount - 1) * this._spacingY) / activeChildCount;
        }

        const children = this._usefulLayoutObj;
        for (let i = 0; i < children.length; ++i) {
            const childTrans = children[i];
            const child = childTrans.node;
            const scale = child.scale;
            const childScaleX = this._getUsedScaleValue(scale.x);
            const childScaleY = this._getUsedScaleValue(scale.y);

            // for resizing children
            if (this._resizeMode === ResizeMode.CHILDREN) {
                childTrans.height = newChildHeight / childScaleY;
                if (this._layoutType === Type.GRID) {
                    childTrans.width = this._cellSize.width / childScaleX;
                }
            }

            const anchorY = Math.abs(this._verticalDirection - childTrans.anchorY);
            const childBoundingBoxWidth = childTrans.width * childScaleX;
            const childBoundingBoxHeight = childTrans.height * childScaleY;

            if (childBoundingBoxWidth > tempMaxWidth) {
                maxWidth = Math.max(tempMaxWidth, maxWidth);
                colMaxWidth = tempMaxWidth || childBoundingBoxWidth;
                tempMaxWidth = childBoundingBoxWidth;
            }

            nextY += sign * (anchorY * childBoundingBoxHeight + this._spacingY);
            const topBoundaryOfChild = sign * (1 - anchorY) * childBoundingBoxHeight;

            if (columnBreak) {
                if (limit > 0) {
                    isBreak = (i / limit) > 0 && (i % limit === 0);
                    if (isBreak) {
                        colMaxWidth = tempMaxWidth > childBoundingBoxHeight ? tempMaxWidth : colMaxWidth;
                    }
                } else if (childBoundingBoxHeight > baseHeight - paddingV) {
                    if (nextY > startPos + sign * (anchorY * childBoundingBoxHeight)) {
                        isBreak = true;
                    }
                } else {
                    const boundary = (1 - this._verticalDirection - layoutAnchor.y) * baseHeight;
                    const columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this._paddingTop : this._paddingBottom);
                    isBreak = Math.abs(columnBreakBoundary) > Math.abs(boundary);
                }

                if (isBreak) {
                    nextY = startPos + sign * (anchorY * childBoundingBoxHeight);
                    if (childBoundingBoxWidth !== tempMaxWidth) {
                        colMaxWidth = tempMaxWidth;
                    }
                    // In unconstrained mode, the second width size is always what we need when a line feed condition is required to trigger
                    totalWidth += colMaxWidth + this._spacingX;
                    colMaxWidth = tempMaxWidth = childBoundingBoxWidth;
                }
            }

            const finalPositionX = fnPositionX(child, childTrans, totalWidth);
            if (applyChildren) {
                child.getPosition(_tempVec3);
                child.setPosition(finalPositionX, nextY, _tempVec3.z);
            }

            nextY += topBoundaryOfChild;
        }

        colMaxWidth = Math.max(colMaxWidth, tempMaxWidth);
        const containerResizeBoundary = Math.max(maxWidth, totalWidth + colMaxWidth) + this._getPaddingH();
        return containerResizeBoundary;
    }

    protected _doLayoutGridAxisHorizontal (layoutAnchor: Vec2 | Readonly<Vec2>, layoutSize: Size) {
        const baseWidth = layoutSize.width;

        let sign = 1;
        let bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
        let paddingY = this._paddingBottom;
        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
            paddingY = this._paddingTop;
        }

        const fnPositionY = (child: Node, childTrans: UITransform, topOffset: number) => bottomBoundaryOfLayout + sign * (topOffset + (1 - childTrans.anchorY) * childTrans.height * this._getUsedScaleValue(child.scale.y) + paddingY);

        let newHeight = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            // calculate the new height of container, it won't change the position of it's children
            newHeight = this._doLayoutHorizontally(baseWidth, true, fnPositionY, false);
            bottomBoundaryOfLayout = -layoutAnchor.y * newHeight;

            if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                sign = -1;
                bottomBoundaryOfLayout = (1 - layoutAnchor.y) * newHeight;
            }
        }

        this._doLayoutHorizontally(baseWidth, true, fnPositionY, true);

        if (this._resizeMode === ResizeMode.CONTAINER) {
            this.node._uiProps.uiTransformComp!.setContentSize(baseWidth, newHeight);
        }
    }

    protected _doLayoutGridAxisVertical (layoutAnchor: Vec2 | Readonly<Vec2>, layoutSize: Size) {
        const baseHeight = layoutSize.height;

        let sign = 1;
        let leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
        let paddingX = this._paddingLeft;
        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
            paddingX = this._paddingRight;
        }

        const fnPositionX = (child: Node, childTrans: UITransform, leftOffset: number) => leftBoundaryOfLayout + sign * (leftOffset + (1 - childTrans.anchorX) * childTrans.width * this._getUsedScaleValue(child.scale.x) + paddingX);

        let newWidth = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            newWidth = this._doLayoutVertically(baseHeight, true, fnPositionX, false);

            leftBoundaryOfLayout = -layoutAnchor.x * newWidth;

            if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                sign = -1;
                leftBoundaryOfLayout = (1 - layoutAnchor.x) * newWidth;
            }
        }

        this._doLayoutVertically(baseHeight, true, fnPositionX, true);

        if (this._resizeMode === ResizeMode.CONTAINER) {
            this.node._uiProps.uiTransformComp!.setContentSize(newWidth, baseHeight);
        }
    }

    protected _doLayoutGrid () {
        const trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const layoutSize = trans.contentSize;

        if (this.startAxis === AxisDirection.HORIZONTAL) {
            this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);
        } else if (this.startAxis === AxisDirection.VERTICAL) {
            this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
        }
    }

    protected _getHorizontalBaseWidth (horizontal = true) {
        const children = this._usefulLayoutObj;
        let baseSize = 0;
        const activeChildCount = children.length;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            for (let i = 0; i < children.length; ++i) {
                const childTrans = children[i];
                const child = childTrans.node;
                const scale =  child.scale;
                baseSize += childTrans.width * this._getUsedScaleValue(scale.x);
            }

            baseSize += (activeChildCount - 1) * this._spacingX + this._getPaddingH();
        } else {
            baseSize = this.node._uiProps.uiTransformComp!.width;
        }

        return baseSize;
    }

    protected _getVerticalBaseHeight () {
        const children = this._usefulLayoutObj;
        let baseSize = 0;
        const activeChildCount = children.length;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            for (let i = 0; i < children.length; ++i) {
                const childTrans = children[i];
                const child = childTrans.node;
                const scale = child.scale;
                baseSize += childTrans.height * this._getUsedScaleValue(scale.y);
            }

            baseSize += (activeChildCount - 1) * this._spacingY + this._getPaddingV();
        } else {
            baseSize = this.node._uiProps.uiTransformComp!.height;
        }

        return baseSize;
    }

    protected _doLayout () {
        if (!this._init || this._childrenDirty) {
            this._checkUsefulObj();
            this._init = true;
            this._childrenDirty = false;
        }

        if (this._layoutType === Type.HORIZONTAL) {
            const newWidth = this._getHorizontalBaseWidth();

            const fnPositionY = (child: Node) => {
                const pos = this._isAlign ? Vec3.ZERO : child.position;
                return pos.y;
            };

            this._doLayoutHorizontally(newWidth, false, fnPositionY, true);
            this.node._uiProps.uiTransformComp!.width = newWidth;
        } else if (this._layoutType === Type.VERTICAL) {
            const newHeight = this._getVerticalBaseHeight();

            const fnPositionX = (child: Node) => {
                const pos = this._isAlign ? Vec3.ZERO : child.position;
                return pos.x;
            };

            this._doLayoutVertically(newHeight, false, fnPositionX, true);
            this.node._uiProps.uiTransformComp!.height = newHeight;
        } else if (this._layoutType === Type.GRID) {
            this._doLayoutGrid();
        }
    }

    protected _getUsedScaleValue (value: number) {
        return this._affectedByScale ? Math.abs(value) : 1;
    }

    protected _transformDirty (type: TransformBit) {
        if (!(type & TransformBit.SCALE) || !(type & TransformBit.POSITION) || !this._affectedByScale) {
            return;
        }

        this._doLayoutDirty();
    }

    protected _doLayoutDirty () {
        this._layoutDirty = true;
    }

    protected _childrenChanged () {
        this._childrenDirty = true;
        this._doLayoutDirty();
    }

    protected _getPaddingH () {
        return this._paddingLeft + this._paddingRight;
    }

    protected _getPaddingV () {
        return this._paddingTop + this._paddingBottom;
    }

    protected _getFixedBreakingNum () {
        if (this._layoutType !== Type.GRID || this._constraint === Constraint.NONE || this._constraintNum <= 0) {
            return 0;
        }

        let num = this._constraint === Constraint.FIXED_ROW ? Math.ceil(this._usefulLayoutObj.length / this._constraintNum) : this._constraintNum;
        // Horizontal sorting always counts the number of columns
        if (this._startAxis === AxisDirection.VERTICAL) {
            num = this._constraint === Constraint.FIXED_COL ? Math.ceil(this._usefulLayoutObj.length / this._constraintNum) : this._constraintNum;
        }

        return num;
    }
}

legacyCC.Layout = Layout;
