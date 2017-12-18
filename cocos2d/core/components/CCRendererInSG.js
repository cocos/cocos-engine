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

/**
 * Rendering component in scene graph.
 * Maintains a node which will be the scene graph of component's Node.
 *
 * @class _RendererInSG
 * @extends _SGComponent
 * @private
 */
var RendererInSG = cc.Class({
    extends: require('./CCSGComponent'),
    name: 'cc._RendererInSG',

    ctor: function () {
        /**
         * The Reference to the instance of _ccsg.Node used when this component enabled
         * @property {_ccsg.Node} _sgNode
         * @private
         */
        var sgNode = this._sgNode = this._createSgNode();
        sgNode.setVisible(false);
        if (CC_EDITOR && !sgNode) {
            cc.errorID(1627);
        }
        if (CC_JSB) {
            // retain immediately
            // will be released in onDestroy
            sgNode.retain();
        }

        // The replacement node used when this component disabled
        this._plainNode = new _ccsg.Node();
        if (CC_JSB) {
            this._plainNode.retain();
        }
    },

    __preload: function () {
        this._initSgNode();
        if (CC_EDITOR) {
            var sgSize = this._sgNode.getContentSize();
            // sgSize is not a Vec2 in JSB
            if (sgSize.width !== 0 || sgSize.height !== 0) {
                cc.errorID(1628);
            }
        }
    },

    onEnable: function () {
        if (CC_JSB && cc.director._actionManager && cc.director._actionManager.getNumberOfRunningActionsInTarget(this.node) > 0) {
            cc.errorID(1629, this.node.name);
            cc.errorID(1630);
            cc.errorID(1631);
        }
        this._replaceSgNode(this._sgNode);
    },

    onDisable: function () {
        this._replaceSgNode(this._plainNode);
    },

    onDestroy: function () {
        this._removeSgNode();
        if (CC_JSB) {
            var releasedByNode = this.node._sgNode;
            if (this._plainNode !== releasedByNode) {
                this._plainNode.release();
                this._plainNode = null;
            }
        }
    },

    _replaceSgNode: function (sgNode) {
        if (CC_EDITOR && !(sgNode instanceof _ccsg.Node)) {
            throw new Error("Invalid sgNode. It must be an instance of _ccsg.Node");
        }

        var node = this.node;
        var replaced = node._sgNode;
        replaced._entity = null;

        if (CC_EDITOR && replaced === sgNode) {
            cc.warnID(1624);
            return;
        }

        // rebuild scene graph

        // replace children
        var children = replaced.getChildren().slice();
        replaced.removeAllChildren(false);
        if (sgNode.getChildrenCount() > 0) {
            if (CC_EDITOR) {
                cc.warnID(1625);
            }
            sgNode.removeAllChildren(false);
        }
        for (var i = 0, len = children.length; i < len; ++i) {
            sgNode.addChild(children[i]);
        }

        // replace parent
        var parentNode = replaced.getParent();
        if (parentNode) {
            if ( !CC_JSB ) {
                parentNode.removeChild(replaced, false);
                parentNode.addChild(sgNode);
                sgNode._arrivalOrder = replaced._arrivalOrder;
                cc.renderer.childrenOrderDirty = parentNode._reorderChildDirty = true;
            } else {
                if (cc.runtime) {
                    parentNode.removeChild(replaced, false);
                    parentNode.addChild(sgNode);
                    sgNode.arrivalOrder = replaced.arrivalOrder;
                } else {
                    parentNode.insertChildBefore(sgNode, replaced);
                    parentNode.removeChild(replaced, false);
                }
            }
        }
        // replaced.release();

        // apply node's property
        node._sgNode = sgNode;
        node._sgNode._entity = node;
        node._updateSgNode();
    },
});

cc._RendererInSG = module.exports = RendererInSG;
