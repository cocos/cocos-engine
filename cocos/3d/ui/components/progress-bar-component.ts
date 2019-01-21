/****************************************************************************
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
 ****************************************************************************/

import { Component} from '../../../components/component';
import { clamp01 } from '../../../core/utils/misc';
import { ccclass, menu, executionOrder, executeInEditMode, property } from '../../../core/data/class-decorator';
import { SpriteComponent } from './sprite-component';


/**
 * !#en Enum for ProgressBar mode
 * !#zh 进度条模式
 * @enum ProgressBar.Mode
 */
var Mode = cc.Enum({
    /**
     * !#en TODO
     * !#zh 水平方向模式
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,

    /**
     * !#en TODO
     * !#zh 垂直方向模式
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
    /**
     * !#en TODO
     * !#zh 填充模式
     * @property {Number} FILLED
     */
    FILLED: 2,
});

/**
 * !#en
 * Visual indicator of progress in some operation.
 * Displays a bar to the user representing how far the operation has progressed.
 * !#zh
 * 进度条组件，可用于显示加载资源时的进度。
 * @class ProgressBar
 * @extends Component
 * @example
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
 *
 */
@ccclass('cc.ProgressBarComponent')
@executionOrder(100)
@menu('UI/ProgressBar')
// @executeInEditMode
export class ProgressBarComponent extends Component {
    @property
    _barSprite: SpriteComponent | null = null;
    @property
    _mode: number = Mode.HORIZONTAL;
    _N$totalLength: number = 1;
    @property
    _progress: number = 0.1;
    @property
    _reverse: boolean = false;

    /**
     * !#en The targeted Sprite which will be changed progressively.
     * !#zh 用来显示进度条比例的 Sprite 对象。
     * @property {Sprite} barSprite
     */
    @property({
        type: SpriteComponent
    })
    get barSprite() {
        return this._barSprite;
    }

    set barSprite(value: SpriteComponent) {
        if (this._barSprite === value) {
            return
        }

        this._barSprite = value;
        this._initBarSprite();
    }

    /**
     * !#en The progress mode, there are two modes supported now: horizontal and vertical.
     * !#zh 进度条的模式
     * @property {ProgressBar.Mode} mode
     */
    @property({
        type: Mode
    })
    get mode() {
        return this._mode;
    }

    set mode(value: number) {
        if (this._mode === value) {
            return;
        }

        this._mode = value;
        if (this._barSprite) {
            var entity = this._barSprite.node;
            if (!entity) return;

            var entitySize = entity.getContentSize();
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
     * !#en The total width or height of the bar sprite.
     * !#zh 进度条实际的总长度
     * @property {Number} totalLength - range[[0, Number.MAX_VALUE]]
     */
    @property
    get totalLength() {
        return this._N$totalLength;
    }

    set totalLength(value: number) {
        if (this._mode === Mode.FILLED) {
            value = clamp01(value);
        }
        this._N$totalLength = value;
        this._updateBarStatus();
    }

    /**
     * !#en The current progress of the bar sprite. The valid value is between 0-1.
     * !#zh 当前进度值，该数值的区间是 0-1 之间。
     * @property {Number} progress
     */
    @property
    get progress() {
        return this._progress;
    }

    set progress(value: number) {
        if (this._progress === value) {
            return
        }

        this._progress = value;
        this._updateBarStatus();
    }

    /**
     * !#en Whether reverse the progress direction of the bar sprite.
     * !#zh 进度条是否进行反方向变化。
     * @property {Boolean} reverse
     */
    @property
    get reverse() {
        return this._reverse;
    }

    set reverse(value: boolean) {
        if (this._reverse === value) {
            return;
        }

        this._reverse = value;
        if (this._barSprite) {
            this._barSprite.fillStart = 1 - this._barSprite.fillStart;
        }
        this._updateBarStatus();
    }

    static Mode = Mode;

    _initBarSprite() {
        if (this._barSprite) {
            var entity = this._barSprite.node;
            if (!entity) return;

            var nodeSize = this.node.getContentSize();
            var nodeAnchor = this.node.getAnchorPoint();

            var entitySize = entity.getContentSize();

            if (entity.parent === this.node) {
                this.node.setContentSize(entitySize);
            }

            if (this._barSprite.fillType === cc.SpriteComponent.FillType.RADIAL) {
                this._mode = Mode.FILLED;
            }

            var barSpriteSize = entity.getContentSize();
            if (this._mode === Mode.HORIZONTAL) {
                this.totalLength = barSpriteSize.width;
            }
            else if (this._mode === Mode.VERTICAL) {
                this.totalLength = barSpriteSize.height;
            }
            else {
                this.totalLength = this._barSprite.fillRange;
            }

            if (entity.parent === this.node) {
                var x = - nodeSize.width * nodeAnchor.x;
                var y = 0;
                entity.setPosition(cc.v2(x, y));
            }
        }
    }

    _updateBarStatus() {
        if (this._barSprite) {
            var entity = this._barSprite.node;

            if (!entity) return;

            var entityAnchorPoint = entity.getAnchorPoint();
            var entitySize = entity.getContentSize();
            var entityPosition = entity.getPosition();

            var anchorPoint = cc.v2(0, 0.5);
            var progress = clamp01(this._progress);
            var actualLenth = this.totalLength * progress;
            var finalContentSize;
            var totalWidth;
            var totalHeight;
            switch (this._mode) {
                case Mode.HORIZONTAL:
                    if (this._reverse) {
                        anchorPoint = cc.v2(1, 0.5);
                    }
                    finalContentSize = cc.size(actualLenth, entitySize.height);
                    totalWidth = this.totalLength;
                    totalHeight = entitySize.height;
                    break;
                case Mode.VERTICAL:
                    if (this._reverse) {
                        anchorPoint = cc.v2(0.5, 1);
                    } else {
                        anchorPoint = cc.v2(0.5, 0);
                    }
                    finalContentSize = cc.size(entitySize.width, actualLenth);
                    totalWidth = entitySize.width;
                    totalHeight = this.totalLength;
                    break;
            }

            //handling filled mode
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

                    var anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
                    var anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
                    var finalPosition = cc.v2(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY);

                    entity.setPosition(entityPosition.x + finalPosition.x, entityPosition.y + finalPosition.y, entity.getPosition().z);

                    entity.setAnchorPoint(anchorPoint);
                    entity.setContentSize(finalContentSize);
                } else {
                    cc.warn('ProgressBar non-FILLED mode only works when barSprite\'s Type is non-FILLED!');
                }
            }
        }
    }
}

