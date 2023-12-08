import { Vec3, assert, RecyclePool } from '../../core';
import { Frustum, intersect, AABB } from '../../core/geometry';
import { CommandBuffer, Device, Buffer, BufferInfo, BufferViewInfo, MemoryUsageBit, BufferUsageBit } from '../../gfx';
import { BatchingSchemes, Pass, RenderScene } from '../../render-scene';
import { CSMLevel, Camera, DirectionalLight, Light, LightType, Model, PointLight, ProbeType,
    RangedDirectionalLight,
    ReflectionProbe, SKYBOX_FLAG, ShadowType, Shadows, SphereLight, SpotLight } from '../../render-scene/scene';
import { Layers, Node } from '../../scene-graph';
import { PipelineSceneData } from '../pipeline-scene-data';
import { hashCombineStr, getSubpassOrPassID, bool, AlignUp, SetLightUBO } from './define';
import { LayoutGraphData } from './layout-graph';
import { CullingFlags, RenderGraph, RenderGraphValue, SceneData } from './render-graph';
import { SceneFlags } from './types';
import { RenderQueue, RenderQueueDesc, instancePool } from './web-pipeline-types';
import { ObjectPool } from './utils';
import { getUniformBlockSize } from './layout-graph-utils';
import { WebProgramLibrary } from './web-program-library';

const vec3Pool = new ObjectPool(() => new Vec3());
class CullingPools {
    frustumCullingKeyRecycle = new RecyclePool(() => new FrustumCullingKey(), 8);
    frustumCullingsRecycle = new RecyclePool(() => new FrustumCulling(), 8);
    lightBoundsCullingRecycle = new RecyclePool(() => new LightBoundsCulling(), 8);
    lightBoundsCullingResultRecycle = new RecyclePool(() => new LightBoundsCullingResult(), 8);
    lightBoundsCullingKeyRecycle = new RecyclePool(() => new LightBoundsCullingKey(), 8);
    renderQueueRecycle = new RecyclePool(() => new RenderQueue(), 8);
    renderQueueDescRecycle = new RecyclePool(() => new RenderQueueDesc(), 8);
}
const REFLECTION_PROBE_DEFAULT_MASK = Layers.makeMaskExclude([Layers.BitMask.UI_2D, Layers.BitMask.UI_3D,
    Layers.BitMask.GIZMOS, Layers.BitMask.EDITOR,
    Layers.BitMask.SCENE_GIZMO, Layers.BitMask.PROFILER]);

function computeCullingKey (
    sceneData: SceneData,
    castShadows: boolean,
    refId: number = -1,
): number {
    let hashCode = 0;
    const camera = sceneData.camera;
    const light = sceneData.light.light;
    const lightLevel = sceneData.light.level;
    const culledByLight = sceneData.light.culledByLight;
    const reflectProbe = sceneData.light.probe;
    const shadeLight = sceneData.shadingLight;
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
    if (shadeLight) {
        hashCode = hashCombineStr(`shadeLight${shadeLight.node!.uuid}`, hashCode);
    }
    hashCode = hashCombineStr(`culledByLight${culledByLight}`, hashCode);
    hashCode = hashCombineStr(`cast${castShadows}`, hashCode);
    hashCode = hashCombineStr(`level${lightLevel}`, hashCode);
    if (reflectProbe) {
        hashCode = hashCombineStr(`probe${reflectProbe.getProbeId()}`, hashCode);
    }
    hashCode = hashCombineStr(`refId${refId}`, hashCode);
    return hashCode;
}

