import { Vec3, assert, RecyclePool } from '../../core';
import { Frustum, intersect, AABB } from '../../core/geometry';
import { CommandBuffer } from '../../gfx';
import { BatchingSchemes, Pass, RenderScene } from '../../render-scene';
import { CSMLevel, Camera, DirectionalLight, LightType, Model, ProbeType,
    ReflectionProbe, SKYBOX_FLAG, ShadowType, SpotLight } from '../../render-scene/scene';
import { Layers, Node } from '../../scene-graph';
import { PipelineSceneData } from '../pipeline-scene-data';
import { hashCombineStr, getSubpassOrPassID, bool } from './define';
import { LayoutGraphData } from './layout-graph';
import { RenderGraph, RenderGraphValue, SceneData } from './render-graph';
import { SceneFlags } from './types';
import { RenderQueue, RenderQueueDesc, instancePool } from './web-pipeline-types';
import { ObjectPool } from './utils';

const vec3Pool = new ObjectPool(() => new Vec3());
class CullingPools {
    cullingKeyRecycle = new RecyclePool(() => new CullingKey(), 8);
    cullingQueriesRecycle = new RecyclePool(() => new CullingQueries(), 8);
    renderQueueRecycle = new RecyclePool(() => new RenderQueue(), 8);
    renderQueueDescRecycle = new RecyclePool(() => new RenderQueueDesc(), 8);
}
const REFLECTION_PROBE_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.UI_3D,
    Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

function computeCullingKey (
    sceneData: SceneData,
    castShadows: boolean,
): number {
    let hashCode = 0;
    const camera = sceneData.camera;
    const light = sceneData.light.light;
    const lightLevel = sceneData.light.level;
    const reflectProbe = sceneData.light.probe;
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
    if (reflectProbe) {
        hashCode = hashCombineStr(`probe${reflectProbe.getProbeId()}`, hashCode);
    }
    return hashCode;
}

class CullingKey {
    sceneData: SceneData | null = null;
    castShadows = false;
    constructor (sceneData: SceneData | null = null, castShadows: boolean = false) {
        this.sceneData = sceneData;
        this.castShadows = castShadows;
    }
    update (sceneData: SceneData, castShadows: boolean): void {
        this.sceneData = sceneData;
        this.castShadows = castShadows;
    }
}

let pSceneData: PipelineSceneData;

class CullingQueries {
    // key: hash val
    culledResultIndex: Map<number, number> = new Map<number, number>();
    cullingKeyResult: Map<number, CullingKey> = new Map<number, CullingKey>();
    update (): void {
        this.culledResultIndex.clear();
        this.cullingKeyResult.clear();
    }
}

function isNodeVisible (node: Node, visibility: number): boolean {
    return node && ((visibility & node.layer) === node.layer);
}

function isModelVisible (model: Model, visibility: number): boolean {
    return !!(visibility & model.visFlags);
}

