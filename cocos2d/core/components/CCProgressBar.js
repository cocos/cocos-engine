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
     * @property {Number} Horizontal
     */
    HORIZONTAL: 0,

    /**
     * @property {Number} Vertical
     */
    VERTICAL: 1
});

/**
 * Visual indicator of progress in some operation. Displays a bar to the user representing how far the operation has progressed;
 * @class ProgressBar
 * @extends Component
 */
var ProgressBar = cc.Class({
    name: 'cc.ProgressBar',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'UI/ProgressBar',
        executeInEditMode: true
    },

    _initBarSprite: function () {
        var targetEntity = this.barSprite;
        if (targetEntity) {
            this._originalAnchor = targetEntity.getAnchorPoint();
            this._originalPosition = targetEntity.getPosition();
            this._originalSize = targetEntity.getContentSize();

            var barSpriteSize = targetEntity.getContentSize();
            if(this.mode === Mode.HORIZONTAL){
                this.totalLength = barSpriteSize.width;
            }else{
                this.totalLength = barSpriteSize.height;
            }
            this._updateBarStatus(true);
        }
    },
    _updateBarStatus: function(isResetPosition){
        var entity = this.barSprite;
        if(entity) {
            var anchorPoint = cc.p(0, 0.5);
            var actualLenth = this.totalLength * this.progress;
            var spriteSize = this._originalSize;
            var finalContentSize;
            var totalWidth;
            var totalHeight;
            switch(this.mode){
                case Mode.HORIZONTAL:
                    if(this.reverse){
                        anchorPoint = cc.p(1, 0.5);
                    }
                    finalContentSize = cc.size(actualLenth, spriteSize.height);
                    totalWidth = this.totalLength;
                    totalHeight = spriteSize.height;
                    break;
                case Mode.VERTICAL:
                    if(this.reverse){
                        anchorPoint = cc.p(0.5, 1);
                    }else{
                        anchorPoint = cc.p(0.5, 0);
                    }
                    finalContentSize = cc.size(spriteSize.width, actualLenth);
                    totalWidth = spriteSize.width;
                    totalHeight = this.totalLength;
            }

            if(isResetPosition){
                var anchorOffsetX = anchorPoint.x - this._originalAnchor.x;
                var anchorOffsetY = anchorPoint.y - this._originalAnchor.y;

                var finalPosition = cc.p(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY);

                entity.setPosition(cc.pAdd(this._originalPosition, finalPosition));
            }

            entity.setAnchorPoint(anchorPoint);
            entity.setContentSize(finalContentSize);

        }
    },

    properties: {
        _originalAnchor: null,
        _originalPosition: null,
        _originalSize: null,

        barSprite: {
            default: null,
            type: cc.ENode,

            notify: function () {
                this._initBarSprite();
            }
        },

        mode: {
            default: Mode.HORIZONTAL,
            type: Mode,
            notify: function(value){
                //value is the old value
                if(value === Mode.HORIZONTAL){
                    this.totalLength = this._originalSize.height;
                }else if(value === Mode.VERTICAL){
                    this.totalLength = this._originalSize.width;
                }
                this._updateBarStatus(true);
            }
        },

        totalLength: {
            default: 1,
            range: [0, Number.MAX_VALUE],
            notify: function(value){
                this._updateBarStatus();
            }
        },

        progress: {
            default: 1,
            type: 'Float',
            range: [0, 1],
            notify: function(){
                this._updateBarStatus();
            }
        },

        reverse: {
            default: false,
            notify: function(){
                this._updateBarStatus(true);
            }
        }
    }
});


cc.ProgressBar = module.exports = ProgressBar;
