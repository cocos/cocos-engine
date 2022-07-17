import { Material } from '../../assets';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp } from '../../gfx';
import { assert, macro } from '../../platform';
import { Camera, Light, LightType, ShadowType, SKYBOX_FLAG } from '../../renderer/scene';
import { supportsR32FloatTexture } from '../define';
import { SRGBToLinear } from '../pipeline-funcs';
import { PipelineSceneData } from '../pipeline-scene-data';
import { AccessType, AttachmentType, ComputeView, RasterView } from './render-graph';
import { QueueHint, ResourceResidency, SceneFlags } from './types';
import { Pipeline } from './pipeline';

function pickSpotLights (pplScene: Readonly<PipelineSceneData>): Array<Light> {
    const validPunctualLights = pplScene.validPunctualLights;
    const shadows = pplScene.shadows;
    const validLights = new Array<Light>();

    // pick spot lights
    let numSpotLights = 0;
    for (let i = 0; numSpotLights < shadows.maxReceived && i < validPunctualLights.length; ++i) {
        const light = validPunctualLights[i];
        if (light.type === LightType.SPOT) {
            validLights.push(light);
            ++numSpotLights;
        }
    }
    return validLights;
}

function buildShadowPass (passName: Readonly<string>,
    ppl: Pipeline,
    camera: Camera, light: Light,
    width: Readonly<number>, height: Readonly<number>) {
    const device = ppl.device;
    const shadowMapName = passName;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, width, height, ResourceResidency.MANAGED);
    }
    const pass = ppl.addRasterPass(width, height, 'default', passName);
    pass.addRasterView(shadowMapName, new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        ClearFlagBit.COLOR,
        new Color(0, 0, 0, 0)));
    const queue = pass.addQueue(QueueHint.RENDER_OPAQUE);
    queue.addSceneOfCamera(camera, light,
        SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT | SceneFlags.SHADOW_CASTER);
}

class CameraInfo {
    shadowEnabled = false;
    mainLightShadowName = '';
    spotLightShadowNames = new Array<string>();
}

function buildShadowPasses (cameraName: string, camera: Camera, ppl: Pipeline): CameraInfo {
    const pplScene = ppl.pipelineSceneData;
    const shadows = ppl.pipelineSceneData.shadows;
    const cameraInfo = new CameraInfo();
    if (!shadows.enabled || shadows.type !== ShadowType.ShadowMap) {
        return cameraInfo;
    }
    cameraInfo.shadowEnabled = true;

    // build shadow map
    const mapWidth = shadows.size.x;
    const mapHeight = shadows.size.y;
    const mainLight = camera.scene!.mainLight;
    // main light
    if (mainLight) {
        cameraInfo.mainLightShadowName = `MainLightShadow${cameraName}`;
        buildShadowPass(cameraInfo.mainLightShadowName, ppl,
            camera, mainLight, mapWidth, mapHeight);
    }
    // spot lights
    const validLights = pickSpotLights(pplScene);
    for (let i = 0; i !== validLights.length; ++i) {
        const passName = `SpotLightShadow${i.toString()}${cameraName}`;
        cameraInfo.spotLightShadowNames[i] = passName;
        buildShadowPass(passName, ppl,
            camera, validLights[i], mapWidth, mapHeight);
    }
    return cameraInfo;
}

const _cameras: Camera[] = [];

function getCameraUniqueID (camera: Camera) {
    if (!_cameras.includes(camera)) {
        _cameras.push(camera);
    }
    return _cameras.indexOf(camera);
}

function getLoadOpOfClearFlag (clearFlag: ClearFlagBit, attachment: AttachmentType): LoadOp {
    let loadOp = LoadOp.CLEAR;
    if (!(clearFlag & ClearFlagBit.COLOR)
        && attachment === AttachmentType.RENDER_TARGET) {
        if (clearFlag & SKYBOX_FLAG) {
            loadOp = LoadOp.DISCARD;
        } else {
            loadOp = LoadOp.LOAD;
        }
    }
    if ((clearFlag & ClearFlagBit.DEPTH_STENCIL) !== ClearFlagBit.DEPTH_STENCIL
        && attachment === AttachmentType.DEPTH_STENCIL) {
        if (!(clearFlag & ClearFlagBit.DEPTH)) loadOp = LoadOp.LOAD;
        if (!(clearFlag & ClearFlagBit.STENCIL)) loadOp = LoadOp.LOAD;
    }
    return loadOp;
}