class FrustumCullingKey {
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

class LightBoundsCullingKey {
    sceneData: SceneData | null = null;
    frustumCullingID: FrustumCullingID = -1;
    constructor (sceneData: SceneData | null = null, frustumCullingID: FrustumCullingID = -1) {
        this.sceneData = sceneData;
        this.frustumCullingID = frustumCullingID;
    }
    update (sceneData: SceneData | null = null, frustumCullingID: FrustumCullingID = -1): void {
        this.sceneData = sceneData;
        this.frustumCullingID = frustumCullingID;
    }
}

class LightBoundsCulling {
    resultKeyIndex: Map<number, LightBoundsCullingKey> = new Map<number, LightBoundsCullingKey>();
    resultIndex: Map<number, LightBoundsCullingID> = new Map<number, LightBoundsCullingID>();
    update (): void {
        this.resultIndex.clear();
        this.resultKeyIndex.clear();
    }
}

class LightBoundsCullingResult {
    instances: Array<Model> = new Array<Model>();
    lightByteOffset: number = 0xFFFFFFFF;
    update (): LightBoundsCullingResult {
        this.instances.length = 0;
        this.lightByteOffset = 0xFFFFFFFF;
        return this;
    }
}

type FrustumCullingID = number;
type LightBoundsCullingID = number;

let pSceneData: PipelineSceneData;

class FrustumCulling {
    // key: hash val
    resultIndex: Map<number, FrustumCullingID> = new Map<number, FrustumCullingID>();
    resultKeyIndex: Map<number, FrustumCullingKey> = new Map<number, FrustumCullingKey>();
    update (): void {
        this.resultIndex.clear();
        this.resultKeyIndex.clear();
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
                if (is_blend) {
                    queue.transparentInstancingQueue.add(pass, subModel, passIdx);
                } else {
                    queue.opaqueInstancingQueue.add(pass, subModel, passIdx);
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
const rangedDirLightBoundingBox = new AABB(0, 0, 0, 0.5, 0.5, 0.5);
const lightAABB = new AABB();
export class SceneCulling {
    frustumCullings: Map<RenderScene, FrustumCulling> = new Map<RenderScene, FrustumCulling>();
    frustumCullingResults: Array<Array<Model>> = new Array<Array<Model>>();
    lightBoundsCullings: Map<RenderScene, LightBoundsCulling> = new Map<RenderScene, LightBoundsCulling>();
    lightBoundsCullingResults: Array<LightBoundsCullingResult> = new Array<LightBoundsCullingResult>();
    renderQueues: Array<RenderQueue> = new Array<RenderQueue>();
    renderQueueIndex: Map<number, RenderQueueDesc> = new Map<number, RenderQueueDesc>();
    cullingPools = new CullingPools();
    // source id
    numFrustumCulling = 0;
    numLightBoundsCulling = 0;
    // target id
    numRenderQueues = 0;
    layoutGraph;
    renderGraph;
    enableLightCulling = true;
    resetPool (): void {
        const cullingPools = this.cullingPools;
        cullingPools.frustumCullingKeyRecycle.reset();
        cullingPools.frustumCullingsRecycle.reset();
        cullingPools.lightBoundsCullingRecycle.reset();
        cullingPools.lightBoundsCullingResultRecycle.reset();
        cullingPools.lightBoundsCullingKeyRecycle.reset();
        cullingPools.renderQueueRecycle.reset();
        cullingPools.renderQueueDescRecycle.reset();
        instancePool.reset();
    }
    clear (): void {
        this.resetPool();
        this.frustumCullings.clear();
        this.frustumCullingResults.length = 0;
        this.lightBoundsCullings.clear();
        this.lightBoundsCullingResults.length = 0;
        this.renderQueues.length = 0;
        this.renderQueueIndex.clear();
        this.numLightBoundsCulling = 0;
        this.numFrustumCulling = 0;
        this.numRenderQueues = 0;
    }

    buildRenderQueues (rg: RenderGraph, lg: LayoutGraphData, pplSceneData: PipelineSceneData): void {
        this.layoutGraph = lg;
        this.renderGraph = rg;
        pSceneData = pplSceneData;
        this.collectCullingQueries(rg, lg);
        this.batchFrustumCulling(pplSceneData);
        this.batchLightBoundsCulling();
        this.fillRenderQueues(rg, pplSceneData);
    }

    private getOrCreateLightBoundsCulling (sceneData: SceneData, frustumCullingID: FrustumCullingID): LightBoundsCullingID {
        if (!(sceneData.cullingFlags & CullingFlags.LIGHT_BOUNDS)) {
            return 0xFFFFFFFF; // Return an empty ID.
        }
        if (sceneData.shadingLight?.type === LightType.DIRECTIONAL) {
            return 0xFFFFFFFF;
        }
        if (!this.enableLightCulling) {
            return 0xFFFFFFFF; // Return an empty ID.
        }
        assert(!!sceneData.shadingLight, 'shadingLight is expected but not found.');
        const scene = sceneData.scene;
        assert(!!scene, 'scene is expected but not found.');

        let queries = this.lightBoundsCullings.get(scene);
        if (!queries) {
            const cullingQuery = this.cullingPools.lightBoundsCullingRecycle.add();
            cullingQuery.update();
            this.lightBoundsCullings.set(scene, cullingQuery);
            queries = this.lightBoundsCullings.get(scene)!;
        }
        const key = computeCullingKey(sceneData, false, frustumCullingID);
        const cullNum = queries.resultIndex.get(key);
        if (cullNum !== undefined) {
            return cullNum;
        }
        const lightBoundsCullingID: LightBoundsCullingID = this.numLightBoundsCulling++;
        if (this.numLightBoundsCulling >  this.lightBoundsCullingResults.length) {
            assert(this.numLightBoundsCulling === (this.lightBoundsCullingResults.length + 1));
            this.lightBoundsCullingResults.push(this.cullingPools.lightBoundsCullingResultRecycle.add().update());
        }
        queries.resultIndex.set(key, lightBoundsCullingID);
        const cullingKey = this.cullingPools.lightBoundsCullingKeyRecycle.add();
        cullingKey.update(
            sceneData,
            frustumCullingID,
        );
        queries.resultKeyIndex.set(key, cullingKey);
        return lightBoundsCullingID;
    }

    private getOrCreateFrustumCulling (sceneId: number): number {
        const sceneData: SceneData = this.renderGraph.getScene(sceneId);
        const scene = sceneData.scene!;
        let queries = this.frustumCullings.get(scene);
        if (!queries) {
            const cullingQuery = this.cullingPools.frustumCullingsRecycle.add();
            cullingQuery.update();
            this.frustumCullings.set(scene, cullingQuery);
            queries = this.frustumCullings.get(scene)!;
        }
        const castShadow: boolean = bool(sceneData.flags & SceneFlags.SHADOW_CASTER);
        const key = computeCullingKey(sceneData, castShadow);
        const cullNum = queries.resultIndex.get(key);
        if (cullNum !== undefined) {
            return cullNum;
        }
        const frustumCulledResultID: FrustumCullingID = this.numFrustumCulling++;
        if (this.numFrustumCulling >  this.frustumCullingResults.length) {
            assert(this.numFrustumCulling === (this.frustumCullingResults.length + 1));
            this.frustumCullingResults.push([]);
        }
        queries.resultIndex.set(key, frustumCulledResultID);
        const cullingKey = this.cullingPools.frustumCullingKeyRecycle.add();
        cullingKey.update(
            sceneData,
            castShadow,
        );
        queries.resultKeyIndex.set(key, cullingKey);
        return frustumCulledResultID;
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
        assert(rq.empty());
        assert(rq.sceneFlags === SceneFlags.NONE);
        assert(rq.subpassOrPassLayoutID === 0xFFFFFFFF);
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
            const frustumCulledResultID = this.getOrCreateFrustumCulling(v);
            const lightBoundsCullingID = this.getOrCreateLightBoundsCulling(sceneData, frustumCulledResultID);
            const layoutID: number = getSubpassOrPassID(v, rg, lg);
            const targetID = this.createRenderQueue(sceneData.flags, layoutID);

            const lightType = sceneData.light.light ? sceneData.light.light.type : LightType.UNKNOWN;
            const renderQueueDesc = this.cullingPools.renderQueueDescRecycle.add();
            renderQueueDesc.update(frustumCulledResultID, lightBoundsCullingID, targetID, lightType);
            // add render queue to query source
            this.renderQueueIndex.set(v, renderQueueDesc);
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

    private getBuiltinShadowFrustum (pplSceneData: PipelineSceneData, camera: Camera, mainLight: DirectionalLight, level: number): Readonly<Frustum> {
        const csmLayers = pplSceneData.csmLayers;
        const csmLevel = mainLight.csmLevel;
        let frustum: Readonly<Frustum>;
        const shadows = pplSceneData.shadows;
        if (shadows.type === ShadowType.Planar) {
            return camera.frustum;
        }
        if (shadows.enabled && shadows.type === ShadowType.ShadowMap && mainLight && mainLight.node) {
            // pplSceneData.updateShadowUBORange(UBOShadow.SHADOW_COLOR_OFFSET, shadows.shadowColor);
            csmLayers.update(pplSceneData, camera);
        }

        if (mainLight.shadowFixedArea || csmLevel === CSMLevel.LEVEL_1) {
            return csmLayers.specialLayer.validFrustum;
        }
        return csmLayers.layers[level].validFrustum;
    }

    private batchFrustumCulling (pplSceneData: PipelineSceneData): void {
        for (const [scene, queries] of this.frustumCullings) {
            assert(!!scene);
            for (const [key, frustomCulledResultID] of queries.resultIndex) {
                const cullingKey = queries.resultKeyIndex.get(key)!;
                const sceneData = cullingKey.sceneData!;
                assert(!!sceneData.camera);
                assert(sceneData.camera.scene === scene);
                const light = sceneData.light.light;
                const level = sceneData.light.level;
                const castShadow = cullingKey.castShadows;
                const probe = sceneData.light.probe;
                const camera = probe ? probe.camera : sceneData.camera;
                assert(frustomCulledResultID < this.frustumCullingResults.length);
                const models = this.frustumCullingResults[frustomCulledResultID];
                if (probe) {
                    sceneCulling(scene, camera, camera.frustum, castShadow, probe, models);
                    continue;
                }
                if (light) {
                    switch (light.type) {
                    case LightType.SPOT:
                        sceneCulling(scene, camera, (light as SpotLight).frustum, castShadow, null, models);
                        break;
                    case LightType.DIRECTIONAL: {
                        const frustum = this.getBuiltinShadowFrustum(pplSceneData, camera, light as DirectionalLight, level);
                        sceneCulling(scene, camera, frustum, castShadow, null, models);
                    }
                        break;
                    default:
                    }
                } else {
                    sceneCulling(scene, camera, camera.frustum, castShadow, null, models);
                }
            }
        }
    }

    private executeSphereLightCulling (light: SphereLight, frustumCullingResult: Array<Model>, lightBoundsCullingResult: Array<Model>): void {
        const lightAABB = light.aabb;
        for (const model of frustumCullingResult) {
            assert(!!model);
            const modelBounds = model.worldBounds;
            if (!modelBounds || intersect.aabbWithAABB(modelBounds, lightAABB)) {
                lightBoundsCullingResult.push(model);
            }
        }
    }

    private executeSpotLightCulling (light: SpotLight, frustumCullingResult: Array<Model>, lightBoundsCullingResult: Array<Model>): void {
        const lightAABB = light.aabb;
        const lightFrustum: Frustum = light.frustum;
        for (const model of frustumCullingResult) {
            assert(!!model);
            const modelBounds = model.worldBounds;
            if (!modelBounds || (intersect.aabbWithAABB(lightAABB, modelBounds) && intersect.aabbFrustum(modelBounds, lightFrustum))) {
                lightBoundsCullingResult.push(model);
            }
        }
    }

    private executePointLightCulling (light: PointLight, frustumCullingResult: Array<Model>, lightBoundsCullingResult: Array<Model>): void {
        const lightAABB = light.aabb;
        for (const model of frustumCullingResult) {
            assert(!!model);
            const modelBounds = model.worldBounds;
            if (!modelBounds || intersect.aabbWithAABB(lightAABB, modelBounds)) {
                lightBoundsCullingResult.push(model);
            }
        }
    }

    private executeRangedDirectionalLightCulling (
        light: RangedDirectionalLight,
        frustumCullingResult: Array<Model>,
        lightBoundsCullingResult: Array<Model>,
    ): void {
        rangedDirLightBoundingBox.transform(light.node!.worldMatrix, null, null, null, lightAABB);
        for (const model of frustumCullingResult) {
            assert(!!model);
            const modelBounds = model.worldBounds;
            if (!modelBounds || intersect.aabbWithAABB(lightAABB, modelBounds)) {
                lightBoundsCullingResult.push(model);
            }
        }
    }

    private batchLightBoundsCulling (): void {
        for (const [scene, queries] of this.lightBoundsCullings) {
            assert(!!scene);
            for (const [key, cullingID] of queries.resultIndex) {
                const cullingKey = queries.resultKeyIndex.get(key)!;
                const sceneData = cullingKey.sceneData!;
                const frustumCullingID = cullingKey.frustumCullingID;
                const frustumCullingResult = this.frustumCullingResults[frustumCullingID];
                assert(!!sceneData.camera);
                assert(!!sceneData.shadingLight);
                assert(sceneData.camera.scene === scene);
                assert(cullingID < this.frustumCullingResults.length);
                const lightBoundsCullingResult = this.lightBoundsCullingResults[cullingID];
                assert(lightBoundsCullingResult.instances.length === 0);
                switch (sceneData.shadingLight.type) {
                case LightType.SPHERE:
                    {
                        const light = sceneData.shadingLight as SphereLight;
                        this.executeSphereLightCulling(light, frustumCullingResult, lightBoundsCullingResult.instances);
                    }
                    break;
                case LightType.SPOT:
                    {
                        const light = sceneData.shadingLight as SpotLight;
                        this.executeSpotLightCulling(light, frustumCullingResult, lightBoundsCullingResult.instances);
                    }
                    break;
                case LightType.POINT:
                    {
                        const light = sceneData.shadingLight as PointLight;
                        this.executePointLightCulling(light, frustumCullingResult, lightBoundsCullingResult.instances);
                    }
                    break;
                case LightType.RANGED_DIRECTIONAL:
                    {
                        const light = sceneData.shadingLight as RangedDirectionalLight;
                        this.executeRangedDirectionalLightCulling(light, frustumCullingResult, lightBoundsCullingResult.instances);
                    }
                    break;
                case LightType.DIRECTIONAL:
                case LightType.UNKNOWN:
                default:
                }
            }
        }
    }

    private fillRenderQueues (rg: RenderGraph, pplSceneData: PipelineSceneData): void {
        for (const [sceneId, desc] of this.renderQueueIndex) {
            assert(rg.holds(RenderGraphValue.Scene, sceneId));
            const frustomCulledResultID = desc.frustumCulledResultID;
            const lightBoundsCullingID = desc.lightBoundsCulledResultID;
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
            assert(frustomCulledResultID < this.frustumCullingResults.length);
            const sourceModels = ((): Array<Model> => {
                // is culled by light bounds
                if (lightBoundsCullingID !== 0xFFFFFFFF) {
                    if (lightBoundsCullingID < this.lightBoundsCullingResults.length) {
                        return this.lightBoundsCullingResults[lightBoundsCullingID].instances;
                    } else {
                        return [];
                    }
                }
                // not culled by light bounds
                if (frustomCulledResultID < this.frustumCullingResults.length) {
                    return this.frustumCullingResults[frustomCulledResultID];
                } else {
                    return [];
                }
            })();

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

export class LightResource {
    private cpuBuffer!: Float32Array;
    private programLibrary?: WebProgramLibrary;
    private device: Device | null = null;
    private elementSize: number = 0;
    private maxNumLights: number = 16;
    private binding: number = 0xFFFFFFFF;
    private resized: boolean = false;
    private lightBuffer?: Buffer;
    private firstLightBufferView: Buffer | null = null;
    private readonly lights: Array<Light> = [];
    private readonly lightIndex = new Map<Light, number>();

    init (programLib: WebProgramLibrary, deviceIn: Device, maxNumLights: number): void {
        assert(!this.device);

        this.device = deviceIn;
        this.programLibrary = programLib;

        const instanceLayout = this.programLibrary.localLayoutData;
        const attrID: number = programLib.layoutGraph.attributeIndex.get('CCForwardLight')!;
        const uniformBlock = instanceLayout.uniformBlocks.get(attrID);

        this.elementSize = AlignUp(
            getUniformBlockSize(uniformBlock!.members),
            this.device.capabilities.uboOffsetAlignment,
        );
        this.maxNumLights = maxNumLights;
        this.binding = programLib.localLayoutData.bindingMap.get(attrID)!;

        const bufferSize = this.elementSize * this.maxNumLights;

        this.lightBuffer = this.device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            bufferSize,
            this.elementSize,
        ));
        this.firstLightBufferView = this.device.createBuffer(new BufferViewInfo(
            this.lightBuffer,
            0,
            this.elementSize,
        ));

        this.cpuBuffer = new Float32Array(bufferSize / Float32Array.BYTES_PER_ELEMENT);

        assert(!!(this.elementSize && this.maxNumLights));
        this.resized = true;
    }

    buildLights (sceneCulling: SceneCulling, bHDR: boolean, shadowInfo: Shadows | null): void {
        // Build light buffer
        for (const [scene, lightBoundsCullings] of sceneCulling.lightBoundsCullings) {
            for (const [key, lightBoundsCullingID] of lightBoundsCullings.resultIndex) {
                const lightBoundsCulling = lightBoundsCullings.resultKeyIndex.get(key)!;
                const sceneData = lightBoundsCulling.sceneData!;
                let exposure: number = 1.0;
                if (sceneData.camera) {
                    exposure = sceneData.camera.exposure;
                } else if (sceneData.light.probe && sceneData.light.probe.camera) {
                    exposure = sceneData.light.probe.camera.exposure;
                } else {
                    throw new Error('Unexpected situation: No camera or probe found.');
                }
                const lightByteOffset: number = this.addLight(
                    sceneData.shadingLight!,
                    bHDR,
                    exposure,
                    shadowInfo,
                );

                // Save light byte offset for each light bounds culling
                const result: LightBoundsCullingResult = sceneCulling.lightBoundsCullingResults[lightBoundsCullingID];
                result.lightByteOffset = lightByteOffset;
            }
        }

        // Assign light byte offset to each queue
        for (const [sceneID, desc] of sceneCulling.renderQueueIndex) {
            if (desc.lightBoundsCulledResultID === 0xFFFFFFFF) {
                continue;
            }
            const lightByteOffset: number = sceneCulling.lightBoundsCullingResults[desc.lightBoundsCulledResultID].lightByteOffset;

            sceneCulling.renderQueues[desc.renderQueueTarget].lightByteOffset = lightByteOffset;
        }
    }

    tryUpdateRenderSceneLocalDescriptorSet (sceneCulling: SceneCulling): void {
        if (!sceneCulling.lightBoundsCullings.size) {
            return;
        }

        for (const [scene, culling] of sceneCulling.frustumCullings) {
            for (const model of scene.models) {
                if (!model) {
                    throw new Error('Unexpected null model.');
                }
                for (const submodel of model.subModels) {
                    const set = submodel.descriptorSet;
                    const prev = set.getBuffer(this.binding);
                    if (this.resized || prev !== this.firstLightBufferView) {
                        set.bindBuffer(this.binding, this.firstLightBufferView!);
                        set.update();
                    }
                }
            }
        }
        this.resized = false;
    }

    clear (): void {
        this.cpuBuffer.fill(0);
        this.lights.length = 0;
        this.lightIndex.clear();
    }

    addLight (light: Light, bHDR: boolean, exposure: number, shadowInfo: Shadows | null): number {
        // Already added
        const existingLightID = this.lightIndex.get(light);
        if (existingLightID !== undefined) {
            return existingLightID;
        }

        // Resize buffer if needed
        if (this.lights.length === this.maxNumLights) {
            this.resized = true;
            this.maxNumLights *= 2;
            const bufferSize = this.elementSize * this.maxNumLights;
            this.lightBuffer!.resize(bufferSize);
            this.firstLightBufferView = this.device!.createBuffer(new BufferViewInfo(
                this.lightBuffer,
                0,
                this.elementSize,
            ));
            const prevCpuBuffer = this.cpuBuffer;
            this.cpuBuffer = new Float32Array(bufferSize / Float32Array.BYTES_PER_ELEMENT);
            this.cpuBuffer.set(prevCpuBuffer);
        }

        assert(this.lights.length < this.maxNumLights);

        // Add light
        const lightID = this.lights.length;
        this.lights[lightID] = light;
        this.lightIndex.set(light, lightID);

        // Update buffer
        const offset = this.elementSize / Float32Array.BYTES_PER_ELEMENT * lightID;
        SetLightUBO(light, bHDR, exposure, shadowInfo, this.cpuBuffer, offset, this.elementSize);

        return lightID * this.elementSize;
    }

    buildLightBuffer (cmdBuffer: CommandBuffer): void {
        cmdBuffer.updateBuffer(
            this.lightBuffer!,
            this.cpuBuffer,
            (this.lights.length * this.elementSize) / Float32Array.BYTES_PER_ELEMENT,
        );
    }
}
