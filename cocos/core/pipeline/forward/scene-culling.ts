/**
 * @packageDocumentation
 * @hidden
 */

import { aabb, intersect } from '../../geometry';
import { Model } from '../../renderer/scene/model';
import { Camera, SKYBOX_FLAG } from '../../renderer/scene/camera';
import { Layers } from '../../scene-graph/layers';
import { Vec3} from '../../math';
import { ForwardPipeline } from './forward-pipeline';
import { RenderView } from '../render-view';
import { Pool } from '../../memop';
import { IRenderObject } from '../define';
import { ShadowType } from '../../renderer/scene/shadows';

const _tempVec3 = new Vec3();
let _castWorldBounds = new aabb();
let _receiveWorldBounds = new aabb();
let _castBoundsInited = false;
let _receiveBoundsInited = false;

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

export function sceneCulling (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const mainLight = scene.mainLight;
    const shadows = pipeline.shadows;

    const renderObjects = pipeline.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;
    const shadowObjects = pipeline.shadowObjects;
    shadowPool.freeArray(shadowObjects); shadowObjects.length = 0;

    // Each time the calculation,
    // reset the flag.
    _castBoundsInited = false;
    _receiveBoundsInited = false;

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

                    // shadow render Object
                    if (model.castShadow && model.worldBounds) {
                        if (!_castBoundsInited) {
                            _castWorldBounds.copy(model.worldBounds);
                            _castBoundsInited = true;
                        }
                        aabb.merge(_castWorldBounds, _castWorldBounds, model.worldBounds);
                        shadowObjects.push(getCastShadowRenderObject(model, camera));
                    }

                    // Even if the obstruction is not in the field of view,
                    // the shadow is still visible.
                    if (model.receiveShadow && model.worldBounds) {
                        if(!_receiveBoundsInited) {
                            _receiveWorldBounds.copy(model.worldBounds);
                            _receiveBoundsInited = true;
                        }
                        aabb.merge(_receiveWorldBounds, _receiveWorldBounds, model.worldBounds);
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

    if (_castWorldBounds) { aabb.toBoundingSphere(shadows.sphere, _castWorldBounds); }

    if (_receiveWorldBounds) { aabb.toBoundingSphere(shadows.receiveSphere, _receiveWorldBounds); }

    if (shadows.type === ShadowType.Planar) {
        shadows.updateShadowList(scene, camera.frustum, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
    }
}
