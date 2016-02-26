
/**
 * Rendering component in scene graph.
 * This is the base class for components which will attach a leaf node to the cocos2d scene graph.
 *
 * @class _RendererBelowSG
 * @extends _SGComponent
 * @private
 */
var RendererBelowSG = cc.Class({
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
        sgNode.ignoreAnchorPointForPosition(node._ignoreAnchorPointForPosition);

        sgNode.setOpacityModifyRGB(node._opacityModifyRGB);

        // set z order to -1 to make sure component will rendered before all of its entity's children.

        sgNode.setLocalZOrder(-1);

        var sgParent = node._sgNode;
        sgParent.addChild(sgNode);
    }
});

cc._RendererBelowSG = module.exports = RendererBelowSG;
