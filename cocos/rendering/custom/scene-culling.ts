import { assert } from '@base/debug';
import { Vec3 } from '@base/math';
import { Frustum, intersect, AABB } from '../../core/geometry';
import { CommandBuffer } from '../../gfx';
import { BatchingSchemes, Pass, RenderScene } from '../../render-scene';
import { CSMLevel, Camera, DirectionalLight, Light, LightType, Model, SKYBOX_FLAG, ShadowType, SpotLight } from '../../render-scene/scene';
import { Node } from '../../scene-graph';
import { PipelineSceneData } from '../pipeline-scene-data';
import { hashCombineStr, getSubpassOrPassID, bool } from './define';
import { LayoutGraphData } from './layout-graph';
import { RenderGraph, RenderGraphValue, SceneData } from './render-graph';
import { SceneFlags } from './types';
import { RenderQueue, RenderQueueDesc } from './web-pipeline-types';

function computeCullingKey (camera: Camera | null, light: Light | null, castShadows: boolean, lightLevel: number): number {
    let hashCode = 0;
    if (camera) {
        // camera
        hashCode = hashCombineStr(`u${camera.node.uuid}`, hashCode);
        hashCode = hashCombineStr(`p${camera.priority}`, hashCode);
        hashCode = hashCombineStr(`v${camera.visibility}`, hashCode);
        hashCode = hashCombineStr(`f${camera.clearFlag}`, hashCode);
        hashCode = hashCombineStr(`cx${camera.clearColor.x}cy${camera.clearColor.y}cz${camera.clearColor.z}cw${camera.clearColor.w}`, hashCode);
        hashCode = hashCombineStr(`cd${camera.clearDepth}cs${camera.clearStencil}`, hashCode);
        hashCode = hashCombineStr(`pj${camera.projectionType}`, hashCode);
        hashCode = hashCombineStr(`fa${camera.fovAxis}`, hashCode);
        hashCode = hashCombineStr(`fov${camera.fov}`, hashCode);
        hashCode = hashCombineStr(`n${camera.nearClip}`, hashCode);
        hashCode = hashCombineStr(`far${camera.farClip}`, hashCode);
        hashCode = hashCombineStr(`apt${camera.aperture}`, hashCode);
        hashCode = hashCombineStr(`sht${camera.shutter}`, hashCode);
        hashCode = hashCombineStr(`iso${camera.iso}`, hashCode);
        hashCode = hashCombineStr(`rx${camera.viewport.x}ry${camera.viewport.y}rw${camera.viewport.width}rh${camera.viewport.height}`, hashCode);
        hashCode = hashCombineStr(`upp${camera.usePostProcess}`, hashCode);
    }
    // light
    if (light) {
        hashCode = hashCombineStr(`u${light.node!.uuid}`, hashCode);
        // hashCode = hashCombineStr(`cx${light.finalColor.x}cy${light.finalColor.y}cz${light.finalColor.z}`, hashCode);
        // hashCode = hashCombineStr(`ct${light.useColorTemperature}`, hashCode);
        // hashCode = hashCombineStr(`ctv${light.colorTemperature}`, hashCode);
        // hashCode = hashCombineStr(`vis${light.visibility}`, hashCode);
        // hashCode = hashCombineStr(`tp${light.type}`, hashCode);
        // switch (light.type) {
        // case LightType.DIRECTIONAL:
        //     hashCode = hashCombineStr(`${(light as DirectionalLight).illuminance}`, hashCode);
        //     break;
        // default:
        // }
    }
    hashCode = hashCombineStr(`cast${castShadows}`, hashCode);
    hashCode = hashCombineStr(`level${lightLevel}`, hashCode);
    return hashCode;
}

class CullingKey {
    camera: Camera | null;
    light: Light | null;
    castShadows = false;
    lightLevel = 0xffffffff;
    constructor (camera: Camera | null, light: Light | null, castShadows: boolean, lightLevel: number) {
        this.camera = camera;
        this.light = light;
        this.castShadows = castShadows;
        this.lightLevel = lightLevel;
    }
}

let pSceneData: PipelineSceneData;

class CullingQueries {
    // key: hash val
    culledResultIndex: Map<number, number> = new Map<number, number>();
    cullingKeyResult: Map<number, CullingKey> = new Map<number, CullingKey>();
}

