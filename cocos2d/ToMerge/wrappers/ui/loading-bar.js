
var Scale9Wrapper = require('./scale9');

var LoadingBarWrapper = cc.Class({
    name: 'cc.LoadingBarWrapper',
    extends: Scale9Wrapper,

    properties: {
        texture_: {
            get: function () {
                return this.texture;
            },
            set: function (value) {
                this.texture = value;
                this.targetN.loadTexture( value );
            },
            url: cc.Texture2D,
            displayName: 'Texture'
        },

        direction: {
            get: function () {
                return this.targetN.direction;
            },
            set: function (value) {
                if ( typeof value === 'number' && !isNaN(value) ) {
                    this.targetN.direction = value;
                }
                else {
                    cc.error('The new direction must be number');
                }
            },

            type: ccui.LoadingBar.Type
        },

        percent: {
            get: function () {
                return this.targetN.percent;
            },
            set: function (value) {
                if ( typeof value === 'number' && !isNaN(value) ) {
                    this.targetN.percent = value;
                }
                else {
                    cc.error('The new percent must be number');
                }
            }
        },

        _direction: {
            default: ccui.LoadingBar.Type.LEFT
        },

        _percent: {
            default: 100
        },

        texture: {
            default: '',
            url: cc.Texture2D,
            visible: false
        }
    },

    onBeforeSerialize: function () {
        Scale9Wrapper.prototype.onBeforeSerialize.call(this);

        this._direction = this.direction;
        this._percent = this.percent;
    },

    createNode: function (node) {
        node = node || new ccui.LoadingBar();
        node.loadTexture(this.texture);
        node.percent = this._percent;
        node.direction = this._direction;

        Scale9Wrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.LoadingBarWrapper = module.exports = LoadingBarWrapper;
