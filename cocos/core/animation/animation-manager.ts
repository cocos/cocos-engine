/**
 * @category animation
 */

import System from '../components/system';
import { ccclass } from '../data/class-decorator';
import { director, Director } from '../director';
import { errorID } from '../platform/debug';
import { Node } from '../scene-graph';
import { Scheduler } from '../scheduler';
import { MutableForwardIterator, remove } from '../utils/array';
import { AnimationBlendState } from './animation-blend-state';
import { AnimationState } from './animation-state';
import { CrossFade } from './cross-fade';

@ccclass
export class AnimationManager extends System {

    public get blendState () {
        return this._blendState;
    }

    public static ID = 'animation';
    private _anims = new MutableForwardIterator<AnimationState>([]);
    private _delayEvents: Array<{target: Node; func: string; args: any[]; }> = [];
    private _blendState: AnimationBlendState = new AnimationBlendState();
    private _crossFades: CrossFade[] = [];

    public addCrossFade (crossFade: CrossFade) {
        this._crossFades.push(crossFade);
    }

    public removeCrossFade (crossFade: CrossFade) {
        remove(this._crossFades, crossFade);
    }

    public update (dt: number) {
        for (const crossFade of this._crossFades) {
            crossFade.update(dt);
        }
        this._blendState.clear();
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            if (anim.isPlaying && !anim.isPaused) {
                anim.update(dt);
            }
        }
        this._blendState.apply();

        const events = this._delayEvents;
        for (let i = 0, l = events.length; i < l; i++) {
            const event = events[i];
            event.target[event.func].apply(event.target, event.args);
        }
        events.length = 0;
    }

    public destruct () {

    }

    public addAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index === -1) {
            anim.attachToBlendState(this._blendState);
            this._anims.push(anim);
        }
    }

    public removeAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            anim.detachFromBlendState(this._blendState);
            this._anims.fastRemoveAt(index);
        } else {
            errorID(3907);
        }
    }

    public pushDelayEvent (target: Node, func: string, args: any[]) {
        this._delayEvents.push({
            target,
            func,
            args,
        });
    }
}

director.on(Director.EVENT_INIT, () => {
    const animationManager = new AnimationManager();
    director.registerSystem(AnimationManager.ID, animationManager, Scheduler.PRIORITY_SYSTEM);
});

cc.AnimationManager = AnimationManager;
