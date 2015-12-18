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

var EventTarget = require("../event/event-target");

var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
var BOUNCE_BACK_DURATION = 1.0;
var FLOAT_COMPARE_TOLERANCE = 0.0000001;

/**
 * Layout container for a view hierarchy that can be scrolled by the user, allowing it to be larger than the physical display.
 *
 * @class ScrollView
 * @extends Component
 */
var ScrollView = cc.Class({
    name: 'cc.ScrollView',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'UI/ScrollView',
        executeInEditMode: true
    },

    ctor: function() {
        EventTarget.call(this);

        this._touchListener = null;

        this._topBoundary = 0;
        this._bottomBoundary = 0;
        this._leftBoundary = 0;
        this._rightBoundary = 0;

        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];
        this._touchMovePreviousTimestamp = 0;

        this._autoScrolling = false;
        this._autoScrollAttenuate = false;
        this._autoScrollStartPosition = cc.p(0, 0);
        this._autoScrollTargetDelta = cc.p(0, 0);
        this._autoScrollTotalTime = 0;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollCurrentlyOutOfBoundary = false;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.p(0, 0);

        this._outOfBoundaryAmount = cc.p(0, 0);
        this._outOfBoundaryAmountDirty = true;

    },

    properties: {
        content: {
            default: null,
            type: cc.Node,

            notify: function() {

            }
        },

        horizontal: {
            default: true,
            notify: function() {

            }
        },

        vertical: {
            default: true,
            notify: function() {

            }
        },

        momentum: {
            default: true,
            notify: function() {

            }
        },

        brake: {
            default: 0.5
        },

        spring: {
            default: true
        },

        elastic: {
            default: 0.1
        },

        horizontalScrollBar: {
            default: null,
            type: cc.Scrollbar,
            notify: function() {
                this.horizontalScrollBar.setTargetScrollView(this);
                this._updateScrollBar(0);
            }
        },

        verticalScrollBar: {
            default: null,
            type: cc.Scrollbar,
            notify: function() {
                this.verticalScrollBar.setTargetScrollView(this);
                this._updateScrollBar(0);
            }
        }
    },

    _registerEvent: function() {
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan.bind(this),
            onTouchEnded: this._onTouchEnded.bind(this),
            onTouchMoved: this._onTouchMoved.bind(this),
            onTouchCancelled: this._onTouchCancelled.bind(this)
        });
        cc.eventManager.addListener(this._touchListener, this.node._sgNode);
    },

    onLoad: function() {
        if (!CC_EDITOR) {
            this._registerEvent();
        }
    },

    start: function() {
        var scrollViewSize = this.node.getContentSize();
        this._rightBoundary = scrollViewSize.width;
        this._topBoundary = scrollViewSize.height;

        this._updateScrollBar(0);
    },

    update: function(dt) {
        var scrollViewSize = this.node.getContentSize();
        this._rightBoundary = scrollViewSize.width;
        this._topBoundary = scrollViewSize.height;

        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    },

    _hitTest: function(pos) {
        var target = this.node;

        var w = target.width;
        var h = target.height;
        var anchor = target.getAnchorPoint();

        var rect = cc.rect(-anchor.x * w, -anchor.y * h, w, h);
        return cc.rectContainsPoint(rect, target.convertToNodeSpaceAR(pos));
    },

    // touch event handler
    _onTouchBegan: function(touch) {
        var hit = this._hitTest(touch.getLocation());
        if (hit) {
            this._handlePressLogic(touch);
        }


        return hit;
    },

    _onTouchMoved: function(touch) {
        if (this.content) {
            this._handleMoveLogic(touch);
        }
    },

    _onTouchEnded: function(touch) {
        this._handleReleaseLogic(touch);

    },
    _onTouchCancelled: function(touch) {
        this._handlePressLogic(touch);
    },

    _getTimeInMilliseconds: function() {
        var currentTime = new Date();
        return currentTime.getMilliseconds();
    },

    _handleMoveLogic: function(touch) {
        var currPt = touch.getLocation();
        var prevPt = touch.getPreviousLocation();
        if (!this._calculateCurrAndPrevTouchPosition(currPt, prevPt)) {
            return;
        }

        var deltaMove = cc.pSub(currPt, prevPt);
        this._scrollChildren(deltaMove);

        this._gatherTouchMove(deltaMove);
    },

    _scrollChildren: function(deltaMove) {
        var realMove = deltaMove;
        var outOfBoundary;
        if (this.spring) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.spring) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove = cc.pAdd(realMove, outOfBoundary);
        }

        this._moveInnerContainer(realMove, false);
    },

    _handlePressLogic: function(touch) {
        this._autoScrolling = false;

        this._touchMovePreviousTimestamp = this._getTimeInMilliseconds();
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];

        this._onScrollBarTouchBegan();
    },

    _calculateCurrAndPrevTouchPosition: function(currPt, prevPt) {
        if (!this._hitTest(currPt) || !this._hitTest(prevPt)) {
            return false;
        }
        return true;
    },

    _gatherTouchMove: function(delta) {
        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(delta);

        var timeStamp = this._getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    },

    _startBounceBackIfNeeded: function() {
        if (!this.spring) {
            return false;
        }

        var bounceBackAmount = this._getHowMuchOutOfBoundary();
        if (cc.pFuzzyEqual(bounceBackAmount, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE)) {
            return false;
        }

        var bounceBackTime = Math.max(this.elastic, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        return true;
    },

    _handleReleaseLogic: function(touch) {
        var currPt = touch.getLocation();
        var prevPt = touch.getPreviousLocation();

        if (this._calculateCurrAndPrevTouchPosition(currPt, prevPt)) {
            var delta = cc.pSub(currPt, prevPt);
            this._gatherTouchMove(delta);
        }


        var bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.momentum) {
            var touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!cc.pFuzzyEqual(touchMoveVelocity, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE) && this.brake > 0) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    },

    _isOutOfBoundary: function() {
        var outOfBoundary = this._getHowMuchOutOfBoundary();
        return !cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE);
    },

    _isNecessaryAutoScrollBrake: function() {
        if (this._autoScrollBraking) {
            return true;
        }

        if (this._isOutOfBoundary()) {
            if (!this._autoScrollCurrentlyOutOfBoundary) {
                this._autoScrollCurrentlyOutOfBoundary = true;
                this._autoScrollBraking = true;
                this._autoScrollBrakingStartPosition = this.getContentPosition();
                return true;
            }

        } else {
            this._autoScrollCurrentlyOutOfBoundary = false;
        }

        return false;
    },

    _quintEaseOut: function(time) {
        time -= 1;
        return (time * time * time * time * time + 1);
    },

    _processAutoScrolling: function(dt) {
        var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : this.brake * 5;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = this._quintEaseOut(percentage);
        }

        var newPosition = cc.pAdd(this._autoScrollStartPosition, cc.pMult(this._autoScrollTargetDelta, percentage));
        var reachedEnd = (percentage === 1);

        if (this.spring) {
            var brakeOffsetPosition = cc.pSub(newPosition, this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = cc.pMult(brakeOffsetPosition, brakingFactor);
            }
            newPosition = cc.pAdd(this._autoScrollBrakingStartPosition, brakeOffsetPosition);
        } else {
            var moveDelta = cc.pSub(newPosition, this.getContentPosition());
            var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE)) {
                newPosition = cc.pAdd(newPosition, outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
        }

        var contentPos = cc.pSub(newPosition, this.getContentPosition());
        this._moveInnerContainer(contentPos, reachedEnd);
    },

    _startInertiaScroll: function(touchMoveVelocity) {
        var MOVEMENT_FACTOR = 0.7;
        var inertiaTotalMovement = cc.pMult(touchMoveVelocity, MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    },

    _startAttenuatingAutoScroll: function(deltaMove, initialVelocity) {
        var time = this._calculateAutoScrollTimeByInitalSpeed(cc.pLength(initialVelocity));

        this._startAutoScroll(deltaMove, time, true);
    },

    _calculateAutoScrollTimeByInitalSpeed: function(initalSpeed) {
        var time = Math.sqrt(Math.sqrt(initalSpeed / 5));
        return time;
    },

    _startAutoScroll: function(deltaMove, timeInSecond, attenuated) {
        var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this.getContentPosition();
        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._autoScrollBrakingStartPosition = cc.p(0, 0);

        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!cc.pFuzzyEqual(currentOutOfBoundary, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            var afterOutOfBoundary = this._getHowMuchOutOfBoundary(adjustedDeltaMove);
            if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 || currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
                this._autoScrollBraking = true;
                console.log("auto scroll braking");
            }
        }

    },

    _calculateTouchMoveVelocity: function() {
        var totalTime = 0;
        this._touchMoveTimeDeltas.map(function(dt) {
            totalTime += dt;
        });

        if (totalTime === 0 || totalTime >= 0.5) {
            return cc.p(0, 0);
        }

        var totalMovement = cc.p(0, 0);
        this._touchMoveDisplacements.map(function(pt) {
            totalMovement = cc.pAdd(totalMovement, pt);
        });

        return cc.p(totalMovement.x / totalTime, totalMovement.y / totalTime);
    },

    _flattenVectorByDirection: function(vector) {
        var result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    },
    setContentPosition: function(position) {
        var worldSpacePos = this.node.convertToWorldSpace(position);
        var contentParent = this.content.parent;

        var localPositionInParent = contentParent.convertToNodeSpaceAR(worldSpacePos);

        this.content.setPosition(localPositionInParent);
    },

    _convertToScrollViewSpace: function(position) {
        var contentWorldPosition = this.content.convertToWorldSpaceAR(position);

        return this.node.convertToNodeSpace(contentWorldPosition);
    },

    getContentPosition: function() {
        var contentSize = this.content.getContentSize();
        var contentAnchor = this.content.getAnchorPoint();
        return this._convertToScrollViewSpace(cc.p(-contentSize.width * contentAnchor.x, -contentSize.height * contentAnchor.y));
    },

    _setInnerContainerPosition: function(position) {
        if (cc.pFuzzyEqual(position, this.getContentPosition(), FLOAT_COMPARE_TOLERANCE)) {
            return;
        }
        this.setContentPosition(position);
        this._outOfBoundaryAmountDirty = true;

        //TODO: process bouncing and container move event
    },

    _moveInnerContainer: function(deltaMove, canStartBounceBack) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);

        var newPosition = cc.pAdd(this.getContentPosition(), adjustedMove);

        this._setInnerContainerPosition(newPosition);

        var outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.spring && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }

    },

    _getContentLeftBoundary: function() {
        var contentPos = this.getContentPosition();
        return contentPos.x;
    },

    _getContentRightBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._convertToScrollViewSpace(cc.p(contentSize.width, contentSize.height)).x;
    },

    _getContentTopBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._convertToScrollViewSpace(cc.p(contentSize.width, contentSize.height)).y;
    },

    _getContentBottomBoundary: function() {
        return this.getContentPosition().y;
    },

    _getHowMuchOutOfBoundary: function(addition) {
        addition = addition || cc.p(0, 0);
        if (cc.pFuzzyEqual(addition, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        var outOfBoundaryAmount = cc.p(0, 0);
        if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
            outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
        } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
            outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
        }

        if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
            outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
        } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
            outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
        }

        if (cc.pFuzzyEqual(addition, cc.p(0, 0), FLOAT_COMPARE_TOLERANCE)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        return outOfBoundaryAmount;
    },

    _updateScrollBar: function(outOfBoundary) {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onScroll(outOfBoundary);
        }
    },

    _onScrollBarTouchBegan: function() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchBegan();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchBegan();
        }
    },

    _onScrollBarTouchEnded: function() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchEnded();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchEnded();
        }
    },


    onDestroy: function() {
        if (this._touchListener) cc.eventManager.removeListener(this._touchListener);
    }
});

cc.js.addon(ScrollView.prototype, EventTarget.prototype);

cc.ScrollView = module.exports = ScrollView;