function isNodeVisible (node: Node, visibility: number): boolean {
    return node && ((visibility & node.layer) === node.layer);
}

function isModelVisible (model: Model, visibility: number): boolean {
    return !!(visibility & model.visFlags);
}
const transWorldBounds = new AABB();
function isFrustumVisible (model: Model, frustum: Readonly<Frustum>, castShadow: boolean): boolean {
    const modelWorldBounds = model.worldBounds;
    if (!modelWorldBounds) {
        return false;
    }
    transWorldBounds.copy(modelWorldBounds);
    const shadows = pSceneData.shadows;
    if (shadows.type === ShadowType.Planar && castShadow) {
        AABB.transform(transWorldBounds, modelWorldBounds, shadows.matLight);
    }
    return !intersect.aabbFrustum(transWorldBounds, frustum);
}

function sceneCulling (
    skyboxModelToSkip: Model | null,
    scene: RenderScene,
    camera: Camera,
    camOrLightFrustum: Readonly<Frustum>,
    castShadow: boolean,
    models: Array<Model>,
): void {
    const visibility = camera.visibility;
    for (const model of scene.models) {
        assert(!!model);
        if (!model.enabled || model === skyboxModelToSkip || (castShadow && !model.castShadow)) {
            continue;
        }
        if (scene && scene.isCulledByLod(camera, model)) {
            continue;
        }

        if (isNodeVisible(model.node, visibility)
             || isModelVisible(model, visibility)) {
            // frustum culling
            if (isFrustumVisible(model, camOrLightFrustum, castShadow)) {
                continue;
            }

            models.push(model);
        }
    }
}

function isBlend (pass: Pass): boolean {
    let bBlend = false;
    for (const target of pass.blendState.targets) {
        if (target.blend) {
            bBlend = true;
        }
    }
    return bBlend;
}

function computeSortingDepth (camera: Camera, model: Model): number {
    let depth = 0;
    if (model.node) {
        const  node = model.transform;
        const tempVec3 = new Vec3();
        const position = Vec3.subtract(tempVec3, node.worldPosition, camera.position);
        depth = position.dot(camera.forward);
    }
    return depth;
}

function addRenderObject (
    phaseLayoutId: number,
    isDrawOpaqueOrMask: boolean,
    isDrawBlend: boolean,
    camera: Camera,
    model: Model,
    queue: RenderQueue,
): void {
    const subModels = model.subModels;
    const subModelCount = subModels.length;
    for (let subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
        const subModel = subModels[subModelIdx];
        const passes = subModel.passes;
        const passCount = passes.length;
        for (let passIdx = 0; passIdx < passCount; ++passIdx) {
            const pass = passes[passIdx];
            // check phase
            const phaseAllowed = phaseLayoutId === pass.phaseID;
            if (!phaseAllowed) {
                continue;
            }
            // check scene flags
            const is_blend = isBlend(pass);
            const isOpaqueOrMask = !is_blend;
            if (!isDrawBlend && is_blend) {
                // skip transparent object
                continue;
            }
            if (!isDrawOpaqueOrMask && isOpaqueOrMask) {
                // skip opaque object
                continue;
            }

            // add object to queue
            if (pass.batchingScheme === BatchingSchemes.INSTANCING) {
                const instancedBuffer = pass.getInstancedBuffer();
                instancedBuffer.merge(subModel, passIdx);
                if (is_blend) {
                    queue.transparentInstancingQueue.add(instancedBuffer);
                } else {
                    queue.opaqueInstancingQueue.add(instancedBuffer);
                }
            } else {
                const depth = computeSortingDepth(camera, model);
                if (is_blend) {
                    queue.transparentQueue.add(model, depth, subModelIdx, passIdx);
                } else {
                    queue.opaqueQueue.add(model, depth, subModelIdx, passIdx);
                }
            }
        }
    }
}

