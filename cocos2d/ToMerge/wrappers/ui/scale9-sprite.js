
var Scale9Wrapper = require('./scale9');

var Scale9SpriteWrapper = cc.Class({
    name: 'cc.Scale9SpriteWrapper',
    extends: Scale9Wrapper,

    properties: {

        childrenN: {
            get: function () {
                var renderer = this.targetN.getVirtualRenderer();
                var children = this.targetN.children.filter( function (child) {
                    return child !== renderer;
                });
                return children;
            },
        },

        texture_: {
            get: function () {
                return this.texture;
            },
            set: function (value) {
                this.texture = value;
                this.targetN.loadTexture( value );
            },
            url: cc.Texture2D
        },

        texture: {
            default: '',
            url: cc.Texture2D,
            visible: false
        }
    },

    createNode: function (node) {
        node = node || new ccui.ImageView(this.texture);

        Scale9Wrapper.prototype.createNode.call(this, node);

        return node;
    }
});

// ccui.ImageView not implement getRotation
// we implement here
if (!cc.sys.isNative) {
    var _p = ccui.ImageView.prototype;
    _p.getRotation = function() {
        return this._imageRenderer.getRotation();
    };

    cc.js.getset(_p, 'rotation', _p.getRotation, _p.setRotation);
}

cc.Scale9SpriteWrapper = module.exports = Scale9SpriteWrapper;
