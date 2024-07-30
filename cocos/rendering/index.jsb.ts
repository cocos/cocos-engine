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

import { OPEN_HARMONY } from 'internal:constants'
import { ccenum, CCString } from '../core';
import * as pipeline from './define';
import { serializable, editable, type } from '../core/data/class-decorator';
import { legacyCC } from '../core/global-exports';
import * as decors from '../native-binding/decorators';
import { 
    RenderPipeline as NrRenderPipeline,
    RenderFlow as NrRenderFlow,
    RenderStage as NrRenderStage,
    InstancedBuffer as NrInstancedBuffer,
    PipelineStateManager as NrPipelineStateManager,
} from './index';

export { pipeline };
export * from './pass-phase';
export * from './render-types';
export const RenderPipeline: typeof NrRenderPipeline = nr.RenderPipeline;
export type RenderPipeline = NrRenderPipeline;
export const RenderFlow: typeof NrRenderFlow = nr.RenderFlow;
export type RenderFlow = NrRenderFlow;
export const RenderStage: typeof NrRenderStage = nr.RenderStage;
export type RenderStage = NrRenderStage;
export const InstancedBuffer: typeof NrInstancedBuffer = nr.InstancedBuffer;
export type InstancedBuffer = NrInstancedBuffer;
export const PipelineStateManager: typeof NrPipelineStateManager = nr.PipelineStateManager;
export type PipelineStateManager = NrPipelineStateManager;

export { PipelineEventType } from './pipeline-event';

let getOrCreatePipelineState = nr.PipelineStateManager.getOrCreatePipelineState;
nr.PipelineStateManager.getOrCreatePipelineState = function (device, pass, shader, renderPass, ia) {
    return getOrCreatePipelineState(pass, shader, renderPass, ia); //cjh TODO: remove hacking. c++ API doesn't access device argument.
};

export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}
ccenum(RenderQueueSortMode);

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

    public init(): any {
        return new nr.RenderQueueDesc(this.isTransparent, this.sortMode, this.stages);
    }
}

legacyCC.RenderFlow = RenderFlow;
legacyCC.RenderStage = RenderStage;
legacyCC.RenderPipeline = RenderPipeline;

function proxyArrayAttributeImpl(proto: any, attr: string): void {
    const proxyTarget = `_${attr}_target`;
    let arrayProxy = (self, targetArrayAttr: string): any => {
        return new Proxy(self[targetArrayAttr], {
            get(targetArray, prop, receiver): any {
                return Reflect.get(targetArray, prop, receiver);
            },
            set(targetArray, prop, receiver): boolean {
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


let proxyArrayAttribute = proxyArrayAttributeImpl;

if (!OPEN_HARMONY) {
    // WORKAROUND: the proxy array getLength crashed on OH platform
    proxyArrayAttribute(RenderFlow.prototype, '_stages');
    proxyArrayAttribute(RenderPipeline.prototype, '_flows');
}

//-------------------- register types -------------------- 

decors.patch_RenderQueueDesc({RenderQueueDesc, RenderQueueSortMode, CCString});
decors.patch_RenderStage({RenderStage});

decors.patch_RenderFlow({RenderFlow, RenderStage});

decors.patch_cc_RenderPipeline({RenderPipeline, RenderFlow});
