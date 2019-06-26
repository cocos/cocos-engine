/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const misc = require('../utils/misc');
const Component = require('./CCComponent');

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
 * update: function (dt) {
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
var ProgressBar = cc.Class({
    name: 'cc.ProgressBar',
    extends: Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ProgressBar',
        help: 'i18n:COMPONENT.help_url.progressbar',
    },

    _initBarSprite: function() {
        if (this.barSprite) {
            var entity = this.barSprite.node;
            if (!entity) return;

            var nodeSize = this.node.getContentSize();
            var nodeAnchor = this.node.getAnchorPoint();

            var entitySize = entity.getContentSize();

            if(entity.parent === this.node){
                this.node.setContentSize(entitySize);
            }

            if (this.barSprite.fillType === cc.Sprite.FillType.RADIAL) {
                this.mode = Mode.FILLED;
            }

            var barSpriteSize = entity.getContentSize();
            if (this.mode === Mode.HORIZONTAL) {
                this.totalLength = barSpriteSize.width;
            }
            else if(this.mode === Mode.VERTICAL) {
                this.totalLength = barSpriteSize.height;
            }
            else {
                this.totalLength = this.barSprite.fillRange;
            }

            if(entity.parent === this.node){
                var x = - nodeSize.width * nodeAnchor.x;
                var y = 0;
                entity.setPosition(cc.v2(x, y));
            }
        }
    },

    _updateBarStatus: function() {
        if (this.barSprite) {
            var entity = this.barSprite.node;

            if (!entity) return;

            var entityAnchorPoint = entity.getAnchorPoint();
            var entitySize = entity.getContentSize();
            var entityPosition = entity.getPosition();

            var anchorPoint = cc.v2(0, 0.5);
            var progress = misc.clamp01(this.progress);
            var actualLenth = this.totalLength * progress;
            var finalContentSize;
            var totalWidth;
            var totalHeight;
            switch (this.mode) {
                case Mode.HORIZONTAL:
                    if (this.reverse) {
                        anchorPoint = cc.v2(1, 0.5);
                    }
                    finalContentSize = cc.size(actualLenth, entitySize.height);
                    totalWidth = this.totalLength;
                    totalHeight = entitySize.height;
                    break;
                case Mode.VERTICAL:
                    if (this.reverse) {
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
            if (this.mode === Mode.FILLED) {
                if (this.barSprite.type !== cc.Sprite.Type.FILLED) {
                    cc.warn('ProgressBar FILLED mode only works when barSprite\'s Type is FILLED!');
                } else {
                    if (this.reverse) {
                        actualLenth = actualLenth * -1;
                    }
                    this.barSprite.fillRange = actualLenth;
                }
            } else {
                if (this.barSprite.type !== cc.Sprite.Type.FILLED) {

                    var anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
                    var anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
                    var finalPosition = cc.v2(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY);

                    entity.setPosition(entityPosition.x + finalPosition.x, entityPosition.y + finalPosition.y);

                    entity.setAnchorPoint(anchorPoint);
                    entity.setContentSize(finalContentSize);
                } else {
                    cc.warn('ProgressBar non-FILLED mode only works when barSprite\'s Type is non-FILLED!');
                }
            }



        }
    },

    properties: {
        /**
         * !#en The targeted Sprite which will be changed progressively.
         * !#zh 用来显示进度条比例的 Sprite 对象。
         * @property {Sprite} barSprite
         */
        barSprite: {
            default: null,
            type: cc.Sprite,
            tooltip: CC_DEV && 'i18n:COMPONENT.progress.bar_sprite',
            notify: function() {
                this._initBarSprite();
            },
            animatable: false
        },

        /**
         * !#en The progress mode, there are two modes supported now: horizontal and vertical.
         * !#zh 进度条的模式
         * @property {ProgressBar.Mode} mode
         */
        mode: {
            default: Mode.HORIZONTAL,
            type: Mode,
            tooltip: CC_DEV && 'i18n:COMPONENT.progress.mode',
            notify: function() {
                if (this.barSprite) {
                    var entity = this.barSprite.node;
                    if (!entity) return;

                    var entitySize = entity.getContentSize();
                    if (this.mode === Mode.HORIZONTAL) {
                        this.totalLength = entitySize.width;
                    } else if (this.mode === Mode.VERTICAL) {
                        this.totalLength = entitySize.height;
                    } else if (this.mode === Mode.FILLED) {
                        this.totalLength = this.barSprite.fillRange;
                    }
                }
            },
            animatable: false
        },

        _N$totalLength: 1,
        /**
         * !#en The total width or height of the bar sprite.
         * !#zh 进度条实际的总长度
         * @property {Number} totalLength
         */
        totalLength: {
            range: [0, Number.MAX_VALUE],
            tooltip: CC_DEV && 'i18n:COMPONENT.progress.total_length',
            get: function () {
                return this._N$totalLength;
            },
            set: function(value) {
                if (this.mode === Mode.FILLED) {
                    value = misc.clamp01(value);
                }
                this._N$totalLength = value;
                this._updateBarStatus();
            }
        },

        /**
         * !#en The current progress of the bar sprite. The valid value is between 0-1.
         * !#zh 当前进度值，该数值的区间是 0-1 之间。
         * @property {Number} progress
         */
        progress: {
            default: 1,
            type: cc.Float,
            range: [0, 1, 0.1],
            slide: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.progress.progress',
            notify: function() {
                this._updateBarStatus();
            }
        },

        /**
         * !#en Whether reverse the progress direction of the bar sprite.
         * !#zh 进度条是否进行反方向变化。
         * @property {Boolean} reverse
         */
        reverse: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.progress.reverse',
            notify: function() {
                if (this.barSprite) {
                    this.barSprite.fillStart = 1 - this.barSprite.fillStart;
                }
                this._updateBarStatus();
            },
            animatable: false
        }
    },

    statics: {
        Mode: Mode
    }
});


cc.ProgressBar = module.exports = ProgressBar;
