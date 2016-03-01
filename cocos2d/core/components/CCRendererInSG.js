/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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
        else {
            cc.error('Not support for asynchronous creating node in SG');
        }
        
        // The replacement node used when this component disabled 
        this._plainNode = new _ccsg.Node();
    },

    onEnable: function () {
        this._replaceSgNode(this._sgNode);
        this.node._ignoreAnchor = true;
    },
    onDisable: function () {
        this._replaceSgNode(this._plainNode);
        this.node._ignoreAnchor = false;
    },
    onDestroy: function () {
        this._super();
        
        var released = this.node._sgNode;
        if (this._sgNode !== released) {
            this._sgNode.release();
        }
        else {  // if (this._plainNode !== released) {
            this._plainNode.release();
        }
    },

    _replaceSgNode: function (sgNode) {
        if ( !(sgNode instanceof _ccsg.Node) && CC_EDITOR) {
            throw new Error("Invalid sgNode. It must be an instance of _ccsg.Node");
        }

        var node = this.node;
        var replaced = node._sgNode;

        if (replaced === sgNode && CC_EDITOR) {
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
        if (cc.renderer) {
            cc.renderer.childrenOrderDirty = parentNode._reorderChildDirty = true;
        }

        // apply node's property

        node._sgNode = sgNode;
        node._updateSgNode();
    },
});

cc._RendererInSG = module.exports = RendererInSG;
