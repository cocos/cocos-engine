
var WidgetWrapper = require('./widget');

var Scale9Wrapper = cc.Class({
    name: 'cc.Scale9Wrapper',
    extends: WidgetWrapper,

    ctor: function () {
        this._scale9Size = null;
        this._updatingCapInsets = false;
    },

    properties: {
        enableScale9: {
            get: function () {
                return this.targetN.isScale9Enabled();
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    if (!value) this._scale9Size = this.size;

                    this.targetN.setScale9Enabled( value );

                    if (value && this._scale9Size) this.size = this._scale9Size;
                }
                else {
                    cc.error('The new enableScale9 must be boolean');
                }
            }
        },

        left: {
            default: 0,
            range: [0, Number.MAX_SAFE_INTEGER],

            notify: function () {
                this._updateCapInsets('left');
            }
        },

        right: {
            default: 0,
            range: [0, Number.MAX_SAFE_INTEGER],

            notify: function () {
                this._updateCapInsets('right');
            }
        },

        top: {
            default: 0,
            range: [0, Number.MAX_SAFE_INTEGER],

            notify: function () {
                this._updateCapInsets('top');
            }
        },

        bottom: {
            default: 0,
            range: [0, Number.MAX_SAFE_INTEGER],

            notify: function () {
                this._updateCapInsets('bottom');
            }
        },

        _enableScale9: {
            default: false
        },

        _capInsets: {
            default: null
        }
    },

    getVirtualRendererSize: function () {
        var renderer = this.targetN.getVirtualRenderer();
        return renderer ? renderer._spriteRect : cc.size(0,0);
    },

    _updateCapInsets: function (type) {
        if (!this.targetN || this._updatingCapInsets) return;
        this._updatingCapInsets = true;

        var size = this.getVirtualRendererSize();

        var w = size.width - this.left - this.right;
        var h = size.height - this.top - this.bottom;

        // width and height should be greater than 0
        if (type === 'left') {
            if (this.left > size.width-1) {
                this.left = size.width-1;
                this.right = 0;
                w = 1;
            }
            else if (w <= 0) {
                this.right += w;
                w = 1;
            }
        }
        else if (type === 'right') {
            if (this.right > size.width-1) {
                this.right = size.width-1;
                this.left = 0;
                w = 1;
            }
            else if (w <= 0) {
                this.left += w;
                w = 1;
            }
        }
        else if (type === 'top') {
            if (this.top > size.height-1) {
                this.top = size.height-1;
                this.bottom = 0;
                h = 1;
            }
            else if (h <= 0) {
                this.bottom += h;
                h = 1;
            }
        }
        else if (type === 'bottom') {
            if (this.bottom > size.height-1) {
                this.bottom = size.height-1;
                this.top = 0;
                h = 1;
            }
            else if (h <= 0) {
                this.top += h;
                h = 1;
            }
        }

        var x = this.left;
        var y = this.top;

        this.targetN.setCapInsets( cc.rect(x, y, w, h) );
        this._capInsets = [x, y, w, h];

        this._updatingCapInsets = false;
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._enableScale9 = this.enableScale9;
    },

    createNode: function (node) {
        if (!node) {
            cc.error('Can\'t create a node from Scale9Wrapper');
            return;
        }

        node.setScale9Enabled( this._enableScale9 );

        var capInsets = this._capInsets;
        if ( capInsets && this._enableScale9 ) {
            node.setCapInsets( cc.rect(capInsets[0], capInsets[1], capInsets[2], capInsets[3]) );
        }

        WidgetWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

module.exports = Scale9Wrapper;
