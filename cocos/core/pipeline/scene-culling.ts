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

import { AABB, Frustum, intersect, Sphere } from '../geometry';
import { Model } from '../renderer/scene/model';
import { Camera, SKYBOX_FLAG } from '../renderer/scene/camera';
import { Vec3, Mat4, Color } from '../math';
import { RenderPipeline } from './render-pipeline';
import { Pool } from '../memop';
import { IRenderObject, UBOShadow } from './define';
import { ShadowType, Shadows, CSMLevel, CSMOptimizationMode } from '../renderer/scene/shadows';
import { SphereLight, DirectionalLight } from '../renderer/scene';
import { PipelineSceneData } from './pipeline-scene-data';
import { ShadowLayerVolume } from './shadow/csm-layers';

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

function updateSphereLight (pipeline: RenderPipeline, light: SphereLight) {
    const shadows = pipeline.pipelineSceneData.shadows;

    const pos = light.node!.worldPosition;
    const n = shadows.normal; const d = shadows.distance + 0.001; // avoid z-fighting
    const NdL = Vec3.dot(n, pos);
    const lx = pos.x; const ly = pos.y; const lz = pos.z;
    const nx = n.x; const ny = n.y; const nz = n.z;
    const m = shadows.matLight;
    m.m00 = NdL - d - lx * nx;
    m.m01 = -ly * nx;
    m.m02 = -lz * nx;
    m.m03 = -nx;
    m.m04 = -lx * ny;
    m.m05 = NdL - d - ly * ny;
    m.m06 = -lz * ny;
    m.m07 = -ny;
    m.m08 = -lx * nz;
    m.m09 = -ly * nz;
    m.m10 = NdL - d - lz * nz;
    m.m11 = -nz;
    m.m12 = lx * d;
    m.m13 = ly * d;
    m.m14 = lz * d;
    m.m15 = NdL;

    pipeline.pipelineUBO.updateShadowUBORange(UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET, shadows.matLight);
}

function updateDirLight (pipeline: RenderPipeline, light: DirectionalLight) {
    const shadows = pipeline.pipelineSceneData.shadows;

    const dir = light.direction;
    const n = shadows.normal; const d = shadows.distance + 0.001; // avoid z-fighting
    const NdL = Vec3.dot(n, dir); const scale = 1 / NdL;
    const lx = dir.x * scale; const ly = dir.y * scale; const lz = dir.z * scale;
    const nx = n.x; const ny = n.y; const nz = n.z;
    const m = shadows.matLight;
    m.m00 = 1 - nx * lx;
    m.m01 = -nx * ly;
    m.m02 = -nx * lz;
    m.m03 = 0;
    m.m04 = -ny * lx;
    m.m05 = 1 - ny * ly;
    m.m06 = -ny * lz;
    m.m07 = 0;
    m.m08 = -nz * lx;
    m.m09 = -nz * ly;
    m.m10 = 1 - nz * lz;
    m.m11 = 0;
    m.m12 = lx * d;
    m.m13 = ly * d;
    m.m14 = lz * d;
    m.m15 = 1;

    pipeline.pipelineUBO.updateShadowUBORange(UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET, shadows.matLight);
}

export function updatePlanarPROJ (shadowInfo: Shadows, light: DirectionalLight, shadowUBO: Float32Array) {
    const dir = light.direction;
    const n = shadowInfo.normal; const d = shadowInfo.distance + 0.001; // avoid z-fighting
    const NdL = Vec3.dot(n, dir); const scale = 1 / NdL;
    const lx = dir.x * scale; const ly = dir.y * scale; const lz = dir.z * scale;
    const nx = n.x; const ny = n.y; const nz = n.z;
    const m = shadowInfo.matLight;
    m.m00 = 1 - nx * lx;
    m.m01 = -nx * ly;
    m.m02 = -nx * lz;
    m.m03 = 0;
    m.m04 = -ny * lx;
    m.m05 = 1 - ny * ly;
    m.m06 = -ny * lz;
    m.m07 = 0;
    m.m08 = -nz * lx;
    m.m09 = -nz * ly;
    m.m10 = 1 - nz * lz;
    m.m11 = 0;
    m.m12 = lx * d;
    m.m13 = ly * d;
    m.m14 = lz * d;
    m.m15 = 1;

    Mat4.toArray(shadowUBO, m, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
}

export function updatePlanarNormalAndDistance (shadowInfo: Shadows, shadowUBO: Float32Array) {
    Vec3.normalize(_tempVec3, shadowInfo.normal);
    shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 0] = _tempVec3.x;
    shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 1] = _tempVec3.y;
    shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 2] = _tempVec3.z;
    shadowUBO[UBOShadow.PLANAR_NORMAL_DISTANCE_INFO_OFFSET + 3] = shadowInfo.distance;
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

    if (mainLight) {
        if (shadows.type === ShadowType.Planar) {
            updateDirLight(pipeline, mainLight);
        }
    }

    if (skybox.enabled && skybox.model && (camera.clearFlag & SKYBOX_FLAG)) {
        renderObjects.push(getRenderObject(skybox.model, camera));
    }

    const models = scene.models;
    const visibility = camera.visibility;

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        // filter model by view visibility
        if (model.enabled) {
            if (model.castShadow) {
                castShadowObjects.push(getRenderObject(model, camera));
                csmLayerObjects.push(getRenderObject(model, camera));
            }

            if (model.node && ((visibility & model.node.layer) === model.node.layer)
                 || (visibility & model.visFlags)) {
                // frustum culling
                if (model.worldBounds && !intersect.aabbFrustum(model.worldBounds, camera.frustum)) {
                    continue;
                }

                renderObjects.push(getRenderObject(model, camera));
            }
        }
    }
}
