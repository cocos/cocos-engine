/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module pipeline
 */

import * as pipeline from './define';
import { ForwardPipeline } from './forward/forward-pipeline';

export { pipeline };

export * from './pass-phase';

export { RenderPipeline } from './render-pipeline';
export { RenderFlow } from './render-flow';
export { RenderStage } from './render-stage';

export { ForwardPipeline } from './forward/forward-pipeline';
export { ForwardFlow } from './forward/forward-flow';
export { ForwardStage } from './forward/forward-stage';
export { DeferredPipeline } from './deferred/deferred-pipeline';
export { MainFlow } from './deferred/main-flow';
export { GbufferStage } from './deferred/gbuffer-stage';
export { LightingStage } from './deferred/lighting-stage';
export { PostprocessStage } from './deferred/postprocess-stage';
export { ShadowFlow } from './shadow/shadow-flow';
export { ShadowStage } from './shadow/shadow-stage';

export { InstancedBuffer } from './instanced-buffer';
export { PipelineStateManager } from './pipeline-state-manager';

export function createDefaultPipeline () {
    const rppl = new ForwardPipeline();
    rppl.initialize({ flows: [] });
    return rppl;
}
