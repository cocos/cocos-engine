// scene
declare const ns: any;

export const NativeNode = ns.Node;
export const NativeModel = ns.Model;
export const NativeSkinningModel = ns.SkinningModel;
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

import { SkinningModel } from '../../../3d/models/skinning-model';
import { uploadJointData } from '../../../3d/skeletal-animation/skeletal-animation-utils';
import { Mat4 } from '../../math/mat4';
import { RenderScene } from './render-scene'

const m4_1 = new Mat4();
RenderScene.prototype.update = function (stamp: number) {
    this._nativeObj.update(stamp);
}