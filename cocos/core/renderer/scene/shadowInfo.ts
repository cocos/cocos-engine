import { Vec2 } from '../../math';
import { RenderScene } from './render-scene';

export class ShadowInfo {

    // Define shadwoMapCamera
    public cameraNear: number = 1;
    public cameraFar: number = 30;
    public cameraAspect: number = 1;
    public cameraOrthoSize: number = 5;

    public shadowMapSize: Vec2 = new Vec2(512, 512);
    public enabled: boolean = true;

    public static get instance (): ShadowInfo {
        if (!ShadowInfo._instance) {
            ShadowInfo._instance = new ShadowInfo();
        }

        return ShadowInfo._instance;
    }

    public updatePipeline (scene: RenderScene) {
        const pipeline = scene.root.pipeline;
        if (pipeline.macros.CC_RECEIVE_SHADOW === this.enabled) { return; }
        pipeline.macros.CC_RECEIVE_SHADOW = this.enabled;
        scene.onGlobalPipelineStateChanged();
    }

    protected static _instance: ShadowInfo|null = null;
}
