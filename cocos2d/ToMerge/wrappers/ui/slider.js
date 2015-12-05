
var Scale9Wrapper = require('./scale9');

var SliderWrapper = cc.Class({
    name: 'cc.SliderWrapper',
    extends: Scale9Wrapper,

    properties: {
        bgBar_: {
            get: function () {
                return this.bgBar;
            },
            set: function (value) {
                this.bgBar = value;
                this.targetN.loadBarTexture( value );
            },
            url: cc.Texture2D,
            displayName: 'Bg Bar'
        },

        fgBar_: {
            get: function () {
                return this.fgBar;
            },
            set: function (value) {
                this.fgBar = value;
                this.targetN.loadProgressBarTexture( value );
            },
            url: cc.Texture2D,
            displayName: 'Fg Bar'
        },

        control_: {
            get: function () {
                return this.control;
            },
            set: function (value) {
                this.control = value;
                this.targetN.loadSlidBallTextureNormal( value );
            },
            url: cc.Texture2D,
            displayName: 'Control'
        },

        controlPressed_: {
            get: function () {
                return this.controlPressed;
            },
            set: function (value) {
                this.controlPressed = value;
                this.targetN.loadSlidBallTexturePressed( value );
            },
            url: cc.Texture2D,
            displayName: 'Control Pressed'
        },

        controlDisabled_: {
            get: function () {
                return this.controlDisabled;
            },
            set: function (value) {
                this.controlDisabled = value;
                this.targetN.loadSlidBallTextureDisabled( value );
            },
            url: cc.Texture2D,
            displayName: 'Control Disabled'
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

        _percent: {
            default: 0
        },

        bgBar: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        fgBar: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        control: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        controlPressed: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },

        controlDisabled: {
            default: '',
            url: cc.Texture2D,
            visible: false
        },
    },

    onBeforeSerialize: function () {
        Scale9Wrapper.prototype.onBeforeSerialize.call(this);

        this._percent = this.percent;
    },

    createNode: function (node) {
        node = node || new ccui.Slider();

        node.loadBarTexture( this.bgBar );
        node.loadProgressBarTexture( this.fgBar );
        node.loadSlidBallTextures( this.control, this.controlPressed, this.controlDisabled );

        node.percent = this._percent;

        Scale9Wrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.SliderWrapper = module.exports = SliderWrapper;
