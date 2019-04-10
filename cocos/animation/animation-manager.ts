import { ccclass } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import { Node } from '../scene-graph';
import { AnimationState } from './animation-state';

@ccclass
export class AnimationManager {
    private _anims = new cc.js.array.MutableForwardIterator([]);
    private _delayEvents: Array<{target: Node; func: string; args: any[]; }> = [];

    constructor () {
        if (cc.director._scheduler) {
            cc.director._scheduler.enableForTarget(this);
        }
    }

    public update (dt: number) {
        const iterator = this._anims;
        const array = iterator.array;
        for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
            const anim = array[iterator.i];
            if (anim._isPlaying && !anim._isPaused) {
                anim.update(dt);
            }
        }

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

cc.AnimationManager = AnimationManager;
