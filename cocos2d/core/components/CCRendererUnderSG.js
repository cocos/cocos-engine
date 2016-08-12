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
 * The base rendering component which will attach a leaf node to the cocos2d scene graph.
 *
 * @class _RendererUnderSG
 * @extends _SGComponent
 * @private
 */
var RendererUnderSG = cc.Class({
    extends: require('./CCSGComponent'),
    name: 'cc._RendererUnderSG',

    ctor: function () {
        /**
         * Reference to the instance of _ccsg.Node
         * If it is possible to return null from your overloaded _createSgNode,
         * then you should always check for null before using this property and reimplement `__preload`.
         *
         * @property {_ccsg.Node} _sgNode
         * @private
         */
        var sgNode = this._sgNode = this._createSgNode();
        if (sgNode) {
            if (CC_JSB) {
                // retain immediately
                // will be released in onDestroy
                sgNode.retain();
            }
            sgNode.setVisible(false);   // should not visible before onEnable
        }
    },

    // You should reimplement this function if your _sgNode maybe null,
    // and remember to hide the sgNode if component.enabledInHierarchy is false.
    __preload: function () {
        this._initSgNode();
        this._registSizeProvider();
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

    onDestroy: function () {
        if ( this.node._sizeProvider === this._sgNode ) {
            this.node._sizeProvider = null;
        }
        this._removeSgNode();
    },

    _appendSgNode: function (sgNode) {
        if ( !sgNode ) {
            return;
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
