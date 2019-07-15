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

import { Component } from '../../../components';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { clamp01, Color, Size, Vec2, Vec3 } from '../../../core/value-types';
import { CCEnum } from '../../../core/value-types/enum';
import { vec3 } from '../../../core/vmath';
import { Node } from '../../../scene-graph/node';
import { ScrollViewComponent } from './scroll-view-component';
import { SpriteComponent } from './sprite-component';

const GETTINGSHORTERFACTOR = 20;
const ZERO = new Vec3();
const _tempPos_1 = new Vec3();
const _tempPos_2 = new Vec3();
const defaultAnchor = new Vec2();
const _tempColor = new Color();

/**
 * @zh
 * 滚动条方向。
 */
enum Direction {
    /**
     * @zh
     * 横向滚动。
     */
    HORIZONTAL = 0,

    /**
     * @zh
     * 纵向滚动。
     */
    VERTICAL = 1,
}

CCEnum(Direction);

/**
 * @zh
 * 滚动条组件。
 * 可通过 cc.ScrollBarComponent 获得该组件。
 */
@ccclass('cc.ScrollBarComponent')
@executionOrder(110)
@menu('UI/ScrollBar')
export class ScrollBarComponent extends Component {

    /**
     * @zh
     * 作为当前滚动区域位置显示的滑块 Sprite。
     */
    @property({
        type: SpriteComponent,
    })
    get handle () {
        return this._handle;
    }

    set handle (value: SpriteComponent | null) {
        if (this._handle === value) {
            return;
        }
        this._handle = value;
        this.onScroll(cc.v2(0, 0));
    }

    /**
     * @zh
     * ScrollBar 的滚动方向。
     */
    @property({
        type: Direction,
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
     * @zh
     * 是否在没有滚动动作时自动隐藏 ScrollBar。
     */
    @property
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
     * @zh
     * 没有滚动动作后经过多久会自动隐藏。<br/>
     * 注意：只要当 “enableAutoHide” 为 true 时，才有效。
     */
    @property
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
    private _scrollView: ScrollViewComponent | null = null;
    @property
    private _handle: SpriteComponent | null = null;
    @property
    private _direction = Direction.HORIZONTAL;
    @property
    private _enableAutoHide = false;
    @property
    private _autoHideTime = 1.0;

    private _touching = false;
    private _opacity = 255;
    private _autoHideRemainingTime = 0;

    /**
     * @zh
     * 滚动条隐藏。
     */
    public hide () {
        this._autoHideRemainingTime = 0;
        this._setOpacity(0);
    }

    /**
     * @zh
     * 滚动条显示。
     */
    public show () {
        this._autoHideRemainingTime = this._autoHideTime;
        this._setOpacity(this._opacity);
    }

    /**
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

        const contentSize = content.getContentSize();
        const scrollViewSize = this._scrollView.node.getContentSize();
        const barSize = this.node.getContentSize();

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
        this._updateHanlderPosition(position);

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
                const contentSize = content.getContentSize();
                const scrollViewSize = this._scrollView.node.getContentSize();

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

    private _convertToScrollViewSpace (content: Node) {
        if (!this._scrollView) {
            return ZERO;
        }

        let ap = content.getAnchorPoint();
        let contentSize = content.getContentSize();
        const scrollViewSpacePos = new Vec3(- ap.x * contentSize.width, - ap.y * contentSize.height, 0);
        content.uiTransfromComp!.convertToWorldSpaceAR(scrollViewSpacePos, scrollViewSpacePos);
        ap = this._scrollView.node.getAnchorPoint();
        contentSize = this._scrollView.node.getContentSize();
        scrollViewSpacePos.x += ap.x * contentSize.width;
        scrollViewSpacePos.y += ap.y * contentSize.height;
        this._scrollView.node.uiTransfromComp!.convertToNodeSpaceAR(scrollViewSpacePos, scrollViewSpacePos);
        return scrollViewSpacePos;
    }

    private _setOpacity (opacity: number) {
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

    private _updateHanlderPosition (position: Vec3) {
        if (this._handle) {
            const oldPosition = this._fixupHandlerPosition();

            this._handle.node.setPosition(position.x + oldPosition.x, position.y + oldPosition.y, oldPosition.z);
        }
    }

    private _fixupHandlerPosition () {
        const barSize = this.node.getContentSize();
        const barAnchor = this.node.getAnchorPoint();
        const handleSize = this.handle!.node.getContentSize();

        const handleParent = this.handle!.node.parent!;

        vec3.set(_tempPos_1, -barSize.width * barAnchor.x, -barSize.height * barAnchor.y, 0);
        const leftBottomWorldPosition = this.node!.uiTransfromComp!.convertToWorldSpaceAR(_tempPos_1, _tempPos_2);
        let fixupPosition = new Vec3();
        handleParent.uiTransfromComp!.convertToNodeSpaceAR(leftBottomWorldPosition, fixupPosition);

        if (this.direction === Direction.HORIZONTAL) {
            fixupPosition = new Vec3(fixupPosition.x, fixupPosition.y + (barSize.height - handleSize.height) / 2, 0);
        } else if (this.direction === Direction.VERTICAL) {
            fixupPosition = new Vec3(fixupPosition.x + (barSize.width - handleSize.width) / 2, fixupPosition.y, 0);
        }

        this.handle!.node.setPosition(fixupPosition);

        return fixupPosition;
    }

    private _conditionalDisableScrollBar (contentSize: Size, scrollViewSize: Size) {
        if (contentSize.width <= scrollViewSize.width && this._direction === Direction.HORIZONTAL) {
            return true;
        }

        if (contentSize.height <= scrollViewSize.height && this._direction === Direction.VERTICAL) {
            return true;
        }
        return false;
    }

    private _calculateLength (contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, outOfBoundary: number) {
        let denominatorValue = contentMeasure;
        if (outOfBoundary) {
            denominatorValue += (outOfBoundary > 0 ? outOfBoundary : -outOfBoundary) * GETTINGSHORTERFACTOR;
        }

        const lengthRation = scrollViewMeasure / denominatorValue;
        return handleNodeMeasure * lengthRation;
    }

    private _calculatePosition (
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

    private _updateLength (length: number) {
        if (this._handle) {
            const handleNode = this._handle.node;
            const handleNodeSize = handleNode.getContentSize();
            const anchor = handleNode.getAnchorPoint();
            if (anchor.x !== defaultAnchor.x || anchor.y !== defaultAnchor.y){
                handleNode.setAnchorPoint(defaultAnchor);
            }

            if (this._direction === Direction.HORIZONTAL) {
                handleNode.setContentSize(length, handleNodeSize.height);
            } else {
                handleNode.setContentSize(handleNodeSize.width, length);
            }
        }
    }

    private _processAutoHide (deltaTime: number) {
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

cc.ScrollBarComponent = ScrollBarComponent;
