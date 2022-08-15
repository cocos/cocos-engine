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
import { setClassName } from '../../core/utils/js';
import { PipelineEventType } from './pipeline-event';
import * as pipeline from './define';
export { pipeline };

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
export const DeferredPipeline = nr.DeferredPipeline;
export const MainFlow = nr.MainFlow;
export const LightingStage = nr.LightingStage;
export const PostProcessStage = nr.PostProcessStage;
export const GbufferStage = nr.GbufferStage;
export const BloomStage = nr.BloomStage;
export { PipelineEventType } from './pipeline-event';

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function(device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState(pass, shader, renderPass, ia); //cjh TODO: remove hacking. c++ API doesn't access device argument.
};

// ForwardPipeline
const forwardPipelineProto = ForwardPipeline.prototype;
forwardPipelineProto._ctor = function() {
    this._tag = 0;
    this._flows = [];
};

forwardPipelineProto.init = function () {
      for (let i = 0; i < this._flows.length; i++) {
          this._flows[i].init(this);
      }
      const info = new nr.RenderPipelineInfo(this._tag, this._flows);
      this.initialize(info);
};

const oldForwardOnLoaded = forwardPipelineProto.onLoaded;
// hook to invoke init after deserialization
forwardPipelineProto.onLoaded = function () {
    if (oldForwardOnLoaded) oldForwardOnLoaded.call(this);
    for (let i = 0; i < this._flows.length; i++) {
        this._flows[i].init(this);
    }
    const info = new nr.RenderPipelineInfo(this._tag, this._flows);
    this.initialize(info);
}

const forwardFlowProto = ForwardFlow.prototype;
forwardFlowProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
forwardFlowProto.init = function(pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
        this._stages[i].init(pipeline);
    }
    const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
}

const shadowFlowProto = ShadowFlow.prototype;
shadowFlowProto._ctor = function() {
  this._name = 0;
      this._priority = 0;
      this._tag = 0;
      this._stages = [];
}
shadowFlowProto.init = function (pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init(pipeline);
    }
    const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
}

const forwardStageProto = ForwardStage.prototype;
forwardStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
}
forwardStageProto.init = function(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}

const shadowStageProto = ShadowStage.prototype;
shadowStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
}
shadowStageProto.init = function(pipeline) {
    const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, []);
    this.initialize(info);
}

export class RenderQueueDesc {
  public isTransparent = false;
  public sortMode = 0;
  public stages = [];

  constructor() {
      this.isTransparent = false;
      this.sortMode = 0;
      this.stages = [];
  }

  public init() {
      return new nr.RenderQueueDesc(this.isTransparent, this.sortMode, this.stages);
  }
}

const deferredPipelineProto = DeferredPipeline.prototype;
deferredPipelineProto._ctor = function() {
    this._tag = 0;
    this._flows = [];
    this.renderTextures = [];
    this.materials = [];
}

const oldDeferredOnLoaded = deferredPipelineProto.onLoaded;
// hook to invoke init after deserialization
deferredPipelineProto.onLoaded = function () {
    if (oldDeferredOnLoaded) oldDeferredOnLoaded.call(this);

    for (let i = 0; i < this._flows.length; i++) {
        this._flows[i].init(this);
    }
    let info = new nr.RenderPipelineInfo(this._tag, this._flows);
    this.initialize(info);
}

const mainFlowProto = MainFlow.prototype;
mainFlowProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
mainFlowProto.init = function(pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init(pipeline);
    }
    let info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
}

const gbufferStageProto = GbufferStage.prototype;
gbufferStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
}
gbufferStageProto.init = function(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}


const lightingStageProto = LightingStage.prototype;
lightingStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._deferredMaterial = null;
}
lightingStageProto.init = function(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.deferredLightingMaterial = this._deferredMaterial;
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}

const bloomStageProto = BloomStage.prototype;
bloomStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._bloomMaterial = null;
}
bloomStageProto.init = function(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.bloomMaterial = this._bloomMaterial;
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}

const postProcessStageProto = PostProcessStage.prototype;
postProcessStageProto._ctor = function() {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._postProcessMaterial = null;
}
postProcessStageProto.init = function(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.postProcessMaterial = this._postProcessMaterial;
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}

setClassName('DeferredPipeline', DeferredPipeline);
setClassName('MainFlow', MainFlow);
setClassName('GbufferStage', GbufferStage);
setClassName('LightingStage', LightingStage);
setClassName('BloomStage', BloomStage);
setClassName('PostProcessStage',PostProcessStage);
setClassName('ForwardPipeline', ForwardPipeline);
setClassName('ForwardFlow', ForwardFlow);
setClassName('ShadowFlow', ShadowFlow);
setClassName('ForwardStage', ForwardStage);
setClassName('ShadowStage', ShadowStage);
setClassName('RenderQueueDesc', RenderQueueDesc);
