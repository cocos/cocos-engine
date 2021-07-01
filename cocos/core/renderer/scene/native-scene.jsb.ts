// scene
declare const ns: any;

export const NativeNode = ns.Node;
export const NativeModel = ns.Model;
export const NativeSkinningModel = ns.SkinningModel;
export const NativeBakedSkinningModel = ns.BakedSkinningModel;
export const NativeLight = ns.light;
export const NativeDirectionalLight = ns.DirectionalLight;
export const NativeSpotLight = ns.SpotLight;
export const NativeSphereLight = ns.SphereLight;
export const NaitveSkybox = ns.Skybox;
export const NativeFog = ns.Fog;
export const NativeAmbient = ns.Ambient;
export const NativeShadow = ns.Shadow;
export const NativeCamera = ns.Camera;
export const NativeRenderWindow = ns.RenderWindow;
export const NativeRenderScene = ns.RenderScene;
export const NativeDrawBatch2D = ns.DrawBatch2D;
export const NativePass = ns.Pass;
export const NativeSubModel = ns.SubModel;
export const NativeRoot = ns.Root;
export const NativePipelineSharedSceneData = ns.PipelineSharedSceneData;
export const NativeAABB = ns.AABB;

import { RenderScene } from './render-scene'

RenderScene.prototype.update = function (stamp: number) {
    const nativeBatches = [];
    for (let i = 0, len = this._batches.length; i < len; ++i) {
        nativeBatches.push(this._batches[i].native);
    }
    this._nativeObj.updateBatches(nativeBatches);
    this._nativeObj.update(stamp);
}