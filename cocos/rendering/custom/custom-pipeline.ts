import { Camera, CameraUsage } from '../../render-scene/scene';
import { buildBloomPass as buildBloomPasses, buildForwardPass,
    buildNativeDeferredPipeline, buildNativeForwardPass, buildPostprocessPass } from './define';
import { Pipeline, PipelineBuilder } from './pipeline';

export class CustomPipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            const isGameView = camera.cameraUsage === CameraUsage.GAME
                || camera.cameraUsage === CameraUsage.GAME_VIEW;
            // forward pass
            const forwardInfo = buildForwardPass(camera, ppl, isGameView);
            if (!isGameView) {
                continue;
            }
            // bloom passes
            const bloomInfo = buildBloomPasses(camera, ppl, forwardInfo.rtName);
            // Present Pass
            buildPostprocessPass(camera, ppl, bloomInfo.rtName);
        }
    }
}

export class NativePipelineBuilder implements PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            if (camera.cameraUsage !== CameraUsage.GAME) {
                buildForwardPass(camera, ppl, false);
                continue;
            }
            buildNativeForwardPass(camera, ppl);
            // buildNativeDeferredPipeline(camera, ppl);
        }
    }
}
