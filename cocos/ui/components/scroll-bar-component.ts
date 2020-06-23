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

import { Component, UITransformComponent } from '../../core/components';
import { ccclass, help, executionOrder, menu, property, requireComponent } from '../../core/data/class-decorator';
import { Color, Size, Vec2, Vec3 } from '../../core/math';
import { ccenum } from '../../core/value-types/enum';
import { clamp01 } from '../../core/math/utils';
import { ScrollViewComponent } from './scroll-view-component';
import { SpriteComponent } from './sprite-component';
import { Node } from '../../core';
import { legacyCC } from '../../core/global-exports';

const GETTING_SHORTER_FACTOR = 20;
const ZERO = new Vec3();
const _tempPos_1 = new Vec3();
const _tempPos_2 = new Vec3();
const defaultAnchor = new Vec2();
const _tempColor = new Color();

/**
 * @en
 * Enum for ScrollBar direction.
 *
 * @zh
 * 滚动条方向。
 */
enum Direction {
    /**
     * @en
     * Horizontal scroll.
     *
     * @zh
     * 横向滚动。
     */
    HORIZONTAL = 0,

    /**
     * @en
     * Vertical scroll.
     *
     * @zh
     * 纵向滚动。
     */
    VERTICAL = 1,
}

ccenum(Direction);

/**
 * @en
 * The ScrollBar control allows the user to scroll an image or other view that is too large to see completely.
 *
 * @zh
 * 滚动条组件。
 */
@ccclass('cc.ScrollBarComponent')
@help('i18n:cc.ScrollBarComponent')
@executionOrder(110)
@menu('UI/ScrollBar')
@requireComponent(UITransformComponent)
export class ScrollBarComponent extends Component {

    /**
     * @en
     * The "handle" part of the ScrollBar.
     *
     * @zh
     * 作为当前滚动区域位置显示的滑块 Sprite。
     */
    @property({
        type: SpriteComponent,
        tooltip: '作为当前滚动区域位置显示的滑块 Sprite',
        displayOrder: 0,
    })
    get handle () {
        return this._handle;
    }

    set handle (value: SpriteComponent | null) {
        if (this._handle === value) {
            return;
        }
        this._handle = value;
        this.onScroll(new Vec3(0, 0, 0));
    }

    /**
     * @en
     * The direction of scrolling.
     *
     * @zh
     * ScrollBar 的滚动方向。
     */
    @property({
        type: Direction,
        tooltip: 'ScrollBar 的滚动方向',
        displayOrder: 1,
    })
    get direction () {
        return this._direction;
    }

    set direction (value) {
        if (this._direction === value) {
            return;
        }

        this._direction = value;
        this.onScroll(new Vec3());
    }

    /**
     * @en
     * Whether enable auto hide or not.
     *
     * @zh
     * 是否在没有滚动动作时自动隐藏 ScrollBar。
     */
    @property({
        tooltip: '是否在没有滚动动作时自动隐藏 ScrollBar',
        displayOrder: 2,
    })
    get enableAutoHide () {
        return this._enableAutoHide;
    }

    set enableAutoHide (value) {
        if (this._enableAutoHide === value) {
            return;
        }

        this._enableAutoHide = value;
        if (this._enableAutoHide) {
            this._setOpacity(0);
        }
    }

    /**
     * @en
     * The time to hide ScrollBar when scroll finished.
     * Note: This value is only useful when enableAutoHide is true.
     *
     * @zh
     * 没有滚动动作后经过多久会自动隐藏。<br/>
     * 注意：只要当 “enableAutoHide” 为 true 时，才有效。
     */
    @property({
        tooltip: '没有滚动动作后经过多久会自动隐藏。\n注意：只要当 “enableAutoHide” 为 true 时，才有效。',
        displayOrder: 3,
    })
    get autoHideTime () {
        return this._autoHideTime;
    }

    set autoHideTime (value) {
        if (this._autoHideTime === value) {
            return;
        }

        this._autoHideTime = value;
    }

    public static Direction = Direction;
    @property
    protected _scrollView: ScrollViewComponent | null = null;
    @property
    protected _handle: SpriteComponent | null = null;
    @property
    protected _direction = Direction.HORIZONTAL;
    @property
    protected _enableAutoHide = false;
    @property
    protected _autoHideTime = 1.0;

    protected _touching = false;
    protected _opacity = 255;
    protected _autoHideRemainingTime = 0;

