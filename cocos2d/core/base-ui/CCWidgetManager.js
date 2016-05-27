/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var TOP     = 1 << 0;
var MID     = 1 << 1;   // vertical center
var BOT     = 1 << 2;
var LEFT    = 1 << 3;
var CENTER  = 1 << 4;   // horizontal center
var RIGHT   = 1 << 5;
var HORIZONTAL = LEFT | CENTER | RIGHT;
var VERTICAL = TOP | MID | BOT;

// returns a readonly size of the parent node
function getParentSize (parent) {
    if (parent instanceof cc.Scene) {
        return CC_EDITOR ? cc.engine.getDesignResolutionSize() : cc.visibleRect;
    }
    else if (!parent._sizeProvider || (parent._sizeProvider instanceof _ccsg.Node)) {
        return parent._contentSize;
    }
    else {
        return parent.getContentSize();
    }
}

// align to borders by adjusting node's position and size (ignore rotation)
function alignToParent (node, widget) {
    var visibleRect;

    var parent = node._parent;
    var parentSize = getParentSize(parent);
    var parentAnchor = parent._anchorPoint;

    var isRoot = !CC_EDITOR && parent instanceof cc.Scene;
    var x = node._position.x, y = node._position.y;
    var anchor = node.getAnchorPoint();

    if (widget._alignFlags & HORIZONTAL) {

        var parentWidth = parentSize.width;
        var localLeft, localRight;
        if (isRoot) {
            visibleRect = cc.visibleRect;
            localLeft = visibleRect.left.x;
            localRight = visibleRect.right.x;
        }
        else {
            localLeft = -parentAnchor.x * parentWidth;
            localRight = localLeft + parentWidth;
        }

        // adjust borders according to offsets

        localLeft += widget._isAbsLeft ? widget._left : widget._left * parentWidth;
        localRight -= widget._isAbsRight ? widget._right : widget._right * parentWidth;

        //

        var width, anchorX = anchor.x, scaleX = node._scaleX;
        if (scaleX < 0) {
            anchorX = 1.0 - anchorX;
            scaleX = -scaleX;
        }
        if (widget.isStretchWidth) {
            width = localRight - localLeft;
            node.width = width / scaleX;
            x = localLeft + anchorX * width;
        }
        else {
            width = node.width * scaleX;
            if (widget.isAlignHorizontalCenter) {
                var parentCenter = (0.5 - parentAnchor.x) * parentWidth;    // no offset
                x = parentCenter + (anchorX - 0.5) * width;
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

        var parentHeight = parentSize.height;
        var localTop, localBottom;
        if (isRoot) {
            visibleRect = cc.visibleRect;
            localBottom = visibleRect.bottom.y;
            localTop = visibleRect.top.y;
        }
        else {
            localBottom = -parentAnchor.y * parentHeight;
            localTop = localBottom + parentHeight;
        }

        // adjust borders according to offsets

        localBottom += widget._isAbsBottom ? widget._bottom : widget._bottom * parentHeight;
        localTop -= widget._isAbsTop ? widget._top : widget._top * parentHeight;

        //

        var height, anchorY = anchor.y, scaleY = node._scaleY;
        if (scaleY < 0) {
            anchorY = 1.0 - anchorY;
            scaleY = -scaleY;
        }
        if (widget.isStretchHeight) {
            height = localTop - localBottom;
            node.height = height / scaleY;
            y = localBottom + anchorY * height;
        }
        else {
            height = node.height * scaleY;
            if (widget.isAlignVerticalCenter) {
                var parentMiddle = (0.5 - parentAnchor.y) * parentHeight;    // no offset
                y = parentMiddle + (anchorY - 0.5) * height;
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
        alignToParent(node, widget);
        widgetManager._nodesWithWidget.push(node);
        if (!CC_EDITOR && widget.isAlignOnce) {
            widget.enabled = false;
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

function refreshScene () {
    var scene = cc.director.getScene();
    if (scene) {
        widgetManager.isAligning = true;
        if (widgetManager._nodesOrderDirty) {
            widgetManager._nodesWithWidget.length = 0;
            visitNode(scene);
            widgetManager._nodesOrderDirty = false;
        } else {
            var nodes = widgetManager._nodesWithWidget;
            for (var i = 0, len = nodes.length; i < len; i++) {
                var node = nodes[i];
                alignToParent(node, node._widget);
            }
        }
        widgetManager.isAligning = false;
    }
}

var adjustWidgetToAllowMovingInEditor = CC_EDITOR && function (event) {
    if (widgetManager.isAligning) {
        return;
    }
    var oldPos = event.detail;
    var newPos = this.node.position;
    var delta = newPos.sub(oldPos);
    var parentSize = getParentSize(this.node._parent);
    var deltaInPercent;
    if (parentSize.width !== 0 && parentSize.height !== 0) {
        deltaInPercent = cc.v2(delta.x / parentSize.width, delta.y / parentSize.height);
    }
    else {
        deltaInPercent = cc.v2();
    }

    if (this.isAlignTop) {
        this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y);
    }
    if (this.isAlignBottom) {
        this.bottom += (this.isAbsoluteBottom ? delta.y : deltaInPercent.y);
    }
    if (this.isAlignLeft) {
        this.left += (this.isAbsoluteLeft ? delta.x : deltaInPercent.x);
    }
    if (this.isAlignRight) {
        this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x);
    }
    if (this.isAlignHorizontalCenter) {
        if (oldPos.x !== newPos.x) {
            this.isAlignHorizontalCenter = false;
        }
    }
    if (this.isAlignVerticalCenter) {
        if (oldPos.y !== newPos.y) {
            this.isAlignVerticalCenter = false;
        }
    }
};

var adjustWidgetToAllowResizingInEditor = CC_EDITOR && function (event) {
    if (widgetManager.isAligning) {
        return;
    }
    var oldSize = event.detail;
    var newSize = this.node.getContentSize();
    // delta size
    var delta = cc.p(newSize.width - oldSize.width, newSize.height - oldSize.height);
    var parentSize = getParentSize(this.node._parent);
    var deltaInPercent;
    if (parentSize.width !== 0 && parentSize.height !== 0) {
        deltaInPercent = cc.v2(delta.x / parentSize.width, delta.y / parentSize.height);
    }
    else {
        deltaInPercent = cc.v2();
    }

    var anchor = this.node.getAnchorPoint();

    if (this.isAlignTop) {
        this.top -= (this.isAbsoluteTop ? delta.y : deltaInPercent.y) * (1 - anchor.y);
    }
    if (this.isAlignBottom) {
        this.bottom -= (this.isAbsoluteBottom ? delta.y : deltaInPercent.y) * anchor.y;
    }
    if (this.isAlignLeft) {
        this.left -= (this.isAbsoluteLeft ? delta.x : deltaInPercent.x) * anchor.x;
    }
    if (this.isAlignRight) {
        this.right -= (this.isAbsoluteRight ? delta.x : deltaInPercent.x) * (1 - anchor.x);
    }
    if (this.isAlignHorizontalCenter) {
        if (delta.x !== 0 && anchor.x !== 0.5) {
            this.isAlignHorizontalCenter = false;
        }
    }
    if (this.isAlignVerticalCenter) {
        if (delta.y !== 0 && anchor.y !== 0.5) {
            this.isAlignVerticalCenter = false;
        }
    }
};


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
    _nodesWithWidget: [],
    init: function (director) {
        director.on(cc.Director.EVENT_BEFORE_VISIT, refreshScene);
    },
    add: function (widget) {
        widget.node._widget = widget;
        this._nodesOrderDirty = true;
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.on('position-changed', adjustWidgetToAllowMovingInEditor, widget);
            widget.node.on('size-changed', adjustWidgetToAllowResizingInEditor, widget);
        }
    },
    remove: function (widget) {
        widget.node._widget = null;
        var index = this._nodesWithWidget.indexOf(widget.node);
        if (index > -1) {
            this._nodesWithWidget.splice(index, 1);
        }
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.off('position-changed', adjustWidgetToAllowMovingInEditor, widget);
            widget.node.off('size-changed', adjustWidgetToAllowResizingInEditor, widget);
        }
    },
    _getParentSize: getParentSize
};
