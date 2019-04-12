import { ccclass } from '../core/data/class-decorator';
import { errorID } from '../core/platform/CCDebug';
import { MutableForwardIterator } from '../core/utils/array';
import { Node } from '../scene-graph';
import { AnimationBlendState } from './animation-blend-state';
import { AnimationState } from './animation-state';
import { CrossFade } from './cross-fade';

@ccclass
export class AnimationManager {
    private _anims = new MutableForwardIterator<AnimationState>([]);
    private _delayEvents: Array<{target: Node; func: string; args: any[]; }> = [];
    private _blendState: AnimationBlendState = new AnimationBlendState();
    private _crossFades: CrossFade[] = [];

    constructor () {
        if (cc.director._scheduler) {
            cc.director._scheduler.enableForTarget(this);
        }
    }

    public get blendState () {
        return this._blendState;
    }

    public addCrossFade (crossFade: CrossFade) {
        this._crossFades.push(crossFade);
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
            anim.blendState = this.blendState;
            this._anims.push(anim);
        }
    }

    public removeAnimation (anim: AnimationState) {
        const index = this._anims.array.indexOf(anim);
        if (index >= 0) {
            anim.blendState = null;
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
