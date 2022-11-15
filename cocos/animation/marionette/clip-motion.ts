import { editorExtrasTag, _decorator, EditorExtendable } from '../../core';
import { AnimationClip } from '../animation-clip';
import { AnimationState } from '../animation-state';
import { cloneAnimationGraphEditorExtrasFrom } from './animation-graph-editor-extras-clone-helper';
import { createEval } from './create-eval';
import { getMotionRuntimeID, RUNTIME_ID_ENABLED } from './graph-debug';
import { ReadonlyClipOverrideMap, ClipStatus } from './graph-eval';
import { MotionEvalContext, Motion, MotionEval, OverrideClipContext, CreateClipEvalContext } from './motion';

const { ccclass, type } = _decorator;

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
        that[editorExtrasTag] = cloneAnimationGraphEditorExtrasFrom(this);
        return that;
    }
}

class ClipMotionEval implements MotionEval {
    /**
     * @internal
     */
    public declare __DEBUG__ID__?: string;

    public declare runtimeId?: number;

    private declare _state: AnimationState;

    constructor (context: MotionEvalContext, clip: AnimationClip) {
        const overriding = context.clipOverrides?.get(clip) ?? clip;
        this._duration = overriding.duration / overriding.speed;
        this._state = this._createState(overriding, context);
        this._originalClip = clip;
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

    get duration () {
        return this._duration;
    }

    get progress () {
        return this._state.time / this.duration;
    }

    public sample (progress: number, weight: number) {
        if (weight === 0.0) {
            return;
        }
        const time = this._state.duration * progress;
        this._state.time = time;
        this._state.weight = weight;
        this._state.sample();
        this._state.weight = 0.0;
    }

    public overrideClips (overrides: ReadonlyClipOverrideMap, context: OverrideClipContext): void {
        const { _originalClip: originalClip } = this;
        const overriding = overrides.get(originalClip);
        if (overriding) {
            this._state.destroy();
            this._state = this._createState(overriding, context);
            this._duration = overriding.duration / overriding.speed;
        }
    }

    /**
     * Preserved here for clip overriding.
     */
    private declare _originalClip: AnimationClip;

    private declare _duration: number;

    private _createState (clip: AnimationClip, context: CreateClipEvalContext) {
        const state = new AnimationState(clip);
        state.initialize(context.node, context.blendBuffer, context.mask);
        return state;
    }
}