    /**
     * @en
     * Hide ScrollBar.
     *
     * @zh
     * 滚动条隐藏。
     */
    public hide () {
        this._autoHideRemainingTime = 0;
        this._setOpacity(0);
    }

    /**
     * @en
     * Show ScrollBar.
     *
     * @zh
     * 滚动条显示。
     */
    public show () {
        this._autoHideRemainingTime = this._autoHideTime;
        this._setOpacity(this._opacity);
    }

    /**
     * @en
     * Reset the position of ScrollBar.
     *
     * @zh
     * 重置滚动条位置。
     *
     * @param outOfBoundary - 滚动位移。
     */
    public onScroll (outOfBoundary: Vec3) {
        if (!this._scrollView) {
            return;
        }

        const content = this._scrollView.content;
        if (!content) {
            return;
        }

        const contentSize = content._uiProps.uiTransformComp!.contentSize;
        const scrollViewSize = this._scrollView.node._uiProps.uiTransformComp!.contentSize;
        const barSize = this.node._uiProps.uiTransformComp!.contentSize;

        if (this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
            return;
        }

        if (this._enableAutoHide) {
            this._autoHideRemainingTime = this._autoHideTime;
            this._setOpacity(this._opacity);
        }

        let contentMeasure = 0;
        let scrollViewMeasure = 0;
        let outOfBoundaryValue = 0;
        let contentPosition = 0;
        let handleNodeMeasure = 0;

        if (this._direction === Direction.HORIZONTAL) {
            contentMeasure = contentSize.width;
            scrollViewMeasure = scrollViewSize.width;
            handleNodeMeasure = barSize.width;
            outOfBoundaryValue = outOfBoundary.x;

            contentPosition = -this._convertToScrollViewSpace(content).x;
        } else if (this._direction === Direction.VERTICAL) {
            contentMeasure = contentSize.height;
            scrollViewMeasure = scrollViewSize.height;
            handleNodeMeasure = barSize.height;
            outOfBoundaryValue = outOfBoundary.y;

            contentPosition = -this._convertToScrollViewSpace(content).y;
        }

        const length = this._calculateLength(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundaryValue);
        const position = this._calculatePosition(contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundaryValue, length);

        this._updateLength(length);
        this._updateHandlerPosition(position);

    }

    /**
     * @zh
     * 滚动视窗设置。
     *
     * @param scrollView - 滚动视窗。
     */
    public setScrollView (scrollView: ScrollViewComponent) {
        this._scrollView = scrollView;
    }

    public onTouchBegan () {
        if (!this._enableAutoHide) {
            return;
        }
        this._touching = true;
    }

    public onTouchEnded () {
        if (!this._enableAutoHide) {
            return;
        }

        this._touching = false;

        if (this._autoHideTime <= 0) {
            return;
        }

        if (this._scrollView) {
            const content = this._scrollView.content;
            if (content) {
                const contentSize = content._uiProps.uiTransformComp!.contentSize;
                const scrollViewSize = this._scrollView.node._uiProps.uiTransformComp!.contentSize;

                if (this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
                    return;
                }
            }
        }

        this._autoHideRemainingTime = this._autoHideTime;
    }

    protected onEnable () {
        const renderComp = this.node.getComponent(SpriteComponent);
        if (renderComp) {
            this._opacity = renderComp.color.a;
        }
    }

    protected start () {
        if (this._enableAutoHide) {
            this._setOpacity(0);
        }
    }

    protected update (dt) {
        this._processAutoHide(dt);
    }

    protected _convertToScrollViewSpace (content: Node) {
        if (!this._scrollView) {
            return ZERO;
        }

        const scrollTrans = this._scrollView.node._uiProps.uiTransformComp;
        const contentTrans = content._uiProps.uiTransformComp;
        if (!scrollTrans || !contentTrans) {
            return ZERO;
        }

        _tempPos_1.set(-contentTrans.anchorX * contentTrans.width, -contentTrans.anchorY * contentTrans.height, 0);
        contentTrans.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
        const scrollViewSpacePos = scrollTrans.convertToNodeSpaceAR(_tempPos_2);
        scrollViewSpacePos.x += scrollTrans.anchorX * scrollTrans.width;
        scrollViewSpacePos.y += scrollTrans.anchorY * scrollTrans.height;
        return scrollViewSpacePos;
    }

