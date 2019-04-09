import { LegacyAnimationComponent } from '../components/legacy-animation-component';
import { binarySearchEpsilon as binarySearch } from '../core/data/utils/binary-search';
import { MutableForwardIterator } from '../core/utils/array';
import { Node } from '../scene-graph';
import { LegacyAnimationClip } from './animation-clip';
import { EventAnimCurve, EventInfo } from './animation-curve';
import { LegacyAnimationState } from './animation-state';
import { Playable } from './playable';
import { WrapModeMask } from './types';

/**
 * The actual animator for Animation Component.
 */
export class AnimationAnimator extends Playable {
    public _anims = new MutableForwardIterator<LegacyAnimationState>([]);

    constructor (public target: Node, public animation: LegacyAnimationComponent) {
        super();
    }

    public playState (state: LegacyAnimationState, startTime?: number) {
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
    }

    public stopStatesExcept (state: LegacyAnimationState) {
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            if (anim === state) {
                continue;
            }

            this.stopState(anim);
        }
    }

    public addAnimation (anim) {
        const index = this._anims.array.indexOf(anim);
        if (index === -1) {
            this._anims.push(anim);
        }

        anim._setEventTarget(this.animation);
    }

    public removeAnimation (anim) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            this._anims.fastRemoveAt(index);

            if (this._anims.array.length === 0) {
                this.stop();
            }
        }
        else {
            cc.errorID(3908);
        }

        anim.animator = null;
    }

    public sample () {
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            anim.sample();
        }
    }

    public stopState (state: LegacyAnimationState) {
        if (state) {
            state.stop();
        }
    }

    public pauseState (state: LegacyAnimationState) {
        if (state) {
            state.pause();
        }
    }

    public resumeState (state: LegacyAnimationState) {
        if (state) {
            state.resume();
        }

        if (this.isPaused) {
            this.resume();
        }
    }

    public setStateTime (state: LegacyAnimationState, time: number): void;

    public setStateTime (time: number): void;

    public setStateTime (state: LegacyAnimationState | number, time?: number) {
        if (time !== undefined) {
            (state as LegacyAnimationState).setTime(time);
            (state as LegacyAnimationState).sample();
        }
        else {
            for (const anim of this._anims.array) {
                anim.setTime(state as number);
                anim.sample();
            }
        }
    }

    public onStop () {
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            anim.stop();
        }
    }

    public onPause () {
        for (const anim of this._anims.array) {
            anim.pause();
            // need to unbind animator to anim, or it maybe cannot be gc.
            anim.animator = null;
        }
    }

    public onResume () {
        for (const anim of this._anims.array) {
            // rebind animator to anim
            anim.animator = this;

            anim.resume();
        }
    }

    public _reloadClip (state: LegacyAnimationState) {
        initClipData(this.target, state);
    }
}

// 这个方法应该是 SampledAnimCurve 才能用
function createBatchedProperty (propPath, firstDotIndex, mainValue, animValue) {
    mainValue = mainValue.clone();
    let nextValue = mainValue;
    let leftIndex = firstDotIndex + 1;
    let rightIndex = propPath.indexOf('.', leftIndex);

    // scan property path
    while (rightIndex !== -1) {
        const nextName = propPath.slice(leftIndex, rightIndex);
        nextValue = nextValue[nextName];
        leftIndex = rightIndex + 1;
        rightIndex = propPath.indexOf('.', leftIndex);
    }
    const lastPropName = propPath.slice(leftIndex);
    nextValue[lastPropName] = animValue;

    return mainValue;
}

if (CC_TEST) {
    cc._Test.createBatchedProperty = createBatchedProperty;
}

function initClipData (root, state) {
    const clip = state.clip;

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

    const curves = state.curves = clip.createCurves(state, root);

    // events curve

    const events = clip.events;

    if (!CC_EDITOR && events) {
        let curve;

        for (let i = 0, l = events.length; i < l; i++) {
            if (!curve) {
                curve = new EventAnimCurve();
                curve.target = root;
                curves.push(curve);
            }

            const eventData = events[i];
            const ratio = eventData.frame / state.duration;

            let eventInfo;
            const index = binarySearch(curve.ratios, ratio);
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
