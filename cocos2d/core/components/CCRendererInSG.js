
/**
 * Rendering component in scene graph.
 * This is the base class for components which maintains a node in the middle of cocos2d scene graph.
 *
 * @class _RendererInSG
 * @extends _SGComponent
 * @private
 */
var RendererInSG = cc.Class({
    extends: require('./CCSGComponent'),

    ctor: function () {
        /**
         * The current active _ccsg.Node for the entity where this component belongs
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
        
        // origin nodes
        this._customNode = this._sgNode;
        this._plainNode = new _ccsg.Node();
    },

    onEnable: function () {
        this._replaceSgNode(this._customNode);
        this.node.ignoreAnchor = true;
    },
    onDisable: function () {
        this._replaceSgNode(this._plainNode);
        this.node.ignoreAnchor = false;
    },
    onDestroy: function () {
        this._super();
        
        var released = this._sgNode;
        if (this._customNode !== released) {
            this._customNode.release();
        }
        else {
            this._plainNode.release();
        }
    },

    // returns the node being replaced
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
        
        // apply node's property
        
        sgNode.setPosition(node._position);
        sgNode.setRotationX(node._rotationX);
        sgNode.setRotationY(node._rotationY);
        sgNode.setScale(node._scaleX, node._scaleY);
        sgNode.setSkewX(node._skewX);
        sgNode.setSkewY(node._skewY);
        sgNode.setAnchorPoint(node._anchorPoint);
        sgNode.ignoreAnchorPointForPosition(node._ignoreAnchorPointForPosition);

        sgNode.setLocalZOrder(node._localZOrder);
        sgNode.setGlobalZOrder(node._globalZOrder);

        sgNode.setVisible(node._active);
        sgNode.setColor(node._color);
        sgNode.setOpacity(node._opacity);
        sgNode.setOpacityModifyRGB(node._opacityModifyRGB);
        sgNode.setCascadeOpacityEnabled(node._cascadeOpacityEnabled);
        sgNode.setTag(node._tag);

        // rebuild scene graph
        
        // replace children
        var children = replaced.getChildren().slice();
        replaced.removeAllChildren();
        sgNode.removeAllChildren();
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

        // did
        node._sgNode = sgNode;
    },
});

cc._RendererInSG = module.exports = RendererInSG;
