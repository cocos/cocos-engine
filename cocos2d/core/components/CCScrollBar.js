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

var GETTINGSHORTERFACTOR = 20;

/**
 * Enum for Scrollbar direction
 * @enum Scrollbar.Direction
 */
var Direction = cc.Enum({
    /**
     * @property {Number} HORIZONTAL
     */
    HORIZONTAL: 0,

    /**
     * @property {Number} VERTICAL
     */
    VERTICAL: 1
});

/**
 * The Scrollbar control allows the user to scroll an image or other view that is too large to see completely
 *
 * @class Scrollbar
 * @extends Component
 */
var Scrollbar = cc.Class({
    name: 'cc.Scrollbar',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ScrollBar'
    },

    properties: {
        _scrollView: null,
        _touching: false,
        _autoHideRemainingTime: 0,
        _opacity: 255,

        /**
         * The "handle" part of the scrollbar.
         * @property {cc.SpriteRenderer} handle
         */
        handle: {
            default: null,
            type: cc.SpriteRenderer,

            notify: function() {
                this._onScroll(cc.p(0, 0));
            }
        },

        /**
         * The direction of scrollbar.
         *@property {Scrollbar.Direction} direction
         */
        direction: {
            default: Direction.HORIZONTAL,
            type: Direction,
            notify: function() {
                this._onScroll(cc.p(0, 0));
            }
        },

        /**
         * Whehter enable auto hide or not.
         *@property {Boolean} enableAutoHide
         */
        enableAutoHide: {
            default: true
        },

        /**
         * The time to hide scrollbar when scroll finished.
         * Note: This value is only useful when enableAutoHide is true.
         *@property {Float} autoHideTime
         */
        autoHideTime: {
            default: 1.0
        }
    },

    setTargetScrollView: function(scrollView) {
        this._scrollView = scrollView;
    },

    _convertToScrollViewSpace: function(content) {
        var worldSpacePos = content.convertToWorldSpaceAR(cc.p(0, 0));
        var scrollViewSpacePos = this._scrollView.node.convertToNodeSpace(worldSpacePos);
        return scrollViewSpacePos;
    },

    _setOpacity: function(opacity) {
        if (this.handle) {
            this.node.setOpacity(opacity);
        }
    },

    _onScroll: function(outOfBoundary) {
        if (this._scrollView) {
            if (this.enableAutoHide) {
                this._autoHideRemainingTime = this.autoHideTime;
                this._setOpacity(this._opacity);
            }

            var content = this._scrollView.content;
            if(content){
                var contentSize = content.getContentSize();
                var scrollViewSize = this._scrollView.node.getContentSize();

                var contentMeasure = 0;
                var scrollViewMeasure = 0;
                var outOfBoundaryValue = 0;
                var contentPosition = 0;

                if (this.direction === Direction.HORIZONTAL) {
                    contentMeasure = contentSize.width;
                    scrollViewMeasure = scrollViewSize.width;
                    outOfBoundaryValue = outOfBoundary.x;

                    contentPosition = -this._convertToScrollViewSpace(content).x;
                } else if (this.direction === Direction.VERTICAL) {
                    contentMeasure = contentSize.height;
                    scrollViewMeasure = scrollViewSize.height;
                    outOfBoundaryValue = outOfBoundary.y;

                    contentPosition = -this._convertToScrollViewSpace(content).y;
                }

                var length = this._calculateLength(contentMeasure, scrollViewMeasure, outOfBoundaryValue);
                var position = this._calculatePosition(contentMeasure, scrollViewMeasure, contentPosition, outOfBoundaryValue, length);
                this._updateLength(length);
                this._updateHanlderPosition(position);
            }
        }
    },

    _updateHanlderPosition: function(position) {
        if (this.handle) {
            var oldPosition = this._fixupHandlerPosition();

            this.handle.node.setPosition(cc.pAdd(position, oldPosition));
        }
    },

    _fixupHandlerPosition: function() {
        var barSize = this.node.getContentSize();
        var barAnchor = this.node.getAnchorPoint();
        var barPosition = this.node.getPosition();

        var fixupPosition;
        var handleParent = this.handle.node.parent;
        if (this.direction === Direction.HORIZONTAL) {
            var leftSideWorldPosition = this.node.convertToWorldSpaceAR(cc.p(-barSize.width * barAnchor.x, -barSize.height * barAnchor.y));

            fixupPosition = handleParent.convertToNodeSpaceAR(leftSideWorldPosition);
        } else if (this.direction === Direction.VERTICAL) {
            var bottomSideWorldPosition = this.node.convertToWorldSpaceAR(cc.p(-barSize.width * barAnchor.x, -barSize.height * barAnchor.y));

            fixupPosition = handleParent.convertToNodeSpaceAR(bottomSideWorldPosition);
        }

        this.handle.node.setPosition(fixupPosition);
        return fixupPosition;
    },

    _onTouchBegan: function() {
        if (!this.enableAutoHide) {
            return;
        }
        this._touching = true;

    },

    _onTouchEnded: function() {
        if (!this.enableAutoHide) {
            return;
        }

        this._touching = false;

        if (this.autoHideTime <= 0) {
            return;
        }

        this._autoHideRemainingTime = this.autoHideTime;
    },

    _calculateLength: function(contentMeasure, scrollViewMeasure, outOfBoundary) {
        var denominatorValue = contentMeasure;
        if (outOfBoundary) {
            denominatorValue += (outOfBoundary > 0 ? outOfBoundary : -outOfBoundary) * GETTINGSHORTERFACTOR;
        }

        var lengthRation = scrollViewMeasure / denominatorValue;
        return scrollViewMeasure * lengthRation;
    },

    _calculatePosition: function(contentMeasure, scrollViewMeasure, contentPosition, outOfBoundary, actualLenth) {
        var denominatorValue = contentMeasure - scrollViewMeasure;
        if (outOfBoundary) {
            denominatorValue += Math.abs(outOfBoundary);
        }

        var positionRatio = 0;
        if (denominatorValue) {
            positionRatio = contentPosition / denominatorValue;
            positionRatio = cc.clamp01(positionRatio);
        }

        var position = (scrollViewMeasure - actualLenth) * positionRatio;
        if (this.direction === Direction.VERTICAL) {
            return cc.p(0, position);
        } else {
            return cc.p(position, 0);
        }
    },

    _updateLength: function(length) {
        if (this.handle) {
            var handleNode = this.handle.node;
            var handleNodeSize = this.node.getContentSize();
            handleNode.setAnchorPoint(cc.p(0, 0));
            if (this.direction === Direction.HORIZONTAL) {
                handleNode.setContentSize(length, handleNodeSize.height);
            } else {
                handleNode.setContentSize(handleNodeSize.width, length);
            }
        }
    },

    _processAutoHide: function(deltaTime) {
        if (!this.enableAutoHide || this._autoHideRemainingTime <= 0) {
            return;
        } else if (this._touching) {
            return;
        }


        this._autoHideRemainingTime -= deltaTime;
        if (this._autoHideRemainingTime <= this.autoHideTime) {
            this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
            var opacity = this._opacity * (this._autoHideRemainingTime / this.autoHideTime);
            this._setOpacity(opacity);
        }
    },

    start: function() {
        if (this.enableAutoHide) {
            this._setOpacity(0);
        }
    },

    update: function(dt) {
        this._processAutoHide(dt);
    }
});


cc.Scrollbar = module.exports = Scrollbar;