    protected _setOpacity (opacity: number) {
        if (this._handle) {
            let renderComp = this.node.getComponent(SpriteComponent);
            if (renderComp) {
                _tempColor.set(renderComp.color);
                _tempColor.a = opacity;
                renderComp.color = _tempColor;
            }

            renderComp = this._handle.getComponent(SpriteComponent);
            if (renderComp) {
                _tempColor.set(renderComp.color);
                _tempColor.a = opacity;
                renderComp.color = _tempColor;
            }
        }
    }

    protected _updateHandlerPosition (position: Vec3) {
        if (this._handle) {
            const oldPosition = this._fixupHandlerPosition();

            this._handle.node.setPosition(position.x + oldPosition.x, position.y + oldPosition.y, oldPosition.z);
        }
    }

    protected _fixupHandlerPosition () {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const barSize = uiTrans.contentSize;
        const barAnchor = uiTrans.anchorPoint;
        const handleSize = this.handle!.node._uiProps.uiTransformComp!.contentSize;

        const handleParent = this.handle!.node.parent!;

        Vec3.set(_tempPos_1, -barSize.width * barAnchor.x, -barSize.height * barAnchor.y, 0);
        const leftBottomWorldPosition = this.node!._uiProps.uiTransformComp!.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
        let fixupPosition = new Vec3();
        handleParent._uiProps.uiTransformComp!.convertToNodeSpaceAR(leftBottomWorldPosition, fixupPosition);

        if (this.direction === Direction.HORIZONTAL) {
            fixupPosition = new Vec3(fixupPosition.x, fixupPosition.y + (barSize.height - handleSize.height) / 2, 0);
        } else if (this.direction === Direction.VERTICAL) {
            fixupPosition = new Vec3(fixupPosition.x + (barSize.width - handleSize.width) / 2, fixupPosition.y, 0);
        }

        this.handle!.node.setPosition(fixupPosition);

        return fixupPosition;
    }

    protected _conditionalDisableScrollBar (contentSize: Size, scrollViewSize: Size) {
        if (contentSize.width <= scrollViewSize.width && this._direction === Direction.HORIZONTAL) {
            return true;
        }

        if (contentSize.height <= scrollViewSize.height && this._direction === Direction.VERTICAL) {
            return true;
        }
        return false;
    }

    protected _calculateLength (contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, outOfBoundary: number) {
        let denominatorValue = contentMeasure;
        if (outOfBoundary) {
            denominatorValue += (outOfBoundary > 0 ? outOfBoundary : -outOfBoundary) * GETTING_SHORTER_FACTOR;
        }

        const lengthRation = scrollViewMeasure / denominatorValue;
        return handleNodeMeasure * lengthRation;
    }

    protected _calculatePosition (
        contentMeasure: number,
        scrollViewMeasure: number,
        handleNodeMeasure: number,
        contentPosition: number,
        outOfBoundary: number,
        actualLenth: number,
    ) {
        let denominatorValue = contentMeasure - scrollViewMeasure;
        if (outOfBoundary) {
            denominatorValue += Math.abs(outOfBoundary);
        }

        let positionRatio = 0;
        if (denominatorValue) {
            positionRatio = contentPosition / denominatorValue;
            positionRatio = clamp01(positionRatio);
        }

        const position = (handleNodeMeasure - actualLenth) * positionRatio;
        if (this._direction === Direction.VERTICAL) {
            return new Vec3(0, position, 0);
        } else {
            return new Vec3(position, 0, 0);
        }
    }

    protected _updateLength (length: number) {
        if (this._handle) {
            const handleNode = this._handle.node;
            const handleTrans = handleNode._uiProps.uiTransformComp!;
            const handleNodeSize = handleTrans.contentSize;
            const anchor = handleTrans.anchorPoint;
            if (anchor.x !== defaultAnchor.x || anchor.y !== defaultAnchor.y){
                handleTrans.setAnchorPoint(defaultAnchor);
            }

            if (this._direction === Direction.HORIZONTAL) {
                handleTrans.setContentSize(length, handleNodeSize.height);
            } else {
                handleTrans.setContentSize(handleNodeSize.width, length);
            }
        }
    }

    protected _processAutoHide (deltaTime: number) {
        if (!this._enableAutoHide || this._autoHideRemainingTime <= 0) {
            return;
        } else if (this._touching) {
            return;
        }

        this._autoHideRemainingTime -= deltaTime;
        if (this._autoHideRemainingTime <= this._autoHideTime) {
            this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
            const opacity = this._opacity * (this._autoHideRemainingTime / this._autoHideTime);
            this._setOpacity(opacity);
        }
    }
}

legacyCC.ScrollBarComponent = ScrollBarComponent;
