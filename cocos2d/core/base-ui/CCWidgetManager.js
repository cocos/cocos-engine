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

var Event = require('../CCNode').EventType;

var TOP     = 1 << 0;
var MID     = 1 << 1;   // vertical center
var BOT     = 1 << 2;
var LEFT    = 1 << 3;
var CENTER  = 1 << 4;   // horizontal center
var RIGHT   = 1 << 5;
var HORIZONTAL = LEFT | CENTER | RIGHT;
var VERTICAL = TOP | MID | BOT;

var AlignMode = cc.Enum({
    ONCE: 0,
    ON_WINDOW_RESIZE: 1,
    ALWAYS: 2,
});

// returns a readonly size of the node
function getReadonlyNodeSize (parent) {
    if (parent instanceof cc.Scene) {
        return CC_EDITOR ? cc.engine.getDesignResolutionSize() : cc.visibleRect;
    }
    else {
        return parent._contentSize;
    }
}

function computeInverseTransForTarget (widgetNode, target, out_inverseTranslate, out_inverseScale) {
    var scaleX = widgetNode._parent.scaleX;
    var scaleY = widgetNode._parent.scaleY;
    var translateX = 0;
    var translateY = 0;
    for (var node = widgetNode._parent;;) {
        translateX += node.x;
        translateY += node.y;
        node = node._parent;    // loop increment
        if (!node) {
            // ERROR: widgetNode should be child of target
            out_inverseTranslate.x = out_inverseTranslate.y = 0;
            out_inverseScale.x = out_inverseScale.y = 1;
            return;
        }
        if (node !== target) {
            var sx = node.scaleX;
            var sy = node.scaleY;
            translateX *= sx;
            translateY *= sy;
            scaleX *= sx;
            scaleY *= sy;
        }
        else {
            break;
        }
    }
    out_inverseScale.x = scaleX !== 0 ? (1 / scaleX) : 1;
    out_inverseScale.y = scaleY !== 0 ? (1 / scaleY) : 1;
    out_inverseTranslate.x = -translateX;
    out_inverseTranslate.y = -translateY;
}

var tInverseTranslate = cc.Vec2.ZERO;
var tInverseScale = cc.Vec2.ONE;

