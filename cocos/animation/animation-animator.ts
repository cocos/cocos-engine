import { AnimationComponent } from '../components/animation-component';
import { binarySearchEpsilon as binarySearch } from '../core/data/utils/binary-search';
import { errorID } from '../core/platform/CCDebug';
import { MutableForwardIterator } from '../core/utils/array';
import { Node } from '../scene-graph';
import { AnimationBlendState } from './animation-blend-state';
import { EventAnimCurve, EventInfo } from './animation-curve';
import { AnimationState } from './animation-state';
import { Playable } from './playable';
import { WrapModeMask } from './types';

/**
 * The actual animator for Animation Component.
 */
export class AnimationAnimator extends Playable {
    public _anims = new MutableForwardIterator<AnimationState>([]);

    constructor (public target: Node, public animation: AnimationComponent) {
        super();
    }

    public playState (state: AnimationState, startTime?: number) {
        if (!state.clip) {
            return;
        }

        if (!state.curveLoaded) {
            state.initialize(this.target);
        }

        state.animator = this;
        state.play();

        if (typeof startTime === 'number') {
            state.setTime(startTime);
        }

        this.play();
    }

    public stopStatesExcept (state: AnimationState) {
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

    public addAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index === -1) {
            this._anims.push(anim);
        }

        anim._setEventTarget(this.animation);
    }

    public removeAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            this._anims.fastRemoveAt(index);

            if (this._anims.array.length === 0) {
                this.stop();
            }
        }
        else {
            errorID(3908);
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

    public stopState (state?: AnimationState) {
        if (state) {
            state.stop();
        }
    }

    public pauseState (state?: AnimationState) {
        if (state) {
            state.pause();
        }
    }

    public resumeState (state?: AnimationState) {
        if (state) {
            state.resume();
        }

        if (this.isPaused) {
            this.resume();
        }
    }

    public setStateTime (state: AnimationState, time: number): void;

    public setStateTime (time: number): void;

    public setStateTime (state: AnimationState | number, time?: number) {
        if (time !== undefined) {
            (state as AnimationState).setTime(time);
            (state as AnimationState).sample();
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

    public _reloadClip (state: AnimationState) {
        state.initialize(this.target);
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
