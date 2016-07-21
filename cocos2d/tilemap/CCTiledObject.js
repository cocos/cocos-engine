/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

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

var TiledObject = cc.Class({
    name: 'cc.TiledObject',

    // Inherits from the abstract class directly,
    // because TiledLayer not create or maintains the sgNode by itself.
    extends: cc._SGComponent,

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
        if (this.node._sizeProvider === this._sgNode) {
            this.node._sizeProvider = null;
        }
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if (!sgNode) {
            return;
        }
        if (!this.enabledInHierarchy) {
            sgNode.setVisible(false);
        }
        this._registSizeProvider();
        var node = this.node;
        sgNode.setAnchorPoint(node.getAnchorPoint());
    },

    _replaceSgNode: function (sgNode) {
        if (sgNode === this._sgNode) {
            return;
        }

        // Remove the sgNode before
        this._removeSgNode();
        if (this.node._sizeProvider === this._sgNode) {
            this.node._sizeProvider = null;
        }

        if (sgNode && sgNode.isTmxObject) {
            this._sgNode = sgNode;
            if (CC_JSB) {
                // retain the new sgNode, it will be released in _removeSgNode
                sgNode.retain();
            }

            this._initSgNode();
        } else {
            this._sgNode = null;
        }
    },
});

cc.TiledObject = module.exports = TiledObject;
