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

declare const nr: any;

import { getPhaseID } from './pass-phase';

nr.getPhaseID = getPhaseID;

export const RenderPipeline = nr.RenderPipeline;
export const RenderFlow = nr.RenderFlow;
export const RenderStage = nr.RenderStage;
export const InstancedBuffer = nr.InstancedBuffer;
export const PipelineStateManager = nr.PipelineStateManager;
export const ForwardPipeline = nr.ForwardPipeline;
export const ForwardFlow = nr.ForwardFlow;
export const ShadowFlow = nr.ShadowFlow;
export const ForwardStage = nr.ForwardStage;
export const ShadowStage = nr.ShadowStage;
export const RenderQueueDesc = nr.RenderQueueDesc;
export const DeferredPipeline = nr.DeferredPipeline;
export const MainFlow = nr.MainFlow;
export const LightingStage = nr.LightingStage;
export const PostProcessStage = nr.PostProcessStage;
export const GbufferStage = nr.GbufferStage;
export { PipelineEventProcessor, PipelineEventType } from './pipeline-event';

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function(device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState(pass, shader, renderPass, ia); //cjh TODO: remove hacking. c++ API doesn't access device argument.
};

export function createDefaultPipeline () {
    const pipeline = new ForwardPipeline();
    pipeline.init();
    return pipeline;
}

const ForwardOnLoaded = ForwardPipeline.prototype.onLoaded;

// hook to invoke init after deserialization
ForwardPipeline.prototype.onLoaded = function () {
  if (ForwardOnLoaded) ForwardOnLoaded.call(this);
  this.init();
}

const DeferredOnLoaded = DeferredPipeline.prototype.onLoaded;

// hook to invoke init after deserialization
DeferredPipeline.prototype.onLoaded = function () {
  if (DeferredOnLoaded) DeferredOnLoaded.call(this);
  this.init();
}
