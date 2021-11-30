/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const js = cc.js;
const Playable = require('./playable');
const { EventAnimCurve, EventInfo } = require('./animation-curves');
const WrapModeMask = require('./types').WrapModeMask;
const binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;

// The actual animator for Animation Component

function AnimationAnimator (target, animation) {
    Playable.call(this);
    this.target = target;
    this.animation = animation;

    this._anims = new js.array.MutableForwardIterator([]);
}
js.extend(AnimationAnimator, Playable);
let p = AnimationAnimator.prototype;

p.playState = function (state, startTime) {
    if (!state.clip) {
        return;
    }

    if (!state.curveLoaded) {
        initClipData(this.target, state);
    }

    state.animator = this;
    state.play();

    if (typeof startTime === 'number') {
        state.setTime(startTime);
    }

    this.play();
};

p.stopStatesExcept = function (state) {
    let iterator = this._anims;
    let array = iterator.array;
    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        let anim = array[iterator.i];
        if (anim === state) {
            continue;
        }

        this.stopState(anim);
    }
};

p.addAnimation = function (anim) {
    let index = this._anims.array.indexOf(anim);
    if (index === -1) {
        this._anims.push(anim);
    }

    anim._setEventTarget(this.animation);
};

p.removeAnimation = function (anim) {
    let index = this._anims.array.indexOf(anim);
    if (index >= 0) {
        this._anims.fastRemoveAt(index);

        if (this._anims.array.length === 0) {
            this.stop();
        }
    }
    else {
        cc.errorID(3907);
    }

    anim.animator = null;
};

p.sample = function () {
    let iterator = this._anims;
    let array = iterator.array;
    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        let anim = array[iterator.i];
        anim.sample();
    }
};

p.stopState = function (state) {
    if (state) {
        state.stop();
    }
};

p.pauseState = function (state) {
    if (state) {
        state.pause();
    }
};

p.resumeState = function (state) {
    if (state) {
        state.resume();
    }

    if (this.isPaused) {
        this.resume();
    }
};

p.setStateTime = function (state, time) {
    if (time !== undefined) {
        if (state) {
            state.setTime(time);
            state.sample();
        }
    }
    else {
        time = state;

        let array = this._anims.array;
        for (let i = 0; i < array.length; ++i) {
            let anim = array[i];
            anim.setTime(time);
            anim.sample();
        }
    }
};

p.onStop = function () {
    let iterator = this._anims;
    let array = iterator.array;
    for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
        let anim = array[iterator.i];
        anim.stop();
    }
};

p.onPause = function () {
    let array = this._anims.array;
    for (let i = 0; i < array.length; ++i) {
        let anim = array[i];
        anim.pause();

        // need to unbind animator to anim, or it maybe cannot be gc.
        anim.animator = null;
    }
};

p.onResume = function () {
    let array = this._anims.array;
    for (let i = 0; i < array.length; ++i) {
        let anim = array[i];

        // rebind animator to anim
        anim.animator = this;

        anim.resume();
    }
};

p._reloadClip = function (state) {
    initClipData(this.target, state);
};

// 这个方法应该是 SampledAnimCurve 才能用
function createBatchedProperty (propPath, firstDotIndex, mainValue, animValue) {
    mainValue = mainValue.clone();
    let nextValue = mainValue;
    let leftIndex = firstDotIndex + 1;
    let rightIndex = propPath.indexOf('.', leftIndex);

    // scan property path
    while (rightIndex !== -1) {
        let nextName = propPath.slice(leftIndex, rightIndex);
        nextValue = nextValue[nextName];
        leftIndex = rightIndex + 1;
        rightIndex = propPath.indexOf('.', leftIndex);
    }
    let lastPropName = propPath.slice(leftIndex);
    nextValue[lastPropName] = animValue;

    return mainValue;
}

if (CC_TEST) {
    cc._Test.createBatchedProperty = createBatchedProperty;
}


function initClipData (root, state) {
    let clip = state.clip;

    state.duration = clip.duration;
    state.speed = clip.speed;
    state.wrapMode = clip.wrapMode;
    state.frameRate = clip.sample;

    if ((state.wrapMode & WrapModeMask.Loop) === WrapModeMask.Loop) {
        state.repeatCount = Infinity;
    }
    else {
        state.repeatCount = 1;
    }

    let curves = state.curves = clip.createCurves(state, root);

    // events curve

    let events = clip.events;

    if (events) {
        let curve;

        for (let i = 0, l = events.length; i < l; i++) {
            if (!curve) {
                curve = new EventAnimCurve();
                curve.target = root;
                curves.push(curve);
            }

            let eventData = events[i];
            let ratio = eventData.frame / state.duration;

            let eventInfo;
            let index = binarySearch(curve.ratios, ratio);
            if (index >= 0) {
                eventInfo = curve.events[index];
            }
            else {
                eventInfo = new EventInfo();
                curve.ratios.push(ratio);
                curve.events.push(eventInfo);
            }

            eventInfo.add(eventData.func, eventData.params);
        }
    }
}

if (CC_TEST) {
    cc._Test.initClipData = initClipData;
}


module.exports = AnimationAnimator;
