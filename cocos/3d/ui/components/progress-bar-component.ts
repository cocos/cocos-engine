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

import { Component} from '../../../components';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { clamp01, Enum, Size, Vec2, Vec3 } from '../../../core/value-types';
import { SpriteComponent } from './sprite-component';

/**
 * @zh
 * 进度条模式。
 */
enum Mode {
    /**
     * @zh
     * 水平方向模式。
     */
    HORIZONTAL = 0,

    /**
     * @zh
     *  垂直方向模式。
     */
    VERTICAL = 1,
    /**
     * @zh
     * 填充模式。
     */
    FILLED = 2,
}

Enum(Mode);

/**
 * @zh
 * 进度条组件，可用于显示加载资源时的进度。
 * 可通过 cc.ProgressBarComponent 获得该组件。
 *
 * @example
 * ```typescript
 * // update progressBar
 * update(dt) {
 *     var progress = progressBar.progress;
 *     if (progress > 0) {
 *         progress += dt;
 *     }
 *     else {
 *         progress = 1;
 *     }
 *     progressBar.progress = progress;
 * }
 * ```
 */
@ccclass('cc.ProgressBarComponent')
@executionOrder(110)
@menu('UI/ProgressBar')
// @executeInEditMode
export class ProgressBarComponent extends Component {

    /**
     * @zh
     * 用来显示进度条比例的 Sprite 对象。
     */
    @property({
        type: SpriteComponent,
    })
    get barSprite () {
        return this._barSprite;
    }

    set barSprite (value: SpriteComponent | null) {
        if (this._barSprite === value) {
            return;
        }

        this._barSprite = value;
        this._initBarSprite();
    }

    /**
     * @zh
     * 进度条的模式。
     */
    @property({
        type: Mode,
    })
    get mode () {
        return this._mode;
    }

    set mode (value: Mode) {
        if (this._mode === value) {
            return;
        }

        this._mode = value;
        if (this._barSprite) {
            const entity = this._barSprite.node;
            if (!entity) { return; }

            const entitySize = entity.getContentSize() as Size;
            if (this._mode === Mode.HORIZONTAL) {
                this.totalLength = entitySize.width;
            } else if (this._mode === Mode.VERTICAL) {
                this.totalLength = entitySize.height;
            } else if (this._mode === Mode.FILLED) {
                this.totalLength = this._barSprite.fillRange;
            }
        }
    }

    /**
     * @zh
     * 进度条实际的总长度。
     */
    @property
    get totalLength () {
        return this._totalLength;
    }

    set totalLength (value) {
        if (this._mode === Mode.FILLED) {
            value = clamp01(value);
        }
        this._totalLength = value;
        this._updateBarStatus();
    }

    /**
     * @zh
     * 当前进度值，该数值的区间是 0-1 之间。
     */
    @property({
        range: [0, 1, 0.1],
        slide: true,
    })
    get progress () {
        return this._progress;
    }

    set progress (value) {
        if (this._progress === value) {
            return;
        }

        this._progress = value;
        this._updateBarStatus();
    }

    /**
     * @zh
     * 进度条是否进行反方向变化。
     */
    @property
    get reverse () {
        return this._reverse;
    }

    set reverse (value) {
        if (this._reverse === value) {
            return;
        }

        this._reverse = value;
        if (this._barSprite) {
            this._barSprite.fillStart = 1 - this._barSprite.fillStart;
        }
        this._updateBarStatus();
    }

    public static Mode = Mode;
    @property
    private _barSprite: SpriteComponent | null = null;
    @property
    private _mode = Mode.HORIZONTAL;
    @property
    private _totalLength = 1;
    @property
    private _progress = 0.1;
    @property
    private _reverse = false;

    private _initBarSprite () {
        if (this._barSprite) {
            const entity = this._barSprite.node;
            if (!entity) { return; }

            const nodeSize = this.node.getContentSize() as Size;
            const nodeAnchor = this.node.getAnchorPoint() as Vec2;

            const barSpriteSize = entity.getContentSize() as Size;

            // if (entity.parent === this.node) {
            //     this.node.setContentSize(barSpriteSize);
            // }

            if (this._barSprite.fillType === SpriteComponent.FillType.RADIAL) {
                this._mode = Mode.FILLED;
            }

            if (this._mode === Mode.HORIZONTAL) {
                this.totalLength = barSpriteSize.width;
            } else if (this._mode === Mode.VERTICAL) {
                this.totalLength = barSpriteSize.height;
            } else {
                this.totalLength = this._barSprite.fillRange;
            }

            if (entity.parent === this.node) {
                const x = - nodeSize.width * nodeAnchor.x;
                entity.setPosition(x, 0, 0);
            }
        }
    }

    private _updateBarStatus () {
        if (this._barSprite) {
            const entity = this._barSprite.node;

            if (!entity) { return; }

            const entityAnchorPoint = entity.getAnchorPoint() as Vec2;
            const entitySize = entity.getContentSize() as Size;
            const entityPosition = entity.getPosition();

            let anchorPoint = new Vec2(0, 0.5);
            const progress = clamp01(this._progress);
            let actualLenth = this._totalLength * progress;
            let finalContentSize = entitySize;
            let totalWidth = 0;
            let totalHeight = 0;
            switch (this._mode) {
                case Mode.HORIZONTAL:
                    if (this._reverse) {
                        anchorPoint = new Vec2(1, 0.5);
                    }

                    finalContentSize = new Size(actualLenth, entitySize.height);
                    totalWidth = this._totalLength;
                    totalHeight = entitySize.height;
                    break;
                case Mode.VERTICAL:
                    if (this._reverse) {
                        anchorPoint = new Vec2(0.5, 1);
                    } else {
                        anchorPoint = new Vec2(0.5, 0);
                    }

                    finalContentSize = new Size(entitySize.width, actualLenth);
                    totalWidth = entitySize.width;
                    totalHeight = this._totalLength;
                    break;
            }

            // handling filled mode
            if (this._mode === Mode.FILLED) {
                if (this._barSprite.type !== cc.SpriteComponent.Type.FILLED) {
                    cc.warn('ProgressBar FILLED mode only works when barSprite\'s Type is FILLED!');
                } else {
                    if (this._reverse) {
                        actualLenth = actualLenth * -1;
                    }
                    this._barSprite.fillRange = actualLenth;
                }
            } else {
                if (this._barSprite.type !== cc.SpriteComponent.Type.FILLED) {

                    const anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
                    const anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
                    const finalPosition = new Vec3(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY, 0);

                    entity.setPosition(entityPosition.x + finalPosition.x, entityPosition.y + finalPosition.y, entityPosition.z);

                    entity.setAnchorPoint(anchorPoint);
                    entity.setContentSize(finalContentSize);
                } else {
                    cc.warn('ProgressBar non-FILLED mode only works when barSprite\'s Type is non-FILLED!');
                }
            }
        }
    }
}

cc.ProgressBarComponent = ProgressBarComponent;
