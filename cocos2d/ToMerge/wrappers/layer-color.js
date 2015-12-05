
var LayerWrapper = require('./layer');

var LayerColorWrapper = cc.Class({
    name: 'cc.LayerColorWrapper',
    extends: LayerWrapper,

    createNode: function (node) {
        node = node || new cc.LayerColor();

        LayerWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.LayerColorWrapper = module.exports = LayerColorWrapper;
