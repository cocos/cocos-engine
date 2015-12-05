/**
 * Class for sprite animation asset handling.
 * @class SpriteAnimationAsset
 * @extends Asset
 * @constructor
 */
var SpriteAnimationAsset = cc.Class({
    name: 'cc.SpriteAnimationAsset',
    extends: cc.Asset,

    properties: {
        0: {
            default: '',
            url: cc.Texture2D
        },

        1: {
            default: '',
            url: cc.Texture2D
        },

        2: {
            default: '',
            url: cc.Texture2D
        },

        3: {
            default: '',
            url: cc.Texture2D
        },

        4: {
            default: '',
            url: cc.Texture2D
        },

        5: {
            default: '',
            url: cc.Texture2D
        },

        6: {
            default: '',
            url: cc.Texture2D
        },

        7: {
            default: '',
            url: cc.Texture2D
        },

        8: {
            default: '',
            url: cc.Texture2D
        },

        9: {
            default: '',
            url: cc.Texture2D
        },

        /**
         *
         *
         * @property loop
         * @type {Boolean}
         */
        loop: {
            default: true
        },

        /**
         *
         *
         * @property delay
         * @type {Number}
         */
        delay: {
            default: 0.5
        }
    },
});

cc.SpriteAnimationAsset = SpriteAnimationAsset;

module.exports = SpriteAnimationAsset;
