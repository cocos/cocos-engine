
var WidgetWrapper = require('./widget');

var CheckBoxWrapper = cc.Class({
    name: 'cc.CheckBoxWrapper',
    extends: WidgetWrapper,

    properties: {
        bg_: {
            get: function () {
                return this.bg;
            },
            set: function ( value ) {
                this.bg = value;
                this.targetN.loadTextureBackGround( value );
            },
            url: cc.Texture2D,
            displayName: 'Bg'
        },

        bgPressed_: {
            get: function () {
                return this.bgPressed;
            },
            set: function ( value ) {
                this.bgPressed = value;
                this.targetN.loadTextureBackGroundSelected( value );
            },
            url: cc.Texture2D,
            displayName: 'Bg Pressed'
        },

        bgDisabled_: {
            get: function () {
                return this.bgDisabled;
            },
            set: function ( value ) {
                this.bgDisabled = value;
                this.targetN.loadTextureBackGroundDisabled( value );
            },
            url: cc.Texture2D,
            displayName: 'Bg Disabled'
        },

        fg_: {
            get: function () {
                return this.fg;
            },
            set: function ( value ) {
                this.fg = value;
                this.targetN.loadTextureFrontCross( value );
            },
            url: cc.Texture2D,
            displayName: 'Fg'
        },

        fgDisabled_: {
            get: function () {
                return this.fgDisabled;
            },
            set: function ( value ) {
                this.fgDisabled = value;
                this.targetN.loadTextureFrontCrossDisabled( value );
            },
            url: cc.Texture2D,
            displayName: 'Fg Disabled'
        },

        selected: {
            get: function () {
                return this.targetN.selected;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.selected = value;
                }
                else {
                    cc.error('The new selected must be number');
                }
            }
        },

        bg: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        bgPressed: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        bgDisabled: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        fg: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        fgDisabled: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        _selected: {
            default: null
        }

    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._selected = this.selected;
    },

    createNode: function (node) {

        node = node || new ccui.CheckBox();
        node.loadTextures(this.bg, this.bgPressed, this.fg, this.bgDisabled, this.fgDisabled);

        if (this._selected !== null) {
            node.selected = this._selected;
        }

        WidgetWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.CheckBoxWrapper = module.exports = CheckBoxWrapper;
