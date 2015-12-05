
var NodeWrapper = require('../node');

var desc = Object.getOwnPropertyDescriptor(NodeWrapper.prototype, 'parentN');

var WidgetWrapper = cc.Class({
    name: 'cc.WidgetWrapper',
    extends: NodeWrapper,

    ctor: function () {
        this._ignoreUpdateLayoutParameter = false;
    },

    properties: {

        position: {
            get: function () {
                return new cc.Vec2(this.targetN.x, this.targetN.y);
            },
            set: function (value) {
                if ( value instanceof cc.Vec2 ) {
                    this.targetN.setPosition(value.x, value.y);

                    if (this.canDoAnchor) {
                        this.updateAnchorPositon();
                    }
                }
                else {
                    cc.error('The new position must be cc.Vec2');
                }
            }
        },

        parentN: {
            get: function () {
                var parent = this.targetN.parent;

                if (parent) {
                    var ancient = parent.parent;
                    if ( ancient && ancient instanceof ccui.ScrollView) {
                        return ancient;
                    }
                }

                return parent;
            },
            set: desc.set
        },

        enabled: {
            get: function () {
                return this.targetN.enabled;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.enabled = value;
                    this.targetN.bright = value;
                }
                else {
                    cc.error('The new enabled must be boolean');
                }
            }
        },

        touchEnabled: {
            get: function () {
                return this.targetN.touchEnabled;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.touchEnabled = value;
                }
                else {
                    cc.error('The new touchEnabled must be boolean');
                }
            }
        },

        canDoAnchor: {
            get: function () {
                var parentN = this.parentN;
                return parentN && parentN instanceof ccui.Layout;
            }
        },

        anchorAlign: {
            default: ccui.RelativeLayoutParameter.Type.PARENT_TOP_LEFT,
            type: ccui.RelativeLayoutParameter.Type,

            notify: function () {
                this.updateAnchorPositon();
            }
        },

        widgetLayoutType: {
            default: ccui.Layout.Type.RELATIVE,
            type: ccui.Layout.Type,

            notify: function (oldValue) {
                if (oldValue === this.widgetLayoutType) return;

                this._ignoreUpdateLayoutParameter = true;
                this.anchorLeft = this.anchorTop = this.anchorRight = this.anchorBottom = 0;
                this._ignoreUpdateLayoutParameter = false;

                this.updateLayoutParameter();
            }
        },

        anchorLeft: {
            default: 0,

            notify: function () {
                this.updateLayoutParameter();
            }
        },

        anchorRight: {
            default: 0,

            notify: function () {
                this.updateLayoutParameter();
            }
        },

        anchorTop: {
            default: 0,

            notify: function () {
                this.updateLayoutParameter();
            }
        },

        anchorBottom: {
            default: 0,

            notify: function () {
                this.updateLayoutParameter();
            }
        },

        _enabled: {
            default: null
        },

        _touchEnabled: {
            default: null
        },
    },

    updateLayoutParameter: function (node) {
        if (this._ignoreUpdateLayoutParameter) return;

        node = node || this.targetN;

        var parameter;

        if (this.widgetLayoutType === ccui.Layout.Type.RELATIVE) {
            parameter = new ccui.RelativeLayoutParameter();
            parameter.setAlign(this.anchorAlign);
        }
        else {
            parameter = new ccui.LinearLayoutParameter();
        }
        parameter.setMargin(this.anchorLeft, this.anchorTop, this.anchorRight, this.anchorBottom);

        node.setLayoutParameter(parameter);

        if (this.targetN) {
            this.doParentLayout();
        }
    },

    updateAnchorPositon: function () {
        this._ignoreUpdateLayoutParameter = true;

        var targetN = this.targetN;
        var cs = targetN.getContentSize();
        var ap = targetN.getAnchorPointInPoints();
        var ls = targetN.parent._getLayoutContentSize();

        this.anchorLeft     = targetN.x - ap.x;
        this.anchorRight    = ls.width  - targetN.x - (cs.width - ap.x);
        this.anchorTop      = ls.height - targetN.y - (cs.height - ap.y);
        this.anchorBottom   = targetN.y - ap.y;

        this._ignoreUpdateLayoutParameter = false;
        this.updateLayoutParameter();
    },

    onSizeChanged: function () {
        this.doParentLayout();
    },

    _getUrlFromRenderer: function (renderer) {
        if (!renderer) return '';

        var texture;
        if ( renderer.texture ) texture = renderer.texture;
        if ( renderer._scale9Image ) texture = renderer._scale9Image.texture;

        return texture ? texture.url : '';
    },

    doParentLayout: function () {
        var parent = this.parent;
        while (parent) {
            if (parent instanceof cc.LayoutWrapper) {
                parent.doLayout();
                return;
            }
            parent = parent.parent;
        }
    },

    onBeforeSerialize: function () {
        NodeWrapper.prototype.onBeforeSerialize.call(this);

        this._enabled = this.enabled;
        this._touchEnabled = this.touchEnabled;
    },

    createNode: function (node) {
        if (!node) {
            cc.error('Can\'t create a node from WidgetWrapper');
            return;
        }

        NodeWrapper.prototype.createNode.call(this, node);

        this.updateLayoutParameter(node);

        if (this._enabled !== null) {
            node.enabled = this._enabled;
            node.bright = this._enabled;
        }

        if (this._touchEnabled !== null)
            node.setTouchEnabled( this._touchEnabled );

        return node;
    }
});

module.exports = WidgetWrapper;
