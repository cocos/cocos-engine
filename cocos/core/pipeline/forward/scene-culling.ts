/**
 * @hidden
 */

import { intersect, sphere } from '../../geometry';
import { Model } from '../../renderer/scene/model';
import { Camera, SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Layers } from '../../scene-graph/layers';
import { Vec3} from '../../math';
import { ForwardPipeline } from './forward-pipeline';
import { RenderView } from '../render-view';
import { Pool } from '../../memop';
import { IRenderObject } from '../define';
import { ShadowType } from '../../renderer/scene/shadows';
import { Light } from 'cocos/core/renderer/scene';

const _tempVec3 = new Vec3();

const roPool = new Pool<IRenderObject>(() => ({ model: null!, depth: 0 }), 128);
const shadowPool = new Pool<IRenderObject>(() => ({ model: null!, depth: 0 }), 128);

const _validLights: Light[] = [];
const _sphere = sphere.create(0, 0, 0, 1);

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

export function shadowCollecting (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const shadowObjects = pipeline.shadowObjects;
    shadowPool.freeArray(shadowObjects); shadowObjects.length = 0;
    const shadows = pipeline.shadows;
    const shadowSphere = shadows.sphere;
    shadowSphere.center.set(0.0, 0.0, 0.0);
    shadowSphere.radius = 0.01;

    const models = scene.models;
    for (let i = 0; i < models.length; i++) {
        const model = models[i];
        // filter model by view visibility
        if (model.node && ((view.visibility & model.node.layer) === model.node.layer) ||
            (view.visibility & model.visFlags)) {

            // shadow render Object
            if (model.castShadow) {
                sphere.mergeAABB(shadowSphere, shadowSphere, model.worldBounds!);
                shadowObjects.push(getCastShadowRenderObject(model, camera));
            }
        }
    }
}

// include directLight && spotLight
export function lightCollecting (view: RenderView) {
    _validLights.length = 0;

    const camera = view.camera;
    const scene = camera.scene!;
    _validLights.push(scene.mainLight!);

    const spotLights = scene.spotLights;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
            _validLights.push(light);
        }
    }

    return _validLights;
}

export function sceneCulling (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const renderObjects = pipeline.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;

    const shadows = pipeline.shadows;
    const mainLight = scene.mainLight;

    if (mainLight) {
        mainLight.update();
        if (shadows.type === ShadowType.Planar) {
            shadows.updateDirLight(mainLight);
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

                    // frustum culling
                    if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                        continue;
                    }

                    renderObjects.push(getRenderObject(model, camera));
                }
            }
        }
    }

    if (shadows.type === ShadowType.Planar) {
        shadows.updateShadowList(scene, camera.frustum, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
    }
}
