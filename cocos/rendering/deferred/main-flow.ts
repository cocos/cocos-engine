/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.
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

/**
 * @category pipeline.deferred
 */

import { ccclass } from 'cc.decorator';
import { Camera } from '../../render-scene/scene';
import { PIPELINE_FLOW_MAIN } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { DeferredFlowPriority } from '../enum';
import { GbufferStage } from './gbuffer-stage';
import { LightingStage } from './lighting-stage';
import { PostProcessStage } from './postprocess-stage';
import { RenderPipeline } from '../render-pipeline';
import { BloomStage } from './bloom-stage';

/**
 * @en The main flow in deferred render pipeline
 * @zh 延迟渲染流程。
 */
@ccclass('MainFlow')
export class MainFlow extends RenderFlow {
    /**
     * @en The shared initialization information of main render flow
     * @zh 共享的延迟渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_MAIN,
        priority: DeferredFlowPriority.MAIN,
        stages: [],
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const gbufferStage = new GbufferStage();
            gbufferStage.initialize(GbufferStage.initInfo);
            this._stages.push(gbufferStage);
            const lightingStage = new LightingStage();
            lightingStage.initialize(LightingStage.initInfo);
            this._stages.push(lightingStage);
            const bloomStage = new BloomStage();
            bloomStage.initialize(BloomStage.initInfo);
            this._stages.push(bloomStage);
            const postProcessStage = new PostProcessStage();
            postProcessStage.initialize(PostProcessStage.initInfo);
            this._stages.push(postProcessStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline): void {
        super.activate(pipeline);
    }

    public render (camera: Camera): void {
        super.render(camera);
    }

    public destroy (): void {
        super.destroy();
    }
}
