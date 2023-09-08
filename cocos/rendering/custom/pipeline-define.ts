import { EDITOR } from 'internal:constants';
import { cclegacy } from '../../core';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp, Viewport } from '../../gfx';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Camera, Light, LightType, ProbeType, ReflectionProbe, ShadowType } from '../../render-scene/scene';
import { supportsR32FloatTexture } from '../define';
import {
    GBufferInfo,
    getCameraUniqueID,
    getLoadOpOfClearFlag,
    getRenderArea,
    getRTFormatBeforeToneMapping,
    LightingInfo,
    PostInfo,
    ShadowInfo,
    updateCameraUBO,
    validPunctualLightsCulling,
} from './define';
import { BasicPipeline, Pipeline, BasicRenderPassBuilder } from './pipeline';
import {
    AccessType,
    AttachmentType,
    LightInfo,
    QueueHint,
    ResourceResidency,
    SceneFlags,
} from './types';
import { getProfilerCamera, SRGBToLinear } from '../pipeline-funcs';

export class CameraInfo {
    constructor (camera: Camera, id: number, windowID: number, width: number, height: number) {
        this.camera = camera;
        this.id = id;
        this.windowID = windowID;
        this.width = width;
        this.height = height;
    }
    public camera: Camera;
    public id = 0xFFFFFFFF;
    public windowID = 0xFFFFFFFF;
    public width = 0;
    public height = 0;
}
export const cameraInfos = new Map<Camera, CameraInfo>();
export const windowInfos = new Map<RenderWindow, number>();

function prepareRenderWindow (camera: Camera): number {
    let windowID = windowInfos.get(camera.window);
    if (windowID === undefined) {
        windowID = windowInfos.size;
        windowInfos.set(camera.window, windowID);
    }
    return windowID;
}

export function prepareResource (
    ppl: BasicPipeline,
    camera: Camera,
    initResourceFunc: (ppl: BasicPipeline, info: CameraInfo) => void,
    updateResourceFunc: (ppl: BasicPipeline, info: CameraInfo) => void,
): CameraInfo {
    let info = cameraInfos.get(camera);
    if (info !== undefined) {
        let width = camera.window.width;
        let height = camera.window.height;
        if (width === 0) {
            width = 1;
        }
        if (height === 0) {
            height = 1;
        }
        const windowID = prepareRenderWindow(camera);
        info.width = width;
        info.height = height;
        info.windowID = windowID;
        updateResourceFunc(ppl, info);
        return info;
    }
    const windowID = prepareRenderWindow(camera);
    info = new CameraInfo(
        camera,
        cameraInfos.size,
        windowID,
        camera.window.width ? camera.window.width : 1,
        camera.window.height ? camera.window.height : 1,
    );

    initResourceFunc(ppl, info);
    cameraInfos.set(camera, info);
    return info;
}

