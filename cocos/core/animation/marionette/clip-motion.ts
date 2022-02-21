import { editorExtrasTag } from '../../data';
import { ccclass, type } from '../../data/class-decorator';
import { EditorExtendable } from '../../data/editor-extendable';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { createEval } from './create-eval';
import { getMotionRuntimeID, graphDebug, GRAPH_DEBUG_ENABLED, pushWeight, RUNTIME_ID_ENABLED } from './graph-debug';
import { ClipStatus } from './graph-eval';
import { MotionEvalContext, Motion, MotionEval } from './motion';

@ccclass('cc.animation.ClipMotion')
export class ClipMotion extends EditorExtendable implements Motion {
    @type(AnimationClip)
    public clip: AnimationClip | null = null;

    public [createEval] (context: MotionEvalContext) {
        if (!this.clip) {
            return null;
        }
        const clipMotionEval = new ClipMotionEval(context, this.clip);
        if (RUNTIME_ID_ENABLED) {
            clipMotionEval.runtimeId = getMotionRuntimeID(this);
        }
        return clipMotionEval;
    }

    public clone () {
        const that = new ClipMotion();
        that.clip = this.clip;
        return that;
    }
}

class ClipMotionEval implements MotionEval {
    /**
     * @legacyPublic
     */
    public declare __DEBUG__ID__?: string;

    public declare runtimeId?: number;

    private declare _state: AnimationState;

    public declare readonly duration: number;

    constructor (context: MotionEvalContext, clip: AnimationClip) {
        this.duration = clip.duration / clip.speed;
        this._state = new AnimationState(clip);
        this._state.initialize(context.node, context.blendBuffer, context.mask);
    }

    public getClipStatuses (baseWeight: number): Iterator<ClipStatus, any, undefined> {
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
        if (weight === 0.0) {
            return;
        }
        pushWeight(this._state.name, weight);
        const time = this._state.duration * progress;
        this._state.time = time;
        this._state.weight = weight;
        this._state.sample();
        this._state.weight = 0.0;
    }
}
