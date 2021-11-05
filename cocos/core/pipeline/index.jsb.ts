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

import { getPhaseID } from './pass-phase'
import { setClassName, mixin } from '../../core/utils/js';
import { DeferredPipelineSceneData } from './deferred/deferred-pipeline-scene-data';
import { legacyCC } from '../../core/global-exports';
import { Asset } from '../assets/asset';
import { Swapchain } from '../gfx';
import { Model, Camera } from '../renderer/scene';
import { CommonPipelineSceneData } from './common/common-pipeline-scene-data';
import { IPipelineEvent, PipelineEventType } from './pipeline-event';

nr.getPhaseID = getPhaseID;

export const RenderPipeline = nr.RenderPipeline;
export const RenderFlow = nr.RenderFlow;
export const RenderStage = nr.RenderStage;
export const InstancedBuffer = nr.InstancedBuffer;
export const PipelineStateManager = nr.PipelineStateManager;
export { PipelineEventProcessor, PipelineEventType } from './pipeline-event';

let instancedBufferProto = nr.InstancedBuffer;
let oldGetFunc = instancedBufferProto.get;

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function(device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState.call(device, pass.native, shader, renderPass, ia);
}

export function createDefaultPipeline () {
    const pipeline = new ForwardPipeline();
    pipeline.init();
    return pipeline;
}

// ForwardPipeline
export class ForwardPipeline extends nr.ForwardPipeline implements IPipelineEvent {
    public pipelineSceneData = new CommonPipelineSceneData();

    constructor() {
      super();
      this._tag = 0;
      this._flows = [];
      this.renderTextures = [];
      this.materials = [];
    }
    on(type: PipelineEventType, callback: any, target?: any, once?: boolean) {}
    once(type: PipelineEventType, callback: any, target?: any) {}
    off(type: PipelineEventType, callback?: any, target?: any) {}
    emit(type: PipelineEventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {}
    targetOff(typeOrTarget: any): void {}
    removeAll(typeOrTarget: any): void {}
    hasEventListener(type: PipelineEventType, callback?: any, target?: any): boolean { return false; }

    public init () {
        this.setPipelineSharedSceneData(this.pipelineSceneData.native);
        for (let i = 0; i < this._flows.length; i++) {
            this._flows[i].init(this);
        }
        const info = new nr.RenderPipelineInfo(this._tag, this._flows);
        this.initialize(info);
    }

    public activate (swapchain: Swapchain) {
        return super.activate(swapchain) && this.pipelineSceneData.activate(legacyCC.director.root.device, this as any);
    }

    public render (cameras: Camera[]) {
      let nativeObjs = [];
      for (let i = 0, len = cameras.length; i < len; ++i) {
          nativeObjs.push(cameras[i].native);
      }
      super.render(nativeObjs);
    }

    set profiler (value: Model) {
      this.setProfiler(value && value.native);
    }

    public destroy () {
        this.pipelineSceneData.destroy();
        super.destroy();
    }
}

mixin(ForwardPipeline.prototype, Asset.prototype);

const ForwardOnLoaded = ForwardPipeline.prototype.onLoaded;

// hook to invoke init after deserialization
ForwardPipeline.prototype.onLoaded = function () {
  if (ForwardOnLoaded) ForwardOnLoaded.call(this);
  this.init();
}

export class ForwardFlow extends nr.ForwardFlow {
    constructor() {
        super();
        this._name = 0;
        this._priority = 0;
        this._tag = 0;
        this._stages = [];
    }
    init(pipeline) {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].init(pipeline);
        }
        const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
        this.initialize(info);
    }
}

export class ShadowFlow extends nr.ShadowFlow {
    constructor() {
        super();
        this._name = 0;
        this._priority = 0;
        this._tag = 0;
        this._stages = [];
    }
    init(pipeline) {
        for (let i = 0; i < this._stages.length; i++) {
            this._stages[i].init(pipeline);
        }
        const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
        this.initialize(info);
    }
}

export class ForwardStage extends nr.ForwardStage {
    constructor() {
        super();
        this._name = 0;
        this._priority = 0;
        this._tag = 0;
        this.renderQueues = [];
    }
    public init(pipeline) {
        const queues = [];
        for (let i = 0; i < this.renderQueues.length; i++) {
            queues.push(this.renderQueues[i].init());
        }
        const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
        this.initialize(info);
    }
}

export class ShadowStage extends nr.ShadowStage {
    constructor() {
        super();
        this._name = 0;
        this._priority = 0;
        this._tag = 0;
    }
    public init(pipeline) {
        const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, []);
        this.initialize(info);
    }
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

export class DeferredPipeline extends nr.DeferredPipeline implements IPipelineEvent {
  public pipelineSceneData = new DeferredPipelineSceneData();
  constructor() {
    super();
    this._tag = 0;
    this._flows = [];
    this.renderTextures = [];
    this.materials = [];
  }
  on(type: PipelineEventType, callback: any, target?: any, once?: boolean) {}
  once(type: PipelineEventType, callback: any, target?: any) {}
  off(type: PipelineEventType, callback?: any, target?: any) {}
  emit(type: PipelineEventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {}
  targetOff(typeOrTarget: any): void {}
  removeAll(typeOrTarget: any): void {}
  hasEventListener(type: PipelineEventType, callback?: any, target?: any): boolean { return false; }

  init() {
    this.setPipelineSharedSceneData(this.pipelineSceneData.native);
    for (let i = 0; i < this._flows.length; i++) {
      this._flows[i].init(this);
    }
    let info = new nr.RenderPipelineInfo(this._tag, this._flows);
    this.initialize(info);
  }

  public activate (swapchain: Swapchain) {
    return super.activate(swapchain) && this.pipelineSceneData.activate(legacyCC.director.root.device, this as any);
  }

  public render (cameras: Camera[]) {
    let nativeObjs = [];
    for (let i = 0, len = cameras.length; i < len; ++i) {
      nativeObjs.push(cameras[i].native);
    }
    super.render(nativeObjs);
  }

  set profiler (value: Model) {
    this.setProfiler(value && value.native);
  }

  destroy () {
    this.fog.destroy();
    this.ambient.destroy();
    this.skybox.destroy();
    this.shadows.destroy();
    this.pipelineSceneData.destroy();
    super.destroy();
  }

}

mixin(DeferredPipeline.prototype, Asset.prototype);

const DeferredOnLoaded = DeferredPipeline.prototype.onLoaded;

// hook to invoke init after deserialization
DeferredPipeline.prototype.onLoaded = function () {
  if (DeferredOnLoaded) DeferredOnLoaded.call(this);
  this.init();
}

export class MainFlow extends nr.MainFlow {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
  }

  init(pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
      this._stages[i].init(pipeline);
    }
    let info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
    this.initialize(info);
  }
}

export class GbufferStage extends nr.GbufferStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = []
  }

  init(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
}

export class LightingStage extends nr.LightingStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._deferredMaterial = null;
  }
  init(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.deferredLightingMaterial = this._deferredMaterial;
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
}

export class BloomStage extends nr.BloomStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._bloomMaterial = null;
  }
  init(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.bloomMaterial = this._bloomMaterial;
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
}

export class PostProcessStage extends nr.PostProcessStage {
  constructor() {
    super();
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._postProcessMaterial = null;
  }
  init(pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
      queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.postprocessMaterial = this._postProcessMaterial;
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
  }
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
