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
    const models = this._models;
    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        if (model.enabled) {
            if(model instanceof SkinningModel) {
                model.updateTransform(stamp);
                for (let i = 0; i < (model as any)._joints.length; i++) {
                    const { indices, buffers, transform, bindpose } = (model as any)._joints[i];
                    Mat4.multiply(m4_1, transform.world, bindpose);
                    for (let b = 0; b < buffers.length; b++) {
                        uploadJointData((model as any)._dataArray[buffers[b]], indices[b] * 12, m4_1, i === 0);
                    }
                }
                for (let b = 0; b < (model as any)._buffers.length; b++) {
                    (model as any)._buffers[b].update((model as any)._dataArray[b]);
                }
            }
            let currSubModels = model.subModels;
            for (let j = 0; j < currSubModels.length; j++) {
                for (let k = 0; k < currSubModels[j].passes!.length; ++k) {
                    const pass = currSubModels[j].passes![k];
                    pass.update();
                }
            }
        }
    }
    this._nativeObj.update(stamp);
}