function isReflectProbeMask (model: Model): boolean {
    return bool((model.node.layer & REFLECTION_PROBE_DEFAULT_MASK) === model.node.layer || (REFLECTION_PROBE_DEFAULT_MASK & model.visFlags));
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

function isIntersectAABB (lAABB: AABB, rAABB: AABB): boolean {
    return !intersect.aabbWithAABB(lAABB, rAABB);
}

function sceneCulling (
    scene: RenderScene,
    camera: Camera,
    camOrLightFrustum: Readonly<Frustum>,
    castShadow: boolean,
    probe: ReflectionProbe | null,
    isReflectProbe: boolean,
    models: Array<Model>,
): void {
    const skybox = pSceneData.skybox;
    const skyboxModel = skybox.model;
    const visibility = camera.visibility;
    const camSkyboxFlag = camera.clearFlag & SKYBOX_FLAG;
    if (!castShadow && skybox && skybox.enabled && skyboxModel && camSkyboxFlag) {
        models.push(skyboxModel);
    }

    for (const model of scene.models) {
        assert(!!model);
        if (!model.enabled || !model.node || (castShadow && !model.castShadow)) {
            continue;
        }
        if (scene && scene.isCulledByLod(camera, model)) {
            continue;
        }
        if (!probe || (probe && probe.probeType === ProbeType.CUBE)) {
            if (isNodeVisible(model.node, visibility)
                || isModelVisible(model, visibility)) {
                const wBounds = model.worldBounds;
                // frustum culling
                if (wBounds && ((!probe && isFrustumVisible(model, camOrLightFrustum, castShadow))
                    || (probe && isIntersectAABB(wBounds, probe.boundingBox!)))) {
                    continue;
                }

                models.push(model);
            }
        } else if (isReflectProbeMask(model)) {
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
        const tempVec3 = vec3Pool.acquire();
        const position = Vec3.subtract(tempVec3, node.worldPosition, camera.position);
        depth = position.dot(camera.forward);
        vec3Pool.release(tempVec3);
    }
    return depth;
}

function addRenderObject (
    phaseLayoutId: number,
    isDrawOpaqueOrMask: boolean,
    isDrawBlend: boolean,
    isDrawProbe: boolean,
    camera: Camera,
    model: Model,
    queue: RenderQueue,
): void {
    const probeQueue = queue.probeQueue;
    if (isDrawProbe) {
        probeQueue.applyMacro(model, phaseLayoutId);
    }
    const subModels = model.subModels;
    const subModelCount = subModels.length;
    const skyboxModel = pSceneData.skybox.model;
    for (let subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
        const subModel = subModels[subModelIdx];
        const passes = subModel.passes;
        const passCount = passes.length;
        const probePhase = probeQueue.probeMap.includes(subModel);
        if (probePhase) phaseLayoutId = probeQueue.defaultId;
        for (let passIdx = 0; passIdx < passCount; ++passIdx) {
            if (model === skyboxModel && !subModelIdx && !passIdx && isDrawOpaqueOrMask) {
                queue.opaqueQueue.add(model, computeSortingDepth(camera, model), subModelIdx, passIdx);
                continue;
            }
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
    cullingPools = new CullingPools();
    // source id
    numCullingQueries = 0;
    // target id
    numRenderQueues = 0;
    layoutGraph;
    renderGraph;
    resetPool (): void {
        this.cullingPools.cullingKeyRecycle.reset();
        this.cullingPools.cullingQueriesRecycle.reset();
        this.cullingPools.renderQueueRecycle.reset();
        this.cullingPools.renderQueueDescRecycle.reset();
        instancePool.reset();
    }
    clear (): void {
        this.resetPool();
        this.sceneQueries.clear();
        this.culledResults.length = 0;
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

    private getOrCreateSceneCullingQuery (sceneId: number): number {
        const sceneData: SceneData = this.renderGraph.getScene(sceneId);
        const scene = sceneData.scene!;
        let queries = this.sceneQueries.get(scene);
        if (!queries) {
            const cullingQuery = this.cullingPools.cullingQueriesRecycle.add();
            cullingQuery.update();
            this.sceneQueries.set(scene, cullingQuery);
            queries = this.sceneQueries.get(scene);
        }
        const castShadow: boolean = bool(sceneData.flags & SceneFlags.SHADOW_CASTER);
        const key = computeCullingKey(sceneData, castShadow);
        const cullNum = queries!.culledResultIndex.get(key);
        if (cullNum !== undefined) {
            return cullNum;
        }
        const sourceID = this.numCullingQueries++;
        if (this.numCullingQueries >  this.culledResults.length) {
            assert(this.numCullingQueries === (this.culledResults.length + 1));
            this.culledResults.push([]);
        }
        queries!.culledResultIndex.set(key, sourceID);
        const cullingKey = this.cullingPools.cullingKeyRecycle.add();
        cullingKey.update(
            sceneData,
            castShadow,
        );
        queries!.cullingKeyResult.set(key, cullingKey);
        return sourceID;
    }

    private createRenderQueue (sceneFlags: SceneFlags, subpassOrPassLayoutID: number): number {
        const targetID = this.numRenderQueues++;
        if (this.numRenderQueues > this.renderQueues.length) {
            assert(this.numRenderQueues === (this.renderQueues.length + 1));
            const renderQueue = this.cullingPools.renderQueueRecycle.add();
            renderQueue.update();
            this.renderQueues.push(renderQueue);
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
            const sourceID = this.getOrCreateSceneCullingQuery(v);
            const layoutID: number = getSubpassOrPassID(v, rg, lg);
            const targetID = this.createRenderQueue(sceneData.flags, layoutID);

            const lightType = sceneData.light.light ? sceneData.light.light.type : LightType.UNKNOWN;
            const renderQueueDesc = this.cullingPools.renderQueueDescRecycle.add();
            renderQueueDesc.update(sourceID, targetID, lightType);
            // add render queue to query source
            this.sceneQueryIndex.set(v, renderQueueDesc);
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

    private _getPhaseIdFromScene (scene: number): number {
        const rg: RenderGraph = this.renderGraph;
        const renderQueueId = rg.getParent(scene);
        assert(rg.holds(RenderGraphValue.Queue, renderQueueId));
        const graphRenderQueue = rg.getQueue(renderQueueId);
        return graphRenderQueue.phaseID;
    }

    private batchCulling (pplSceneData: PipelineSceneData): void {
        for (const [scene, queries] of this.sceneQueries) {
            assert(!!scene);
            for (const [key, sourceID] of queries.culledResultIndex) {
                const cullingKey = queries.cullingKeyResult.get(key)!;
                const sceneData = cullingKey.sceneData!;
                assert(!!sceneData.camera);
                assert(sceneData.camera.scene === scene);
                const camera = sceneData.camera;
                const light = sceneData.light.light;
                const level = sceneData.light.level;
                const castShadow = cullingKey.castShadows;
                const reflectProbe = sceneData.light.probe;
                assert(sourceID < this.culledResults.length);
                const models = this.culledResults[sourceID];
                const isReflectProbe = bool(sceneData.flags & SceneFlags.REFLECTION_PROBE);
                if (reflectProbe) {
                    sceneCulling(scene, reflectProbe.camera, reflectProbe.camera.frustum, castShadow, reflectProbe, isReflectProbe, models);
                    continue;
                }
                if (light) {
                    switch (light.type) {
                    case LightType.SPOT:
                        sceneCulling(scene, camera, (light as SpotLight).frustum, castShadow, null, isReflectProbe, models);
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
                        sceneCulling(scene, camera, frustum, castShadow, null, isReflectProbe, models);
                    }
                        break;
                    default:
                    }
                } else {
                    sceneCulling(scene, camera, camera.frustum, castShadow, null, isReflectProbe, models);
                }
            }
        }
    }

    private fillRenderQueues (rg: RenderGraph, pplSceneData: PipelineSceneData): void {
        for (const [sceneId, desc] of this.sceneQueryIndex) {
            assert(rg.holds(RenderGraphValue.Scene, sceneId));
            const sourceId = desc.culledSource;
            const targetId = desc.renderQueueTarget;
            const sceneData = rg.getScene(sceneId);
            const isDrawBlend: boolean = bool(sceneData.flags & SceneFlags.TRANSPARENT_OBJECT);
            const isDrawOpaqueOrMask: boolean = bool(sceneData.flags & (SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT));
            const isDrawShadowCaster: boolean = bool(sceneData.flags & SceneFlags.SHADOW_CASTER);
            const isDrawProbe: boolean = bool(sceneData.flags & SceneFlags.REFLECTION_PROBE);
            if (!isDrawShadowCaster && !isDrawBlend && !isDrawOpaqueOrMask && !isDrawProbe) {
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
            // fill render queue
            for (const model of sourceModels) {
                addRenderObject(
                    phaseLayoutId,
                    isDrawOpaqueOrMask,
                    isDrawBlend,
                    isDrawProbe,
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