export class SceneCulling {
    sceneQueries: Map<RenderScene, CullingQueries> = new Map<RenderScene, CullingQueries>();
    culledResults: Array<Array<Model>> = new Array<Array<Model>>();
    renderQueues: Array<RenderQueue> = new Array<RenderQueue>();
    sceneQueryIndex: Map<number, RenderQueueDesc> = new Map<number, RenderQueueDesc>();
    // source id
    numCullingQueries = 0;
    // target id
    numRenderQueues = 0;
    layoutGraph;
    renderGraph;
    clear (): void {
        this.sceneQueries.clear();
        for (const c of this.culledResults) {
            c.length = 0;
        }
        this.culledResults.length = 0;
        for (const q of this.renderQueues) {
            q.clear();
        }
        this.renderQueues.length = 0;
        this.sceneQueryIndex.clear();
        this.numCullingQueries = 0;
        this.numRenderQueues = 0;
    }

    buildRenderQueues (rg: RenderGraph, lg: LayoutGraphData, pplSceneData: PipelineSceneData): void {
        this.layoutGraph = lg;
        this.renderGraph = rg;
        pSceneData = pplSceneData;
        this.collectCullingQueries(rg, lg);
        this.batchCulling(pplSceneData);
        this.fillRenderQueues(rg, pplSceneData);
    }

    private getOrCreateSceneCullingQuery (sceneData: SceneData): number {
        const scene = sceneData.scene!;
        let queries = this.sceneQueries.get(scene);
        if (!queries) {
            this.sceneQueries.set(scene, new CullingQueries());
            queries = this.sceneQueries.get(scene);
        }
        const castShadow = bool(sceneData.flags & SceneFlags.SHADOW_CASTER);
        const key = computeCullingKey(sceneData.camera, sceneData.light.light, castShadow, sceneData.light.level);
        const cullNum = queries!.culledResultIndex.get(key);
        if (cullNum !== undefined) {
            return cullNum;
        }
        const soureceID = this.numCullingQueries++;
        if (this.numCullingQueries >  this.culledResults.length) {
            assert(this.numCullingQueries === (this.culledResults.length + 1));
            this.culledResults.push([]);
        }
        queries!.culledResultIndex.set(key, soureceID);
        queries!.cullingKeyResult.set(key, new CullingKey(sceneData.camera, sceneData.light.light, castShadow, sceneData.light.level));
        return soureceID;
    }

    private createRenderQueue (sceneFlags: SceneFlags, subpassOrPassLayoutID: number): number {
        const targetID = this.numRenderQueues++;
        if (this.numRenderQueues > this.renderQueues.length) {
            assert(this.numRenderQueues === (this.renderQueues.length + 1));
            this.renderQueues.push(new RenderQueue());
        }
        assert(targetID < this.renderQueues.length);
        const rq = this.renderQueues[targetID];
        rq.sceneFlags = sceneFlags;
        rq.subpassOrPassLayoutID = subpassOrPassLayoutID;
        return targetID;
    }

    private collectCullingQueries (rg: RenderGraph, lg: LayoutGraphData): void {
        for (const v of rg.vertices()) {
            if (!rg.holds(RenderGraphValue.Scene, v) || !rg.getValid(v)) {
                continue;
            }
            const sceneData = rg.getScene(v);
            if (!sceneData.scene) {
                assert(!!sceneData.scene);
                continue;
            }
            const sourceID = this.getOrCreateSceneCullingQuery(sceneData);
            const layoutID = getSubpassOrPassID(v, rg, lg);
            const targetID = this.createRenderQueue(sceneData.flags, layoutID);

            const lightType = sceneData.light.light ? sceneData.light.light.type : LightType.UNKNOWN;
            // add render queue to query source
            this.sceneQueryIndex.set(v, new RenderQueueDesc(sourceID, targetID, lightType));
        }
    }

    uploadInstancing (cmdBuffer: CommandBuffer): void {
        for (let queueID = 0; queueID !== this.numRenderQueues; ++queueID) {
            assert(this.numRenderQueues <= this.renderQueues.length);
            const queue = this.renderQueues[queueID];
            queue.opaqueInstancingQueue.uploadBuffers(cmdBuffer);
            queue.transparentInstancingQueue.uploadBuffers(cmdBuffer);
        }
    }