function buildShadowRes (ppl: BasicPipeline, name: string, width: number, height: number): void {
    const fboW = width;
    const fboH = height;
    const shadowMapName = name;
    const device = ppl.device;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, fboW, fboH, ResourceResidency.MANAGED);
        ppl.addDepthStencil(`${shadowMapName}Depth`, Format.DEPTH_STENCIL, fboW, fboH, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(shadowMapName, fboW, fboH);
    ppl.updateDepthStencil(`${shadowMapName}Depth`, fboW, fboH);
}
const shadowInfo = new ShadowInfo();
export function setupShadowRes (ppl: BasicPipeline, cameraInfo: CameraInfo): ShadowInfo {
    const camera = cameraInfo.camera;
    validPunctualLightsCulling(ppl, camera);
    const pipeline = ppl;
    const shadow = pipeline.pipelineSceneData.shadows;
    const validPunctualLights = ppl.pipelineSceneData.validPunctualLights;
    const shadows = ppl.pipelineSceneData.shadows;
    shadowInfo.reset();
    if (!shadow.enabled || shadow.type !== ShadowType.ShadowMap) { return shadowInfo; }
    shadowInfo.shadowEnabled = true;
    const _validLights: Light[] = shadowInfo.validLights;
    let n = 0;
    let m = 0;
    for (; n < shadow.maxReceived && m < validPunctualLights.length;) {
        const light = validPunctualLights[m];
        if (light.type === LightType.SPOT) {
            const spotLight = light as any;
            if (spotLight.shadowEnabled) {
                _validLights.push(light);
                n++;
            }
        }
        m++;
    }

    const { mainLight } = camera.scene!;
    // build shadow map
    const mapWidth = shadows.size.x;
    const mapHeight = shadows.size.y;
    if (mainLight && mainLight.shadowEnabled) {
        shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraInfo.id}`;
        if (mainLight.shadowFixedArea) {
            buildShadowRes(ppl, shadowInfo.mainLightShadowNames[0], mapWidth, mapHeight);
        } else {
            const csmLevel = pipeline.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
            shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraInfo.id}`;
            for (let i = 0; i < csmLevel; i++) {
                buildShadowRes(ppl, shadowInfo.mainLightShadowNames[0], mapWidth, mapHeight);
            }
        }
    }

    for (let l = 0; l < _validLights.length; l++) {
        const light = _validLights[l];
        const passName = `SpotLightShadow${l.toString()}${cameraInfo.id}`;
        shadowInfo.spotLightShadowNames[l] = passName;
        buildShadowRes(ppl, shadowInfo.spotLightShadowNames[l], mapWidth, mapHeight);
    }
    return shadowInfo;
}

