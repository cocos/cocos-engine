var JS = cc.js;
var Playable = require('./playable');
var AnimationNode = require('./types').AnimationNode;
var DynamicAnimCurve = require('./animation-curves').DynamicAnimCurve;

// The base of animators
function Animator (target) {
    this.target = target;
    // {AnimationNodeBase}
    this.playingAnims = [];
}

JS.extend(Animator, Playable);

var animProto = Animator.prototype;

// 由 AnimationManager 调用，只有在该 animator 处于播放状态时才会被调用
animProto.update = function (deltaTime) {
    var anims = this.playingAnims;
    for (var i = 0; i < anims.length; i++) {
        var anim = anims[i];
        if (anim._isPlaying && !anim._isPaused) {
            anim.update(deltaTime);
            // if removed
            if (! anim._isPlaying) {
                anims.splice(i, 1);     // TODO: 由 anim 来负责调用 splice
                i--;
            }
        }
    }
    if (anims.length === 0) {
        this.stop();
    }
};

animProto.onPlay = function () {
    cc.director.getAnimationManager().addAnimator(this);
};

animProto.onStop = function () {
    this.playingAnims.length = 0;
    cc.director.getAnimationManager().removeAnimator(this);
};



// The actual animator for Entity
function EntityAnimator (target) {
    Animator.call(this, target);
}
JS.extend(EntityAnimator, Animator);

var entProto = EntityAnimator.prototype;

// 通用逻辑

function computeNullRatios (keyFrames) {
    var lastIndex = 0;
    var lastRatio = 0;

    var len = keyFrames.length;
    for (var i = 0; i < len; i++) {
        var frame = keyFrames[i];
        var ratio = frame.ratio;
        if (i === 0 && typeof ratio !== "number") {
            // 如果一开始就没有 ratio，则默认从 0 开始
            frame.computedRatio = ratio = 0;
        }
        else if (i === len - 1 && typeof ratio !== "number") {
            // 如果最后没有 ratio，则设置为 1
            frame.computedRatio = ratio = 1;
        }
        if (typeof ratio === "number") {
            if (lastIndex + 1 < i) {
                var count = i - lastIndex;
                var step = (ratio - lastRatio) / count;
                for (var j = lastIndex + 1; j < i; j++) {
                    lastRatio += step;
                    keyFrames[j].computedRatio = lastRatio;   // 不占用已有变量，这样 keyFrames 才能重用
                }
            }
            lastIndex = i;
            lastRatio = ratio;
        }
    }
}

if (CC_TEST) {
    cc._Test.computeNullRatios = computeNullRatios;
}

///**
// * @param {object[]} keyFrames
// * @param {object} [timingInput] - This dictionary is used as a convenience for specifying the timing properties of an Animation in bulk.
// * @return {AnimationNode}
// */
entProto.animate = function (keyFrames, timingInput) {
    if (! keyFrames) {
        cc.error('[animate] keyFrames must be non-nil');
        return null;
    }
    // compute absolute ratio of each keyframe with a null ratio
    computeNullRatios(keyFrames);

    var anim = this._doAnimate(keyFrames, timingInput);

    this.play();
    return anim;
};

// 具体逻辑

function findCurve (curves, target, propName) {
    var i = 0, curve;

    for (; i < curves.length; i++) {
        curve = curves[i];
        if (curve.target === target && curve.prop === propName) {
            return curve;
        }
    }

    return null;
}

function createPropCurve (curves, target, propName, value, ratio) {
    var curve = findCurve(curves, target, propName);
    if (! curve) {
        curve = new DynamicAnimCurve();
        curves.push(curve);
        // 缓存目标对象，所以 Component 必须一开始都创建好并且不能运行时动态替换……
        curve.target = target;
        curve.prop = propName;
    }
    curve.values.push(value);
    curve.ratios.push(ratio);
}

entProto._doAnimate = function (keyFrames, timingInput) {
    var anim = new AnimationNode(this, null, timingInput);
    anim.play();
    var curves = anim.curves;

    // create curves
    var lastRatio = -1;
    for (var i = 0; i < keyFrames.length; i++) {
        var frame = keyFrames[i];

        // get ratio
        var ratio = frame.ratio;
        if (typeof ratio !== "number") {
            ratio = frame.computedRatio;
        }
        if (ratio < 0) {
            cc.error('[animate] ratio should >= 0!');
            continue;
        }
        if (ratio < lastRatio) {
            cc.error('[animate] ratio should in the order of smallest to largest!');
            continue;
        }
        lastRatio = ratio;

        // 先遍历每一帧，获得所有曲线
        for (var key in frame) {

            var data = frame[key];

            if (key === 'props') {
                for (var propName in data) {
                    createPropCurve(curves, this.target, propName, data[propName], ratio);
                }
            }
            else if (key === 'comps') {
                for (var compName in data) {
                    var comp = this.target.getComponent(compName);
                    var compData = data[compName];

                    for (var propName in compData) {
                        createPropCurve(curves, comp, propName, compData[propName], ratio);
                    }
                }
            }
        }
    }
    this.playingAnims.push(anim);
    return anim;
};

if (CC_TEST) {
    cc._Test.EntityAnimator = EntityAnimator;
}

module.exports = {
    Animator: Animator,
    EntityAnimator: EntityAnimator
};