    private batchCulling (pplSceneData: PipelineSceneData): void {
        const skybox = pplSceneData.skybox;
        const skyboxModelToSkip = skybox ? skybox.model : null;
        for (const [scene, queries] of this.sceneQueries) {
            assert(!!scene);
            for (const [key, sourceID] of queries.culledResultIndex) {
                const cullingKey = queries.cullingKeyResult.get(key)!;
                assert(!!cullingKey.camera);
                assert(cullingKey.camera.scene === scene);
                const camera = cullingKey.camera;
                const light = cullingKey.light;
                const level = cullingKey.lightLevel;
                const castShadow = cullingKey.castShadows;
                assert(sourceID < this.culledResults.length);
                const models = this.culledResults[sourceID];
                if (light) {
                    switch (light.type) {
                    case LightType.SPOT:
                        sceneCulling(skyboxModelToSkip, scene, camera, (light as SpotLight).frustum, castShadow, models);
                        break;
                    case LightType.DIRECTIONAL: {
                        const csmLayers = pplSceneData.csmLayers;
                        const mainLight: DirectionalLight = light as DirectionalLight;
                        const csmLevel = mainLight.csmLevel;
                        let frustum: Readonly<Frustum>;
                        const shadows = pplSceneData.shadows;
                        if (shadows.type === ShadowType.Planar) {
                            frustum = camera.frustum;
                        } else {
                            if (shadows.enabled && shadows.type === ShadowType.ShadowMap && mainLight && mainLight.node) {
                                // pplSceneData.updateShadowUBORange(UBOShadow.SHADOW_COLOR_OFFSET, shadows.shadowColor);
                                csmLayers.update(pplSceneData, camera);
                            }

                            if (mainLight.shadowFixedArea || csmLevel === CSMLevel.LEVEL_1) {
                                frustum = csmLayers.specialLayer.validFrustum;
                            } else {
                                frustum = csmLayers.layers[level].validFrustum;
                            }
                        }
                        sceneCulling(skyboxModelToSkip, scene, camera, frustum, castShadow, models);
                    }
                        break;
                    default:
                    }
                } else {
                    sceneCulling(skyboxModelToSkip, scene, camera, camera.frustum, castShadow, models);
                }
            }
        }
    }

    private fillRenderQueues (rg: RenderGraph, pplSceneData: PipelineSceneData): void {
        const skybox = pplSceneData.skybox;
        for (const [sceneId, desc] of this.sceneQueryIndex) {
            assert(rg.holds(RenderGraphValue.Scene, sceneId));
            const sourceId = desc.culledSource;
            const targetId = desc.renderQueueTarget;
            const sceneData = rg.getScene(sceneId);
            const isDrawBlend = bool(sceneData.flags & SceneFlags.TRANSPARENT_OBJECT);
            const isDrawOpaqueOrMask = bool(sceneData.flags & (SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT));
            const isDrawShadowCaster = bool(sceneData.flags & SceneFlags.SHADOW_CASTER);
            if (!isDrawShadowCaster && !isDrawBlend && !isDrawOpaqueOrMask) {
                continue;
            }
            // render queue info
            const renderQueueId = rg.getParent(sceneId);
            assert(rg.holds(RenderGraphValue.Queue, renderQueueId));
            const graphRenderQueue = rg.getQueue(renderQueueId);
            const phaseLayoutId = graphRenderQueue.phaseID;
            assert(phaseLayoutId !== this.layoutGraph.nullVertex());

            // culling source
            assert(sourceId < this.culledResults.length);
            const sourceModels = this.culledResults[sourceId];

            // queue target
            assert(targetId < this.renderQueues.length);
            const renderQueue = this.renderQueues[targetId];
            assert(renderQueue.empty());

            // skybox
            const camera = sceneData.camera;
            assert(!!camera);
            if (!bool(sceneData.flags & SceneFlags.SHADOW_CASTER)
            && skybox && skybox.enabled
            && (camera.clearFlag & SKYBOX_FLAG)) {
                assert(!!skybox.model);
                const model = skybox.model;
                const node = model.node;
                let depth = 0;
                if (node) {
                    const tempVec3 = new Vec3();
                    Vec3.subtract(tempVec3, node.worldPosition, camera.position);
                    depth = tempVec3.dot(camera.forward);
                }
                renderQueue.opaqueQueue.add(model, depth, 0, 0);
            }

            // fill render queue
            for (const model of sourceModels) {
                addRenderObject(
                    phaseLayoutId,
                    isDrawOpaqueOrMask,
                    isDrawBlend,
                    camera,
                    model,
                    renderQueue,
                );
            }
            // post-processing
            renderQueue.sort();
        }
    }
}