export function setupBuiltinForward (cameras: Camera[], ppl: Pipeline) {
    for (let i = 0; i < cameras.length; i++) {
        const camera = cameras[i];
        if (camera.scene === null) {
            continue;
        }
        const cameraID = getCameraUniqueID(camera);
        const cameraName = `Camera${cameraID}`;
        const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
        const width = camera.window.width;
        const height = camera.window.height;

        const forwardPassRTName = `dsForwardPassColor${cameraName}`;
        const forwardPassDSName = `dsForwardPassDS${cameraName}`;
        if (!ppl.containsResource(forwardPassRTName)) {
            ppl.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
            ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        const forwardPass = ppl.addRasterPass(width, height, 'default', `CameraForwardPass${cameraID}`);
        if (cameraInfo.mainLightShadowName) {
            assert(ppl.containsResource(cameraInfo.mainLightShadowName));
            const computeView = new ComputeView();
            forwardPass.addComputeView(cameraInfo.mainLightShadowName, computeView);
        }
        for (const spotShadowName of cameraInfo.spotLightShadowNames) {
            if (ppl.containsResource(spotShadowName)) {
                const computeView = new ComputeView();
                forwardPass.addComputeView(spotShadowName, computeView);
            }
        }
        const passView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
            StoreOp.STORE,
            camera.clearFlag,
            new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
        const passDSView = new RasterView('_',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
            StoreOp.STORE,
            camera.clearFlag,
            new Color(camera.clearDepth, camera.clearStencil, 0, 0));
        forwardPass.addRasterView(forwardPassRTName, passView);
        forwardPass.addRasterView(forwardPassDSName, passDSView);
        forwardPass
            .addQueue(QueueHint.RENDER_OPAQUE)
            .addSceneOfCamera(camera, null, SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
        forwardPass
            .addQueue(QueueHint.RENDER_TRANSPARENT)
            .addSceneOfCamera(camera, null, SceneFlags.TRANSPARENT_OBJECT | SceneFlags.UI);
    }
}

// Anti-aliasing type, other types will be gradually added in the future
export enum AntiAliasing {
    NONE,
    FXAA,
}

class DeferredData {
    constructor () {
        this._deferredLightingMaterial = new Material();
        this._deferredLightingMaterial.name = 'builtin-deferred-material';
        this._deferredLightingMaterial.initialize({ effectName: 'pipeline/deferred-lighting' });
        for (let i = 0; i < this._deferredLightingMaterial.passes.length; ++i) {
            this._deferredLightingMaterial.passes[i].tryCompile();
        }

        this._deferredPostMaterial = new Material();
        this._deferredPostMaterial.name = 'builtin-post-process-material';
        if (macro.ENABLE_ANTIALIAS_FXAA) {
            this._antiAliasing = AntiAliasing.FXAA;
        }
        this._deferredPostMaterial.initialize({
            effectName: 'pipeline/post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this._antiAliasing,
            },
        });
        for (let i = 0; i < this._deferredPostMaterial.passes.length; ++i) {
            this._deferredPostMaterial.passes[i].tryCompile();
        }
    }
    readonly _deferredLightingMaterial: Material;
    readonly _deferredPostMaterial: Material;
    _antiAliasing: AntiAliasing = AntiAliasing.NONE;
}

let _deferredData: DeferredData | null = null;

export function setupBuiltinDeferred (cameras: Camera[], ppl: Pipeline) {
    if (!_deferredData) {
        _deferredData = new DeferredData();
    }
    for (let i = 0; i < cameras.length; ++i) {
        const camera = cameras[i];
        if (!camera.scene) {
            continue;
        }
        const cameraID = getCameraUniqueID(camera);
        const cameraName = `Camera${cameraID}`;
        const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
        const width = camera.window.width;
        const height = camera.window.height;

        const deferredGbufferPassRTName = `dsDeferredPassColorCamera`;
        const deferredGbufferPassNormal = `deferredGbufferPassNormal`;
        const deferredGbufferPassEmissive = `deferredGbufferPassEmissive`;
        const deferredGbufferPassDSName = `dsDeferredPassDSCamera`;
        if (!ppl.containsResource(deferredGbufferPassRTName)) {
            const colFormat = Format.RGBA16F;
            ppl.addRenderTarget(deferredGbufferPassRTName, colFormat, width, height, ResourceResidency.MANAGED);
            ppl.addRenderTarget(deferredGbufferPassNormal, colFormat, width, height, ResourceResidency.MANAGED);
            ppl.addRenderTarget(deferredGbufferPassEmissive, colFormat, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(deferredGbufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        // gbuffer pass
        const gbufferPass = ppl.addRasterPass(width, height, 'Geometry', `CameraGbufferPass${cameraID}`);
        if (cameraInfo.mainLightShadowName) {
            assert(ppl.containsResource(cameraInfo.mainLightShadowName));
            const computeView = new ComputeView();
            gbufferPass.addComputeView(cameraInfo.mainLightShadowName, computeView);
        }
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
        const passColorView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            rtColor);
        const passNormalView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            new Color(0, 0, 0, 0));
        const passEmissiveView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            new Color(0, 0, 0, 0));
        const passDSView = new RasterView('_',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            new Color(camera.clearDepth, camera.clearStencil, 0, 0));
        gbufferPass.addRasterView(deferredGbufferPassRTName, passColorView);
        gbufferPass.addRasterView(deferredGbufferPassNormal, passNormalView);
        gbufferPass.addRasterView(deferredGbufferPassEmissive, passEmissiveView);
        gbufferPass.addRasterView(deferredGbufferPassDSName, passDSView);
        gbufferPass
            .addQueue(QueueHint.RENDER_OPAQUE)
            .addSceneOfCamera(camera, null, SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
        const deferredLightingPassRTName = `deferredLightingPassRTName`;
        const deferredLightingPassDS = `deferredLightingPassDS`;
        if (!ppl.containsResource(deferredLightingPassRTName)) {
            ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(deferredLightingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        // lighting pass
        const lightingPass = ppl.addRasterPass(width, height, 'Lighting', `CameraLightingPass${cameraID}`);
        if (ppl.containsResource(deferredGbufferPassRTName)) {
            const computeView = new ComputeView();
            computeView.name = 'gbuffer_albedoMap';
            lightingPass.addComputeView(deferredGbufferPassRTName, computeView);

            const computeNormalView = new ComputeView();
            computeNormalView.name = 'gbuffer_normalMap';
            lightingPass.addComputeView(deferredGbufferPassNormal, computeNormalView);

            const computeEmissiveView = new ComputeView();
            computeEmissiveView.name = 'gbuffer_emissiveMap';
            lightingPass.addComputeView(deferredGbufferPassEmissive, computeEmissiveView);

            const computeDepthView = new ComputeView();
            computeDepthView.name = 'depth_stencil';
            lightingPass.addComputeView(deferredGbufferPassDSName, computeDepthView);
        }
        const lightingClearColor = new Color(0, 0, 0, 0);
        if (camera.clearFlag & ClearFlagBit.COLOR) {
            lightingClearColor.x = camera.clearColor.x;
            lightingClearColor.y = camera.clearColor.y;
            lightingClearColor.z = camera.clearColor.z;
        }
        lightingClearColor.w = 0;
        const lightingPassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            lightingClearColor);
        lightingPass.addRasterView(deferredLightingPassRTName, lightingPassView);
        lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, _deferredData._deferredLightingMaterial,
            SceneFlags.VOLUMETRIC_LIGHTING,
        );
        lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, null, SceneFlags.TRANSPARENT_OBJECT);
        // Postprocess
        const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
        const postprocessPassDS = `postprocessPassDS${cameraID}`;
        if (!ppl.containsResource(postprocessPassRTName)) {
            ppl.addRenderTexture(postprocessPassRTName, Format.RGBA8, width, height, camera.window);
            ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        const postprocessPass = ppl.addRasterPass(width, height, 'Postprocess', `CameraPostprocessPass${cameraID}`);
        if (ppl.containsResource(deferredLightingPassRTName)) {
            const computeView = new ComputeView();
            computeView.name = 'outputResultMap';
            postprocessPass.addComputeView(deferredLightingPassRTName, computeView);
        }
        const postClearColor = new Color(0, 0, 0, camera.clearColor.w);
        if (camera.clearFlag & ClearFlagBit.COLOR) {
            postClearColor.x = camera.clearColor.x;
            postClearColor.y = camera.clearColor.y;
            postClearColor.z = camera.clearColor.z;
        }
        const postprocessPassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
            StoreOp.STORE,
            camera.clearFlag,
            postClearColor);
        const postprocessPassDSView = new RasterView('_',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
            StoreOp.STORE,
            camera.clearFlag,
            new Color(camera.clearDepth, camera.clearStencil, 0, 0));
        postprocessPass.addRasterView(postprocessPassRTName, postprocessPassView);
        postprocessPass.addRasterView(postprocessPassDS, postprocessPassDSView);
        postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(_deferredData._deferredPostMaterial, SceneFlags.NONE);
        postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, null, SceneFlags.UI);
    }
}
