var NodeWrapper = require('./node');

var DrawNodeWrapper = cc.Class({
    name: 'cc.DrawNodeWrapper',
    extends: NodeWrapper,

    createNode: function(node){
        node = node || new cc.DrawNode();

        NodeWrapper.prototype.createNode.call(this, node);

        return node;
    }

});

cc.DrawNodeWrapper = module.exports = DrawNodeWrapper;
