var Utils = require('../utils');

var WidgetWrapper = require('./widget');

var TextWrapper = cc.Class({
    name: 'cc.TextWrapper',
    extends: WidgetWrapper,

    ctor: function () {
        this._boundingBox = [100, 100]
    },

    properties: {
        text: {
            get: function () {
                return this.targetN.string;
            },
            set: function (value) {
                if (typeof value === 'string') {
                    this.targetN.string = value;
                }
                else {
                    cc.error('The new text must be String');
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
                }
                else {
                    cc.error('The new fontFamily must be String');
                }
            }
        },

        align: {
            get: function () {
                return this.targetN.getTextHorizontalAlignment();
            },
            set: function ( value ) {
                if (typeof value === 'number') {
                    this.targetN.textAlign = value;
                }
                else {
                    cc.error('The new textAlign must be number');
                }
            },
            type: cc.TextAlignment
        },

        verticalAlign: {
            get: function () {
                return this.targetN.getTextVerticalAlignment();
            },
            set: function ( value ) {
                if (typeof value === 'number') {
                    this.targetN.verticalAlign = value;
                }
                else {
                    cc.error('The new verticalAlign must be number');
                }
            },
            type: cc.VerticalTextAlignment
        },

        boundingBox: {
            get: function () {
                var size = this.targetN.getTextAreaSize();
                return new cc.Vec2(size.width, size.height);
            },
            set: function (value) {
                if (value instanceof cc.Vec2) {
                    this.targetN.setTextAreaSize( cc.size( value.x, value.y ) );
                }
                else {
                    cc.error('The new boundingBox must be Vec2');
                }
            },
            type: cc.Vec2
        },

        _text: {
            default: 'Label'
        },

        _fontSize: {
            default: 16
        },

        _fontFamily: {
            default: null
        },

        _align: {
            default: cc.TextAlignment.CENTER
        },

        _verticalAlign: {
            default: cc.VerticalTextAlignment.CENTER
        },

        _boundingBox: {
            default: null
        }
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
        this._fontSize = this.fontSize;
        this._fontFamily = this.fontFamily;
        this._align = this.align;
        this._verticalAlign = this.verticalAlign;
        this._boundingBox = [this.boundingBox.x, this.boundingBox.y];
    },

    createNode: function (node) {
        node = node || new ccui.Text();
        node.ignoreContentAdaptWithSize(false);

        WidgetWrapper.prototype.createNode.call(this, node);

        node.string = this._text;
        node.fontSize = this._fontSize;
        node.fontName = this._fontFamily === null ? node.fontName : this._fontFamily;
        node.textAlign = this._align;
        node.verticalAlign = this._verticalAlign;

        var boundingBox = this._boundingBox;
        if (boundingBox) {
            node.setTextAreaSize( cc.size( boundingBox[0], boundingBox[1] ) );
        }

        Utils.setFontToNode(this.font, node);

        return node;
    }
});

cc.TextWrapper = module.exports = TextWrapper;
