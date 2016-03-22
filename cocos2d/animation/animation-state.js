
var JS = cc.js;
var AnimationNode = require('./types').AnimationNode;

/**
 * !#en
 * The AnimationState gives full control over animation playback process.
 * In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
 * !#zh
 * AnimationState 完全控制动画播放过程。<br/>
 * 大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。
 * @class AnimationState
 * @extends AnimationNode
 * @constructor
 */

/**
 * @method AnimationState
 * @param {AnimationClip} clip
 * @param {String} [name]
 * @return {AnimationState}
 */
function AnimationState (clip, name) {
    AnimationNode.call(this, null, null, {
        duration: clip.length
    });

    this._clip = clip;
    this._name = name || clip.name;
}
JS.extend(AnimationState, AnimationNode);

var state = AnimationState.prototype;

/**
 * !#en The clip that is being played by this animation state.
 * !#zh 此动画状态正在播放的剪辑。
 * @property clip
 * @type {AnimationClip}
 * @final
 */
JS.get(state, 'clip', function () {
    return this._clip;
});

/**
 * !#en The name of the playing animation.
 * !#zh 动画的名字
 * @property name
 * @type {String}
 * @readOnly
 */
JS.get(state, 'name', function () {
    return this._name;
});

JS.obsolete(state, 'AnimationState.length', 'duration');

JS.getset(state, 'curveLoaded',
    function () {
        return this.curves.length > 0;
    },
    function () {
        this.curves.length = 0;
    }
);

state.onPlay = function () {
    // replay
    this.setTime(0);
};

state.onStop = function () {
    if (this.animator) {
        this.animator.removeAnimation(this);
    }
};

state.setTime = function (time) {
    this.time = time || 0;

    this.curves.forEach(function (curve) {
        curve.onTimeChangedManually();
    });
};

cc.AnimationState = module.exports = AnimationState;
