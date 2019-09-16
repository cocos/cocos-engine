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
 * !#en
 * The Scrollbar control allows the user to scroll an image or other view that is too large to see completely
 * !#zh 滚动条组件
 * @class Scrollbar
 * @extends Component
 */
var Scrollbar = cc.Class({
    name: 'cc.Scrollbar',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ScrollBar',
        help: 'i18n:COMPONENT.help_url.scrollbar',
    },

    properties: {
        _scrollView: null,
        _touching: false,
        _autoHideRemainingTime: {
            default: 0,
            serializable: false
        },
        _opacity: 255,

        /**
         * !#en The "handle" part of the scrollbar.
         * !#zh 作为当前滚动区域位置显示的滑块 Sprite。
         * @property {Sprite} handle
         */
        handle: {
            default: null,
            type: cc.Sprite,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollbar.handle',
            notify: function() {
                this._onScroll(cc.v2(0, 0));
            },
            animatable: false
        },

        /**
         * !#en The direction of scrollbar.
         * !#zh ScrollBar 的滚动方向。
         * @property {Scrollbar.Direction} direction
         */
        direction: {
            default: Direction.HORIZONTAL,
            type: Direction,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollbar.direction',
            notify: function() {
                this._onScroll(cc.v2(0, 0));
            },
            animatable: false
        },

        /**
         * !#en Whether enable auto hide or not.
         * !#zh 是否在没有滚动动作时自动隐藏 ScrollBar。
         * @property {Boolean} enableAutoHide
         */
        enableAutoHide: {
            default: true,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollbar.auto_hide',
        },

        /**
         * !#en
         * The time to hide scrollbar when scroll finished.
         * Note: This value is only useful when enableAutoHide is true.
         * !#zh
         * 没有滚动动作后经过多久会自动隐藏。
         * 注意：只要当 “enableAutoHide” 为 true 时，才有效。
         * @property {Number} autoHideTime
         */
        autoHideTime: {
            default: 1.0,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.scrollbar.auto_hide_time',
        }
    },

    statics: {
        Direction: Direction
    },

    setTargetScrollView: function(scrollView) {
        this._scrollView = scrollView;
    },

    _convertToScrollViewSpace: function(content) {
        let scrollViewNode = this._scrollView.node;
        var worldSpacePos = content.convertToWorldSpaceAR(cc.v2(-content.anchorX * content.width, -content.anchorY * content.height));
        var scrollViewSpacePos = scrollViewNode.convertToNodeSpaceAR(worldSpacePos);
        scrollViewSpacePos.x += scrollViewNode.anchorX * scrollViewNode.width;
        scrollViewSpacePos.y += scrollViewNode.anchorY * scrollViewNode.height;
        return scrollViewSpacePos;
    },

    _setOpacity: function(opacity) {
        if (this.handle) {
            this.node.opacity = opacity;
            this.handle.node.opacity = opacity;
        }
    },

    _onScroll: function(outOfBoundary) {
        if (this._scrollView) {

            var content = this._scrollView.content;
            if(content){
                var contentSize = content.getContentSize();
                var scrollViewSize = this._scrollView.node.getContentSize();
                var handleNodeSize = this.node.getContentSize();

                if(this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
                    return;
                }

                if (this.enableAutoHide) {
                    this._autoHideRemainingTime = this.autoHideTime;
                    this._setOpacity(this._opacity);
                }

                var contentMeasure = 0;
                var scrollViewMeasure = 0;
                var outOfBoundaryValue = 0;
                var contentPosition = 0;
                var handleNodeMeasure = 0;

                if (this.direction === Direction.HORIZONTAL) {
                    contentMeasure = contentSize.width;
                    scrollViewMeasure = scrollViewSize.width;
                    handleNodeMeasure = handleNodeSize.width;
                    outOfBoundaryValue = outOfBoundary.x;

                    contentPosition = -this._convertToScrollViewSpace(content).x;
                } else if (this.direction === Direction.VERTICAL) {
                    contentMeasure = contentSize.height;
                    scrollViewMeasure = scrollViewSize.height;
                    handleNodeMeasure = handleNodeSize.height;
                    outOfBoundaryValue = outOfBoundary.y;

                    contentPosition = -this._convertToScrollViewSpace(content).y;
                }

                var length = this._calculateLength(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundaryValue);
                var position = this._calculatePosition(contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundaryValue, length);

                this._updateLength(length);
                this._updateHanlderPosition(position);
            }
        }
    },

    _updateHanlderPosition: function(position) {
        if (this.handle) {
            var oldPosition = this._fixupHandlerPosition();

            this.handle.node.setPosition(position.x + oldPosition.x, position.y + oldPosition.y);
        }
    },

    _fixupHandlerPosition: function() {
        var barSize = this.node.getContentSize();
        var barAnchor = this.node.getAnchorPoint();
        var handleSize = this.handle.node.getContentSize();

        var handleParent = this.handle.node.parent;

        var leftBottomWorldPosition = this.node.convertToWorldSpaceAR(cc.v2(-barSize.width * barAnchor.x, -barSize.height * barAnchor.y));
        var fixupPosition = handleParent.convertToNodeSpaceAR(leftBottomWorldPosition);

        if (this.direction === Direction.HORIZONTAL) {
            fixupPosition = cc.v2(fixupPosition.x, fixupPosition.y + (barSize.height - handleSize.height) / 2);
        } else if (this.direction === Direction.VERTICAL) {
            fixupPosition = cc.v2(fixupPosition.x + (barSize.width - handleSize.width) / 2, fixupPosition.y);
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

    _conditionalDisableScrollBar: function (contentSize, scrollViewSize) {
        if(contentSize.width <= scrollViewSize.width
           && this.direction === Direction.HORIZONTAL){
            return true;
        }

        if(contentSize.height <= scrollViewSize.height
           && this.direction === Direction.VERTICAL){
            return true;
        }
        return false;
    },

    _onTouchEnded: function() {
        if (!this.enableAutoHide) {
            return;
        }

        this._touching = false;

        if (this.autoHideTime <= 0) {
            return;
        }


        if (this._scrollView) {
            var content = this._scrollView.content;
            if(content){
                var contentSize = content.getContentSize();
                var scrollViewSize = this._scrollView.node.getContentSize();

                if(this._conditionalDisableScrollBar(contentSize, scrollViewSize)) {
                    return;
                }
            }
        }

        this._autoHideRemainingTime = this.autoHideTime;
    },

    _calculateLength: function(contentMeasure, scrollViewMeasure, handleNodeMeasure, outOfBoundary) {
        var denominatorValue = contentMeasure;
        if (outOfBoundary) {
            denominatorValue += (outOfBoundary > 0 ? outOfBoundary : -outOfBoundary) * GETTINGSHORTERFACTOR;
        }

        var lengthRation = scrollViewMeasure / denominatorValue;
        return handleNodeMeasure * lengthRation;
    },

    _calculatePosition: function(contentMeasure, scrollViewMeasure, handleNodeMeasure, contentPosition, outOfBoundary, actualLenth) {
        var denominatorValue = contentMeasure - scrollViewMeasure;
        if (outOfBoundary) {
            denominatorValue += Math.abs(outOfBoundary);
        }

        var positionRatio = 0;
        if (denominatorValue) {
            positionRatio = contentPosition / denominatorValue;
            positionRatio = misc.clamp01(positionRatio);
        }

        var position = (handleNodeMeasure - actualLenth) * positionRatio;
        if (this.direction === Direction.VERTICAL) {
            return cc.v2(0, position);
        } else {
            return cc.v2(position, 0);
        }
    },

    _updateLength: function(length) {
        if (this.handle) {
            var handleNode = this.handle.node;
            var handleNodeSize = handleNode.getContentSize();
            handleNode.setAnchorPoint(cc.v2(0, 0));
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

    hide: function() {
        this._autoHideRemainingTime = 0;
        this._setOpacity(0);
    },

    show: function() {
        this._autoHideRemainingTime = this.autoHideTime;
        this._setOpacity(this._opacity);
    },

    update: function(dt) {
        this._processAutoHide(dt);
    }
});


cc.Scrollbar = module.exports = Scrollbar;
