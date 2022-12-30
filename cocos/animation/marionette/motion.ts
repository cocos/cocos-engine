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

import { Node } from '../../scene-graph';
import { AnimationMask } from './animation-mask';
import { createEval } from './create-eval';
import type { BindContext } from './parametric';
import type { BlendStateBuffer } from '../../3d/skeletal-animation/skeletal-animation-blending';
import type { ReadonlyClipOverrideMap, ClipStatus } from './graph-eval';
import type { RuntimeID } from './graph-debug';

export interface CreateClipEvalContext {
    node: Node;

    blendBuffer: BlendStateBuffer;

    mask?: AnimationMask;
}

export interface MotionEvalContext extends BindContext, CreateClipEvalContext {
    clipOverrides: ReadonlyClipOverrideMap | null;
}

export interface MotionEval {
    /**
     * The runtime ID. Maybe invalid.
     */
    readonly runtimeId?: RuntimeID;

    readonly duration: number;
    sample(progress: number, baseWeight: number): void;
    getClipStatuses(baseWeight: number): Iterator<ClipStatus>;

    overrideClips(overrides: ReadonlyClipOverrideMap, context: OverrideClipContext): void;
}

export type OverrideClipContext = CreateClipEvalContext;

export interface Motion {
    [createEval] (context: MotionEvalContext): MotionEval | null;

    clone(): Motion;
}
