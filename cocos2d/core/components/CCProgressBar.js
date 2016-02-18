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
 * Enum for ProgressBar mode
 * @enum ProgressBar.Mode
 */
var Mode = cc.Enum({
    /**
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,

    /**
     * @property {Number} VERTICAL
     */
    VERTICAL: 1,
    /**
     * @property {Number} RADIAL
     */
    RADIAL: 2,
});

/**
 * Visual indicator of progress in some operation. Displays a bar to the user representing how far the operation has progressed
 * @class ProgressBar
 * @extends Component
 */
var ProgressBar = cc.Class({
    name: 'cc.ProgressBar',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ProgressBar'
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
                this.mode = Mode.RADIAL;
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
                entity.setPosition(cc.p(x, y));
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

            var anchorPoint = cc.p(0, 0.5);
            var actualLenth = this.totalLength * this.progress;
            var finalContentSize;
            var totalWidth;
            var totalHeight;
            switch (this.mode) {
                case Mode.HORIZONTAL:
                    if (this.reverse) {
                        anchorPoint = cc.p(1, 0.5);
                    }
                    finalContentSize = cc.size(actualLenth, entitySize.height);
                    totalWidth = this.totalLength;
                    totalHeight = entitySize.height;
                    break;
                case Mode.VERTICAL:
                    if (this.reverse) {
                        anchorPoint = cc.p(0.5, 1);
                    } else {
                        anchorPoint = cc.p(0.5, 0);
                    }
                    finalContentSize = cc.size(entitySize.width, actualLenth);
                    totalWidth = entitySize.width;
                    totalHeight = this.totalLength;
                    break;
                case Mode.RADIAL:
                    this.barSprite.fillRange = actualLenth;
                    break;
            }

            if (this.barSprite.type !== cc.Sprite.Type.FILLED) {

                var anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
                var anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
                var finalPosition = cc.p(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY);

                entity.setPosition(cc.pAdd(entityPosition, finalPosition));

                entity.setAnchorPoint(anchorPoint);
                entity.setContentSize(finalContentSize);
            }


        }
    },

    properties: {
        /**
         * The targeted Sprite which will be changed progressively.
         *@property {cc.Sprite} barSprite
         */
        barSprite: {
            default: null,
            type: cc.Sprite,
            tooltip: 'i18n:COMPONENT.progress.bar_sprite',
            notify: function() {
                this._initBarSprite();
            },
            animatable: false
        },

        /**
         * The progress mode, there are two modes supported now: horizontal and vertical.
         *@property {ProgressBar.Mode} mode
         */
        mode: {
            default: Mode.HORIZONTAL,
            type: Mode,
            tooltip: 'i18n:COMPONENT.progress.mode',
            notify: function() {
                if (this.barSprite) {
                    var entity = this.barSprite.node;
                    if (!entity) return;

                    var entitySize = entity.getContentSize();
                    if (this.mode === Mode.HORIZONTAL) {
                        this.totalLength = entitySize.width;
                    } else if (this.mode === Mode.VERTICAL) {
                        this.totalLength = entitySize.height;
                    } else if (this.mode === Mode.RADIAL) {
                        this.totalLength = this.barSprite.fillRange;
                    }
                }
            },
            animatable: false
        },

        /**
         * The total width or height of the bar sprite.
         *@property {Number} totalLength
         */
        totalLength: {
            default: 1,
            range: [0, Number.MAX_VALUE],
            tooltip: 'i18n:COMPONENT.progress.total_length',
            notify: function(value) {
                this._updateBarStatus();
            }
        },

        /**
         * The current progress of the bar sprite. The valid value is between 0-1.
         *@property {Number} progress
         */
        progress: {
            default: 1,
            type: 'Float',
            range: [0, 1, 0.1],
            tooltip: 'i18n:COMPONENT.progress.progress',
            notify: function() {
                this._updateBarStatus();
            }
        },

        /**
         * Whether reverse the progress direction of the bar sprite.
         *@property {Boolean} reverse
         */
        reverse: {
            default: false,
            tooltip: 'i18n:COMPONENT.progress.reverse',
            notify: function() {
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
