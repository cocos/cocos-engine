
var LayoutWrapper = require('./layout');

var PageViewWrapper = cc.Class({
    name: 'cc.PageViewWrapper',
    extends: LayoutWrapper,

    onChildSiblingIndexChanged: function () {
        var pages = this.targetN._pages;
        pages.sort(function (a, b) {
            return a.getOrderOfArrival() > b.getOrderOfArrival() ? 1 : -1;
        });

        LayoutWrapper.prototype.onChildSiblingIndexChanged.call(this);
    },

    addChildN: function (child) {
        if (child instanceof ccui.Layout) {
            this.targetN.addPage(child);
        }
        else {
            this.targetN.addChild(child);
        }
    },

    removeChildN: function (child) {
        if (child instanceof ccui.Layout) {
            this.targetN.removePage(child);
        }
        else {
            this.targetN.removeChild(child);
        }
    },

    createNode: function (node) {
        node = node || new ccui.PageView();

        LayoutWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.PageViewWrapper = module.exports = PageViewWrapper;
