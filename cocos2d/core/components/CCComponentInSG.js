var SceneGraphHelper = require('../utils/scene-graph-helper');

/**
 * Component in scene graph.
 * This is the base class for components which will attach a node to the cocos2d scene graph.
 *
 * You should override:
 * - _createSgNode
 *
 * @class _ComponentInSG
 * @extends Component
 */
var ComponentInSG = cc.Class({
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        executeInEditMode: true,
        disallowMultiple: true
    },

    ctor: function () {
        this._sgNode = null;
    },

    onLoad: function () {
        var sgNode = this._createSgNode();
        this._appendSgNode(sgNode);
        if ( !this.node._sizeProvider ) {
            this.node._sizeProvider = sgNode;
        }
    },
    onEnable: function () {
        if (this._sgNode) {
            this._sgNode.visible = true;
        }
    },
    onDisable: function () {
        if (this._sgNode) {
            this._sgNode.visible = false;
        }
    },
    onDestroy: function () {
        if ( this.node._sizeProvider === this._sgNode ) {
            this.node._sizeProvider = null;
        }
        this._removeSgNode();
    },

    /**
     * Create and returns your new scene graph node (SGNode) to append to scene graph.
     * You should call the setContentSize of the SGNode if its size should be the same with the node's.
     *
     * @method _createSgNode
     * @return {cc.Node}
     * @private
     */
    _createSgNode: null,

    _removeSgNode: SceneGraphHelper.removeSgNode,

    _appendSgNode: function (sgNode) {
        var node = this.node;

        sgNode.setColor(node._color);
        if ( !node._cascadeOpacityEnabled ) {
            sgNode.setOpacity(node._opacity);
        }

        sgNode.setAnchorPoint(node._anchorPoint);
        sgNode.ignoreAnchorPointForPosition(node._ignoreAnchorPointForPosition);

        sgNode.setOpacityModifyRGB(node._opacityModifyRGB);

        // set z order to -1 to make sure component will rendered before all of its entity's children.

        sgNode.setLocalZOrder(-1);

        var sgParent = node._sgNode;
        sgParent.addChild(sgNode);

        // retain immediately
        sgNode.retain();
        this._sgNode = sgNode;
    }
});

cc._ComponentInSG = module.exports = ComponentInSG;
