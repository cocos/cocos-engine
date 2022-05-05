import { editorExtrasTag } from '../../data';
import { ccclass, type } from '../../data/class-decorator';
import { EditorExtendable } from '../../data/editor-extendable';
import { AnimationClip } from '../animation-clip';
import { PoseOutput } from '../pose-output';
import { WrapModeMask, WrappedInfo } from '../types';
import { wrap } from '../wrap';
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
     * @internal
     */
    public declare __DEBUG__ID__?: string;

    public declare runtimeId?: number;

    public declare readonly duration: number;

    constructor (context: MotionEvalContext, clip: AnimationClip) {
        this.duration = clip.duration / clip.speed;
        this._clip = clip;
        const poseOutput = new PoseOutput(context.blendBuffer);
        this._poseOutput = poseOutput;
        this._clipEval = clip.createEvaluator({
            target: context.node,
            pose: poseOutput,
            mask: context.mask,
        });
        this._clipEventEval = clip.createEventEvaluator(context.node);
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
                            clip: this._clip,
                            weight: baseWeight,
                        },
                    };
                }
            },
        };
    }

    get progress () {
        return this._elapsedTime / this.duration;
    }

    public sample (progress: number, weight: number) {
        if (weight === 0.0) {
            return;
        }
        pushWeight(this._clip.name, weight);
        const { duration } = this;
        const elapsedTime = this.duration * progress;
        const { wrapMode } = this._clip;
        const repeatCount = (wrapMode & WrapModeMask.Loop) === WrapModeMask.Loop
            ? Infinity : 1;
        const wrapInfo = wrap(
            elapsedTime,
            duration,
            wrapMode,
            repeatCount,
            false,
            this._wrapInfo,
        );
        this._poseOutput.weight = weight;
        this._clipEval.evaluate(wrapInfo.time);
        this._poseOutput.weight = 0.0;
        this._clipEventEval.sample(
            wrapInfo.ratio,
            wrapInfo.direction,
            wrapInfo.iterations,
        );
    }

    private _clip: AnimationClip;

    private _poseOutput: PoseOutput;

    private _clipEval: ReturnType<AnimationClip['createEvaluator']>;

    private _clipEventEval: ReturnType<AnimationClip['createEventEvaluator']>;

    private _elapsedTime = 0.0;

    private _wrapInfo = new WrappedInfo();
}
