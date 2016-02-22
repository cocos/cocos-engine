
/**
 * Class for animation data handling.
 * @class AnimationClip
 * @extends Asset
 * @constructor
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
         * Duration of this animation
         * @property duration
         * @type {Number}
         */
        duration: {
            get: function () { return this._duration; },
        },

        /**
         * FrameRate of this animation
         * @property sample
         * @type {Number}
         */
        sample: {
            default: 60,
        },

        /**
         * Speed of this animation
         * @property speed
         * @type {Number}
         */
        speed: {
            default: 1
        },

        /**
         * WrapMode of this animation
         * @property wrapMode
         * @type {cc.WrapMode}
         */
        wrapMode: {
            default: cc.WrapMode.Normal
        },

        /**
         * Curve data
         * @property curveData
         * @type {Object}
         * @example
         * {
         *     // 根节点不用查找路径
         *     // root properties
         *     props: {
         *         x: [
         *             { frame: 0, value: 0, curve: [0,0.5,0.5,1] },
         *             { frame: 1, value: 200, curve: null }
         *         ]
         *     },
         *     comps: {
         *         // component
         *         'comp-1': {
         *             // component properties
         *             'prop-1': [
         *                 { frame: 0, value: 10, curve: [0,0.5,0.5,1] },
         *                 { frame: 1, value: 20, curve: null }
         *             ]
         *         }
         *     },
         *     paths: {
         *         // key 为节点到root的路径名, 通过cc.find找到
         *         'foo/bar': {
         *             // node properties
         *             props: {
         *                 x: [
         *                     { frame: 0, value: 0, curve: [0,0.5,0.5,1] },
         *                     { frame: 1, value: 200, curve: null }
         *                 ]
         *             },
         *            comps: {
         *                 // component
         *                 'comp-1': {
         *                     // component property
         *                     'prop-1': [
         *                         { frame: 0, value: 10, curve: [0,0.5,0.5,1] },
         *                         { frame: 1, value: 20, curve: null }
         *                     ]
         *                 }
         *             }
         *         },
         *         'hello': {
         *             props: {
         *                 position: [
         *                     {
         *                         frame: 0,
         *                         value: [0,0],
         *                         motionPath: [
         *                             [320, 240, 0, 240, 640, 240],
         *                             [640, 0, 400, 0, 1000, 0]
         *                         ]
         *                     },
         *                     { frame: 5, value: [640, 480] }
         *                 ]
         *             }
         *         }
         *     }
         * }
         */
        curveData: {
            default: {},
            visible: false,
        },

        /**
         * Event data
         * @property events
         * @type {Array}
         * @example
         * [
         *     frame: 0, func: 'onAnimationEvent1', params:['param-1', 'param-2']
         *     frame: 2, func: 'onAnimationEvent3', params:['param-1', 'param-2']
         *     frame: 3, func: 'onAnimationEvent2', params:['param-1']
         *     // The second event at frame 3
         *     frame: 3, func: 'onAnimationEvent4', params:['param-1']
         *     frame: 4, func: 'onAnimationEvent4', params:['param-1']
         * ]
         */
        events: {
            default: [],
            visible: false,
        }
    },

});

cc.AnimationClip = module.exports = AnimationClip;
