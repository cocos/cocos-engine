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

import { Component } from '../../core/components/component';
import { ccclass, help, executeInEditMode, executionOrder, menu, property, requireComponent } from '../../core/data/class-decorator';
import { Rect, Size, Vec2, Vec3 } from '../../core/math';
import { ccenum } from '../../core/value-types/enum';
import { UITransformComponent } from '../../core/components/ui-base/ui-transform-component';
import { SystemEventType } from '../../core/platform/event-manager/event-enum';
import { director, Director } from '../../core/director';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { Node } from '../../core';
import { EDITOR, GAME_VIEW } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
const NodeEvent = SystemEventType;
/**
 * @en Enum for layout.
 *
 * @zh 布局类型。
 */
enum Type {
    /**
     * @en None Layout.
     *
     * @zh 取消布局。
     */
    NONE = 0,
    /**
     * @en Horizontal Layout.
     *
     * @zh 水平布局。
     */
    HORIZONTAL = 1,

    /**
     * @en Vertical Layout.
     *
     * @zh 垂直布局。
     */
    VERTICAL = 2,
    /**
     * @en Grid Layout.
     *
     * @zh 网格布局。
     */
    GRID = 3,
}

ccenum(Type);

/**
 * @en Enum for Layout Resize Mode.
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
 * @en Enum for Grid Layout start axis direction.
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
 * @en Enum for vertical layout direction.
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
 * @en Enum for horizontal layout direction.
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

const _tempPos = new Vec3();
const _tempScale = new Vec3();

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
@ccclass('cc.LayoutComponent')
@help('i18n:cc.LayoutComponent')
@executionOrder(110)
@menu('UI/Layout')
@requireComponent(UITransformComponent)
@executeInEditMode
export class LayoutComponent extends Component {

    /**
     * @en
     * The layout type.
     *
     * @zh
     * 布局类型。
     */
    @property({
        type: Type,
        tooltip:'自动布局模式，包括：\n 1. NONE，不会对子节点进行自动布局 \n 2. HORIZONTAL，横向自动排布子物体 \n 3. VERTICAL，垂直自动排布子物体\n 4. GRID, 采用网格方式对子物体自动进行布局',
    })
    get type () {
        return this._N$layoutType;
    }

    set type (value: Type) {
        this._N$layoutType = value;

        if (EDITOR && this._N$layoutType !== Type.NONE && this._resizeMode === ResizeMode.CONTAINER /*&& !cc.engine.isPlaying*/) {
            // const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
            // if (reLayouted) {
            //     return;
            // }
        }

        this._isAlign = true;
        this._doLayoutDirty();
    }
    /**
     * @en
     * The are three resize modes for Layout. None, resize Container and resize children.
     *
     * @zh
     * 缩放模式。
     */
    @property({
        type: ResizeMode,
        tooltip:'缩放模式，包括：\n 1. NONE，不会对子节点和容器进行大小缩放 \n 2. CONTAINER, 对容器的大小进行缩放 \n 3. CHILDREN, 对子节点的大小进行缩放',
    })
    get resizeMode () {
        return this._resizeMode;
    }
    set resizeMode (value) {
        if (this._N$layoutType === Type.NONE && value === ResizeMode.CHILDREN) {
            return;
        }

        this._resizeMode = value;
        if (EDITOR && value === ResizeMode.CONTAINER /*&& !cc.engine.isPlaying*/) {
            // const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
            // if (reLayouted) {
            //     return;
            // }
        }
        this._doLayoutDirty();
    }

    /**
     * @en
     * The cell size for grid layout.
     *
     * @zh
     * 每个格子的大小，只有布局类型为 GRID 的时候才有效。
     */
    @property({
        tooltip: '每个格子的大小，只有布局类型为 GRID 的时候才有效',
    })
    // @constget
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
    @property({
        type: AxisDirection,
        tooltip: '起始轴方向类型，可进行水平和垂直布局排列，只有布局类型为 GRID 的时候才有效',
    })
    get startAxis () {
        return this._startAxis;
    }

    set startAxis (value) {
        if (this._startAxis === value) {
            return;
        }

        if (EDITOR && this._resizeMode === ResizeMode.CONTAINER && !GAME_VIEW) {
            // const reLayouted = _Scene.DetectConflict.checkConflict_Layout(this);
            // if (reLayouted) {
            //     return;
            // }
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
    @property({
        tooltip: '容器内左边距，只会在一个布局方向上生效',
    })
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
    @property({
        tooltip: '容器内右边距，只会在一个布局方向上生效',
    })
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
    @property({
        tooltip: '容器内上边距，只会在一个布局方向上生效',
    })
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
    @property({
        tooltip: '容器内下边距，只会在一个布局方向上生效',
    })
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
    @property({
        tooltip: '子节点之间的水平间距',
    })
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
    @property({
        tooltip: '子节点之间的垂直间距',
    })
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
    @property({
        type: VerticalDirection,
        tooltip: '垂直排列子节点的方向',
    })
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
    @property({
        type: HorizontalDirection,
        tooltip: '水平排列子节点的方向',
    })
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
    @property({
        tooltip: '容器内边距，该属性会在四个布局方向上生效',
    })
    get padding () {
        return this._paddingLeft;
    }

    set padding (value) {
        this._N$padding = value;

        this._migratePaddingData();
        this._doLayoutDirty();
    }

    /**
     * @en
     * Adjust the layout if the children scaled.
     *
     * @zh
     * 子节点缩放比例是否影响布局。
     */
    @property({
        tooltip: '子节点缩放比例是否影响布局',
    })
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

    @property
    protected _resizeMode = ResizeMode.NONE;
    // TODO: refactoring this name after data upgrade machanism is out.
    @property
    protected _N$layoutType = Type.NONE;
    @property
    protected _N$padding = 0;
    @property
    protected _cellSize = new Size(40, 40);
    @property
    protected _startAxis = AxisDirection.HORIZONTAL;
    @property
    protected _paddingLeft = 0;
    @property
    protected _paddingRight = 0;
    @property
    protected _paddingTop = 0;
    @property
    protected _paddingBottom = 0;
    @property
    protected _spacingX = 0;
    @property
    protected _spacingY = 0;
    @property
    protected _verticalDirection = VerticalDirection.TOP_TO_BOTTOM;
    @property
    protected _horizontalDirection = HorizontalDirection.LEFT_TO_RIGHT;
    @property
    protected _affectedByScale = false;

    protected _layoutSize = new Size(300, 200);
    protected _layoutDirty = true;
    protected _isAlign = false;

    /**
     * @en
     * Perform the layout update.
     *
     * @zh
     * 立即执行更新布局。
     *
     * @example
     * ```typescript
     * layout.type = cc.LayoutComponent.HORIZONTAL;
     * layout.node.addChild(childNode);
     * cc.log(childNode.x); // not yet changed
     * layout.updateLayout();
     * cc.log(childNode.x); // changed
     * ```
     */
    public updateLayout () {
        if (this._layoutDirty && this.node.children.length > 0) {
            this._doLayout();
            this._layoutDirty = false;
        }
    }

    protected onEnable () {
        this._addEventListeners();

        let trans = this.node._uiProps.uiTransformComp!;
        if (trans.contentSize.equals(Size.ZERO)) {
            trans.setContentSize(this._layoutSize);
        }

        if (this._N$padding !== 0) {
            this._migratePaddingData();
        }

        this._doLayoutDirty();
    }

    protected onDisable () {
        this._removeEventListeners();
    }

    protected _migratePaddingData () {
        this._paddingLeft = this._N$padding;
        this._paddingRight = this._N$padding;
        this._paddingTop = this._N$padding;
        this._paddingBottom = this._N$padding;
        this._N$padding = 0;
    }

    protected _addEventListeners () {
        director.on(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.on(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.on(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.on(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
        // this.node.on(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);
        this._addChildrenEventListeners();
    }

    protected _removeEventListeners () {
        director.off(Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
        this.node.off(NodeEvent.SIZE_CHANGED, this._resized, this);
        this.node.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        this.node.off(NodeEvent.CHILD_ADDED, this._childAdded, this);
        this.node.off(NodeEvent.CHILD_REMOVED, this._childRemoved, this);
        // this.node.off(NodeEvent.CHILD_REORDER, this._doLayoutDirty, this);
        this._removeChildrenEventListeners();
    }

    protected _addChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.on(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
            child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
            child.on(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
            child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    }

    protected _removeChildrenEventListeners () {
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            child.off(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
            child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
            child.off(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
            child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
            child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);
        }
    }

    protected _childAdded (child: Node) {
        child.on(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
        child.on(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.on(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
        child.on(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.on('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    }

    protected _childRemoved (child: Node) {
        child.off(NodeEvent.TRANSFORM_CHANGED, this._doScaleDirty, this);
        child.off(NodeEvent.SIZE_CHANGED, this._doLayoutDirty, this);
        child.off(NodeEvent.TRANSFORM_CHANGED, this._transformDirty, this);
        child.off(NodeEvent.ANCHOR_CHANGED, this._doLayoutDirty, this);
        child.off('active-in-hierarchy-changed', this._doLayoutDirty, this);

        this._doLayoutDirty();
    }

    protected _resized () {
        this._layoutSize.set(this.node._uiProps.uiTransformComp!.contentSize);
        this._doLayoutDirty();
    }

    protected _doLayoutHorizontally (baseWidth: number, rowBreak: boolean, fnPositionY: Function, applyChildren: boolean) {
        const trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const children = this.node.children;

        let sign = 1;
        let paddingX = this._paddingLeft;
        let startPos = -layoutAnchor.x * baseWidth;
        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            startPos = (1 - layoutAnchor.x) * baseWidth;
            paddingX = this._paddingRight;
        }

        let nextX = startPos + sign * paddingX - sign * this._spacingX;
        let rowMaxHeight = 0;
        let tempMaxHeight = 0;
        let secondMaxHeight = 0;
        let row = 0;
        let containerResizeBoundary = 0;

        let maxHeightChildAnchorY = 0;

        let activeChildCount = 0;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].activeInHierarchy) {
                activeChildCount++;
            }
        }

        let newChildWidth = this._cellSize.width;
        if (this._N$layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
            newChildWidth = (baseWidth - (this._paddingLeft + this._paddingRight) - (activeChildCount - 1) * this._spacingX) / activeChildCount;
        }

        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            const childTrans = child._uiProps.uiTransformComp;
            if (!child.activeInHierarchy || !childTrans) {
                continue;
            }

            child.getScale(_tempScale);
            const childScaleX = this._getUsedScaleValue(_tempScale.x);
            const childScaleY = this._getUsedScaleValue(_tempScale.y);
            // for resizing children
            if (this._resizeMode === ResizeMode.CHILDREN) {
                childTrans.width = newChildWidth / childScaleX;
                if (this._N$layoutType === Type.GRID) {
                    childTrans.height = this._cellSize.height / childScaleY;
                }
            }

            let anchorX = childTrans.anchorX;
            const childBoundingBoxWidth = childTrans.width * childScaleX;
            const childBoundingBoxHeight = childTrans.height * childScaleY;

            if (secondMaxHeight > tempMaxHeight) {
                tempMaxHeight = secondMaxHeight;
            }

            if (childBoundingBoxHeight >= tempMaxHeight) {
                secondMaxHeight = tempMaxHeight;
                tempMaxHeight = childBoundingBoxHeight;
                maxHeightChildAnchorY = childTrans.anchorY;
            }

            if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - childTrans.anchorX;
            }
            nextX = nextX + sign * anchorX * childBoundingBoxWidth + sign * this._spacingX;
            const rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

            if (rowBreak) {
                const rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this._paddingRight : this._paddingLeft);
                let leftToRightRowBreak = false;
                if (this._horizontalDirection === HorizontalDirection.LEFT_TO_RIGHT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth) {
                    leftToRightRowBreak = true;
                }

                let rightToLeftRowBreak = false;
                if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth) {
                    rightToLeftRowBreak = true;
                }

                if (leftToRightRowBreak || rightToLeftRowBreak) {

                    if (childBoundingBoxHeight >= tempMaxHeight) {
                        if (secondMaxHeight === 0) {
                            secondMaxHeight = tempMaxHeight;
                        }
                        rowMaxHeight += secondMaxHeight;
                        secondMaxHeight = tempMaxHeight;
                    } else {
                        rowMaxHeight += tempMaxHeight;
                        secondMaxHeight = childBoundingBoxHeight;
                        tempMaxHeight = 0;
                    }
                    nextX = startPos + sign * (paddingX + anchorX * childBoundingBoxWidth);
                    row++;
                }
            }

            const finalPositionY = fnPositionY(child, childTrans, rowMaxHeight, row);
            if (baseWidth >= (childBoundingBoxWidth + this._paddingLeft + this._paddingRight)) {
                if (applyChildren) {
                    child.getPosition(_tempPos);
                    child.setPosition(nextX, finalPositionY, _tempPos.z);
                }
            }

            let signX = 1;
            let tempFinalPositionY;
            const topMargin = (tempMaxHeight === 0) ? childBoundingBoxHeight : tempMaxHeight;

            if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                containerResizeBoundary = containerResizeBoundary || trans.height;
                signX = -1;
                tempFinalPositionY = finalPositionY + signX * (topMargin * maxHeightChildAnchorY + this._paddingBottom);
                if (tempFinalPositionY < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            } else {
                containerResizeBoundary = containerResizeBoundary || -trans.height;
                tempFinalPositionY = finalPositionY + signX * (topMargin * maxHeightChildAnchorY + this._paddingTop);
                if (tempFinalPositionY > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }

            nextX += rightBoundaryOfChild;
        }

        return containerResizeBoundary;
    }

    protected _doLayoutVertically (
        baseHeight: number,
        columnBreak: boolean,
        fnPositionX: Function,
        applyChildren: boolean,
    ) {
        const trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const children = this.node.children;

        let sign = 1;
        let paddingY = this._paddingBottom;
        let bottomBoundaryOfLayout = -layoutAnchor.y * baseHeight;
        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * baseHeight;
            paddingY = this._paddingTop;
        }

        let nextY = bottomBoundaryOfLayout + sign * paddingY - sign * this._spacingY;
        let columnMaxWidth = 0;
        let tempMaxWidth = 0;
        let secondMaxWidth = 0;
        let column = 0;
        let containerResizeBoundary = 0;
        let maxWidthChildAnchorX = 0;

        let activeChildCount = 0;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].activeInHierarchy) {
                activeChildCount++;
            }
        }

        let newChildHeight = this._cellSize.height;
        if (this._N$layoutType !== Type.GRID && this._resizeMode === ResizeMode.CHILDREN) {
            newChildHeight = (baseHeight - (this._paddingTop + this._paddingBottom) - (activeChildCount - 1) * this._spacingY) / activeChildCount;
        }

        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (!child) {
                continue;
            }

            const scale = child.getScale();
            const childScaleX = this._getUsedScaleValue(scale.x);
            const childScaleY = this._getUsedScaleValue(scale.y);
            const childTrans = child._uiProps.uiTransformComp;
            if (!child.activeInHierarchy || !childTrans) {
                continue;
            }

            // for resizing children
            if (this._resizeMode === ResizeMode.CHILDREN) {
                childTrans.height = newChildHeight / childScaleY;
                if (this._N$layoutType === Type.GRID) {
                    childTrans.width = this._cellSize.width / childScaleX;
                }
            }

            let anchorY = childTrans.anchorY;
            const childBoundingBoxWidth = childTrans.width * childScaleX;
            const childBoundingBoxHeight = childTrans.height * childScaleY;

            if (secondMaxWidth > tempMaxWidth) {
                tempMaxWidth = secondMaxWidth;
            }

            if (childBoundingBoxWidth >= tempMaxWidth) {
                secondMaxWidth = tempMaxWidth;
                tempMaxWidth = childBoundingBoxWidth;
                maxWidthChildAnchorX = childTrans.anchorX;
            }

            if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
                anchorY = 1 - childTrans.anchorY;
            }
            nextY = nextY + sign * anchorY * childBoundingBoxHeight + sign * this._spacingY;
            const topBoundaryOfChild = sign * (1 - anchorY) * childBoundingBoxHeight;

            if (columnBreak) {
                const columnBreakBoundary = nextY + topBoundaryOfChild + sign * (sign > 0 ? this._paddingTop : this._paddingBottom);
                let bottomToTopColumnBreak = false;
                if (this._verticalDirection === VerticalDirection.BOTTOM_TO_TOP && columnBreakBoundary > (1 - layoutAnchor.y) * baseHeight) {
                    bottomToTopColumnBreak = true;
                }

                let topToBottomColumnBreak = false;
                if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM && columnBreakBoundary < -layoutAnchor.y * baseHeight) {
                    topToBottomColumnBreak = true;
                }

                if (bottomToTopColumnBreak || topToBottomColumnBreak) {
                    if (childBoundingBoxWidth >= tempMaxWidth) {
                        if (secondMaxWidth === 0) {
                            secondMaxWidth = tempMaxWidth;
                        }
                        columnMaxWidth += secondMaxWidth;
                        secondMaxWidth = tempMaxWidth;
                    } else {
                        columnMaxWidth += tempMaxWidth;
                        secondMaxWidth = childBoundingBoxWidth;
                        tempMaxWidth = 0;
                    }
                    nextY = bottomBoundaryOfLayout + sign * (paddingY + anchorY * childBoundingBoxHeight);
                    column++;
                }
            }

            const finalPositionX = fnPositionX(child, columnMaxWidth, column);
            if (baseHeight >= (childBoundingBoxHeight + (this._paddingTop + this._paddingBottom))) {
                if (applyChildren) {
                    child.getPosition(_tempPos);
                    child.setPosition(finalPositionX, nextY, _tempPos.z);
                }
            }

            let signX = 1;
            let tempFinalPositionX;
            // when the item is the last column break item, the tempMaxWidth will be 0.
            const rightMargin = (tempMaxWidth === 0) ? childBoundingBoxWidth : tempMaxWidth;

            if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
                signX = -1;
                containerResizeBoundary = containerResizeBoundary || trans.width;
                tempFinalPositionX = finalPositionX + signX * (rightMargin * maxWidthChildAnchorX + this._paddingLeft);
                if (tempFinalPositionX < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionX;
                }
            } else {
                containerResizeBoundary = containerResizeBoundary || -trans.width;
                tempFinalPositionX = finalPositionX + signX * (rightMargin * maxWidthChildAnchorX + this._paddingRight);
                if (tempFinalPositionX > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionX;
                }

            }

            nextY += topBoundaryOfChild;
        }

        return containerResizeBoundary;
    }

    protected _doLayoutBasic () {
        const children = this.node.children;
        let allChildrenBoundingBox: Rect | null = null;

        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            const childTransform = child._uiProps.uiTransformComp;
            if (!childTransform) {
                continue;
            }

            if (child.activeInHierarchy) {
                if (!allChildrenBoundingBox) {
                    allChildrenBoundingBox = childTransform.getBoundingBoxToWorld();
                } else {
                    Rect.union(allChildrenBoundingBox, allChildrenBoundingBox, childTransform.getBoundingBoxToWorld());
                }
            }
        }

        if (allChildrenBoundingBox) {
            const parentTransform = this.node.parent!.getComponent(UITransformComponent);
            if (!parentTransform) {
                return;
            }

            Vec3.set(_tempPos, allChildrenBoundingBox.x, allChildrenBoundingBox.y, 0);
            const leftBottomInParentSpace = new Vec3();
            parentTransform.convertToNodeSpaceAR(_tempPos, leftBottomInParentSpace);
            Vec3.set(leftBottomInParentSpace,
                leftBottomInParentSpace.x - this._paddingLeft, leftBottomInParentSpace.y - this._paddingBottom,
                leftBottomInParentSpace.z);

            Vec3.set(_tempPos, allChildrenBoundingBox.x + allChildrenBoundingBox.width, allChildrenBoundingBox.y + allChildrenBoundingBox.height, 0);
            const rightTopInParentSpace = new Vec3();
            parentTransform.convertToNodeSpaceAR(_tempPos, rightTopInParentSpace);
            Vec3.set(rightTopInParentSpace, rightTopInParentSpace.x + this._paddingRight, rightTopInParentSpace.y + this._paddingTop, rightTopInParentSpace.z);

            const newSize = legacyCC.size(parseFloat((rightTopInParentSpace.x - leftBottomInParentSpace.x).toFixed(2)),
                parseFloat((rightTopInParentSpace.y - leftBottomInParentSpace.y).toFixed(2)));

            this.node.getPosition(_tempPos);
            const trans = this.node._uiProps.uiTransformComp!;
            if (newSize.width !== 0) {
                const newAnchorX = (_tempPos.x - leftBottomInParentSpace.x) / newSize.width;
                trans.anchorX = parseFloat(newAnchorX.toFixed(2));
            }
            if (newSize.height !== 0) {
                const newAnchorY = (_tempPos.y - leftBottomInParentSpace.y) / newSize.height;
                trans.anchorY = parseFloat(newAnchorY.toFixed(2));
            }
            trans.setContentSize(newSize);
        }
    }

    protected _doLayoutGridAxisHorizontal (layoutAnchor, layoutSize) {
        const baseWidth = layoutSize.width;

        let sign = 1;
        let bottomBoundaryOfLayout = -layoutAnchor.y * layoutSize.height;
        let paddingY = this._paddingBottom;
        if (this._verticalDirection === VerticalDirection.TOP_TO_BOTTOM) {
            sign = -1;
            bottomBoundaryOfLayout = (1 - layoutAnchor.y) * layoutSize.height;
            paddingY = this._paddingTop;
        }

        const self = this;
        const fnPositionY = (child: Node, childTrans: UITransformComponent, topOffset: number, row: number) => {
            return bottomBoundaryOfLayout +
                sign * (topOffset + childTrans.anchorY * childTrans.height * self._getUsedScaleValue(child.getScale().y) + paddingY + row * this._spacingY);
        };

        let newHeight = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            // calculate the new height of container, it won't change the position of it's children
            const boundary = this._doLayoutHorizontally(baseWidth, true, fnPositionY, false);
            newHeight = bottomBoundaryOfLayout - boundary;
            if (newHeight < 0) {
                newHeight *= -1;
            }

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

    protected _doLayoutGridAxisVertical (layoutAnchor: Vec2, layoutSize: Size) {
        const baseHeight = layoutSize.height;

        let sign = 1;
        let leftBoundaryOfLayout = -layoutAnchor.x * layoutSize.width;
        let paddingX = this._paddingLeft;
        if (this._horizontalDirection === HorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * layoutSize.width;
            paddingX = this._paddingRight;
        }

        const self = this;
        const fnPositionX = (child: Node, childTrans: UITransformComponent, leftOffset: number, column: number) => {
            return leftBoundaryOfLayout +
                sign * (leftOffset + childTrans.anchorX * childTrans.width * self._getUsedScaleValue(child.getScale().x) + paddingX + column * this._spacingX);
        };

        let newWidth = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            const boundary = this._doLayoutVertically(baseHeight, true, fnPositionX, false);
            newWidth = leftBoundaryOfLayout - boundary;
            if (newWidth < 0) {
                newWidth *= -1;
            }

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
        let trans = this.node._uiProps.uiTransformComp!;
        const layoutAnchor = trans.anchorPoint;
        const layoutSize = trans.contentSize;

        if (this.startAxis === AxisDirection.HORIZONTAL) {
            this._doLayoutGridAxisHorizontal(layoutAnchor, layoutSize);

        } else if (this.startAxis === AxisDirection.VERTICAL) {
            this._doLayoutGridAxisVertical(layoutAnchor, layoutSize);
        }

    }

    protected _getHorizontalBaseWidth (children: Readonly<Node[]>) {
        let newWidth = 0;
        let activeChildCount = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                child.getScale(_tempScale);
                let childTrans = child._uiProps.uiTransformComp;
                if (child.activeInHierarchy && childTrans) {
                    activeChildCount++;
                    newWidth += childTrans.width * this._getUsedScaleValue(_tempScale.x);
                }
            }
            newWidth += (activeChildCount - 1) * this._spacingX + this._paddingLeft + this._paddingRight;
        } else {
            newWidth = this.node._uiProps.uiTransformComp!.width;
        }
        return newWidth;
    }

    protected _getVerticalBaseHeight (children: Readonly<Node[]>) {
        let newHeight = 0;
        let activeChildCount = 0;
        if (this._resizeMode === ResizeMode.CONTAINER) {
            for (let i = 0; i < children.length; ++i) {
                const child = children[i];
                child.getScale(_tempScale);
                let childTrans = child._uiProps.uiTransformComp;
                if (child.activeInHierarchy && childTrans) {
                    activeChildCount++;
                    newHeight += childTrans.height! * this._getUsedScaleValue(_tempScale.y);
                }
            }

            newHeight += (activeChildCount - 1) * this._spacingY + this._paddingBottom + this._paddingTop;
        } else {
            newHeight = this.node._uiProps.uiTransformComp!.height;
        }
        return newHeight;
    }

    protected _doLayout () {

        if (this._N$layoutType === Type.HORIZONTAL) {
            const newWidth = this._getHorizontalBaseWidth(this.node.children);

            const fnPositionY = (child: Node) => {
                const pos = this._isAlign ? Vec3.ZERO : child.position;
                return pos.y;
            };

            this._doLayoutHorizontally(newWidth, false, fnPositionY, true);
            this._isAlign = false;
            this.node._uiProps.uiTransformComp!.width = newWidth;
        } else if (this._N$layoutType === Type.VERTICAL) {
            const newHeight = this._getVerticalBaseHeight(this.node.children);

            const fnPositionX = (child: Node) => {
                const pos = this._isAlign ? Vec3.ZERO : child.position;
                return pos.x;
            };

            this._doLayoutVertically(newHeight, false, fnPositionX, true);
            this._isAlign = false;
            this.node._uiProps.uiTransformComp!.height = newHeight;
        } else if (this._N$layoutType === Type.NONE) {
            if (this._resizeMode === ResizeMode.CONTAINER) {
                this._doLayoutBasic();
            }
        } else if (this._N$layoutType === Type.GRID) {
            this._doLayoutGrid();
        }
    }

    protected _getUsedScaleValue (value) {
        return this._affectedByScale ? Math.abs(value) : 1;
    }

    protected _transformDirty (type: TransformBit) {
        if (!(type & TransformBit.POSITION)){
            return;
        }

        this._doLayoutDirty();
    }

    protected _doLayoutDirty () {
        this._layoutDirty = true;
    }

    protected _doScaleDirty (type: TransformBit) {
        if (type & TransformBit.SCALE){
            this._layoutDirty = this._layoutDirty || this._affectedByScale;
        }
    }

}

legacyCC.LayoutComponent = LayoutComponent;
