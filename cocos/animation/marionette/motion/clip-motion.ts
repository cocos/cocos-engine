/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { editorExtrasTag, _decorator, EditorExtendable, editable, serializable } from '../../../core';
import { additiveSettingsTag, AnimationClip } from '../../animation-clip';
import { cloneAnimationGraphEditorExtrasFrom } from '../animation-graph-editor-extras-clone-helper';
import { createEval } from '../create-eval';
import { getMotionRuntimeID, RUNTIME_ID_ENABLED } from '../graph-debug';
import type { ClipStatus } from '../state-machine/state-machine-eval';
import type { ReadonlyClipOverrideMap } from '../clip-overriding';
import { Motion, MotionEval, MotionPort } from './motion';
import { wrap } from '../../wrap';
import { Pose } from '../../core/pose';
import { AnimationGraphEvaluationContext, AnimationGraphBindingContext } from '../animation-graph-context';
import { WrappedInfo } from '../../types';
import { WrapModeMask } from '../../../core/geometry';
import { AnimationClipAGEvaluation, createAnimationAGEvaluation } from '../animation-graph-animation-clip-binding';

const { ccclass, type } = _decorator;

@ccclass('cc.animation.ClipMotion')
export class ClipMotion extends Motion {
    @type(AnimationClip)
    @editable
    @serializable
    public clip: AnimationClip | null = null;

    public [createEval] (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
    ): ClipMotionEval | null {
        if (!this.clip) {
            return null;
        }
        const clipMotionEval = new ClipMotionEval(context, this.clip, ignoreEmbeddedPlayers);
        if (RUNTIME_ID_ENABLED) {
            clipMotionEval.runtimeId = getMotionRuntimeID(this);
        }
        return clipMotionEval;
    }

    public clone (): ClipMotion {
        const that = new ClipMotion();
        that.clip = this.clip;
        that[editorExtrasTag] = cloneAnimationGraphEditorExtrasFrom(this);
        return that;
    }
}

const evaluatePortTag = Symbol('EvaluatePort');

class ClipMotionEval implements MotionEval {
    /**
     * @internal
     */
    public declare __DEBUG__ID__?: string;

    public declare runtimeId?: number;

    constructor (
        context: AnimationGraphBindingContext,
        clip: AnimationClip,
        ignoreEmbeddedPlayers: boolean,
    ) {
        this._originalClip = clip;
        this._ignoreEmbeddedPlayers = ignoreEmbeddedPlayers;
        const overriding = context.clipOverrides?.get(clip) ?? clip;
        this._setClip(overriding, context);
    }

    get duration (): number {
        return this._duration;
    }

    public createPort (): MotionPort {
        return new ClipMotionPort(this);
    }

    public getClipStatuses (baseWeight: number): Iterator<ClipStatus> {
        let got = false;
        return {
            next: (): IteratorResult<ClipStatus, any> => {
                if (got) {
                    return {
                        done: true,
                        value: undefined,
                    };
                } else {
                    got = true;
                    return {
                        done: false,
                        // TODO: `__DEBUG_ID__` does not exist on ClipStatus, please fix it @Leslie Leigh
                        // tracking issue: https://github.com/cocos/cocos-engine/issues/15307
                        value: {
                            __DEBUG_ID__: this.__DEBUG__ID__,
                            clip: this._clip,
                            weight: baseWeight,
                        } as any,
                    };
                }
            },
        };
    }

    public [evaluatePortTag] (progress: number, context: AnimationGraphEvaluationContext): Pose {
        const {
            _duration: duration,
            _clip: { duration: clipDuration },
            _clipEval: clipEval,
        } = this;

        const elapsedTime = duration * progress;

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

        // Transform the motion space time(scaled by clip speed) into clip space time.
        const clipTime = wrapInfo.ratio * clipDuration;

        const pose = clipEval.evaluate(clipTime, context);

        // Sample frame events.
        this._frameEventEval?.sample(wrapInfo.ratio, wrapInfo.direction, wrapInfo.iterations);

        // Evaluate embedded players.
        this._clipEmbeddedPlayerEval?.evaluate(clipTime, Math.trunc(wrapInfo.iterations));

        return pose;
    }

    public overrideClips (context: AnimationGraphBindingContext): void {
        const { _originalClip: originalClip } = this;
        const overriding = context.clipOverrides?.get(originalClip);
        if (overriding) {
            this._setClip(overriding, context);
        }
    }

    public reenter (): void {
        this._frameEventEval?.reset();
    }

    /**
     * Preserved here for clip overriding.
     */
    private declare _originalClip: AnimationClip;
    /**
     * Actual clip used. Will be equal to `this._originalClip` if not being override.
     */
    private declare _clip: AnimationClip;
    private declare _clipEval: AnimationClipAGEvaluation;
    private _clipEmbeddedPlayerEval: ReturnType<AnimationClip['createEmbeddedPlayerEvaluator']> | null = null;
    private _frameEventEval: ReturnType<AnimationClip['createEventEvaluator']> | null = null;
    private _wrapInfo = new WrappedInfo();
    private _duration = 0.0;
    private _ignoreEmbeddedPlayers: boolean;

    private _setClip (clip: AnimationClip, context: AnimationGraphBindingContext): void {
        this._clipEval?.destroy();
        this._frameEventEval = null;
        if (this._clipEmbeddedPlayerEval) {
            this._clipEmbeddedPlayerEval.destroy();
            this._clipEmbeddedPlayerEval = null;
        }

        this._clip = clip;
        this._duration = clip.speed === 0.0
            ? 0.0
            : clip.duration / clip.speed; // TODO, a test for `clip.speed === 0` is required!
        this._clipEval = createAnimationAGEvaluation(clip, context);
        this._frameEventEval = clip.createEventEvaluator(context.origin);
        if (!this._ignoreEmbeddedPlayers && clip.containsAnyEmbeddedPlayer()) {
            this._clipEmbeddedPlayerEval = clip.createEmbeddedPlayerEvaluator(context.origin);
        }
    }
}

class ClipMotionPort implements MotionPort {
    constructor (host: ClipMotionEval) {
        this._eval = host;
    }

    public evaluate (progress: number, context: AnimationGraphEvaluationContext): Pose {
        return this._eval[evaluatePortTag](progress, context);
    }

    public reenter (): void {
        this._eval.reenter();
    }

    private _eval: ClipMotionEval;
}
