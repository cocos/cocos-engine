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

import { getPhaseID } from './pass-phase';
import { ccenum, CCString, js } from '../core';
import * as pipeline from './define';
import { ccclass, serializable, editable, type, visible } from '../core/data/class-decorator';
import { legacyCC } from '../core/global-exports';
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
export const ReflectionProbeFlow = nr.ReflectionProbeFlow;
export const ReflectionProbeStage = nr.ReflectionProbeStage;
export { PipelineEventType } from './pipeline-event';

interface IRenderFlowInfo {
    name: string;
    priority: number;
    stages: any[];
    tag: number;
}

interface IRenderPipelineInfo {
    flows: any[];
    tag: number;
}
interface IRenderStageInfo {
    name: string;
    priority: number;
    tag: number;
    renderQueues: RenderQueueDesc[];
}

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function (device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState(pass, shader, renderPass, ia); //cjh TODO: remove hacking. c++ API doesn't access device argument.
};

// ForwardPipeline
const forwardPipelineProto = ForwardPipeline.prototype;
forwardPipelineProto._ctor = function () {
    this._tag = 0;
    this._flows = [];
};

forwardPipelineProto.init = function () {
    for (let i = 0; i < this._flows.length; i++) {
        this._flows[i].init(this);
    }
    const info: IRenderPipelineInfo = { tag: this._tag, flows: this._flows };
    this.initialize(info);
};

const oldForwardOnLoaded = forwardPipelineProto.onLoaded;
// hook to invoke init after deserialization
forwardPipelineProto.onLoaded = function () {
    if (oldForwardOnLoaded) oldForwardOnLoaded.call(this);
    for (let i = 0; i < this._flows.length; i++) {
        this._flows[i].init(this);
    }
    const info: IRenderPipelineInfo = { tag: this._tag, flows: this._flows };
    this.initialize(info);
}

const forwardFlowProto = ForwardFlow.prototype;
forwardFlowProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
forwardFlowProto.init = function (pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
        this._stages[i].init(pipeline);
    }
    const info: IRenderFlowInfo = { name: this._name, priority: this._priority, tag: this._tag, stages: this._stages };
    this.initialize(info);
}

const shadowFlowProto = ShadowFlow.prototype;
shadowFlowProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
shadowFlowProto.init = function (pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
        this._stages[i].init(pipeline);
    }
    const info: IRenderFlowInfo = { name: this._name, priority: this._priority, tag: this._tag, stages: this._stages };
    this.initialize(info);
}

const reflectionProbeFlowProto = ReflectionProbeFlow.prototype;
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

const forwardStageProto = ForwardStage.prototype;
forwardStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
}
forwardStageProto.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}

const shadowStageProto = ShadowStage.prototype;
shadowStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
}

const reflectionProbeStage = ReflectionProbeStage.prototype;
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


export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}
ccenum(RenderQueueSortMode);

shadowStageProto.init = function (pipeline) {
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: [] };
    this.initialize(info);
}

export class RenderQueueDesc {

    /**
 * @en Whether the render queue is a transparent queue
 * @zh 当前队列是否是半透明队列
    */
    @serializable
    @editable
    public isTransparent = false;

    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    @type(RenderQueueSortMode)
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    /**
 * @en The stages using this queue
 * @zh 使用当前渲染队列的阶段列表
 */
    @type([CCString])
    public stages: string[] = [];

    constructor() {
        this.stages = [];
    }

    public init() {
        return new nr.RenderQueueDesc(this.isTransparent, this.sortMode, this.stages);
    }
}

const deferredPipelineProto = DeferredPipeline.prototype;
deferredPipelineProto._ctor = function () {
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
    let info = { tag: this._tag, flows: this._flows };
    this.initialize(info);
}

const mainFlowProto = MainFlow.prototype;
mainFlowProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this._stages = [];
}
mainFlowProto.init = function (pipeline) {
    for (let i = 0; i < this._stages.length; i++) {
        this._stages[i].init(pipeline);
    }
    const info: IRenderFlowInfo = { name: this._name, priority: this._priority, tag: this._tag, stages: this._stages };
    this.initialize(info);
}

const gbufferStageProto = GbufferStage.prototype;
gbufferStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
}
gbufferStageProto.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}


const lightingStageProto = LightingStage.prototype;
lightingStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._deferredMaterial = null;
}
lightingStageProto.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.deferredLightingMaterial = this._deferredMaterial;
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}

const bloomStageProto = BloomStage.prototype;
bloomStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._bloomMaterial = null;
}
bloomStageProto.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.bloomMaterial = this._bloomMaterial;
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}

const postProcessStageProto = PostProcessStage.prototype;
postProcessStageProto._ctor = function () {
    this._name = 0;
    this._priority = 0;
    this._tag = 0;
    this.renderQueues = [];
    this._postProcessMaterial = null;
}
postProcessStageProto.init = function (pipeline) {
    const queues = [];
    for (let i = 0; i < this.renderQueues.length; i++) {
        // @ts-ignore
        queues.push(this.renderQueues[i].init());
    }
    pipeline.pipelineSceneData.postProcessMaterial = this._postProcessMaterial;
    const info: IRenderStageInfo = { name: this._name, priority: this._priority, tag: this._tag, renderQueues: queues };
    this.initialize(info);
}


legacyCC.RenderFlow = RenderFlow;
legacyCC.RenderStage = RenderStage;
legacyCC.RenderPipeline = RenderPipeline;


