import { intersect, sphere } from '../../geometry';
import { Model } from '../../renderer/scene/model';
import { Camera, SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Layers } from '../../scene-graph/layers';
import { Vec3, Mat4, Quat, Color } from '../../math';
import { ForwardPipeline } from './forward-pipeline';
import { RenderView } from '../';
import { Pool } from '../../memop';
import { IRenderObject, UBOShadow } from '../define';
import { ShadowType } from '../../renderer/scene/shadows';
import { SphereLight, DirectionalLight} from '../../renderer/scene';

const _tempVec3 = new Vec3();
const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();
const _dir_negate = new Vec3();
const _vec3_p = new Vec3();
const _mat4_trans = new Mat4();
const _data = Float32Array.from([
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
    0.0, 0.0, 0.0, 0.3, // shadowColor
]);

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

export function getShadowWorldMatrix (pipeline: ForwardPipeline, rotation: Quat, dir: Vec3) {
    const shadows = pipeline.shadows;
    Vec3.negate(_dir_negate, dir);
    const distance: number = Math.sqrt(2) * shadows.sphere.radius;
    Vec3.multiplyScalar(_vec3_p, _dir_negate, distance);
    Vec3.add(_vec3_p, _vec3_p, shadows.sphere.center);

    Mat4.fromRT(_mat4_trans, rotation, _vec3_p);

    return _mat4_trans;
}

function updateSphereLight (pipeline: ForwardPipeline, light: SphereLight) {
    const shadows = pipeline.shadows;
    if (!light.node!.hasChangedFlags && !shadows.dirty) {
        return;
    }

    shadows.dirty = true;
    light.node!.getWorldPosition(_v3);
    const n = shadows.normal; const d = shadows.distance + 0.001; // avoid z-fighting
    const NdL = Vec3.dot(n, _v3);
    const lx = _v3.x; const ly = _v3.y; const lz = _v3.z;
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

    Mat4.toArray(_data, shadows.matLight, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
    pipeline.descriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(_data);
}

function updateDirLight (pipeline: ForwardPipeline, light: DirectionalLight) {
    const shadows = pipeline.shadows;
    if (!light.node!.hasChangedFlags && !shadows.dirty) {
        return;
    }

    shadows.dirty = false;

    light.node!.getWorldRotation(_qt);
    Vec3.transformQuat(_v3, _forward, _qt);
    const n = shadows.normal; const d = shadows.distance + 0.001; // avoid z-fighting
    const NdL = Vec3.dot(n, _v3); const scale = 1 / NdL;
    const lx = _v3.x * scale; const ly = _v3.y * scale; const lz = _v3.z * scale;
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

    Mat4.toArray(_data, shadows.matLight, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
    pipeline.descriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(_data);
}

export function sceneCulling (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const renderObjects = pipeline.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;
    const shadowObjects = pipeline.shadowObjects;
    shadowPool.freeArray(shadowObjects); shadowObjects.length = 0;

    const mainLight = scene.mainLight;
    const shadows = pipeline.shadows;
    const shadowSphere = shadows.sphere;
    shadowSphere.center.set(0.0, 0.0, 0.0);
    shadowSphere.radius = 0.01;

    if (shadows.enabled && shadows.dirty) {
        Color.toArray(_data, shadows.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
        pipeline.descriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(_data);
    }

    if (mainLight) {
        if (shadows.type === ShadowType.Planar) {
            updateDirLight(pipeline, mainLight);
        }
    }

    if (pipeline.skybox.enabled && pipeline.skybox.model && (camera.clearFlag & SKYBOX_FLAG)) {
        renderObjects.push(getRenderObject(pipeline.skybox.model, camera));
    }

    const models = scene.models;

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        // filter model by view visibility
        if (model.enabled) {
            const vis = view.visibility & Layers.BitMask.UI_2D;
            if (vis) {
                if ((model.node && (view.visibility === model.node.layer)) ||
                    view.visibility === model.visFlags) {
                    renderObjects.push(getRenderObject(model, camera));
                }
            } else {
                if (model.node && ((view.visibility & model.node.layer) === model.node.layer) ||
                    (view.visibility & model.visFlags)) {

                    // shadow render Object
                    if (model.castShadow) {
                        sphere.mergeAABB(shadowSphere, shadowSphere, model.worldBounds!);
                        shadowObjects.push(getCastShadowRenderObject(model, camera));
                    }

                    // frustum culling
                    if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                        continue;
                    }

                    renderObjects.push(getRenderObject(model, camera));
                }
            }
        }
    }
}
