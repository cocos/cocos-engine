
/**
 * !#en Class for animation data handling.
 * !#zh 动画剪辑，用于存储动画数据。
 * @class AnimationClip
 * @extends Asset
 */
var AnimationClip = cc.Class({
    name: 'cc.AnimationClip',
    extends: cc.Asset,

    properties: {
        _duration: {
            default: 0,
            type: 'Float',
        },

        /**
         * !#en Duration of this animation.
         * !#zh 动画的持续时间。
         * @property duration
         * @type {Number}
         */
        duration: {
            get: function () { return this._duration; },
        },

        /**
         * !#en FrameRate of this animation.
         * !#zh 动画的帧速率。
         * @property sample
         * @type {Number}
         */
        sample: {
            default: 60,
        },

        /**
         * !#en Speed of this animation.
         * !#zh 动画的播放速度。
         * @property speed
         * @type {Number}
         */
        speed: {
            default: 1
        },

        /**
         * !#en WrapMode of this animation.
         * !#zh 动画的循环模式。
         * @property wrapMode
         * @type {WrapMode}
         */
        wrapMode: {
            default: cc.WrapMode.Normal
        },

        /**
         * !#en Curve data.
         * !#zh 曲线数据。
         * @property curveData
         * @type {Object}
         * @example {@link utils/api/engine/docs/cocos2d/core/animation-clip/curve-data.js}
         */
        curveData: {
            default: {},
            visible: false,
        },

        /**
         * !#en Event data.
         * !#zh 事件数据。
         * @property events
         * @type {Object[]}
         * @example {@link utils/api/engine/docs/cocos2d/core/animation-clip/event-data.js}
         * @typescript events: {frame: number, func: string, params: string[]}[]
         */
        events: {
            default: [],
            visible: false,
        }
    },

    statics: {
        /**
         * !#en Crate clip with a set of sprite frames
         * !#zh 使用一组序列帧图片来创建动画剪辑
         * @method createWithSpriteFrames
         * @param {[SpriteFrame]} spriteFrames
         * @param {Number} sample
         * @return {AnimationClip}
         * @static
         * @example
         *
         * var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
         *
         */
        createWithSpriteFrames: function (spriteFrames, sample) {
            if (!Array.isArray(spriteFrames)) {
                cc.errorID(3905);
                return null;
            }

            var clip = new AnimationClip();
            clip.sample = sample || clip.sample;

            clip._duration = spriteFrames.length / clip.sample;

            var frames = [];
            var step = 1 / clip.sample;

            for (var i = 0, l = spriteFrames.length; i < l; i++) {
                frames[i] = { frame: (i * step), value: spriteFrames[i] };
            }

            clip.curveData = {
                comps: {
                    // component
                    'cc.Sprite': {
                        // component properties
                        'spriteFrame': frames
                    }
                }
            };

            return clip;
        }
    }
});

cc.AnimationClip = module.exports = AnimationClip;