const RenderTexture: any = jsb.RenderTexture;
@ccclass('RenderTextureConfig')
class RenderTextureConfig {
    @serializable
    @editable
    public name = '';
    @type(RenderTexture)
    public texture: RenderTexture | null = null;
}


function proxyArrayAttributeImpl(proto: any, attr: string) {
    const proxyTarget = `_${attr}_target`;
    let arrayProxy = (self, targetArrayAttr: string) => {
        return new Proxy(self[targetArrayAttr], {
            get(targetArray, prop, receiver) {
                return Reflect.get(targetArray, prop, receiver);
            },
            set(targetArray, prop, receiver) {
                const ret = Reflect.set(targetArray, prop, receiver);
                self[targetArrayAttr] = targetArray;
                return ret;
            }
        });
    }

    Object.defineProperty(proto, attr, {
        configurable: true,
        enumerable: true,
        get: function () {
            this[proxyTarget] ||= [];
            return arrayProxy(this, proxyTarget);
        },
        set: function (v) {
            this[proxyTarget] = v;
        }
    });
}

function declType(proto: any, attrType: any, attr: string, dft: () => any) {
    (type(attrType) as any)(proto, attr, dft);
}





let proxyArrayAttribute = proxyArrayAttributeImpl;

editable(RenderStage.prototype, '_name', () => '');
editable(RenderStage.prototype, '_tag', () => 0);
editable(RenderStage.prototype, '_priority', () => 0);
serializable(RenderStage.prototype, '_tag', () => 0);
serializable(RenderStage.prototype, '_priority', () => 0);

editable(RenderFlow.prototype, '_name', () => '');
editable(RenderFlow.prototype, '_priority', () => 0);
editable(RenderFlow.prototype, '_tag', () => 0);
editable(RenderFlow.prototype, '_stages', () => []);
declType(RenderFlow.prototype, [RenderStage], '_stages', () => []);
proxyArrayAttribute(RenderFlow.prototype, '_stages');
serializable(RenderFlow.prototype, '_name', () => '');
serializable(RenderFlow.prototype, '_priority', () => 0);
serializable(RenderFlow.prototype, '_tag', () => 0);
serializable(RenderFlow.prototype, '_stages', () => []);

editable(RenderPipeline.prototype, '_tag', () => 0);
editable(RenderPipeline.prototype, '_name', () => []);
serializable(RenderPipeline.prototype, '_tag', () => 0);
serializable(RenderPipeline.prototype, '_name', () => '');

editable(RenderPipeline.prototype, '_flows', () => []);
declType(RenderPipeline.prototype, [RenderFlow], '_flows', () => []);
proxyArrayAttribute(RenderPipeline.prototype, '_flows');
serializable(RenderPipeline.prototype, '_flows', () => []);

editable(DeferredPipeline.prototype, 'renderTextures', () => []);
declType(DeferredPipeline.prototype, [RenderTextureConfig], "renderTextures", () => []);
serializable(DeferredPipeline.prototype, 'renderTextures', () => []);
editable(DeferredPipeline.prototype, 'renderTextures', () => []);


editable(ForwardPipeline.prototype, 'renderTextures', () => []);
declType(ForwardPipeline.prototype, [RenderTextureConfig], "renderTextures", () => []);
serializable(ForwardPipeline.prototype, 'renderTextures', () => []);

declType(GbufferStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
serializable(GbufferStage.prototype, 'renderQueues', () => []);
editable(GbufferStage.prototype, 'renderQueues', () => []);


editable(LightingStage.prototype, '_deferredMaterial', () => null);
declType(LightingStage.prototype, jsb.Material, '_deferredMaterial', () => null);
declType(LightingStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
serializable(LightingStage.prototype, '_deferredMaterial', () => null);
serializable(LightingStage.prototype, 'renderQueue', () => []);
editable(LightingStage.prototype, 'renderQueue', () => []);

editable(BloomStage.prototype, '_bloomMaterial', () => null);
declType(BloomStage.prototype, jsb.Material, '_bloomMaterial', () => []);
serializable(BloomStage.prototype, '_bloomMaterial', () => null);


declType(PostProcessStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
editable(PostProcessStage.prototype, '_postProcessMaterial', () => null);
declType(PostProcessStage.prototype, jsb.Material, '_postProcessMaterial', () => null);
serializable(PostProcessStage.prototype, 'renderQueues', () => []);
editable(PostProcessStage.prototype, 'renderQueues', () => []);
serializable(PostProcessStage.prototype, '_postProcessMaterial', () => null);

declType(ForwardStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
serializable(ForwardStage.prototype, 'renderQueues', () => []);
editable(ForwardStage.prototype, 'renderQueues', () => []);

//-------------------- register types -------------------- 
ccclass('RenderQueueDesc')(RenderQueueDesc);
ccclass('RenderStage')(RenderStage)
ccclass('ReflectionProbeStage')(ReflectionProbeStage);
ccclass('GbufferStage')(GbufferStage);
ccclass('LightingStage')(LightingStage);
ccclass('BloomStage')(BloomStage);
ccclass('PostProcessStage')(PostProcessStage);
ccclass('ForwardStage')(ForwardStage);
ccclass('ShadowStage')(ShadowStage);

ccclass('RenderFlow')(RenderFlow)
ccclass('MainFlow')(MainFlow);
ccclass('ForwardFlow')(ForwardFlow);
ccclass('ShadowFlow')(ShadowFlow);
ccclass('ReflectionProbeFlow')(ReflectionProbeFlow);

ccclass('cc.RenderPipeline')(RenderPipeline);
ccclass('ForwardPipeline')(ForwardPipeline);
ccclass('DeferredPipeline')(DeferredPipeline);