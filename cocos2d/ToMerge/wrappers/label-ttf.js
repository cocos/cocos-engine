var Utils = require('./utils');
var NodeWrapper = require('./node');

var LabelTTFWrapper = cc.Class({
    name: 'cc.LabelTTFWrapper',
    extends: NodeWrapper,

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
                return this.targetN.textAlign;
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
                return this.targetN.verticalAlign;
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
                var target = this.targetN;
                return new cc.Vec2(target.boundingWidth, target.boundingHeight);
            },
            set: function (value) {
                if (value instanceof cc.Vec2) {
                    this.targetN.boundingWidth = value.x;
                    this.targetN.boundingHeight = value.y;
                }
                else {
                    cc.error('The new boundingBox must be Vec2');
                }
            },
            type: cc.Vec2
        },

        lineHeight: {
            get: function() {
                return this.targetN.getLineHeight();
            },
            set: function (value) {
                if (typeof value === 'number') {
                    this.targetN.setLineHeight( value );
                    this.targetN._setUpdateTextureDirty();
                }
                else {
                    cc.error('The new lineHeight must be number');
                }
            }
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
            default: cc.TextAlignment.LEFT
        },

        _verticalAlign: {
            default: cc.VerticalTextAlignment.TOP
        },

        _boundingBox: {
            default: null
        },

        _lineHeight: {
            default: null
        }
    },

    onBeforeSerialize: function () {
        NodeWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
        this._fontSize = this.fontSize;
        this._fontFamily = this.fontFamily;
        this._align = this.align;
        this._verticalAlign = this.verticalAlign;
        this._boundingBox = [this.boundingBox.x, this.boundingBox.y];
        this._lineHeight = this.lineHeight;
    },

    createNode: function (node) {

        node = node || new cc.LabelTTF();

        NodeWrapper.prototype.createNode.call(this, node);

        node.string = this._text;
        node.fontSize = this._fontSize;
        node.fontName = this._fontFamily === null ? node.fontName : this._fontFamily;
        node.textAlign = this._align;
        node.verticalAlign = this._verticalAlign;

        if (typeof this._lineHeight === 'number' &&
            node.setLineHeight) {
            node.setLineHeight( this._lineHeight );
        }

        var boundingBox = this._boundingBox;
        if (boundingBox) {
            node.boundingWidth = boundingBox[0];
            node.boundingHeight = boundingBox[1];
        }

        Utils.setFontToNode(this.font, node);

        return node;
    }
});

cc.LabelTTFWrapper = module.exports = LabelTTFWrapper;
