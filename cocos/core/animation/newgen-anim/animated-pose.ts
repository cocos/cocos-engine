import { ccclass, type } from '../../data/class-decorator';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { createEval } from './create-eval';
import { graphDebug, GRAPH_DEBUG_ENABLED, pushWeight } from './graph-debug';
import { PoseEvalContext, Pose, PoseEval } from './pose';

@ccclass('cc.animation.AnimatedPose')
export class AnimatedPose implements Pose {
    @type(AnimationClip)
    public clip: AnimationClip | null = null;

    public [createEval] (context: PoseEvalContext) {
        return !this.clip ? null : new AnimatedPoseEval(context, this.clip);
    }
}

class AnimatedPoseEval implements PoseEval {
    private declare _state: AnimationState;
    private _weight = 1.0;

    public declare readonly duration: number;

    constructor (context: PoseEvalContext, clip: AnimationClip) {
        this.duration = clip.duration;
        this._state = new AnimationState(clip);
        this._state.initialize(context.node, context.blendBuffer);
    }

    get progress () {
        return this._state.time / this.duration;
    }

    public active () {
        this._state.time = 0.0;
    }

    public inactive () {
    }

    public update (deltaTime: number) {
        this._state.time += deltaTime;
    }

    public setBaseWeight (weight: number) {
        if (GRAPH_DEBUG_ENABLED) {
            graphDebug(`Set state ${this._state.name} weight to ${weight}`);
        }
        this._weight = weight;
        this._state.weight = this._weight;
    }

    public sample () {
        pushWeight(this._state.name, this._state.weight);
        this._state.sample();
    }
}
