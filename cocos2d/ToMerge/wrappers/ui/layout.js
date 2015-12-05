var NodeWrapper = require('../node');
var WidgetWrapper = require('./widget');

var LayoutWrapper = cc.Class({
    name: 'cc.LayoutWrapper',
    extends: WidgetWrapper,

    properties: {
        clippingEnabled: {
            get: function () {
                return this.targetN.clippingEnabled;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.clippingEnabled = value;

                    cc.renderer.childrenOrderDirty = true;
                    if (CC_EDITOR) {
                        cc.engine.repaintInEditMode();
                    }
                }
                else {
                    cc.error('The new clippingEnabled must be boolean');
                }
            }
        },

        layoutType: {
            get: function () {
                return this.targetN.layoutType;
            },
            set: function (value) {
                if (typeof value === 'number' && !isNaN(value)) {
                    this.targetN.layoutType = value;
                    this.updateChildLayoutType();

                    this.doLayout();
                }
                else {
                    cc.error('The new layoutType must be number');
                }
            },
            type: ccui.Layout.Type
        },

        _layoutType: {
            default: 0
        },

        _clippingEnabled: {
            default: null
        }
    },

    updateChildLayoutType: function () {
        var layoutType = this.layoutType;
        this.children.forEach( function (child) {
            child.widgetLayoutType = layoutType;
        });
    },

    addChildN: function (child) {
        var wrapper = cc.getWrapper(child);
        wrapper.widgetLayoutType = this.layoutType;
        NodeWrapper.prototype.addChildN.call(this, child);
    },

    canAddChildN: function (child) {
        if ( !(child instanceof ccui.Widget) ) {
            cc.error('Layout can only add ccui.Widget as a child');
            return false;
        }

        return true;
    },

    onChildSiblingIndexChanged: function () {
        this.doLayout();
    },

    doLayout: function () {
        this.targetN.requestDoLayout();
        cc.renderer.childrenOrderDirty = true;
        if (CC_EDITOR) {
            cc.engine.repaintInEditMode();
        }
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._layoutType = this.layoutType;
        this._clippingEnabled = this.clippingEnabled;
    },

    createNode: function (node) {
        node = node || new ccui.Layout();

        WidgetWrapper.prototype.createNode.call(this, node);

        node.layoutType = this._layoutType;

        if (this._clippingEnabled !== null)
            node.clippingEnabled = this._clippingEnabled;

        return node;
    }
});

cc.LayoutWrapper = module.exports = LayoutWrapper;
