/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

declare const nr: any;
declare const jsb: any;

import * as pipeline from './define';
import * as decors from '../native-binding/decorators';
import { 
    InstancedBuffer as NrInstancedBuffer,
    PipelineStateManager as NrPipelineStateManager,
    ReflectionProbeFlow as NrReflectionProbeFlow,
    ReflectionProbeStage as NrReflectionProbeStage,
} from './index';

export { pipeline };
export * from './pass-phase';
export const InstancedBuffer: typeof NrInstancedBuffer = nr.InstancedBuffer;
export type InstancedBuffer = NrInstancedBuffer;
export const PipelineStateManager: typeof NrPipelineStateManager = nr.PipelineStateManager;
export type PipelineStateManager = NrPipelineStateManager;
export const ReflectionProbeFlow: typeof NrReflectionProbeFlow = nr.ReflectionProbeFlow;
export type ReflectionProbeFlow = NrReflectionProbeFlow;
export const ReflectionProbeStage: typeof NrReflectionProbeStage = nr.ReflectionProbeStage;
export type ReflectionProbeStage = NrReflectionProbeStage;
export { PipelineEventType } from './pipeline-event';

export * from './custom/settings';

interface IRenderFlowInfo {
    name: string;
    priority: number;
    stages: any[];
    tag: number;
}

interface IRenderStageInfo {
    name: string;
    priority: number;
    tag: number;
    renderQueues: any[];
}

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function (device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState(pass, shader, renderPass, ia); //cjh TODO: remove hacking. c++ API doesn't access device argument.
};

// TODO: we mark it as type of any, because here we have many dynamic injected property @dumganhar
const reflectionProbeFlowProto: any = ReflectionProbeFlow.prototype;
reflectionProbeFlowProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
reflectionProbeFlowProto.init = function (pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
        this._stages[i].init(pipeline);
    }
    const info: IRenderFlowInfo = { name: this._name, priority: this._priority, tag: this._tag, stages: this._stages };
    this.initialize(info);
}


// TODO: we mark it as type of any, because here we have many dynamic injected property @dumganhar
const reflectionProbeStage: any = ReflectionProbeStage.prototype;
reflectionProbeStage._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
}
reflectionProbeStage.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}

//-------------------- register types -------------------- 
decors.patch_ReflectionProbeStage({ReflectionProbeStage});
decors.patch_ReflectionProbeFlow({ReflectionProbeFlow});
