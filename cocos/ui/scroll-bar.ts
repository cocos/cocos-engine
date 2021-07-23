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

import { ccclass, help, executionOrder, menu, requireComponent, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { Component } from '../core/components/component';
import { UITransform } from '../2d/framework';
import { Color, Size, Vec2, Vec3 } from '../core/math';
import { ccenum } from '../core/value-types/enum';
import { clamp01 } from '../core/math/utils';
import { ScrollView } from './scroll-view';
import { Sprite } from '../2d/components/sprite';
import { Node } from '../core';
import { legacyCC } from '../core/global-exports';

const GETTING_SHORTER_FACTOR = 20;
const _tempPos_1 = new Vec3();
const _tempPos_2 = new Vec3();
const _tempVec3 = new Vec3();
const defaultAnchor = new Vec2();
const _tempColor = new Color();
const _tempVec2 = new Vec2();

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
@ccclass('cc.ScrollBar')
@help('i18n:cc.ScrollBar')
@executionOrder(110)
@menu('UI/ScrollBar')
@requireComponent(UITransform)
export class ScrollBar extends Component {
    /**
     * @en
     * The "handle" part of the ScrollBar.
     *
     * @zh
     * 作为当前滚动区域位置显示的滑块 Sprite。
     */
    @type(Sprite)
    @displayOrder(0)
    @tooltip('i18n:scrollbar.handle')
    get handle () {
        return this._handle;
    }

    set handle (value: Sprite | null) {
        if (this._handle === value) {
            return;
        }
        this._handle = value;
        this.onScroll(Vec2.ZERO);
    }

    /**
     * @en
     * The direction of scrolling.
     *
     * @zh
     * ScrollBar 的滚动方向。
     */
    @type(Direction)
    @displayOrder(1)
    @tooltip('i18n:scrollbar.direction')
    get direction () {
        return this._direction;
    }

    set direction (value) {
        if (this._direction === value) {
            return;
        }

        this._direction = value;
        this.onScroll(Vec2.ZERO);
    }

    /**
     * @en
     * Whether enable auto hide or not.
     *
     * @zh
     * 是否在没有滚动动作时自动隐藏 ScrollBar。
     */
    @displayOrder(2)
    @tooltip('i18n:scrollbar.auto_hide')
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
    @displayOrder(3)
    @tooltip('i18n:scrollbar.auto_hide_time')
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
    @serializable
    protected _scrollView: ScrollView | null = null;
    @serializable
    protected _handle: Sprite | null = null;
    @serializable
    protected _direction = Direction.HORIZONTAL;
    @serializable
    protected _enableAutoHide = false;
    @serializable
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
    public onScroll (outOfBoundary: Readonly<Vec2>) {
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
        const outOfContentPosition = _tempVec2;
        outOfContentPosition.set(0, 0);

        if (this._direction === Direction.HORIZONTAL) {
            contentMeasure = contentSize.width;
            scrollViewMeasure = scrollViewSize.width;
            handleNodeMeasure = barSize.width;
            outOfBoundaryValue = outOfBoundary.x;

            this._convertToScrollViewSpace(outOfContentPosition, content);
            contentPosition = -outOfContentPosition.x;
        } else if (this._direction === Direction.VERTICAL) {
            contentMeasure = contentSize.height;
            scrollViewMeasure = scrollViewSize.height;
            handleNodeMeasure = barSize.height;
            outOfBoundaryValue = outOfBoundary.y;

            this._convertToScrollViewSpace(outOfContentPosition, content);
            contentPosition = -outOfContentPosition.y;
        }

        const length = this._calculateLength(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundaryValue);
        const position = _tempVec2;
        this._calculatePosition(position, contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundaryValue, length);

        this._updateLength(length);
        this._updateHandlerPosition(position);
    }

    /**
     * @zh
     * 滚动视窗设置。
     *
     * @param scrollView - 滚动视窗。
     */
    public setScrollView (scrollView: ScrollView) {
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
        const renderComp = this.node.getComponent(Sprite);
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

    protected _convertToScrollViewSpace (out: Vec2, content: Node) {
        const scrollTrans = this._scrollView && this._scrollView.node._uiProps.uiTransformComp;
        const contentTrans = content._uiProps.uiTransformComp;
        if (!scrollTrans || !contentTrans) {
            out.set(Vec2.ZERO);
        } else {
            _tempPos_1.set(-contentTrans.anchorX * contentTrans.width, -contentTrans.anchorY * contentTrans.height, 0);
            contentTrans.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
            const scrollViewSpacePos = scrollTrans.convertToNodeSpaceAR(_tempPos_2);
            scrollViewSpacePos.x += scrollTrans.anchorX * scrollTrans.width;
            scrollViewSpacePos.y += scrollTrans.anchorY * scrollTrans.height;

            out.set(scrollViewSpacePos.x, scrollViewSpacePos.y);
        }
    }

    protected _setOpacity (opacity: number) {
        if (this._handle) {
            let renderComp = this.node.getComponent(Sprite);
            if (renderComp) {
                _tempColor.set(renderComp.color);
                _tempColor.a = opacity;
                renderComp.color = _tempColor;
            }

            renderComp = this._handle.getComponent(Sprite);
            if (renderComp) {
                _tempColor.set(renderComp.color);
                _tempColor.a = opacity;
                renderComp.color = _tempColor;
            }
        }
    }

    protected _updateHandlerPosition (position: Vec2) {
        if (this._handle) {
            const oldPosition = _tempVec3;
            this._fixupHandlerPosition(oldPosition);

            this._handle.node.setPosition(position.x + oldPosition.x, position.y + oldPosition.y, oldPosition.z);
        }
    }

    protected _fixupHandlerPosition (out: Vec3) {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const barSize = uiTrans.contentSize;
        const barAnchor = uiTrans.anchorPoint;
        const handleSize = this.handle!.node._uiProps.uiTransformComp!.contentSize;

        const handleParent = this.handle!.node.parent!;

        Vec3.set(_tempPos_1, -barSize.width * barAnchor.x, -barSize.height * barAnchor.y, 0);
        const leftBottomWorldPosition = this.node._uiProps.uiTransformComp!.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
        const fixupPosition = out;
        fixupPosition.set(0, 0, 0);
        handleParent._uiProps.uiTransformComp!.convertToNodeSpaceAR(leftBottomWorldPosition, fixupPosition);

        if (this.direction === Direction.HORIZONTAL) {
            fixupPosition.set(fixupPosition.x, fixupPosition.y + (barSize.height - handleSize.height) / 2, fixupPosition.z);
        } else if (this.direction === Direction.VERTICAL) {
            fixupPosition.set(fixupPosition.x + (barSize.width - handleSize.width) / 2, fixupPosition.y, fixupPosition.z);
        }

        this.handle!.node.setPosition(fixupPosition);
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
        out: Vec2,
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
            out.set(0, position);
        } else {
            out.set(position, 0);
        }
    }

    protected _updateLength (length: number) {
        if (this._handle) {
            const handleNode = this._handle.node;
            const handleTrans = handleNode._uiProps.uiTransformComp!;
            const handleNodeSize = handleTrans.contentSize;
            const anchor = handleTrans.anchorPoint;
            if (anchor.x !== defaultAnchor.x || anchor.y !== defaultAnchor.y) {
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
