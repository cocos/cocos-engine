
var WidgetWrapper = require('./widget');

var TextBMFontWrapper = cc.Class({
    name: 'cc.TextBMFontWrapper',
    extends: WidgetWrapper,

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

        bitmapFont_: {
            get: function () {
                return this.targetN._file || '';
            },
            set: function (value) {
                cc.loader.load(value, function () {
                    this.targetN.setFntFile(value);
                }.bind(this) );
            },
            url: cc.BitmapFont
        },

        _text: {
            default: 'TextBMFont'
        },

        bitmapFont: {
            default: '',
            url: cc.BitmapFont,
            visible: false
        }
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
        this.bitmapFont = this.bitmapFont_;
    },

    createNode: function (node) {
        node = node || new ccui.TextBMFont();
        node.string = this._text;
        node.setFntFile(this.bitmapFont);

        WidgetWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

var originSetFntFile = ccui.TextBMFont.prototype.setFntFile;
ccui.TextBMFont.prototype.setFntFile = function (value) {
    this._file = value;
    originSetFntFile.call(this, value);
};

cc.TextBMFontWrapper = module.exports = TextBMFontWrapper;