export const updateShadowRes = setupShadowRes;
let shadowPass;
function buildShadowPass (
    passName: Readonly<string>,
    ppl: BasicPipeline,
    camera: Camera,
    light: Light,
    level: number,
    width: Readonly<number>,
    height: Readonly<number>,
): void {
    const fboW = width;
    const fboH = height;
    const area = getRenderArea(camera, width, height, light, level);
    width = area.width;
    height = area.height;
    const shadowMapName = passName;
    if (!level) {
        shadowPass = ppl.addRenderPass(width, height, 'default');
        shadowPass.name = passName;
        shadowPass.setViewport(new Viewport(0, 0, fboW, fboH));
        shadowPass.addRenderTarget(shadowMapName, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, camera.clearColor.w));
        shadowPass.addDepthStencil(
            `${shadowMapName}Depth`,
            LoadOp.CLEAR,
            StoreOp.DISCARD,
            camera.clearDepth,
            camera.clearStencil,
            ClearFlagBit.DEPTH_STENCIL,
        );
    }
    const queue = shadowPass.addQueue(QueueHint.RENDER_OPAQUE, 'shadow-caster');
    queue.addSceneOfCamera(
        camera,
        new LightInfo(light, level),
        SceneFlags.SHADOW_CASTER,
    );
    queue.setViewport(new Viewport(area.x, area.y, area.width, area.height));
}
export function setupShadowPass (ppl: BasicPipeline, cameraInfo: CameraInfo): void {
    if (!shadowInfo.shadowEnabled) return;
    const camera = cameraInfo.camera;
    const shadows = ppl.pipelineSceneData.shadows;
    // build shadow map
    const mapWidth = shadows.size.x;
    const mapHeight = shadows.size.y;
    const { mainLight } = camera.scene!;
    if (mainLight && mainLight.shadowEnabled) {
        shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraInfo.id}`;
        if (mainLight.shadowFixedArea) {
            buildShadowPass(
                shadowInfo.mainLightShadowNames[0],
                ppl,
                camera,
                mainLight,
                0,
                mapWidth,
                mapHeight,
            );
        } else {
            const csmLevel = ppl.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
            shadowInfo.mainLightShadowNames[0] = `MainLightShadow${cameraInfo.id}`;
            for (let i = 0; i < csmLevel; i++) {
                buildShadowPass(
                    shadowInfo.mainLightShadowNames[0],
                    ppl,
                    camera,
                    mainLight,
                    i,
                    mapWidth,
                    mapHeight,
                );
            }
        }
    }

    for (let l = 0; l < shadowInfo.validLights.length; l++) {
        const light = shadowInfo.validLights[l];
        const passName = `SpotLightShadow${l.toString()}${cameraInfo.id}`;
        shadowInfo.spotLightShadowNames[l] = passName;
        buildShadowPass(
            passName,
            ppl,
            camera,
            light,
            0,
            mapWidth,
            mapHeight,
        );
    }
}

export function setupForwardRes (ppl: BasicPipeline, cameraInfo: CameraInfo, isOffScreen = false): void {
    const camera = cameraInfo.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    setupShadowRes(ppl, cameraInfo);
    if (!isOffScreen) {
        ppl.addRenderWindow(`ForwardColor${cameraInfo.id}`, Format.BGRA8, width, height, cameraInfo.camera.window);
    } else {
        ppl.addRenderTarget(
            `ForwardColor${cameraInfo.id}`,
            getRTFormatBeforeToneMapping(ppl),
            width,
            height,
            ResourceResidency.PERSISTENT,
        );
    }
    ppl.addDepthStencil(`ForwardDepthStencil${cameraInfo.id}`, Format.DEPTH_STENCIL, width, height);
}

export function updateForwardRes (ppl: BasicPipeline, cameraInfo: CameraInfo, isOffScreen = false): void {
    const camera = cameraInfo.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    updateShadowRes(ppl, cameraInfo);
    if (!isOffScreen) {
        ppl.updateRenderWindow(`ForwardColor${cameraInfo.id}`, cameraInfo.camera.window);
    } else {
        ppl.updateRenderTarget(`ForwardColor${cameraInfo.id}`, width, height);
    }
    ppl.updateDepthStencil(`ForwardDepthStencil${cameraInfo.id}`, width, height);
}

export function setupDeferredForward (ppl: BasicPipeline, cameraInfo: CameraInfo, inputColor: string, clusterLighting?: boolean): void {
    const area = getRenderArea(cameraInfo.camera, cameraInfo.camera.window.width, cameraInfo.camera.window.height);
    const width = area.width;
    const height = area.height;
    const forwardPass = ppl.addRenderPass(width, height, 'default');
    const camera = cameraInfo.camera;
    forwardPass.addRenderTarget(inputColor, LoadOp.LOAD, StoreOp.STORE);
    forwardPass.addDepthStencil(gBufferInfo.ds, LoadOp.LOAD, StoreOp.DISCARD);

    for (const dirShadowName of shadowInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            forwardPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of shadowInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            forwardPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }

    let sceneFlags = SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
        | SceneFlags.DRAW_INSTANCING;
    sceneFlags |= clusterLighting ? SceneFlags.CLUSTERED_LIGHTING : SceneFlags.DEFAULT_LIGHTING;

    forwardPass.addQueue(QueueHint.RENDER_OPAQUE, 'deferred-forward')
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    forwardPass.addQueue(QueueHint.RENDER_TRANSPARENT, 'deferred-forward')
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY);
}

export function setupForwardPass (ppl: BasicPipeline, cameraInfo: CameraInfo, isOffScreen = false, enabledAlpha = true): { rtName: string; dsName: string; } {
    if (EDITOR) {
        ppl.setMacroInt('CC_PIPELINE_TYPE', 0);
    }
    setupShadowPass(ppl, cameraInfo);
    const cameraID = cameraInfo.id;
    const area = getRenderArea(cameraInfo.camera, cameraInfo.camera.window.width, cameraInfo.camera.window.height);
    const width = area.width;
    const height = area.height;
    const forwardPass = ppl.addRenderPass(width, height, 'default');
    forwardPass.name = `ForwardPass${cameraID}`;
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of shadowInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            forwardPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of shadowInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            forwardPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    const camera = cameraInfo.camera;
    forwardPass.addRenderTarget(
        `ForwardColor${cameraInfo.id}`,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w),
    );
    forwardPass.addDepthStencil(
        `ForwardDepthStencil${cameraInfo.id}`,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        // If the depth texture is used by subsequent passes, it must be set to store.
        isOffScreen ? StoreOp.DISCARD : StoreOp.STORE,
        camera.clearDepth,
        camera.clearStencil,
        camera.clearFlag,
    );
    forwardPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(
            camera,
            new LightInfo(),
            SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
            | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING,
        );

    let sceneFlags = SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY;
    if (!isOffScreen) {
        sceneFlags |= SceneFlags.UI;
        forwardPass.showStatistics = true;
    }
    if (enabledAlpha) {
        forwardPass
            .addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    }
    return { rtName: `ForwardColor${cameraInfo.id}`, dsName: `ForwardDepthStencil${cameraInfo.id}` };
}

export function buildReflectionProbeRes (ppl: BasicPipeline, probe: ReflectionProbe, renderWindow: RenderWindow, faceIdx: number): void {
    const area = probe.renderArea();
    const width = area.x;
    const height = area.y;

    const probePassRTName = `reflectionProbePassColor${faceIdx}`;
    const probePassDSName = `reflectionProbePassDS${faceIdx}`;

    if (!ppl.containsResource(probePassRTName)) {
        ppl.addRenderWindow(probePassRTName, Format.RGBA8, width, height, renderWindow);
        ppl.addDepthStencil(probePassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(probePassRTName, renderWindow);
    ppl.updateDepthStencil(probePassDSName, width, height);
}

export function setupReflectionProbeRes (ppl: BasicPipeline, info: CameraInfo): void {
    if (!cclegacy.internal.reflectionProbeManager) return;
    const probes = cclegacy.internal.reflectionProbeManager.getProbes();
    if (probes.length === 0) return;
    for (let i = 0; i < probes.length; i++) {
        const probe = probes[i] as ReflectionProbe;
        if (probe.needRender) {
            if (probes[i].probeType === ProbeType.PLANAR) {
                const window: RenderWindow = probe.realtimePlanarTexture!.window!;
                buildReflectionProbeRes(ppl, probe, window, 0);
            } else if (EDITOR) {
                for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                    probe.updateCameraDir(faceIdx);
                    buildReflectionProbeRes(ppl, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
                }
                probe.needRender = false;
            }
        }
    }
}

export const updateReflectionProbeRes = setupReflectionProbeRes;

function buildReflectProbePass (ppl: BasicPipeline, info: CameraInfo, probe: ReflectionProbe, renderWindow: RenderWindow, faceIdx: number): void {
    const area = probe.renderArea();
    const width = area.x;
    const height = area.y;
    const probeCamera = probe.camera;

    const probePassRTName = `reflectionProbePassColor${faceIdx}`;
    const probePassDSName = `reflectionProbePassDS${faceIdx}`;

    const probePass = ppl.addRenderPass(width, height, 'default');
    probePass.name = `ReflectionProbePass${faceIdx}`;
    probePass.setViewport(new Viewport(0, 0, width, height));
    probePass.addRenderTarget(
        probePassRTName,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(probeCamera.clearColor.x, probeCamera.clearColor.y, probeCamera.clearColor.z, probeCamera.clearColor.w),
    );
    probePass.addDepthStencil(
        probePassDSName,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        probeCamera.clearDepth,
        probeCamera.clearStencil,
        probeCamera.clearFlag,
    );
    const passBuilder = probePass.addQueue(QueueHint.RENDER_OPAQUE);
    passBuilder.addSceneOfCamera(info.camera, new LightInfo(), SceneFlags.REFLECTION_PROBE);
    updateCameraUBO(passBuilder as unknown as any, probeCamera, ppl);
}

export function setupReflectionProbePass (ppl: BasicPipeline, info: CameraInfo): void {
    if (!cclegacy.internal.reflectionProbeManager) return;
    const probes = cclegacy.internal.reflectionProbeManager.getProbes();
    if (probes.length === 0) return;
    for (let i = 0; i < probes.length; i++) {
        const probe = probes[i] as ReflectionProbe;
        if (probe.needRender) {
            if (probes[i].probeType === ProbeType.PLANAR) {
                const window = probe.realtimePlanarTexture!.window!;
                buildReflectProbePass(ppl, info, probe, window, 0);
            } else if (EDITOR) {
                for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                    probe.updateCameraDir(faceIdx);
                    buildReflectProbePass(ppl, info, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
                }
                probe.needRender = false;
            }
        }
    }
}
const gBufferInfo = new GBufferInfo();
export function setupGBufferRes (ppl: BasicPipeline, info: CameraInfo): void {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = `gBufferPassColorCamera${info.id}`;
    const gBufferPassNormal = `gBufferPassNormal${info.id}`;
    const gBufferPassEmissive = `gBufferPassEmissive${info.id}`;
    const gBufferPassDSName = `gBufferPassDSCamera${info.id}`;
    const colFormat = Format.RGBA16F;
    ppl.addRenderTarget(gBufferPassRTName, colFormat, width, height, ResourceResidency.MANAGED);
    ppl.addRenderTarget(gBufferPassEmissive, colFormat, width, height, ResourceResidency.MANAGED);
    ppl.addRenderTarget(gBufferPassNormal, colFormat, width, height, ResourceResidency.MANAGED);
    ppl.addDepthStencil(gBufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    gBufferInfo.color = gBufferPassRTName;
    gBufferInfo.normal = gBufferPassNormal;
    gBufferInfo.emissive = gBufferPassEmissive;
    gBufferInfo.ds = gBufferPassDSName;
}

export function updateGBufferRes (ppl: BasicPipeline, info: CameraInfo): void {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = `gBufferPassColorCamera${info.id}`;
    const gBufferPassNormal = `gBufferPassNormal${info.id}`;
    const gBufferPassEmissive = `gBufferPassEmissive${info.id}`;
    const gBufferPassDSName = `gBufferPassDSCamera${info.id}`;
    ppl.updateRenderTarget(gBufferPassRTName, width, height);
    ppl.updateRenderTarget(gBufferPassEmissive, width, height);
    ppl.updateRenderTarget(gBufferPassNormal, width, height);
    ppl.updateDepthStencil(gBufferPassDSName, width, height);
}

const emptyColor = new Color(0, 0, 0, 0);
export function setupScenePassTiled (pipeline: BasicPipeline, info: CameraInfo, useCluster: boolean): { rtName: string } {
    if (!lightingInfo) {
        lightingInfo = new LightingInfo(useCluster);
    }

    const ppl = (pipeline as Pipeline);
    const camera = info.camera;
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = gBufferInfo.color;
    const gBufferPassNormal = gBufferInfo.normal;
    const gBufferPassEmissive = gBufferInfo.emissive;
    const gBufferPassDSName = gBufferInfo.ds;
    const scenePass = ppl.addRenderPass(width, height, 'deferred-scene-tiled');

    // gbuffer subpass
    const gBufferPass = scenePass.addRenderSubpass('gbuffer-tiled');
    gBufferPass.name = `CameraGBufferPass${info.id}`;
    gBufferPass.setViewport(new Viewport(area.x, area.y, width, height));
    const rtColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        if (ppl.pipelineSceneData.isHDR) {
            SRGBToLinear(rtColor, camera.clearColor);
        } else {
            rtColor.x = camera.clearColor.x;
            rtColor.y = camera.clearColor.y;
            rtColor.z = camera.clearColor.z;
        }
    }
    gBufferPass.addRenderTarget(gBufferPassRTName, AccessType.WRITE, '_', LoadOp.CLEAR, StoreOp.DISCARD, emptyColor);
    gBufferPass.addRenderTarget(gBufferPassNormal, AccessType.WRITE, '_', LoadOp.CLEAR, StoreOp.DISCARD, emptyColor);
    gBufferPass.addRenderTarget(gBufferPassEmissive, AccessType.WRITE, '_', LoadOp.CLEAR, StoreOp.DISCARD, emptyColor);
    gBufferPass.addDepthStencil(
        gBufferPassDSName,
        AccessType.WRITE,
        '_',
        '_',
        LoadOp.CLEAR,
        StoreOp.DISCARD,
        camera.clearDepth,
        camera.clearStencil,
        camera.clearFlag,
    );
    gBufferPass
        .addQueue(QueueHint.RENDER_OPAQUE, 'gbuffer-tiled')
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);

    // lighting subpass
    const lightingPass = scenePass.addRenderSubpass('deferred-lighting-tiled');
    lightingPass.name = `CameraLightingPass${info.id}`;
    lightingPass.setViewport(new Viewport(area.x, area.y, width, height));

    lightingPass.addRenderTarget(gBufferPassRTName, AccessType.READ, 'albedoMap', LoadOp.DISCARD, StoreOp.DISCARD);
    lightingPass.addRenderTarget(gBufferPassNormal, AccessType.READ, 'normalMap', LoadOp.DISCARD, StoreOp.DISCARD);
    lightingPass.addRenderTarget(gBufferPassEmissive, AccessType.READ, 'emissiveMap', LoadOp.DISCARD, StoreOp.DISCARD);
    lightingPass.addDepthStencil(gBufferPassDSName, AccessType.READ, 'depthStencil', '_', LoadOp.DISCARD, StoreOp.DISCARD);

    // cluster data
    const clusterLightBufferName = `clusterLightBuffer${cameraID}`;
    const clusterLightIndicesBufferName = `clusterLightIndicesBuffer${cameraID}`;
    const clusterLightGridBufferName = `clusterLightGridBuffer${cameraID}`;
    if (ppl.containsResource(clusterLightBufferName)) {
        lightingPass.addStorageBuffer(clusterLightBufferName, AccessType.READ, 'b_ccLightsBuffer');
        lightingPass.addStorageBuffer(clusterLightIndicesBufferName, AccessType.READ, 'b_clusterLightIndicesBuffer');
        lightingPass.addStorageBuffer(clusterLightGridBufferName, AccessType.READ, 'b_clusterLightGridBuffer');
    }

    const deferredLightingPassRTName = `deferredLightingPassRTName${info.id}`;
    lightingPass.addRenderTarget(deferredLightingPassRTName, AccessType.WRITE, '_', LoadOp.CLEAR, StoreOp.STORE, rtColor);
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT, 'deferred-lighting-tiled').addCameraQuad(
        camera,
        lightingInfo.deferredLightingMaterial,
        1,
        SceneFlags.VOLUMETRIC_LIGHTING,
    );
    return { rtName: deferredLightingPassRTName };
}

export function setupGBufferPass (ppl: BasicPipeline, info: CameraInfo): BasicRenderPassBuilder {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = gBufferInfo.color;
    const gBufferPassNormal = gBufferInfo.normal;
    const gBufferPassEmissive = gBufferInfo.emissive;
    const gBufferPassDSName = gBufferInfo.ds;
    // gbuffer pass
    const gBufferPass = ppl.addRenderPass(width, height, 'gbuffer');
    gBufferPass.name = `CameraGBufferPass${info.id}`;
    gBufferPass.setViewport(new Viewport(area.x, area.y, width, height));
    const rtColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        if (ppl.pipelineSceneData.isHDR) {
            SRGBToLinear(rtColor, camera.clearColor);
        } else {
            rtColor.x = camera.clearColor.x;
            rtColor.y = camera.clearColor.y;
            rtColor.z = camera.clearColor.z;
        }
    }
    gBufferPass.addRenderTarget(gBufferPassRTName, LoadOp.CLEAR, StoreOp.STORE, rtColor);
    gBufferPass.addRenderTarget(gBufferPassEmissive, LoadOp.CLEAR, StoreOp.STORE, new Color(0, 0, 0, 0));
    gBufferPass.addRenderTarget(gBufferPassNormal, LoadOp.CLEAR, StoreOp.STORE, new Color(0, 0, 0, 0));
    gBufferPass.addDepthStencil(gBufferPassDSName, LoadOp.CLEAR, StoreOp.STORE, camera.clearDepth, camera.clearStencil, camera.clearFlag);
    gBufferPass
        .addQueue(QueueHint.RENDER_OPAQUE, 'gbuffer')
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
    return gBufferPass;
}

export function setupLightingRes (ppl: BasicPipeline, info: CameraInfo): void {
    setupShadowRes(ppl, info);
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const deferredLightingPassRTName = `deferredLightingPassRTName${info.id}`;
    ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
}

export function updateLightingRes (ppl: BasicPipeline, info: CameraInfo): void {
    updateShadowRes(ppl, info);
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const deferredLightingPassRTName = `deferredLightingPassRTName${info.id}`;
    ppl.updateRenderTarget(deferredLightingPassRTName, width, height);
}
let lightingInfo: LightingInfo;
export function setupLightingPass (pipeline: BasicPipeline, info: CameraInfo, useCluster: boolean): { rtName: string } {
    setupShadowPass(pipeline, info);
    if (!lightingInfo) {
        lightingInfo = new LightingInfo(useCluster);
    }
    const ppl = pipeline as Pipeline;
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const cameraID = getCameraUniqueID(camera);

    const deferredLightingPassRTName = `deferredLightingPassRTName${info.id}`;
    // lighting pass
    const lightingPass = ppl.addRenderPass(width, height, 'deferred-lighting');
    lightingPass.name = `CameraLightingPass${info.id}`;
    lightingPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of shadowInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            lightingPass.addTexture(dirShadowName, 'cc_shadowMap');
        }
    }
    for (const spotShadowName of shadowInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            lightingPass.addTexture(spotShadowName, 'cc_spotShadowMap');
        }
    }
    if (ppl.containsResource(gBufferInfo.color)) {
        lightingPass.addTexture(gBufferInfo.color, 'albedoMap');
        lightingPass.addTexture(gBufferInfo.normal, 'normalMap');
        lightingPass.addTexture(gBufferInfo.emissive, 'emissiveMap');
        lightingPass.addTexture(gBufferInfo.ds, 'depthStencil');
    }

    // cluster data
    const clusterLightBufferName = `clusterLightBuffer${cameraID}`;
    const clusterLightIndicesBufferName = `clusterLightIndicesBuffer${cameraID}`;
    const clusterLightGridBufferName = `clusterLightGridBuffer${cameraID}`;
    if (ppl.containsResource(clusterLightBufferName)) {
        lightingPass.addStorageBuffer(clusterLightBufferName, AccessType.READ, 'b_ccLightsBuffer');
        lightingPass.addStorageBuffer(clusterLightIndicesBufferName, AccessType.READ, 'b_clusterLightIndicesBuffer');
        lightingPass.addStorageBuffer(clusterLightGridBufferName, AccessType.READ, 'b_clusterLightGridBuffer');
    }

    const lightingClearColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        lightingClearColor.x = camera.clearColor.x;
        lightingClearColor.y = camera.clearColor.y;
        lightingClearColor.z = camera.clearColor.z;
    }
    lightingClearColor.w = 0;
    lightingPass.addRenderTarget(deferredLightingPassRTName, LoadOp.CLEAR, StoreOp.STORE, lightingClearColor);
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera,
        lightingInfo.deferredLightingMaterial,
        0,
        SceneFlags.VOLUMETRIC_LIGHTING,
    );
    // lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
    //     SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
    return { rtName: deferredLightingPassRTName };
}

export function setupPostprocessRes (ppl: BasicPipeline, info: CameraInfo): void {
    const cameraID = info.id;
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    ppl.addRenderWindow(postprocessPassRTName, Format.BGRA8, width, height, camera.window);
    ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
}

export function updatePostprocessRes (ppl: BasicPipeline, info: CameraInfo): void {
    const cameraID = info.id;
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    ppl.updateRenderWindow(postprocessPassRTName, camera.window);
    ppl.updateDepthStencil(postprocessPassDS, width, height);
}
let postInfo: PostInfo;
export function setupPostprocessPass (
    ppl: BasicPipeline,
    info: CameraInfo,
    inputTex: string,
): { rtName: string; dsName: string; } {
    if (!postInfo) {
        postInfo = new PostInfo();
    }
    const cameraID = info.id;
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    const postprocessPass = ppl.addRenderPass(width, height, 'post-process');
    postprocessPass.name = `CameraPostprocessPass${cameraID}`;
    postprocessPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputTex)) {
        postprocessPass.addTexture(inputTex, 'outputResultMap');
    }
    const postClearColor = new Color(0, 0, 0, camera.clearColor.w);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        postClearColor.x = camera.clearColor.x;
        postClearColor.y = camera.clearColor.y;
        postClearColor.z = camera.clearColor.z;
    }
    postprocessPass.addRenderTarget(
        postprocessPassRTName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),

        StoreOp.STORE,

        postClearColor,
    );
    postprocessPass.addDepthStencil(
        postprocessPassDS,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,

        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    postprocessPass.addQueue(QueueHint.NONE).addCameraQuad(
        camera,
        postInfo.postMaterial,
        0,
        SceneFlags.NONE,
    );
    if (getProfilerCamera() === camera) {
        postprocessPass.showStatistics = true;
    }
    return { rtName: postprocessPassRTName, dsName: postprocessPassDS };
}

export function setupUIRes (
    ppl: BasicPipeline,
    info: CameraInfo,
): void {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const dsUIAndProfilerPassRTName = `dsUIAndProfilerPassColor${info.id}`;
    const dsUIAndProfilerPassDSName = `dsUIAndProfilerPassDS${info.id}`;
    ppl.addRenderWindow(dsUIAndProfilerPassRTName, Format.BGRA8, width, height, camera.window);
    ppl.addDepthStencil(dsUIAndProfilerPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
}

export function updateUIRes (
    ppl: BasicPipeline,
    info: CameraInfo,
): void {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const dsUIAndProfilerPassRTName = `dsUIAndProfilerPassColor${info.id}`;
    const dsUIAndProfilerPassDSName = `dsUIAndProfilerPassDS${info.id}`;
    ppl.updateRenderWindow(dsUIAndProfilerPassRTName, camera.window);
    ppl.updateDepthStencil(dsUIAndProfilerPassDSName, width, height);
}

export function setupUIPass (
    ppl: BasicPipeline,
    info: CameraInfo,
): void {
    const camera = info.camera;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const dsUIAndProfilerPassRTName = `dsUIAndProfilerPassColor${info.id}`;
    const dsUIAndProfilerPassDSName = `dsUIAndProfilerPassDS${info.id}`;
    const uiAndProfilerPass = ppl.addRenderPass(width, height, 'default');
    uiAndProfilerPass.name = `CameraUIAndProfilerPass${info.id}`;
    uiAndProfilerPass.setViewport(new Viewport(area.x, area.y, width, height));
    uiAndProfilerPass.addRenderTarget(
        dsUIAndProfilerPassRTName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w),
    );
    uiAndProfilerPass.addDepthStencil(
        dsUIAndProfilerPassDSName,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearDepth,

        camera.clearStencil,

        camera.clearFlag,
    );
    const sceneFlags = SceneFlags.UI;
    uiAndProfilerPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    if (getProfilerCamera() === camera) {
        uiAndProfilerPass.showStatistics = true;
    }
}
