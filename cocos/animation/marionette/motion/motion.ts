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

import { Node } from '../../../scene-graph';
import { AnimationMask } from '../animation-mask';
import { createEval } from '../create-eval';
import type { BindContext } from '../parametric';
import type { BlendStateBuffer } from '../../../3d/skeletal-animation/skeletal-animation-blending';
import type { ClipStatus } from '../state-machine/state-machine-eval';
import type { ReadonlyClipOverrideMap } from '../clip-overriding';
import type { RuntimeID } from '../graph-debug';
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from '../animation-graph-context';
import { Pose } from '../../core/pose';
import { EditorExtendable } from '../../../core';
import { ccclass } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';

export interface CreateClipEvalContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: AnimationMask;
}

export interface MotionEval {
    /**
     * The runtime ID. Maybe invalid.
     */
    readonly runtimeId?: RuntimeID;

    /**
     * The duration of this motion. If it's a clip motion.
     * It should be $duration_{clip} / speed_{clip}$.
     */
    readonly duration: number;

    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;

    overrideClips(context: AnimationGraphBindingContext): void;

    createPort(): MotionPort;
}

// Note: the ccclass name mismatch
// since we ever made a historical mistaken: take a look at `MotionState`'s class name...
@ccclass(`${CLASS_NAME_PREFIX_ANIM}MotionBase`)
export abstract class Motion extends EditorExtendable {
    abstract [createEval] (
        context: AnimationGraphBindingContext,
        ignoreEmbeddedPlayers: boolean,
    ): MotionEval | null;

    abstract clone(): Motion;

    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive (): void {
        // Can be overrode in subclasses.
    }
}

export interface MotionPort {
    evaluate(progress: number, context: AnimationGraphEvaluationContext): Pose;

    reenter(): void;
}
