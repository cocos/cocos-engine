
var WidgetWrapper = require('./widget');

var TextAtlasWrapper = cc.Class({
    name: 'cc.TextAtlasWrapper',
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

        texture: {
            default: '',
            url: cc.Texture2D,

            notify: function () {
                this.updateProperties();
            }
        },

        itemWidth: {
            default: 0,
            notify: function () {
                this.updateProperties();
            }
        },

        itemHeight: {
            default: 0,
            notify: function () {
                this.updateProperties();
            }
        },

        startCharMap: {
            default: '0',
            notify: function () {
                this.updateProperties();
            }
        },

        _text: {
            default: 'Label'
        },
    },

    updateProperties: function () {
        if (!this.targetN) return;
        this.targetN.setProperty(this.text, this.texture, this.itemWidth, this.itemHeight, this.startCharMap);
    },

    onBeforeSerialize: function () {
        WidgetWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
    },

    createNode: function (node) {
        node = node || new ccui.TextAtlas();
        node.setProperty(this._text, this.texture, this.itemWidth, this.itemHeight, this.startCharMap);

        WidgetWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.TextAtlasWrapper = module.exports = TextAtlasWrapper;
