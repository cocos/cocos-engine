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

function alignToParent (node, widget) {
    var parent = node._parent;
    var parentSize = getParentSize(parent);
    var parentWidth = parentSize.width;
    var parentHeight = parentSize.height;
    var parentAnchor = parent._anchorPoint;
    var localLeft, localRight, localTop, localBottom;
    if (!CC_EDITOR && parent instanceof cc.Scene) {
        var visibleRect = cc.visibleRect;
        localLeft = visibleRect.left.x;
        localRight = visibleRect.right.x;
        localBottom = visibleRect.bottom.y;
        localTop = visibleRect.top.y;
    }
    else {
        localLeft = -parentAnchor.x * parentWidth;
        localRight = localLeft + parentWidth;
        localBottom = -parentAnchor.y * parentHeight;
        localTop = localBottom + parentHeight;
    }

    // adjust borders according to offsets

    localLeft += widget._isAbsLeft ? widget._left : widget._left * parentWidth;
    localRight -= widget._isAbsRight ? widget._right : widget._right * parentWidth;
    localBottom += widget._isAbsBottom ? widget._bottom : widget._bottom * parentHeight;
    localTop -= widget._isAbsTop ? widget._top : widget._top * parentHeight;

    // align to borders by adjusting node's position and size (ignore rotation and scaling)

    var anchor = node.getAnchorPoint();

    var width, x = node._position.x, anchorX = anchor.x;
    if (widget.isStretchWidth) {
        width = localRight - localLeft;
        node.width = width;
        x = localLeft + anchorX * width;
    }
    else {
        width = node.width;
        if (widget.isAlignHorizontalCenter) {
            var parentCenter = (0.5 - parentAnchor.x) * parentWidth;    // no offset
            x = parentCenter + (anchorX - 0.5) * width;
        }
        else if (widget.isAlignLeft) {
            x = localLeft + anchorX * width;
        }
        else if (widget.isAlignRight) {
            x = localRight + anchorX * width - width;
        }
    }

    var height, y = node._position.y, anchorY = anchor.y;
    if (widget.isStretchHeight) {
        height = localTop - localBottom;
        node.height = height;
        y = localBottom + anchorY * height;
    }
    else {
        height = node.height;
        if (widget.isAlignVerticalCenter) {
            var parentMiddle = (0.5 - parentAnchor.y) * parentHeight;    // no offset
            y = parentMiddle + (anchorY - 0.5) * height;
        }
        else if (widget.isAlignBottom) {
            y = localBottom + anchorY * height;
        }
        else if (widget.isAlignTop) {
            y = localTop + anchorY * height - height;
        }
    }

    node.setPosition(x, y);
}

function visitNode (node) {
    var widget = node._widget;
    if (widget) {
        alignToParent(node, widget);
    }
    var children = node._children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child._active) {
            visitNode(child);
        }
    }
}

function visit () {
    var scene = cc.director.getScene();
    if (scene) {
        widgetManager.isAligning = true;
        visitNode(scene);
        widgetManager.isAligning = false;
    }
}

var adjustWidgetToFitPositionInEditor = CC_EDITOR && function (event) {
    if (widgetManager.isAligning) {
        return;
    }
    var oldPos = event.detail;
    var newPos = this.node.position;
    var delta = newPos.sub(oldPos);
    if (this.isAlignTop) {
        this.top -= delta.y;
    }
    if (this.isAlignBottom) {
        this.bottom += delta.y;
    }
    if (this.isAlignLeft) {
        this.left += delta.x;
    }
    if (this.isAlignRight) {
        this.right -= delta.x;
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

var widgetManager = cc._widgetManager = {
    isAligning: false,
    init: function (director) {
        director.on(cc.Director.EVENT_BEFORE_VISIT, visit);
    },
    add: function (widget) {
        widget.node._widget = widget;
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.on('position-changed', adjustWidgetToFitPositionInEditor, widget);
        }
    },
    remove: function (widget) {
        widget.node._widget = null;
        if (CC_EDITOR && !cc.engine.isPlaying) {
            widget.node.off('position-changed', adjustWidgetToFitPositionInEditor, widget);
        }
    },
    _getParentSize: getParentSize
};
