import { ccclass, type } from '../../data/class-decorator';
import { EditorExtendable } from '../../data/editor-extendable';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { createEval } from './create-eval';
import { graphDebug, GRAPH_DEBUG_ENABLED, pushWeight } from './graph-debug';
import { PoseStatus } from './graph-eval';
import { PoseEvalContext, Pose, PoseEval } from './pose';

@ccclass('cc.animation.AnimatedPose')
export class AnimatedPose extends EditorExtendable implements Pose {
    @type(AnimationClip)
    public clip: AnimationClip | null = null;

    public [createEval] (context: PoseEvalContext) {
        return !this.clip ? null : new AnimatedPoseEval(context, this.clip);
    }

    public clone () {
        const that = new AnimatedPose();
        that.clip = this.clip;
        return that;
    }
}

class AnimatedPoseEval implements PoseEval {
    public declare __DEBUG__ID__?: string;

    private declare _state: AnimationState;

    public declare readonly duration: number;

    constructor (context: PoseEvalContext, clip: AnimationClip) {
        this.duration = clip.duration;
        this._state = new AnimationState(clip);
        this._state.initialize(context.node, context.blendBuffer);
    }

    public poses (baseWeight: number): Iterator<PoseStatus, any, undefined> {
        let got = false;
        return {
            next: () => {
                if (got) {
                    return {
                        done: true,
                        value: undefined,
                    };
                } else {
                    got = true;
                    return {
                        done: false,
                        value: {
                            __DEBUG_ID__: this.__DEBUG__ID__,
                            clip: this._state.clip,
                            weight: baseWeight,
                        },
                    };
                }
            },
        };
    }

    get progress () {
        return this._state.time / this.duration;
    }

    public sample (progress: number, weight: number) {
        pushWeight(this._state.name, weight);
        const time = this._state.duration * progress;
        this._state.time = time;
        this._state.weight = weight;
        this._state.sample();
        this._state.weight = 0.0;
    }
}