// align to borders by adjusting node's position and size (ignore rotation)
function align (node, widget) {
    var hasTarget = widget._target;
    var target;
    var inverseTranslate, inverseScale;
    if (hasTarget) {
        target = hasTarget;
        inverseTranslate = tInverseTranslate;
        inverseScale = tInverseScale;
        computeInverseTransForTarget(node, target, inverseTranslate, inverseScale);
    }
    else {
        target = node._parent;
    }
    var targetSize = getReadonlyNodeSize(target);
    var targetAnchor = target._anchorPoint;

    var isRoot = !CC_EDITOR && target instanceof cc.Scene;
    var x = node.x, y = node.y;
    var anchor = node._anchorPoint;

    if (widget._alignFlags & HORIZONTAL) {

        var localLeft, localRight, targetWidth = targetSize.width;
        if (isRoot) {
            localLeft = cc.visibleRect.left.x;
            localRight = cc.visibleRect.right.x;
        }
        else {
            localLeft = -targetAnchor.x * targetWidth;
            localRight = localLeft + targetWidth;
        }

        // adjust borders according to offsets
        localLeft += widget._isAbsLeft ? widget._left : widget._left * targetWidth;
        localRight -= widget._isAbsRight ? widget._right : widget._right * targetWidth;

        if (hasTarget) {
            localLeft += inverseTranslate.x;
            localLeft *= inverseScale.x;
            localRight += inverseTranslate.x;
            localRight *= inverseScale.x;
        }

        var width, anchorX = anchor.x, scaleX = node.scaleX;
        if (scaleX < 0) {
            anchorX = 1.0 - anchorX;
            scaleX = -scaleX;
        }
        if (widget.isStretchWidth) {
            width = localRight - localLeft;
            if (scaleX !== 0) {
                node.width = width / scaleX;
            }
            x = localLeft + anchorX * width;
        }
        else {
            width = node.width * scaleX;
            if (widget.isAlignHorizontalCenter) {
                var localHorizontalCenter = widget._isAbsHorizontalCenter ? widget._horizontalCenter : widget._horizontalCenter * targetWidth;
                var targetCenter = (0.5 - targetAnchor.x) * targetSize.width;
                if (hasTarget) {
                    localHorizontalCenter *= inverseScale.x;
                    targetCenter += inverseTranslate.x;
                    targetCenter *= inverseScale.x;
                }
                x = targetCenter + (anchorX - 0.5) * width + localHorizontalCenter;
            }
            else if (widget.isAlignLeft) {
                x = localLeft + anchorX * width;
            }
            else {
                x = localRight + (anchorX - 1) * width;
            }
        }
    }

    if (widget._alignFlags & VERTICAL) {

        var localTop, localBottom, targetHeight = targetSize.height;
        if (isRoot) {
            localBottom = cc.visibleRect.bottom.y;
            localTop = cc.visibleRect.top.y;
        }
        else {
            localBottom = -targetAnchor.y * targetHeight;
            localTop = localBottom + targetHeight;
        }

        // adjust borders according to offsets
        localBottom += widget._isAbsBottom ? widget._bottom : widget._bottom * targetHeight;
        localTop -= widget._isAbsTop ? widget._top : widget._top * targetHeight;

        if (hasTarget) {
            // transform
            localBottom += inverseTranslate.y;
            localBottom *= inverseScale.y;
            localTop += inverseTranslate.y;
            localTop *= inverseScale.y;
        }

        var height, anchorY = anchor.y, scaleY = node.scaleY;
        if (scaleY < 0) {
            anchorY = 1.0 - anchorY;
            scaleY = -scaleY;
        }
        if (widget.isStretchHeight) {
            height = localTop - localBottom;
            if (scaleY !== 0) {
                node.height = height / scaleY;
            }
            y = localBottom + anchorY * height;
        }
        else {
            height = node.height * scaleY;
            if (widget.isAlignVerticalCenter) {
                var localVerticalCenter = widget._isAbsVerticalCenter ? widget._verticalCenter : widget._verticalCenter * targetHeight;
                var targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;
                if (hasTarget) {
                    localVerticalCenter *= inverseScale.y;
                    targetMiddle += inverseTranslate.y;
                    targetMiddle *= inverseScale.y;
                }
                y = targetMiddle + (anchorY - 0.5) * height + localVerticalCenter;
            }
            else if (widget.isAlignBottom) {
                y = localBottom + anchorY * height;
            }
            else {
                y = localTop + (anchorY - 1) * height;
            }
        }
    }

    node.setPosition(x, y);
}

function visitNode (node) {
    var widget = node._widget;
    if (widget) {
        if (CC_DEV) {
            widget._validateTargetInDEV();
        }
        align(node, widget);
        if ((!CC_EDITOR || animationState.animatedSinceLastFrame) && widget.alignMode !== AlignMode.ALWAYS) {
            widget.enabled = false;
        }
        else {
            activeWidgets.push(widget);
        }
    }
    var children = node._children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child._active) {
            visitNode(child);
        }
    }
}

if (CC_EDITOR) {
    var animationState = {
        previewing: false,
        time: 0,
        animatedSinceLastFrame: false,
    };
}

