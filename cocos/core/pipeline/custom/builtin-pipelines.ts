import { Material } from '../../assets';
import { intersect, Sphere } from '../../geometry';
import { ClearFlagBit, Color, Format, LoadOp, Rect, StoreOp, Viewport } from '../../gfx';
import { macro } from '../../platform';
import { Camera, CSMLevel, DirectionalLight, Light, LightType, ShadowType, SKYBOX_FLAG, SpotLight } from '../../renderer/scene';
import { supportsR32FloatTexture } from '../define';
import { SRGBToLinear } from '../pipeline-funcs';
import { AccessType, AttachmentType, ComputeView, LightInfo, QueueHint, RasterView, ResourceResidency, SceneFlags } from './types';
import { Pipeline, PipelineBuilder } from './pipeline';

export function getRenderArea (camera: Camera, width: number, height: number, light: Light | null = null, level = 0): Rect {
    const out = new Rect();
    const vp = camera.viewport;
    const w = width;
    const h = height;
    out.x = vp.x * w;
    out.y = vp.y * h;
    out.width = vp.width * w;
    out.height = vp.height * h;
    if (light) {
        switch (light.type) {
        case LightType.DIRECTIONAL: {
            const mainLight = light as DirectionalLight;
            if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1) {
                out.x = 0;
                out.y = 0;
                out.width = w;
                out.height = h;
            } else {
                out.x = level % 2 * 0.5 * w;
                out.y = (1 - Math.floor(level / 2)) * 0.5 * h;
                out.width = 0.5 * w;
                out.height = 0.5 * h;
            }
            break;
        }
        case LightType.SPOT: {
            out.x = 0;
            out.y = 0;
            out.width = w;
            out.height = h;
            break;
        }
        default:
        }
    }
    return out;
}

export function buildShadowPass (passName: Readonly<string>,
    ppl: Pipeline,
    camera: Camera, light: Light, level: number,
    width: Readonly<number>, height: Readonly<number>) {
    const device = ppl.device;
    const shadowMapName = passName;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(`${shadowMapName}Depth`, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    const pass = ppl.addRasterPass(width, height, 'default', passName);
    pass.addRasterView(shadowMapName, new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        ClearFlagBit.COLOR,
        new Color(1, 1, 1, camera.clearColor.w)));
    pass.addRasterView(`${shadowMapName}Depth`, new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        LoadOp.CLEAR, StoreOp.DISCARD,
        ClearFlagBit.DEPTH_STENCIL,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0)));
    const rect = getRenderArea(camera, width, height, light, level);
    pass.setViewport(new Viewport(rect.x, rect.y, rect.width, rect.height));
    const queue = pass.addQueue(QueueHint.RENDER_OPAQUE);
    queue.addSceneOfCamera(camera, new LightInfo(light, level),
        SceneFlags.SHADOW_CASTER);
}

class CameraInfo {
    shadowEnabled = false;
    mainLightShadowNames = new Array<string>();
    spotLightShadowNames = new Array<string>();
}

