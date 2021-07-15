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

/**
 * @packageDocumentation
 * @hidden
 */

import { AABB, Frustum, intersect, Sphere } from '../geometry';
import { Model } from '../renderer/scene/model';
import { Camera, SKYBOX_FLAG } from '../renderer/scene/camera';
import { Vec3, Mat4, Quat, Color } from '../math';
import { RenderPipeline } from './render-pipeline';
import { Pool } from '../memop';
import { IRenderObject, UBOShadow } from './define';
import { ShadowType, Shadows } from '../renderer/scene/shadows';
import { SphereLight, DirectionalLight, Light } from '../renderer/scene';
import { max, min } from '../math/bits';

const _tempVec3 = new Vec3();
const _dir_negate = new Vec3();
const _vec3_p = new Vec3();
const _mat4_trans = new Mat4();
const _validLights: Light[] = [];
const _sphere = Sphere.create(0, 0, 0, 1);
const _vec3_near = new Vec3();
const _vec3_far = new Vec3();
const frustumVertexes: Vec3[] = [];

const roPool = new Pool<IRenderObject>(() => ({ model: null!, depth: 0 }), 128);
const shadowPool = new Pool<IRenderObject>(() => ({ model: null!, depth: 0 }), 128);

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

function getCastShadowRenderObject (model: Model, camera: Camera) {
    let depth = 0;
    if (model.node) {
        Vec3.subtract(_tempVec3, model.node.worldPosition, camera.position);
        depth = Vec3.dot(_tempVec3, camera.forward);
    }
    const ro = shadowPool.alloc();
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

export function lightCollecting (camera: Camera, lightNumber: number) {
    _validLights.length = 0;

    const scene = camera.scene!;
    _validLights.push(scene.mainLight!);

    const spotLights = scene.spotLights;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphereFrustum(_sphere, camera.frustum)
         && lightNumber > _validLights.length) {
            _validLights.push(light);
        }
    }

    return _validLights;
}

export function updateDirFrustum (cameraBoundingSphere: Sphere, rotation: Quat, range: number, dirLightFrustum: Frustum) {
    const position = cameraBoundingSphere.center;
    const radius = cameraBoundingSphere.radius;
    const radius_2x = radius * 2.0;
    Mat4.fromRT(_mat4_trans, rotation, position);
    Frustum.createOrtho(dirLightFrustum, radius_2x, radius_2x, -range, radius, _mat4_trans);
}

export function sceneCulling (pipeline: RenderPipeline, camera: Camera) {
    const scene = camera.scene!;
    const mainLight = scene.mainLight;
    const sceneData = pipeline.pipelineSceneData;
    const shadows = sceneData.shadows;
    const skybox = sceneData.skybox;
    const dirLightFrustum = shadows.dirLightFrustum;

    const renderObjects = sceneData.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;

    let shadowObjects: IRenderObject[] | null = null;
    if (shadows.enabled) {
        pipeline.pipelineUBO.updateShadowUBORange(UBOShadow.SHADOW_COLOR_OFFSET, shadows.shadowColor);
        if (shadows.type === ShadowType.ShadowMap) {
            shadowObjects = pipeline.pipelineSceneData.shadowObjects;
            shadowPool.freeArray(shadowObjects); shadowObjects.length = 0;

            // update dirLightFrustum
            // but not every time
            if (mainLight && mainLight.node) {
                cameraToFrustumVertexes(camera, frustumVertexes);
                const rotation = mainLight.node.getWorldRotation();
                const range = shadows.range;
                const cameraBoundingSphere = shadows.cameraBoundingSphere;
                if (mainLight.dirDirty) {
                    Sphere.fromPointArray(cameraBoundingSphere, cameraBoundingSphere, frustumVertexes);
                    updateDirFrustum(cameraBoundingSphere, rotation, range, dirLightFrustum);
                    mainLight.dirDirty = false;
                } else if (shadows.rangeDirty) {
                    Sphere.fromPointArray(cameraBoundingSphere, cameraBoundingSphere, frustumVertexes);
                    updateDirFrustum(cameraBoundingSphere, rotation, range, dirLightFrustum);
                    shadows.rangeDirty = false;
                }
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
            if (model.node && ((visibility & model.node.layer) === model.node.layer)
                || (visibility & model.visFlags)) {
                // shadow render Object
                if (shadowObjects != null && model.castShadow && model.worldBounds) {
                    // frustum culling
                    if (!intersect.aabbFrustum(model.worldBounds, dirLightFrustum)) {
                        shadowObjects.push(getCastShadowRenderObject(model, camera));
                    }
                }
                // frustum culling
                if (model.worldBounds && !intersect.aabbFrustum(model.worldBounds, camera.frustum)) {
                    continue;
                }

                renderObjects.push(getRenderObject(model, camera));
            }
        }
    }
}

export function cameraToFrustumVertexes (camera: Camera, frustumVertexes: Vec3[]) {
    const nearZ = max(camera.nearClip, 0.0);
    const farZ = min(camera.farClip, 50.0);
    const halfViewSize = Math.tan(camera.fov * (Math.PI / 360.0));
    const transform = camera.node.getWorldMatrix();

    _vec3_near.z = nearZ;
    _vec3_near.y = _vec3_near.z * halfViewSize;
    _vec3_near.x = _vec3_near.y * camera.aspect;

    _vec3_far.z = farZ;
    _vec3_far.y = _vec3_far.z * halfViewSize;
    _vec3_far.x = _vec3_far.y * camera.aspect;

    getFrustumVertexes(frustumVertexes, _vec3_near, _vec3_far, transform);
}

const _vec3_Tmp = new Vec3();
export function getFrustumVertexes (frustumVertexes: Vec3[], near: Vec3, far: Vec3, transform: Mat4) {
    frustumVertexes.length = 0;
    for (let i = 0; i < 8; i++) {
        frustumVertexes.push(_vec3_Tmp);
    }

    Vec3.transformMat4(frustumVertexes[0], near, transform);
    Vec3.transformMat4(frustumVertexes[1], _vec3_Tmp.set(near.x, -near.y, near.z), transform);
    Vec3.transformMat4(frustumVertexes[2], _vec3_Tmp.set(-near.x, -near.y, near.z), transform);
    Vec3.transformMat4(frustumVertexes[3], _vec3_Tmp.set(-near.x, near.y, near.z), transform);
    Vec3.transformMat4(frustumVertexes[4], far, transform);
    Vec3.transformMat4(frustumVertexes[5], _vec3_Tmp.set(far.x, -far.y, far.z), transform);
    Vec3.transformMat4(frustumVertexes[6], _vec3_Tmp.set(-far.x, -far.y, far.z), transform);
    Vec3.transformMat4(frustumVertexes[7], _vec3_Tmp.set(-far.x, far.y, far.z), transform);
}
