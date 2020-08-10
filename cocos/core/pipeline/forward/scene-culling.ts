import { intersect, sphere } from '../../geometry';
import { Model, Camera } from '../../renderer';
import { Layers } from '../../scene-graph';
import { DirectionalLight } from '../../renderer/scene/directional-light';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from '../culling';
import { Vec3} from '../../math';
import { LightType } from '../../renderer/scene/light';
import { SKYBOX_FLAG } from '../../renderer';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { SpotLight } from '../../renderer/scene/spot-light';
import { UBOForwardLight } from '../define';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from './forward-pipeline';
import { RenderView } from '../render-view';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXBuffer } from '../../gfx/buffer';

const _tempVec3 = new Vec3();
const _sphere = sphere.create(0, 0, 0, 1);

function addVisibleModel (pipeline: ForwardPipeline, model: Model, camera: Camera) {
    let depth = 0;
    if (model.node) {
        Vec3.subtract(_tempVec3, model.node.worldPosition, camera.position);
        depth = Vec3.dot(_tempVec3, camera.forward);
    }
    pipeline.renderObjects.push({
        model,
        depth,
    });
}

function cullLightPerModel (pipeline: ForwardPipeline, model: Model) {
    const validLights = pipeline.validLights;
    const lightIndices = pipeline.lightIndices;

    if (model.node) {
        model.node.getWorldPosition(_tempVec3);
    } else {
        _tempVec3.set(0.0, 0.0, 0.0);
    }
    for (let i = 0; i < validLights.length; i++) {
        let isCulled = false;
        switch (validLights[i].type) {
            case LightType.DIRECTIONAL:
                isCulled = cullDirectionalLight(validLights[i] as DirectionalLight, model);
                break;
            case LightType.SPHERE:
                isCulled = cullSphereLight(validLights[i] as SphereLight, model);
                break;
            case LightType.SPOT:
                isCulled = cullSpotLight(validLights[i] as SpotLight, model);
                break;
        }
        if (!isCulled) {
            lightIndices.push(i);
        }
    }
}

export function sceneCulling (pipeline: ForwardPipeline, view: RenderView) {
    const camera = view.camera;
    const scene = camera.scene!;
    const device = pipeline.device;
    const renderObjects = pipeline.renderObjects;
    renderObjects.length = 0;

    const mainLight = scene.mainLight;
    const planarShadows = pipeline.planarShadows;
    if (mainLight) {
        mainLight.update();
        if (planarShadows.enabled && mainLight.node!.hasChangedFlags) {
            planarShadows.updateDirLight(mainLight);
        }
    }

    if (pipeline.skybox.enabled && (camera.clearFlag & SKYBOX_FLAG)) {
        addVisibleModel(pipeline, pipeline.skybox.model!, camera);
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
                    addVisibleModel(pipeline, model, camera);
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
                    addVisibleModel(pipeline, model, camera);
                }
            }
        }
    }

    if (planarShadows.enabled) {
        planarShadows.updateShadowList(scene, camera.frustum, stamp, (camera.visibility & Layers.BitMask.DEFAULT) !== 0);
    }

    const validLights = pipeline.validLights;
    const lightBuffers = pipeline.lightBuffers;
    const lightIndexOffsets = pipeline.lightIndexOffsets;
    const lightIndices = pipeline.lightIndices;
    validLights.length = lightIndexOffsets.length = lightIndices.length = 0;
    const sphereLights = view.camera.scene!.sphereLights;

    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        light.update();
        sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
            validLights.push(light);
        }
    }
    const spotLights = view.camera.scene!.spotLights;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        light.update();
        sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
            validLights.push(light);
        }
    }

    if (validLights.length > lightBuffers.length) {
        for (let l = lightBuffers.length; l < validLights.length; ++l) {
            const lightBuffer: GFXBuffer = device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOForwardLight.SIZE,
                stride: UBOForwardLight.SIZE,
            });
            lightBuffers.push(lightBuffer);
        }
    }

    if (validLights.length > 0) {
        for (let i = 0; i < renderObjects.length; i++) {
            lightIndexOffsets[i] = lightIndices.length;
            cullLightPerModel(pipeline, renderObjects[i].model);
        }
    }
}