export function buildShadowPasses (cameraName: string, camera: Camera, ppl: Pipeline): CameraInfo {
    const pipeline = ppl;
    const shadowInfo = pipeline.pipelineSceneData.shadows;
    const validPunctualLights = ppl.pipelineSceneData.validPunctualLights;
    const cameraInfo = new CameraInfo();
    const shadows = ppl.pipelineSceneData.shadows;
    if (!shadowInfo.enabled || shadowInfo.type !== ShadowType.ShadowMap) { return cameraInfo; }
    cameraInfo.shadowEnabled = true;
    const _validLights: Light[] = [];
    let n = 0;
    let m = 0;
    for (;n < shadowInfo.maxReceived && m < validPunctualLights.length;) {
        const light = validPunctualLights[m];
        if (light.type === LightType.SPOT) {
            const spotLight = light as SpotLight;
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
        cameraInfo.mainLightShadowNames[0] = `MainLightShadow${cameraName}`;
        if (mainLight.shadowFixedArea) {
            buildShadowPass(cameraInfo.mainLightShadowNames[0], ppl,
                camera, mainLight, 0, mapWidth, mapHeight);
        } else {
            const csmLevel = pipeline.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
            for (let i = 0; i < csmLevel; i++) {
                cameraInfo.mainLightShadowNames[i] = `MainLightShadow${cameraName}`;
                buildShadowPass(cameraInfo.mainLightShadowNames[i], ppl,
                    camera, mainLight, i, mapWidth, mapHeight);
            }
        }
    }

    for (let l = 0; l < _validLights.length; l++) {
        const light = _validLights[l];
        const passName = `SpotLightShadow${l.toString()}${cameraName}`;
        cameraInfo.spotLightShadowNames[l] = passName;
        buildShadowPass(passName, ppl,
            camera, light, 0, mapWidth, mapHeight);
    }
    return cameraInfo;
}

const _cameras: Camera[] = [];

export function getCameraUniqueID (camera: Camera) {
    if (!_cameras.includes(camera)) {
        _cameras.push(camera);
    }
    return _cameras.indexOf(camera);
}

export function getLoadOpOfClearFlag (clearFlag: ClearFlagBit, attachment: AttachmentType): LoadOp {
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

export class ForwardPipelineBuilder extends PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            validPunctualLightsCulling(ppl, camera);
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
            for (const dirShadowName of cameraInfo.mainLightShadowNames) {
                if (ppl.containsResource(dirShadowName)) {
                    const computeView = new ComputeView();
                    forwardPass.addComputeView(dirShadowName, computeView);
                }
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
                .addSceneOfCamera(camera, new LightInfo(),
                    SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
                    | SceneFlags.PLANAR_SHADOW | SceneFlags.DEFAULT_LIGHTING);
            forwardPass
                .addQueue(QueueHint.RENDER_TRANSPARENT)
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.UI | SceneFlags.GEOMETRY | SceneFlags.PROFILER);
        }
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
        this._deferredLightingMaterial.initialize({
            effectName: 'pipeline/deferred-lighting',
            defines: { CC_RECEIVE_SHADOW: 1 },
        });
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

export function validPunctualLightsCulling (pipeline: Pipeline, camera: Camera) {
    const sceneData = pipeline.pipelineSceneData;
    const validPunctualLights = sceneData.validPunctualLights;
    validPunctualLights.length = 0;
    const _sphere = Sphere.create(0, 0, 0, 1);
    const { spotLights } = camera.scene!;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        if (light.baked) {
            continue;
        }

        Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { sphereLights } = camera.scene!;
    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        if (light.baked) {
            continue;
        }
        Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }
}

export class DeferredPipelineBuilder extends PipelineBuilder {
    public setup (cameras: Camera[], ppl: Pipeline): void {
        for (let i = 0; i < cameras.length; ++i) {
            const camera = cameras[i];
            if (!camera.scene) {
                continue;
            }
            validPunctualLightsCulling(ppl, camera);
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
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
            const deferredLightingPassRTName = `deferredLightingPassRTName`;
            const deferredLightingPassDS = `deferredLightingPassDS`;
            if (!ppl.containsResource(deferredLightingPassRTName)) {
                ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
                ppl.addDepthStencil(deferredLightingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            // lighting pass
            const lightingPass = ppl.addRasterPass(width, height, 'Lighting', `CameraLightingPass${cameraID}`);
            for (const dirShadowName of cameraInfo.mainLightShadowNames) {
                if (ppl.containsResource(dirShadowName)) {
                    const computeView = new ComputeView();
                    lightingPass.addComputeView(dirShadowName, computeView);
                }
            }
            for (const spotShadowName of cameraInfo.spotLightShadowNames) {
                if (ppl.containsResource(spotShadowName)) {
                    const computeView = new ComputeView();
                    lightingPass.addComputeView(spotShadowName, computeView);
                }
            }
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
                camera, this._deferredData._deferredLightingMaterial,
                SceneFlags.VOLUMETRIC_LIGHTING,
            );
            lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
                SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
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
            postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(this._deferredData._deferredPostMaterial, SceneFlags.NONE);
            postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
                SceneFlags.UI | SceneFlags.PROFILER);
        }
    }
    readonly _deferredData = new DeferredData();
}
