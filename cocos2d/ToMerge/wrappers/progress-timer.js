var NodeWrapper = require('./node');

var ProgressTimerWrapper = cc.Class({
    name: 'cc.ProgressTimerWrapper',
    extends: NodeWrapper,

    ctor: function () {
        this._midPoint = [0.5, 0.5];
        this._barChangeRate = [1, 1];
    },

    properties: {

        _type: {
            default: cc.ProgressTimer.Type.RADIAL,
            type: cc.ProgressTimer.Type
        },

        type: {
            get: function () {
                return this.targetN.getType();
            },
            set: function (value) {
                if (!isNaN(value)) {
                    this.targetN.setType(value);
                }
                else {
                    cc.error('The new type must not be NaN');
                }
            },
            type: cc.ProgressTimer.Type
        },

        _percentage: {
            default: 50,
        },

        percentage: {
            get: function() {
                return this.targetN.getPercentage();
            },
            set: function (value) {
                if (!isNaN(value)) {
                    this.targetN.setPercentage(value);
                }
                else {
                    cc.error('The new percentage must not be NaN');
                }
            },
        },

        _midPoint: {
            default: []
        },

        midPoint: {
            get: function () {
                var pt = this.targetN.getMidpoint();
                return new cc.Vec2(pt.x, pt.y);
            },
            set: function (value) {
                if ( value instanceof cc.Vec2 ) {
                    this.targetN.setMidpoint(cc.p(value.x, value.y));
                }
                else {
                    cc.error('The new midPoint must be cc.Vec2');
                }
            }
        },

        _barChangeRate: {
            default: []
        },

        barChangeRate: {
            get: function () {
                var pt = this.targetN.getBarChangeRate();
                return new cc.Vec2(pt.x, pt.y);
            },
            set: function (value) {
                if ( value instanceof cc.Vec2 ) {
                    this.targetN.setBarChangeRate(cc.p(value.x, value.y));
                }
                else {
                    cc.error('The new barChangeRate must be cc.Vec2');
                }
            }
        },

        _reverseDirection : {
            default: false,
        },

        reverseDirection: {
            get: function () {
                return this.targetN.isReverseDirection();
            },
            set: function (value) {
                if (typeof value === 'boolean') {
                    this.targetN.setReverseProgress(value);
                }
                else {
                    cc.error('The new reverseDirection must be Boolean');
                }
            }
        },

        _texture: {
            default: '',
            url: cc.Texture2D
        },

        texture: {
            get: function () {
                var tex = this.targetN.getSprite().texture;
                return (tex && tex.url) || '';
            },
            set: function (value) {
                this.targetN.getSprite().texture = value;
            },
            url: cc.Texture2D
        }
    },

    onBeforeSerialize: function () {
        NodeWrapper.prototype.onBeforeSerialize.call(this);
        this._type = this.type;
        this._percentage = this.percentage;
        this._midPoint = [this.midPoint.x, this.midPoint.y];
        this._barChangeRate = [this.barChangeRate.x, this.barChangeRate.y];
        this._reverseDirection = this.reverseDirection;
        this._texture = this.texture;
    },

    createNode: function (node) {
        node = node || new cc.ProgressTimer(new cc.Sprite());

        var sp = node.getSprite();
        if (this._texture) {
            sp.texture = this._texture;

            if (cc.sys.isNative) {
                // jsb Texture will not save url, so we save manually.
                sp.texture.url = this._texture;
            }
        }

        node.setType(this._type);
        node.setPercentage(this._percentage);

        if (this._midPoint) {
            node.setMidpoint(cc.p(this._midPoint[0], this._midPoint[1]));
        }

        if (this._barChangeRate) {
            node.setBarChangeRate(cc.p(this._barChangeRate[0], this._barChangeRate[1]));
        }

        node.setReverseProgress(this._reverseDirection);

        NodeWrapper.prototype.createNode.call(this, node);

        return node;
    }
});

cc.ProgressTimerWrapper = module.exports = ProgressTimerWrapper;
