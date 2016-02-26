var SceneGraphHelper = require('../utils/scene-graph-helper');

/**
 * Rendering component in scene graph. This is the base class for RendererBelowSG and RendererInSG.
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

    editor: CC_EDITOR && {
        executeInEditMode: true,
        disallowMultiple: true
    },

    onLoad: function () {
        this._initSgNode();
        var sgNode = this._sgNode;
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = sgNode;
        }
    },
    onDestroy: function () {
        if ( this.node._sizeProvider === this._sgNode ) {
            this.node._sizeProvider = null;
        }
        this._removeSgNode();
    },

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
});

cc._SGComponent = module.exports = SGComponent;
