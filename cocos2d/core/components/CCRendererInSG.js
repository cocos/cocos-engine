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

    ctor: function () {
        /**
         * The Reference to the instance of _ccsg.Node used when this component enabled
         * @property {_ccsg.Node} _sgNode
         * @private
         */
        this._sgNode = this._createSgNode();
        if (this._sgNode) {
            // retain immediately
            // will be released in onDestroy
            this._sgNode.retain();
        }
        else if (CC_EDITOR) {
            cc.error('Not support for asynchronous creating node in SG');
        }
        
        // The replacement node used when this component disabled 
        this._plainNode = new _ccsg.Node();
        this._plainNode.retain();
    },

    onLoad: function () {
        this._initSgNode();
        if (CC_EDITOR) {
            var sgSize = this._sgNode.getContentSize();
            // sgSize is not a Vec2 in JSB
            if (sgSize.x !== 0 || sgSize.y !== 0) {
                cc.error('Renderer error: Size of the cc._RendererInSG._sgNode must be zero');
            }
        }
    },

    onEnable: function () {
        this._replaceSgNode(this._sgNode);

        // can not ignore anchor in render tree due to rotation bug which can't be fixed in JSB
        // see https://github.com/cocos-creator/engine/pull/610
        //this.node._ignoreAnchor = true;
    },

    onDisable: function () {
        this._replaceSgNode(this._plainNode);
        //this.node._ignoreAnchor = false;
    },

    onDestroy: function () {
        this._removeSgNode();
        var releasedByNode = this.node._sgNode;
        if (this._plainNode !== releasedByNode) {
            this._plainNode.release();
        }
    },

    _replaceSgNode: function (sgNode) {
        if (CC_EDITOR && !(sgNode instanceof _ccsg.Node)) {
            throw new Error("Invalid sgNode. It must be an instance of _ccsg.Node");
        }

        var node = this.node;
        var replaced = node._sgNode;

        if (CC_EDITOR && replaced === sgNode) {
            cc.warn('The same sgNode');
            return;
        }
        
        // rebuild scene graph
        
        // replace children
        var children = replaced.getChildren().slice();
        replaced.removeAllChildren();
        if (sgNode.getChildrenCount() > 0) {
            if (CC_EDITOR) {
                cc.warn('The replacement sgNode should not contain any child.');
            }
            sgNode.removeAllChildren();
        }
        for (var i = 0, len = children.length; i < len; ++i) {
            sgNode.addChild(children[i]);
        }
        
        // replace parent
        var parentNode = replaced.getParent();
        parentNode.removeChild(replaced);
        parentNode.addChild(sgNode);
        sgNode.arrivalOrder = replaced.arrivalOrder;
        if ( !CC_JSB ) {
            cc.renderer.childrenOrderDirty = parentNode._reorderChildDirty = true;
        }

        // apply node's property

        node._sgNode = sgNode;
        node._updateSgNode();
    },
});

cc._RendererInSG = module.exports = RendererInSG;
