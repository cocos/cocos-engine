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

var EventTarget = require('../event/event-target');

var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
var EPSILON = 1e-7;
var MOVEMENT_FACTOR = 0.7;

var quintEaseOut = function(time) {
    time -= 1;
    return (time * time * time * time * time + 1);
};

var getTimeInMilliseconds = function() {
    var currentTime = new Date();
    return currentTime.getMilliseconds();
};

/**
 * Layout container for a view hierarchy that can be scrolled by the user,
 * allowing it to be larger than the physical display.
 *
 * @class ScrollView
 * @extends Component
 */
var ScrollView = cc.Class({
    name: 'cc.ScrollView',
    extends: require('./CCComponent'),
    mixins: [EventTarget],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/ScrollView',
        executeInEditMode: true
    },

    ctor: function() {

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
        /**
         * This is a reference to the UI element to be scrolled.
         *@property {cc.Node} content
         */
        content: {
            default: null,
            type: cc.Node,
            tooltip: 'i18n:COMPONENT.scrollview.content',
        },

        /**
         * Enable horizontal scroll.
         *@property {Boolean} horizontal
         */
        horizontal: {
            default: true,
            tooltip: 'i18n:COMPONENT.scrollview.horizontal',
        },

        /**
         * Enable vertical scroll.
         *@property {Boolean} vertical
         */
        vertical: {
            default: true,
            tooltip: 'i18n:COMPONENT.scrollview.vertical',
        },

        /**
         * When inertia is set, the content will continue to move when touch ended.
         *@property {Boolean} inertia
         */
        inertia: {
            default: true,
            tooltip: 'i18n:COMPONENT.scrollview.inertia',
        },

        /**
         * It determines how quickly the content stop moving. A value of 1 will stop the movement immediately.
         * A value of 0 will never stop the movement until it reaches to the boundary of scrollview.
         *@property {Float} brake
         */
        brake: {
            default: 0.5,
            type: 'Float',
            range: [0, 1, 0.1]
        },

        /**
         * When elastic is set, the content will be bounce back when move out of boundary.
         *@property {Boolean} elastic
         */
        elastic: {
            default: true
        },

        /**
         * The elapse time of bouncing back. A value of 0 will bounce back immediately.
         *@property {Float} bounceDuration
         */
        bounceDuration: {
            default: 1,
            range: [0, 10]
        },

        /**
         * The horizontal scrollbar reference.
         *@property {cc.Scrollbar} horizontalScrollBar
         */
        horizontalScrollBar: {
            default: null,
            type: cc.Scrollbar,
            tooltip: 'i18n:COMPONENT.scrollview.horizontal_bar',
            notify: function() {
                this.horizontalScrollBar.setTargetScrollView(this);
                this._updateScrollBar(0);
            }
        },

        /**
         * The vertical scrollbar reference.
         *@property {cc.Scrollbar} verticalScrollBar
         */
        verticalScrollBar: {
            default: null,
            type: cc.Scrollbar,
            tooltip: 'i18n:COMPONENT.scrollview.vertical_bar',
            notify: function() {
                this.verticalScrollBar.setTargetScrollView(this);
                this._updateScrollBar(0);
            }
        }
    },

    /**
     * Scroll the content to the bottom boundary of ScrollView.
     * @method scrollToBottom
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToBottom: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta, true);
        }
    },

    /**
     * Scroll the content to the top boundary of ScrollView.
     * @method scrollToTop
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToTop: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 1),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the left boundary of ScrollView.
     * @method scrollToLeft
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the left boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the right boundary of ScrollView.
     * @method scrollToRight
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the right boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the top left boundary of ScrollView.
     * @method scrollToTopLeft
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top left boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToTopLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the top right boundary of ScrollView.
     * @method scrollToTopRight
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top right boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToTopRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 1),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the bottom left boundary of ScrollView.
     * @method scrollToBottomLeft
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom left boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToBottomLeft: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the bottom right boundary of ScrollView.
     * @method scrollToBottomRight
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the bottom right boundary immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToBottomRight: function(timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(1, 0),
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the horizontal percent position  of ScrollView.
     * @method scrollToPercentHorizontal
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the horizontal percent position of ScrollView immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToPercentHorizontal: function(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(percent, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the percent position of ScrollView in any direction.
     * @method scrollTo
     * @param {Point} anchor - A point which will be clamp between cc.p(0,0) and cc.p(1,1).
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the percent position of ScrollView immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollTo: function(anchor, timeInSecond, attenuated){
        var moveDelta = this._calculateMovePercentDelta({
            anchor: anchor,
            applyToHorizontal: true,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Scroll the content to the vertical percent position of ScrollView.
     * @method scrollToPercentVertical
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} timeInSecond - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the vertical percent position of ScrollView immediately.
     * @param {Boolean} attenuated - Whether the scroll acceleration attenuated, default is true.
     */
    scrollToPercentVertical: function(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
            anchor: cc.p(0, percent),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if(timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        }else {
            this._moveContent(moveDelta);
        }
    },

    /**
     * Modify the content position.
     * @param {Point} position - The position in content's parent space.
     */
    setContentPosition: function(position) {
        if (cc.pFuzzyEqual(position, this.getContentPosition(), EPSILON)) {
            return;
        }

        this.content.setPosition(position);

        this._outOfBoundaryAmountDirty = true;

        //TODO: process bouncing and container move event
    },

    /**
     * Query the content's position in its parent space.
     * @returns {Position} - The content's position in its parent space.
     */
    getContentPosition: function() {
        return this.content.getPosition();
    },

    //private methods
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

    _calculateMovePercentDelta: function(options) {
        var anchor = options.anchor;
        var applyToHorizontal = options.applyToHorizontal;
        var applyToVertical = options.applyToVertical;

        anchor = cc.pClamp(anchor, cc.p(0, 0), cc.p(1, 1));

        var scrollSize = this.node.getContentSize();
        var contentSize = this.content.getContentSize();
        var bottomDeta = Math.abs(this._getContentBottomBoundary() - this._bottomBoundary);
        var leftDeta = Math.abs(this._getContentLeftBoundary() - this._leftBoundary);

        var moveDelta = cc.p(0, 0);
        if(applyToHorizontal) {
            moveDelta.x = (contentSize.width - scrollSize.width) * anchor.x - leftDeta;
        }

        if(applyToVertical) {
            moveDelta.y = (contentSize.height - scrollSize.height) * anchor.y  - bottomDeta;
        }

        moveDelta = cc.pNeg(moveDelta);
        return moveDelta;
    },

    _calculateBoundary: function() {
        var scrollViewSize = this.node.getContentSize();

        var leftBottomPosition = this._convertToContentParentSpace(cc.p(0, 0));
        this._leftBoundary = leftBottomPosition.x;
        this._bottomBoundary = leftBottomPosition.y;

        var topRightPosition = this._convertToContentParentSpace(cc.p(scrollViewSize.width, scrollViewSize.height));
        this._rightBoundary = topRightPosition.x;
        this._topBoundary = topRightPosition.y;
    },

    _convertToContentParentSpace: function(position) {
        var scrollViewPositionInWorldSpace = this.node.convertToWorldSpace(position);
        var contentParent = this.content.parent;

        return contentParent.convertToNodeSpaceAR(scrollViewPositionInWorldSpace);
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

    _handleMoveLogic: function(touch) {
        var currPt = touch.getLocation();
        var prevPt = touch.getPreviousLocation();
        if (!this._hitTest(currPt) || !this._hitTest(prevPt)) {
            return;
        }

        var deltaMove = cc.pSub(currPt, prevPt);
        this._scrollChildren(deltaMove);

        this._gatherTouchMove(deltaMove);
    },

    _scrollChildren: function(deltaMove) {
        deltaMove = this._clampDelta(deltaMove);

        var realMove = deltaMove;
        var outOfBoundary;
        if (this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove = cc.pAdd(realMove, outOfBoundary);
        }

        this._moveContent(realMove, false);
    },

    _handlePressLogic: function(touch) {
        this._autoScrolling = false;

        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements = [];
        this._touchMoveTimeDeltas = [];

        this._onScrollBarTouchBegan();
    },

    _clampDelta: function(delta) {
        var contentSize = this.content.getContentSize();
        var scrollViewSize = this.node.getContentSize();
        if (contentSize.width <= scrollViewSize.width) {
            delta.x = 0;
        }
        if (contentSize.height <= scrollViewSize.height) {
            delta.y = 0;
        }

        return delta;
    },

    _gatherTouchMove: function(delta) {
        delta = this._clampDelta(delta);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(delta);

        var timeStamp = getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    },

    _startBounceBackIfNeeded: function() {
        if (!this.elastic) {
            return false;
        }

        var bounceBackAmount = this._getHowMuchOutOfBoundary();
        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (cc.pFuzzyEqual(bounceBackAmount, cc.p(0, 0), EPSILON)) {
            return false;
        }

        var bounceBackTime = Math.max(this.bounceDuration, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        return true;
    },

    _handleReleaseLogic: function(touch) {
        var currPt = touch.getLocation();
        var prevPt = touch.getPreviousLocation();

        if (this._hitTest(currPt) && this._hitTest(prevPt)) {
            var delta = cc.pSub(currPt, prevPt);
            this._gatherTouchMove(delta);
        }


        var bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertia) {
            var touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!cc.pFuzzyEqual(touchMoveVelocity, cc.p(0, 0), EPSILON) && this.brake < 1) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    },

    _isOutOfBoundary: function() {
        var outOfBoundary = this._getHowMuchOutOfBoundary();
        return !cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), EPSILON);
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


    _processAutoScrolling: function(dt) {
        var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = quintEaseOut(percentage);
        }

        var newPosition = cc.pAdd(this._autoScrollStartPosition, cc.pMult(this._autoScrollTargetDelta, percentage));
        var reachedEnd = (percentage === 1);

        if (this.elastic) {
            var brakeOffsetPosition = cc.pSub(newPosition, this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = cc.pMult(brakeOffsetPosition, brakingFactor);
            }
            newPosition = cc.pAdd(this._autoScrollBrakingStartPosition, brakeOffsetPosition);
        } else {
            var moveDelta = cc.pSub(newPosition, this.getContentPosition());
            var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!cc.pFuzzyEqual(outOfBoundary, cc.p(0, 0), EPSILON)) {
                newPosition = cc.pAdd(newPosition, outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
        }

        var contentPos = cc.pSub(newPosition, this.getContentPosition());
        this._moveContent(contentPos, reachedEnd);
    },

    _startInertiaScroll: function(touchMoveVelocity) {
        var inertiaTotalMovement = cc.pMult(touchMoveVelocity, MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    },

    _startAttenuatingAutoScroll: function(deltaMove, initialVelocity) {
        var time = this._calculateAutoScrollTimeByInitalSpeed(cc.pLength(initialVelocity));

        var originalMoveLength = cc.pLength(deltaMove);

        var targetDelta = cc.pNormalize(deltaMove);
        var contentSize = this.content.getContentSize();
        var scrollviewSize = this.node.getContentSize();

        targetDelta = cc.p(targetDelta.x * (contentSize.width - scrollviewSize.width) * (1 - this.brake),
            targetDelta.y * (contentSize.height - scrollviewSize.height) * (1 - this.brake));

        targetDelta = cc.pAdd(deltaMove, targetDelta);
        var factor = cc.pLength(targetDelta) / originalMoveLength;

        time = time * factor;

        this._startAutoScroll(targetDelta, time, true);
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
        if (!cc.pFuzzyEqual(currentOutOfBoundary, cc.p(0, 0), EPSILON)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            var afterOutOfBoundary = this._getHowMuchOutOfBoundary(adjustedDeltaMove);
            if (currentOutOfBoundary.x * afterOutOfBoundary.x > 0 ||
                currentOutOfBoundary.y * afterOutOfBoundary.y > 0) {
                this._autoScrollBraking = true;
            }
        }

    },

    _calculateTouchMoveVelocity: function() {
        var totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce(function(a, b) {
            return a + b;
        }, totalTime);

        if (totalTime === 0 || totalTime >= 0.5) {
            return cc.p(0, 0);
        }

        var totalMovement = cc.p(0, 0);
        totalMovement = this._touchMoveDisplacements.reduce(function(a, b) {
            return cc.pAdd(a, b);
        }, totalMovement);

        return cc.p(totalMovement.x / totalTime, totalMovement.y / totalTime);
    },

    _flattenVectorByDirection: function(vector) {
        var result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    },

    _moveContent: function(deltaMove, canStartBounceBack) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);

        var newPosition = cc.pAdd(this.getContentPosition(), adjustedMove);

        this.setContentPosition(newPosition);

        var outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }

    },


    _getContentLeftBoundary: function() {
        var contentPos = this.getContentPosition();
        var leftBoundary = contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
        return leftBoundary;
    },

    _getContentRightBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._getContentLeftBoundary() + contentSize.width;
    },

    _getContentTopBoundary: function() {
        var contentSize = this.content.getContentSize();
        return this._getContentBottomBoundary() + contentSize.height;
    },

    _getContentBottomBoundary: function() {
        var contentPos = this.getContentPosition();
        var bottomBoundary = contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
        return bottomBoundary;
    },

    _getHowMuchOutOfBoundary: function(addition) {
        addition = addition || cc.p(0, 0);
        if (cc.pFuzzyEqual(addition, cc.p(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
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

        if (cc.pFuzzyEqual(addition, cc.p(0, 0), EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);

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

    //component life cycle methods
    onLoad: function() {
        if (!CC_EDITOR) {
            this._registerEvent();
        }
    },

    start: function() {
        this._calculateBoundary();
    },

    update: function(dt) {
        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    },

    onDestroy: function() {
        if (this._touchListener) cc.eventManager.removeListener(this._touchListener);
    }
});

cc.ScrollView = module.exports = ScrollView;