function refreshScene () {
    // check animation editor
    if (CC_EDITOR && !Editor.isBuilder) {
        var AnimUtils = Editor.require('scene://utils/animation');
        var EditMode = Editor.require('scene://edit-mode');
        if (AnimUtils && EditMode) {
            var nowPreviewing = (EditMode.curMode().name === 'animation' && !!AnimUtils.Cache.animation);
            if (nowPreviewing !== animationState.previewing) {
                animationState.previewing = nowPreviewing;
                if (nowPreviewing) {
                    animationState.animatedSinceLastFrame = true;
                    let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
                    if (component) {
                        let animation = component.getAnimationState(AnimUtils.Cache.animation);
                        if (animation) {
                            animationState.time = animation.time;
                        }
                    }
                }
                else {
                    animationState.animatedSinceLastFrame = false;
                }
            }
            else if (nowPreviewing) {
                let component = cc.engine.getInstanceById(AnimUtils.Cache.component);
                if (component) {
                    let animation = component.getAnimationState(AnimUtils.Cache.animation);
                    if (animation && animationState.time !== animation.time) {
                        animationState.animatedSinceLastFrame = true;
                        animationState.time = AnimUtils.Cache.animation.time;
                    }
                }
            }
        }
    }

    var scene = cc.director.getScene();
    if (scene) {
        widgetManager.isAligning = true;
        if (widgetManager._nodesOrderDirty) {
            activeWidgets.length = 0;
            visitNode(scene);
            widgetManager._nodesOrderDirty = false;
        }
        else {
            var i, widget, iterator = widgetManager._activeWidgetsIterator;
            var AnimUtils;
            if (CC_EDITOR &&
                (AnimUtils = Editor.require('scene://utils/animation')) &&
                AnimUtils.Cache.animation) {
                var editingNode = cc.engine.getInstanceById(AnimUtils.Cache.rNode);
                if (editingNode) {
                    for (i = activeWidgets.length - 1; i >= 0; i--) {
                        widget = activeWidgets[i];
                        var node = widget.node;
                        if (widget.alignMode !== AlignMode.ALWAYS &&
                            animationState.animatedSinceLastFrame &&
                            node.isChildOf(editingNode)
                        ) {
                            // widget contains in activeWidgets should aligned at least once
                            widget.enabled = false;
                        }
                        else {
                            align(node, widget);
                        }
                    }
                }
            }
            else {
                // loop reversely will not help to prevent out of sync
                // because user may remove more than one item during a step.
                for (iterator.i = 0; iterator.i < activeWidgets.length; ++iterator.i) {
                    widget = activeWidgets[iterator.i];
                    align(widget.node, widget);
                }
            }
        }
        widgetManager.isAligning = false;
    }

    // check animation editor
    if (CC_EDITOR) {
        animationState.animatedSinceLastFrame = false;
    }
}

var adjustWidgetToAllowMovingInEditor = CC_EDITOR && function (oldPos) {
    if (widgetManager.isAligning) {
        return;
    }
    var newPos = this.node.position;
    var delta = newPos.sub(oldPos);

    var target = this.node._parent;
    var inverseScale = cc.Vec2.ONE;

    if (this._target) {
        target = this._target;
        computeInverseTransForTarget(this.node, target, new cc.Vec2(), inverseScale);
    }

    var targetSize = getReadonlyNodeSize(target);
    var deltaInPercent;
    if (targetSize.width !== 0 && targetSize.height !== 0) {
        deltaInPercent = new cc.Vec2(delta.x / targetSize.width, delta.y / targetSize.height);
    }
    else {
        deltaInPercent = cc.Vec2.ZERO;
    }

    if (this.isAlignTop) {
        this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y) * inverseScale.y;
    }
    if (this.isAlignBottom) {
        this.bottom += (this.isAbsoluteBottom ? delta.y : deltaInPercent.y) * inverseScale.y;
    }
    if (this.isAlignLeft) {
        this.left += (this.isAbsoluteLeft ? delta.x : deltaInPercent.x) * inverseScale.x;
    }
    if (this.isAlignRight) {
        this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x) * inverseScale.x;
    }
    if (this.isAlignHorizontalCenter) {
        this.horizontalCenter += (this.isAbsoluteHorizontalCenter ? delta.x : deltaInPercent.x) * inverseScale.x;
    }
    if (this.isAlignVerticalCenter) {
        this.verticalCenter += (this.isAbsoluteVerticalCenter ? delta.y : deltaInPercent.y) * inverseScale.y;
    }
};

