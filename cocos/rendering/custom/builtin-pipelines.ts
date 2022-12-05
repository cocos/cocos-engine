import { EDITOR } from 'internal:constants';
import { Camera } from '../../render-scene/scene';
import { Pipeline, PipelineBuilder } from './pipeline';
import { buildForwardPass, buildGBufferPass, buildLightingPass, buildPostprocessPass, buildReflectionProbePasss } from './define';

export class ForwardPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            // forward pass
            buildForwardPass(camera, ppl, false);
            if (EDITOR) {
                buildReflectionProbePasss(camera, ppl, false);
            }
        }
    }
}

export class DeferredPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; ++i) {
            const camera = cameras[i];
            if (!camera.scene) {
                continue;
            }
            if (EDITOR) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            // GBuffer Pass
            const gBufferInfo = buildGBufferPass(camera, ppl);
            // Lighting Pass
            const lightInfo = buildLightingPass(camera, ppl, gBufferInfo);
            // Postprocess
            buildPostprocessPass(camera, ppl, lightInfo.rtName);
        }
    }
}
