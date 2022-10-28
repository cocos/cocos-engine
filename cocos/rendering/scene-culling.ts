/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
import { intersect, Sphere } from '../core/geometry';
import { Model } from '../render-scene/scene/model';
import { Camera, SKYBOX_FLAG } from '../render-scene/scene/camera';
import { Vec3 } from '../core/math';
import { RenderPipeline } from './render-pipeline';
import { Pool } from '../core/memop';
import { IRenderObject, UBOShadow } from './define';
import { ShadowType, CSMOptimizationMode } from '../render-scene/scene/shadows';
import { PipelineSceneData } from './pipeline-scene-data';
import { ShadowLayerVolume } from './shadow/csm-layers';
import { warnID } from '../core/platform';
import { ReflectionProbeManager } from './reflectionProbeManager';
import { LODModelsCachedUtils } from './lod-models-utils';

const _tempVec3 = new Vec3();
const _sphere = Sphere.create(0, 0, 0, 1);

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

        Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { sphereLights } = camera.scene!;
    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        if (light.baked) {
            continue;
        }
        Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }
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
        const csmLayerObject = csmLayerObjects.array[i];
        if (csmLayerObject) {
            const model = csmLayerObject.model;
            // filter model by view visibility
            if (model.enabled) {
                if (model.node && ((visibility & model.node.layer) === model.node.layer)) {
                    // shadow render Object
                    if (dirShadowObjects != null && model.castShadow && model.worldBounds) {
                        // frustum culling
                        // eslint-disable-next-line no-lonely-if
                        const accurate = intersect.aabbFrustum(model.worldBounds, dirLightFrustum);
                        if (accurate) {
                            dirShadowObjects.push(csmLayerObject);
                            if (layer.level < mainLight.csmLevel) {
                                if (mainLight.csmOptimizationMode === CSMOptimizationMode.RemoveDuplicates
                                    && intersect.aabbFrustumCompletelyInside(model.worldBounds, dirLightFrustum)) {
                                    csmLayerObjects.fastRemove(i);
                                }
                            }
                        }
                    }
                }
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
        } else {
            warnID(15100, camera.name);
        }
    }

    const models = scene.models;
    const visibility = camera.visibility;

    function enqueueRenderObject (model: Model) {
        // filter model by view visibility
        if (model.enabled) {
            if (LODModelsCachedUtils.isLODModelCulled(model)) {
                return;
            }

            if (model.castShadow) {
                castShadowObjects.push(getRenderObject(model, camera));
                csmLayerObjects.push(getRenderObject(model, camera));
            }

            if (model.node && ((visibility & model.node.layer) === model.node.layer)
                 || (visibility & model.visFlags)) {
                // frustum culling
                if (model.worldBounds && !intersect.aabbFrustum(model.worldBounds, camera.frustum)) {
                    return;
                }

                renderObjects.push(getRenderObject(model, camera));
            }
        }
    }

    LODModelsCachedUtils.updateCachedLODModels(scene, camera);
    for (let i = 0; i < models.length; i++) {
        enqueueRenderObject(models[i]);
    }
    LODModelsCachedUtils.clearCachedLODModels();
}

export function reflectionProbeCulling (sceneData: PipelineSceneData, camera: Camera) {
    const scene = camera.scene!;
    const skybox = sceneData.skybox;

    ReflectionProbeManager.probeManager.clearRenderObject(camera);

    if (skybox.enabled && skybox.model && (camera.clearFlag & SKYBOX_FLAG)) {
        ReflectionProbeManager.probeManager.addRenderObject(camera, getRenderObject(skybox.model, camera), true);
    }

    const models = scene.models;
    const visibility = camera.visibility;

    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        // filter model by view visibility
        if (model.enabled) {
            if (model.node && ((visibility & model.node.layer) === model.node.layer)
                  || (visibility & model.visFlags)) {
                if (model.bakeToReflectionProbe) {
                    ReflectionProbeManager.probeManager.addRenderObject(camera, getRenderObject(model, camera));
                }
            }
        }
    }
}