var adjustWidgetToAllowResizingInEditor = CC_EDITOR && function (oldSize) {
    if (widgetManager.isAligning) {
        return;
    }
    var newSize = this.node.getContentSize();
    var delta = cc.v2(newSize.width - oldSize.width, newSize.height - oldSize.height);

    var target = this.node._parent;
    var inverseScale = cc.Vec2.ONE;
    if (this._target) {
        target = this._target;
        computeInverseTransForTarget(this.node, target, new cc.Vec2(), inverseScale);
    }

    var targetSize = getReadonlyNodeSize(target);
    var deltaInPercent;
    if (targetSize.width !== 0 && targetSize.height !== 0) {
        deltaInPercent = new cc.Vec2(delta.x / targetSize.width, delta.y / targetSize.height);
    }
    else {
        deltaInPercent = cc.Vec2.ZERO;
    }

    var anchor = this.node._anchorPoint;

    if (this.isAlignTop) {
        this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y) * (1 - anchor.y) * inverseScale.y;
    }
    if (this.isAlignBottom) {
        this.bottom -= (this.isAbsoluteBottom ? delta.y : deltaInPercent.y) * anchor.y * inverseScale.y;
    }
    if (this.isAlignLeft) {
        this.left -= (this.isAbsoluteLeft ? delta.x : deltaInPercent.x) * anchor.x * inverseScale.x;
    }
    if (this.isAlignRight) {
        this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x) * (1 - anchor.x) * inverseScale.x;
    }
};

var activeWidgets = [];

// updateAlignment from scene to node recursively
function updateAlignment (node) {
    var parent = node._parent;
    if (cc.Node.isNode(parent)) {
        updateAlignment(parent);
    }
    var widget = node._widget ||
                 node.getComponent(cc.Widget);  // node._widget will be null when widget is disabled
    if (widget && parent) {
        align(node, widget);
    }
}

var widgetManager = cc._widgetManager = module.exports = {
    _AlignFlags: {
        TOP: TOP,
        MID: MID,       // vertical center
        BOT: BOT,
        LEFT: LEFT,
        CENTER: CENTER, // horizontal center
        RIGHT: RIGHT
    },
    isAligning: false,
    _nodesOrderDirty: false,
    _activeWidgetsIterator: new cc.js.array.MutableForwardIterator(activeWidgets),

    init: function (director) {
        director.on(cc.Director.EVENT_AFTER_UPDATE, refreshScene);

        if (CC_EDITOR && cc.engine) {
            cc.engine.on('design-resolution-changed', this.onResized.bind(this));
        }
        else {
            if (cc.sys.isMobile) {
                window.addEventListener('resize', this.onResized.bind(this));
            }
            else {
                cc.view.on('canvas-resize', this.onResized, this);
            }
        }
    },
    add: function (widget) {
        widget.node._widget = widget;
        this._nodesOrderDirty = true;
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.on(Event.POSITION_CHANGED, adjustWidgetToAllowMovingInEditor, widget);
            widget.node.on(Event.SIZE_CHANGED, adjustWidgetToAllowResizingInEditor, widget);
        }
    },
    remove: function (widget) {
        widget.node._widget = null;
        this._activeWidgetsIterator.remove(widget);
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.off(Event.POSITION_CHANGED, adjustWidgetToAllowMovingInEditor, widget);
            widget.node.off(Event.SIZE_CHANGED, adjustWidgetToAllowResizingInEditor, widget);
        }
    },
    onResized () {
        var scene = cc.director.getScene();
        if (scene) {
            this.refreshWidgetOnResized(scene);
        }
    },
    refreshWidgetOnResized (node) {
        var widget = cc.Node.isNode(node) && node.getComponent(cc.Widget);
        if (widget) {
            if (widget.alignMode === AlignMode.ON_WINDOW_RESIZE) {
                widget.enabled = true;
            }
        }

        var children = node._children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this.refreshWidgetOnResized(child);
        }
    },
    updateAlignment: updateAlignment,
    AlignMode: AlignMode,
};

if (CC_EDITOR) {
    module.exports._computeInverseTransForTarget = computeInverseTransForTarget;
    module.exports._getReadonlyNodeSize = getReadonlyNodeSize;
}
