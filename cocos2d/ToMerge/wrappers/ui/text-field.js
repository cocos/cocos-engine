var Utils = require('../utils');

var WidgetWrapper = require('./widget');

var TextFieldWrapper = cc.Class({
    name: 'cc.TextFieldWrapper',
    extends: WidgetWrapper,

    properties: {
        text: {
            get: function () {
                return this.targetN.string;
            },
            set: function (value) {
                if (typeof value === 'string') {
                    this.targetN.string = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new text must be String');
                }
            }
        },

        placeHolder: {
            get: function () {
                return this.targetN.placeHolder;
            },
            set: function (value) {
                if (typeof value === 'string') {
                    this.targetN.placeHolder = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new placeHolder must be String');
                }
            }
        },

        fontSize: {
            get: function () {
                return this.targetN.fontSize;
            },
            set: function (value) {
                if ( !isNaN(value) ) {
                    this.targetN.fontSize = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new fontSize must not be NaN');
                }
            }
        },

        font: {
            default: null,
            type: cc.TTFFont,

            notify: function () {
                if ( !this.targetN ) return;

                var value = this.font;
                if (!value || value instanceof cc.TTFFont) {
                    Utils.setFontToNode(value, this.targetN);

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new font must be cc.TTFFont');
                }
            }
        },

        fontFamily: {
            get: function () {
                return this.targetN.fontName;
            },
            set: function (value) {
                if (typeof value === 'string') {
                    this.targetN.fontName = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new fontFamily must be String');
                }
            }
        },

        maxLengthEnabled: {
            get: function () {
                return this.targetN.maxLengthEnabled;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.maxLengthEnabled = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new maxLengthEnabled must be boolean');
                }
            }
        },

        maxLength: {
            get: function () {
                return this.targetN.maxLength;
            },
            set: function (value) {
                if (typeof value === 'number') {
                    this.targetN.maxLength = value;

                    this.setDirtyFlag();
                }
                else {
                    cc.error('The new maxLength must be String');
                }
            }
        },

        passwordEnabled: {
            get: function () {
                return this.targetN.passwordEnabled;
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    var targetN = this.targetN;
                    targetN.passwordEnabled = value;

                    this.text = this.text;
                }
                else {
                    cc.error('The new passwordEnabled must be boolean');
                }
            }
        },

        _text: {
            default: ''
        },

        _placeHolder: {
            default: 'Input Something'
        },

        _fontSize: {
            default: 16
        },

        _fontFamily: {
            default: null
        },

        _maxLengthEnabled: {
            default: false
        },

        _maxLength: {
            default: 0
        },

        _passwordEnabled: {
            default: false
        }
    },

    onSizeChanged: function () {
        WidgetWrapper.prototype.onSizeChanged.call(this);
        this.setDirtyFlag();
    },

    setDirtyFlag: function () {
        cc.renderer.childrenOrderDirty = true;
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
        this._placeHolder = this.placeHolder;
        this._fontSize = this.fontSize;
        this._fontFamily = this.fontFamily;
        this._maxLengthEnabled = this.maxLengthEnabled;
        this._passwordEnabled = this.passwordEnabled;

        if (this.maxLengthEnabled) this._maxLength = this.maxLength;
    },

    createNode: function (node) {
        node = node || new ccui.TextField();
        node.ignoreContentAdaptWithSize(false);

        WidgetWrapper.prototype.createNode.call(this, node);

        node.passwordEnabled = this._passwordEnabled;
        node.string = this._text;
        node.placeHolder = this._placeHolder;
        node.fontSize = this._fontSize;
        node.fontFamily = this._fontFamily;
        node.maxLengthEnabled = this._maxLengthEnabled;

        if (this._maxLengthEnabled) node.maxLength = this._maxLength;

        Utils.setFontToNode(this.font, node);

        return node;
    }
});

cc.TextFieldWrapper = module.exports = TextFieldWrapper;
