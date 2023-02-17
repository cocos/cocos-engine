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
import { EDITOR } from 'internal:constants';
import { Model } from '../render-scene/scene/model';
import { Camera, CameraUsage, SKYBOX_FLAG } from '../render-scene/scene/camera';
import { Vec3, Pool, warnID, geometry, cclegacy } from '../core';
import { RenderPipeline } from './render-pipeline';
import { IRenderObject, UBOShadow } from './define';
import { ShadowType, CSMOptimizationMode } from '../render-scene/scene/shadows';
import { PipelineSceneData } from './pipeline-scene-data';
import { ShadowLayerVolume } from './shadow/csm-layers';

const _tempVec3 = new Vec3();
const _sphere = geometry.Sphere.create(0, 0, 0, 1);

const roPool = new Pool<IRenderObject>(() => ({ model: null!, depth: 0 }), 128);

function getRenderObject (model: Model, camera: Camera) {
    let depth = 0;
    if (model.node) {
        Vec3.subtract(_tempVec3, model.node.worldPosition, camera.position);
        depth = Vec3.dot(_tempVec3, camera.forward);
    }
    const ro = roPool.alloc();
    ro.model = model;
    ro.depth = depth;
    return ro;
}

export function validPunctualLightsCulling (pipeline: RenderPipeline, camera: Camera) {
    const sceneData = pipeline.pipelineSceneData;
    const validPunctualLights = sceneData.validPunctualLights;
    validPunctualLights.length = 0;

    const { spotLights } = camera.scene!;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        if (light.baked) {
            continue;
        }

        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { sphereLights } = camera.scene!;
    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        if (light.baked) {
            continue;
        }
        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }
    // in jsb, std::vector is not synchronized, so we need to assign it manually
    sceneData.validPunctualLights = validPunctualLights;
}
export function shadowCulling (camera: Camera, sceneData: PipelineSceneData, layer: ShadowLayerVolume) {
    const scene = camera.scene!;
    const mainLight = scene.mainLight!;
    const csmLayers = sceneData.csmLayers;
    const csmLayerObjects = csmLayers.layerObjects;
    const dirLightFrustum = layer.validFrustum;
    const dirShadowObjects = layer.shadowObjects;
    dirShadowObjects.length = 0;
    const visibility = camera.visibility;

    for (let i = csmLayerObjects.length - 1; i >= 0; i--) {
        const obj = csmLayerObjects.array[i];
        if (!obj) {
            csmLayerObjects.fastRemove(i);
            continue;
        }
        const model = obj.model;
        if (!model || !model.enabled || !model.node) {
            csmLayerObjects.fastRemove(i);
            continue;
        }
        if (((visibility & model.node.layer) !== model.node.layer) && (!(visibility & model.visFlags))) {
            csmLayerObjects.fastRemove(i);
            continue;
        }
        if (!model.worldBounds || !model.castShadow) {
            csmLayerObjects.fastRemove(i);
            continue;
        }
        const accurate = geometry.intersect.aabbFrustum(model.worldBounds, dirLightFrustum);
        if (!accurate) {
            continue;
        }
        dirShadowObjects.push(obj);
        if (layer.level < mainLight.csmLevel) {
            if (mainLight.csmOptimizationMode === CSMOptimizationMode.RemoveDuplicates
                    && geometry.intersect.aabbFrustumCompletelyInside(model.worldBounds, dirLightFrustum)) {
                csmLayerObjects.fastRemove(i);
            }
        }
    }
}

export function sceneCulling (pipeline: RenderPipeline, camera: Camera) {
    const scene = camera.scene!;
    const mainLight = scene.mainLight;
    const sceneData = pipeline.pipelineSceneData;
    const shadows = sceneData.shadows;
    const skybox = sceneData.skybox;
    const csmLayers = sceneData.csmLayers;

    const renderObjects = sceneData.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;

    const castShadowObjects = csmLayers.castShadowObjects;
    castShadowObjects.length = 0;
    const csmLayerObjects = csmLayers.layerObjects;
    csmLayerObjects.clear();

    if (shadows.enabled) {
        pipeline.pipelineUBO.updateShadowUBORange(UBOShadow.SHADOW_COLOR_OFFSET, shadows.shadowColor);
        if (shadows.type === ShadowType.ShadowMap) {
            // update CSM layers
            if (mainLight && mainLight.node) {
                csmLayers.update(sceneData, camera);
            }
        }
    }

    if ((camera.clearFlag & SKYBOX_FLAG)) {
        if (skybox.enabled && skybox.model) {
            renderObjects.push(getRenderObject(skybox.model, camera));
        } else if (camera.cameraUsage !== CameraUsage.EDITOR && camera.cameraUsage !== CameraUsage.SCENE_VIEW) {
            cclegacy.warnID(15100, camera.name);
        }
    }

    const models = scene.models;
    const visibility = camera.visibility;

    function enqueueRenderObject (model: Model) {
        // filter model by view visibility
        if (model.enabled) {
            if (scene.isCulledByLod(camera, model)) {
                return;
            }

            if (model.castShadow) {
                castShadowObjects.push(getRenderObject(model, camera));
                csmLayerObjects.push(getRenderObject(model, camera));
            }

            if (model.node && ((visibility & model.node.layer) === model.node.layer)
                 || (visibility & model.visFlags)) {
                // frustum culling
                if (model.worldBounds && !geometry.intersect.aabbFrustum(model.worldBounds, camera.frustum)) {
                    return;
                }

                renderObjects.push(getRenderObject(model, camera));
            }
        }
    }

    for (let i = 0; i < models.length; i++) {
        enqueueRenderObject(models[i]);
    }
}
