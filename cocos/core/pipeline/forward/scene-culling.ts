import { intersect } from '../../geometry';
import { Model, Camera } from '../../renderer';
import { Layers } from '../../scene-graph';
import { Vec3} from '../../math';
import { SKYBOX_FLAG } from '../../renderer';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from './forward-pipeline';
import { RenderView } from '../render-view';
import { Pool } from '../../memop';
import { IRenderObject } from '../define';

const _tempVec3 = new Vec3();

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

export function sceneCulling (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const renderObjects = pipeline.renderObjects;
    roPool.freeArray(renderObjects); renderObjects.length = 0;

    const mainLight = scene.mainLight;
    const planarShadows = scene.planarShadows;
    if (mainLight) {
        mainLight.update();
        if (planarShadows.enabled && mainLight.node!.hasChangedFlags) {
            planarShadows.updateDirLight(mainLight);
        }
    }

    if (scene.skybox.enabled && (camera.clearFlag & SKYBOX_FLAG)) {
        renderObjects.push(getRenderObject(scene.skybox, camera));
    }

    const models = scene.models;
    const stamp = legacyCC.director.getTotalFrames();

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        // filter model by view visibility
        if (model.enabled) {
            const vis = view.visibility & Layers.BitMask.UI_2D;
            if (vis) {
                if ((model.node && (view.visibility === model.node.layer)) ||
                    view.visibility === model.visFlags) {
                    model.updateTransform(stamp);
                    model.updateUBOs(stamp);
                    renderObjects.push(getRenderObject(model, camera));
                }
            } else {
                if (model.node && ((view.visibility & model.node.layer) === model.node.layer) ||
                    (view.visibility & model.visFlags)) {
                    model.updateTransform(stamp);

                    // frustum culling
                    if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                        continue;
                    }

                    model.updateUBOs(stamp);
                    renderObjects.push(getRenderObject(model, camera));
                }
            }
        }
    }

    if (planarShadows.enabled) {
        planarShadows.updateShadowList(camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
    }
}
