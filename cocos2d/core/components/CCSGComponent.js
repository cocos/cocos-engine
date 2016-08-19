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

var SceneGraphHelper = require('../utils/scene-graph-helper');

/**
 * The base class for all rendering component in scene graph.
 *
 * You should override:
 * - _createSgNode
 * - _initSgNode
 *
 * @class _SGComponent
 * @extends Component
 * @private
 */
var SGComponent = cc.Class({
    extends: require('./CCComponent'),
    name: 'cc._SGComponent',

    editor: CC_EDITOR && {
        executeInEditMode: true,
        disallowMultiple: true
    },
    
    properties: {
        _sgNode: {
            default: null,
            serializable: false
        }
    },

    //__preload: function () {
    //    this._initSgNode();
    //},
    //onDestroy: function () {
    //    this._removeSgNode();
    //},

    /**
     * Create and returns your new scene graph node (SGNode) to add to scene graph.
     * You should call the setContentSize of the SGNode if its size should be the same with the node's.
     *
     * @method _createSgNode
     * @return {_ccsg.Node}
     * @private
     */
    _createSgNode: null,

    /**
     * @method _initSgNode
     * @private
     */
    _initSgNode: null,
    
    /**
     * @method _removeSgNode
     * @private
     */
    _removeSgNode: SceneGraphHelper.removeSgNode,

    _registSizeProvider: function () {
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = this._sgNode;
        }
        else if (CC_DEV) {
            var name = cc.js.getClassName(this);
            if (this.node.getComponent(cc.Canvas)) {
                cc.error('Should not add renderer component (%s) to a Canvas node.', name);
            }
            else {
                cc.error('Should not add %s to a node which size is already used by its other component.', name);
            }
        }
    }
});

cc._SGComponent = module.exports = SGComponent;
