import { Vec2 } from '../../math';
import { RenderScene } from './render-scene';

export class ShadowInfo {

    // Define shadwoMapCamera
    public _shadowCameraNear: number = 1;
    public _shadowCameraFar: number = 30;
    public _shadowCameraAspect: number = 1;
    public _shadowCameraOrthoSize: number = 5;

    public _shadowMapSize: Vec2 = new Vec2(512, 512);
    public _enabled: boolean = true;

    public static get shadowInfoInstance (): ShadowInfo {
        if (!this._shadowInfo) {
            this._shadowInfo = new ShadowInfo();
        }

        return this._shadowInfo;
    }

    public updatePipeline (scene: RenderScene) {
        const pipeline = scene.root.pipeline;
        if (pipeline.macros.CC_RECEIVE_SHADOW === this._enabled) { return; }
        pipeline.macros.CC_RECEIVE_SHADOW = this._enabled;
        scene.onGlobalPipelineStateChanged();
    }

    protected static _shadowInfo: ShadowInfo|null = null;
}
