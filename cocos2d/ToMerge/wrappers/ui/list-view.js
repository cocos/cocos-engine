
var ScrollViewWrapper = require('./scroll-view');

var ListViewWrapper = cc.Class({
    name: 'cc.ListViewWrapper',
    extends: ScrollViewWrapper,

    createNode: function (node) {
        node = node || new ccui.ListView();

        ScrollViewWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.ListViewWrapper = module.exports = ListViewWrapper;
