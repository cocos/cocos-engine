
var NodeWrapper = require('./node');

var SpriteBatchNodeWrapper = cc.Class({
    name: 'cc.SpriteBatchNodeWrapper',
    extends: NodeWrapper,

    properties: {

        texture_: {
            get: function () {
                var tex = this.targetN.texture;
                return (tex && tex.url) || '';
            },
            set: function (value) {
                this.targetN.initWithFile(value);
            },
            url: cc.Texture2D
        },

        texture: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        _textureObject: {
            default: null
        },
    },

    onBeforeSerialize: function () {
        NodeWrapper.prototype.onBeforeSerialize.call(this);

        this.texture = this.texture_;
        this._textureObject = this.targetN.texture;
    },

    createNode: function (node) {
        node = node || new cc.SpriteBatchNode(new cc.Texture2D());

        NodeWrapper.prototype.createNode.call(this, node);

        if (this.texture) {
            node.texture = cc.textureCache.addImage(this.texture);
        }
        else if (this._textureObject) {
            node.texture = this._textureObject;
        }

        return node;
    }
});

cc.SpriteBatchNodeWrapper = module.exports = SpriteBatchNodeWrapper;
