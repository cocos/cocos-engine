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
    const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
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
    const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
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
    const info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
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
    const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
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
    const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
    this.initialize(info);
}


export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}
ccenum(RenderQueueSortMode);

shadowStageProto.init = function (pipeline) {
    const info = new nr.RenderStageInfo(this._name, this._priority, this._tag, []);
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
    let info = new nr.RenderPipelineInfo(this._tag, this._flows);
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
    let info = new nr.RenderFlowInfo(this._name, this._priority, this._tag, this._stages);
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
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
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
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
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
    let info = new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
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
    let info =
        new nr.RenderStageInfo(this._name, this._priority, this._tag, queues);
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


function proxyArrayAttribute(proto: any, attr: string) {
    const underlyingAttr = `_udl_${attr}`;
    const underlyingPropt = Object.getOwnPropertyDescriptor(proto, attr);
    if (!underlyingPropt) {
        console.error(`Attribute ${attr} is not defined in function ${proto.constructor.name}`);
        return;
    }
    Object.defineProperty(proto, underlyingAttr, underlyingPropt!);
    Object.defineProperty(proto, attr, {
        configurable: true,
        enumerable: true,
        get: function () {
            const self = this;
            return new Proxy(this[underlyingAttr], {
                get(target, prop, receiver) {
                    // console.log('GET: ' + String(prop) );
                    return Reflect.get(target, prop, receiver);
                },
                set(target, prop, receiver) {
                    // console.log('SET: ' + String(prop) );
                    const ret = Reflect.set(target, prop, receiver);
                    self[underlyingAttr] = target;
                    return ret;
                }
            });
        },
        set: function (v) {
            this[underlyingAttr] = v;
        }
    });
}

function declType(proto: any, attrType: any, attr: string, dft: () => any) {
    (type(attrType) as any)(proto, attr, dft);
}


function declArrayPropetry(proto: any, attr: string) {
    const udKey = `__arr_${attr}`;
    Object.defineProperty(proto, attr, {
        configurable: true,
        enumerable: true,
        get() {
            if (!this[udKey]) {
                this[udKey] = [];
            }
            return this[udKey];
        },
        set(v: any) {
            if (!this[udKey]) {
                this[udKey] = [];
            }
            this[udKey] = v;
        }
    });
}
function declObjectPropetry(proto: any, attr: string, dftValue: any) {
    const udKey = `__obj_${attr}`;
    Object.defineProperty(proto, attr, {
        configurable: true,
        enumerable: true,
        get() {
            if (this[udKey] === undefined) {
                this[udKey] = dftValue;
            }
            return this[udKey];
        },
        set(v: any) {
            if (this[udKey] === undefined) {
                this[udKey] = dftValue;
            }
            this[udKey] = v;
        }
    });

}

declArrayPropetry(DeferredPipeline.prototype, 'renderTextures');
declArrayPropetry(ForwardPipeline.prototype, 'renderTextures');
declArrayPropetry(GbufferStage.prototype, 'renderQueues');
declArrayPropetry(LightingStage.prototype, 'renderQueues');
declArrayPropetry(PostProcessStage.prototype, 'renderQueues');
declArrayPropetry(ForwardStage.prototype, 'renderQueues');

declObjectPropetry(LightingStage.prototype, '_deferredMaterial', null);
declObjectPropetry(BloomStage.prototype, '_bloomMaterial', null);
declObjectPropetry(PostProcessStage.prototype, '_postProcessMaterial', null);

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
proxyArrayAttribute(DeferredPipeline.prototype, 'renderTextures');
serializable(DeferredPipeline.prototype, 'renderTextures', () => []);


editable(ForwardPipeline.prototype, 'renderTextures', () => []);
declType(ForwardPipeline.prototype, [RenderTextureConfig], "renderTextures", () => []);
proxyArrayAttribute(ForwardPipeline.prototype, 'renderTextures');
serializable(ForwardPipeline.prototype, 'renderTextures', () => []);

declType(GbufferStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
proxyArrayAttribute(GbufferStage.prototype, 'renderQueues');
serializable(GbufferStage.prototype, 'renderQueues', () => []);

// serializable(RenderQueueDesc.prototype, 'isTransparent', () => false);
// editable(RenderQueueDesc.prototype, 'isTransparent', () => false);
// editable(RenderQueueDesc.prototype, 'sortMode', () => false);
// editable(RenderQueueDesc.prototype, 'stages', () => []);

editable(LightingStage.prototype, '_deferredMaterial', () => null);
declType(LightingStage.prototype, jsb.Material, '_deferredMaterial', () => null);
declType(LightingStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
proxyArrayAttribute(LightingStage.prototype, 'renderQueues');
serializable(LightingStage.prototype, '_deferredMaterial', () => null);
serializable(LightingStage.prototype, 'renderQueue', () => []);

editable(BloomStage.prototype, '_bloomMaterial', () => null);
declType(BloomStage.prototype, jsb.Material, '_bloomMaterial', () => []);
serializable(BloomStage.prototype, '_bloomMaterial', () => null);


declType(PostProcessStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
proxyArrayAttribute(PostProcessStage.prototype, 'renderQueues');
editable(PostProcessStage.prototype, '_postProcessMaterial', () => null);
declType(PostProcessStage.prototype, jsb.Material, '_postProcessMaterial', () => null);
serializable(PostProcessStage.prototype, 'renderQueues', () => []);
serializable(PostProcessStage.prototype, '_postProcessMaterial', () => null);

declType(ForwardStage.prototype, [RenderQueueDesc], 'renderQueues', () => []);
proxyArrayAttribute(ForwardStage.prototype, 'renderQueues');
serializable(ForwardStage.prototype, 'renderQueues', () => []);

//-------------------- register types -------------------- 
ccclass('cc.RenderPipeline')(RenderPipeline);
ccclass('RenderStage')(RenderStage)
ccclass('RenderFlow')(RenderFlow)
ccclass('ForwardPipeline')(ForwardPipeline);
ccclass('DeferredPipeline')(DeferredPipeline);
ccclass('MainFlow')(MainFlow);
ccclass('ForwardFlow')(ForwardFlow);
ccclass('ShadowFlow')(ShadowFlow);
ccclass('GbufferStage')(GbufferStage);
ccclass('LightingStage')(LightingStage);
ccclass('BloomStage')(BloomStage);
ccclass('PostProcessStage')(PostProcessStage);
ccclass('ForwardStage')(ForwardStage);
ccclass('ShadowStage')(ShadowStage);
ccclass('RenderQueueDesc')(RenderQueueDesc);
ccclass('ReflectionProbeFlow')(ReflectionProbeFlow);
ccclass('ReflectionProbeStage')(ReflectionProbeStage);