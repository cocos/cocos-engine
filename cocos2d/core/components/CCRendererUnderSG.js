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
 * The base rendering component which will attach a leaf node to the cocos2d scene graph.
 *
 * @class _RendererUnderSG
 * @extends _SGComponent
 * @private
 */
var RendererUnderSG = cc.Class({
    extends: require('./CCSGComponent'),

    ctor: function () {
        /**
         * Reference to the instance of _ccsg.Node
         * If it is possible to return null from your overloaded _createSgNode,
         * then you should always check for null before using this property and reimplement onLoad.
         *
         * @property {_ccsg.Node} _sgNode
         * @private
         */
        this._sgNode = this._createSgNode();
        if (this._sgNode) {
            // retain immediately
            // will be released in onDestroy
            this._sgNode.retain();
        }
    },

    // You should reimplement this function if your _sgNode maybe null.
    onLoad: function () {
        this._super();
        this._appendSgNode(this._sgNode);
    },
    onEnable: function () {
        if (this._sgNode) {
            this._sgNode.setVisible(true);
        }
    },
    onDisable: function () {
        if (this._sgNode) {
            this._sgNode.setVisible(false);
        }
    },

    _appendSgNode: function (sgNode) {
        if ( !sgNode ) {
            return;
        }

        if ( !this.enabled ) {
            sgNode.setVisible(false);
        }
        var node = this.node;
        sgNode.setColor(node._color);
        if ( !node._cascadeOpacityEnabled ) {
            sgNode.setOpacity(node._opacity);
        }

        sgNode.setAnchorPoint(node._anchorPoint);
        sgNode.ignoreAnchorPointForPosition(node.__ignoreAnchor);

        sgNode.setOpacityModifyRGB(node._opacityModifyRGB);

        // set z order to -1 to make sure component will rendered before all of its entity's children.

        sgNode.setLocalZOrder(-1);

        var sgParent = node._sgNode;
        sgParent.addChild(sgNode);
    }
});

cc._RendererUnderSG = module.exports = RendererUnderSG;
