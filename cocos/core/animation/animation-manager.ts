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
import { BlendStateBuffer } from './skeletal-animation-blending';
import { AnimationState } from './animation-state';
import { CrossFade } from './cross-fade';
import { legacyCC } from '../global-exports';

@ccclass
export class AnimationManager extends System {

    public get blendState () {
        return this._blendStateBuffer;
    }

    public static ID = 'animation';
    private _anims = new MutableForwardIterator<AnimationState>([]);
    private _delayEvents: Array<{target: Node; func: string; args: any[]}> = [];
    private _blendStateBuffer: BlendStateBuffer = new BlendStateBuffer();
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
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            if (!anim.isMotionless) {
                anim.update(dt);
            }
        }
        this._blendStateBuffer.apply();

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
            this._anims.push(anim);
        }
    }

    public removeAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
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

legacyCC.AnimationManager = AnimationManager;
