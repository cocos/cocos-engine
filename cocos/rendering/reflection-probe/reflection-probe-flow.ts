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
import { EDITOR } from 'internal:constants';
import { ccclass } from 'cc.decorator';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ReflectionProbeStage } from './reflection-probe-stage';
import { RenderFlowTag } from '../pipeline-serialization';
import { RenderPipeline } from '../render-pipeline';
import { Camera } from '../../render-scene/scene/camera';
import { ProbeType, ReflectionProbe } from '../../render-scene/scene/reflection-probe';
import { cclegacy } from '../../core';

/**
 * @en reflection probe render flow
 * @zh 反射探针rendertexture绘制流程
 */
@ccclass('ReflectionProbeFlow')
export class ReflectionProbeFlow extends RenderFlow {
    public static initInfo: IRenderFlowInfo = {
        name: 'PIPELINE_FLOW_RELECTION_PROBE',
        priority: 0,
        tag: RenderFlowTag.SCENE,
        stages: [],
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const probeStage = new ReflectionProbeStage();
            probeStage.initialize(ReflectionProbeStage.initInfo);
            this._stages.push(probeStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline): void {
        super.activate(pipeline);
    }

    public render (camera: Camera): void {
        if (!cclegacy.internal.reflectionProbeManager) {
            return;
        }
        const probes = cclegacy.internal.reflectionProbeManager.getProbes() as ReflectionProbe[];
        for (let i = 0; i < probes.length; i++) {
            if (probes[i].needRender) {
                if (EDITOR || probes[i].probeType === ProbeType.PLANAR) {
                    this._renderStage(camera, probes[i]);
                }
            }
        }
    }

    public destroy (): void {
        super.destroy();
    }
    private _renderStage (camera: Camera, probe: ReflectionProbe): void {
        for (let i = 0; i < this._stages.length; i++) {
            const probeStage = this._stages[i] as ReflectionProbeStage;
            if (probe.probeType === ProbeType.PLANAR) {
                cclegacy.internal.reflectionProbeManager.updatePlanarMap(probe, null);
                probeStage.setUsageInfo(probe, probe.realtimePlanarTexture!.window!.framebuffer);
                probeStage.render(camera);
                cclegacy.internal.reflectionProbeManager.updatePlanarMap(probe, probe.realtimePlanarTexture!.getGFXTexture());
            } else {
                for (let faceIdx = 0; faceIdx < 6; faceIdx++) {
                    const renderTexture = probe.bakedCubeTextures[faceIdx];
                    if (!renderTexture) return;
                    //update camera dirction
                    probe.updateCameraDir(faceIdx);
                    probeStage.setUsageInfo(probe, renderTexture.window!.framebuffer);
                    probeStage.render(camera);
                }
                probe.needRender = false;
            }
        }
    }
}
