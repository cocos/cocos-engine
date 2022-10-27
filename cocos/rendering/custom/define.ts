import { ClearFlagBit, Color, Format, LoadOp, Rect, StoreOp, Viewport } from '../../gfx';
import { Camera, CSMLevel, DirectionalLight, Light, LightType, ShadowType, SKYBOX_FLAG, SpotLight } from '../../render-scene/scene';
import { intersect, Sphere } from '../../core/geometry';
import { supportsR32FloatTexture } from '../define';
import { Pipeline } from './pipeline';
import { AccessType, AttachmentType, ComputeView, LightInfo, QueueHint, RasterView, ResourceResidency, SceneFlags } from './types';
import { Vec4 } from '../../core/math';
import { Material } from '../../asset/assets';
import { macro } from '../../core/platform';
import { SRGBToLinear } from '../pipeline-funcs';

// Anti-aliasing type, other types will be gradually added in the future
export enum AntiAliasing {
    NONE,
    FXAA,
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
            loadOp = LoadOp.CLEAR;
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

export function getRenderArea (camera: Camera, width: number, height: number, light: Light | null = null, level = 0): Rect {
    const out = new Rect();
    const vp = camera ? camera.viewport : new Rect(0, 0, 1, 1);
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

export const MAX_BLOOM_FILTER_PASS_NUM = 6;
export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
class BloomData {
    declare bloomMaterial: Material;
    threshold = 0.1;
    iterations = 2;
    intensity = 0.8;
    private _updateBloomPass () {
        if (!this.bloomMaterial) return;

        const prefilterPass = this.bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        prefilterPass.beginChangeStatesSilently();
        prefilterPass.tryCompile();
        prefilterPass.endChangeStatesSilently();

        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            const downsamplePass = this.bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            downsamplePass.beginChangeStatesSilently();
            downsamplePass.tryCompile();
            downsamplePass.endChangeStatesSilently();

            const upsamplePass = this.bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            upsamplePass.beginChangeStatesSilently();
            upsamplePass.tryCompile();
            upsamplePass.endChangeStatesSilently();
        }

        const combinePass = this.bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init () {
        if (this.bloomMaterial) return;
        this.bloomMaterial = new Material();
        this.bloomMaterial._uuid = 'builtin-bloom-material';
        this.bloomMaterial.initialize({ effectName: 'pipeline/bloom' });
        for (let i = 0; i < this.bloomMaterial.passes.length; ++i) {
            this.bloomMaterial.passes[i].tryCompile();
        }
        this._updateBloomPass();
    }
    constructor () {
        this._init();
    }
}
let bloomData: BloomData | null = null;
export function buildBloomPass (camera: Camera,
    ppl: Pipeline,
    inputRT: string,
    threshold = 0.1,
    iterations = 2,
    intensity = 0.8) {
    if (!bloomData) {
        bloomData = new BloomData();
    }
    bloomData.threshold = threshold;
    bloomData.iterations = iterations;
    bloomData.intensity = intensity;
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    let width = camera.window.width;
    let height = camera.window.height;
    const area = getRenderArea(camera, width, height);
    width = area.width;
    height = area.height;
    // Start bloom
    const bloomClearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        bloomClearColor.x = camera.clearColor.x;
        bloomClearColor.y = camera.clearColor.y;
        bloomClearColor.z = camera.clearColor.z;
    }
    bloomClearColor.w = camera.clearColor.w;
    // ==== Bloom prefilter ===
    const bloomPassPrefilterRTName = `dsBloomPassPrefilterColor${cameraName}`;
    const bloomPassPrefilterDSName = `dsBloomPassPrefilterDS${cameraName}`;

    width >>= 1;
    height >>= 1;
    if (!ppl.containsResource(bloomPassPrefilterRTName)) {
        ppl.addRenderTarget(bloomPassPrefilterRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassPrefilterDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    const bloomPrefilterPass = ppl.addRasterPass(width, height, 'Bloom_Prefilter');
    bloomPrefilterPass.name = `CameraBloomPrefilterPass${cameraID}`;
    bloomPrefilterPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        const computeView = new ComputeView();
        computeView.name = 'outputResultMap';
        bloomPrefilterPass.addComputeView(inputRT, computeView);
    }
    const prefilterPassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        bloomClearColor);
    bloomPrefilterPass.addRasterView(bloomPassPrefilterRTName, prefilterPassView);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, bloomData.threshold, 0), 0);
    bloomPrefilterPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, bloomData.bloomMaterial, 0,
        SceneFlags.NONE,
    );
    // === Bloom downSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
        const bloomPassDownSampleDSName = `dsBloomPassDownSampleDS${cameraName}${i}`;
        width >>= 1;
        height >>= 1;
        if (!ppl.containsResource(bloomPassDownSampleRTName)) {
            ppl.addRenderTarget(bloomPassDownSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassDownSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        const bloomDownSamplePass = ppl.addRasterPass(width, height, `Bloom_Downsample${i}`);
        bloomDownSamplePass.name = `CameraBloomDownSamplePass${cameraID}${i}`;
        bloomDownSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        const computeView = new ComputeView();
        computeView.name = 'bloomTexture';
        if (i === 0) {
            bloomDownSamplePass.addComputeView(bloomPassPrefilterRTName, computeView);
        } else {
            bloomDownSamplePass.addComputeView(`dsBloomPassDownSampleColor${cameraName}${i - 1}`, computeView);
        }
        const downSamplePassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            bloomClearColor);
        bloomDownSamplePass.addRasterView(bloomPassDownSampleRTName, downSamplePassView);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
        bloomDownSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, bloomData.bloomMaterial, BLOOM_DOWNSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom upSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - 1 - i}`;
        const bloomPassUpSampleDSName = `dsBloomPassUpSampleDS${cameraName}${bloomData.iterations - 1 - i}`;
        width <<= 1;
        height <<= 1;
        if (!ppl.containsResource(bloomPassUpSampleRTName)) {
            ppl.addRenderTarget(bloomPassUpSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassUpSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        const bloomUpSamplePass = ppl.addRasterPass(width, height, `Bloom_Upsample${i}`);
        bloomUpSamplePass.name = `CameraBloomUpSamplePass${cameraID}${bloomData.iterations - 1 - i}`;
        bloomUpSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        const computeView = new ComputeView();
        computeView.name = 'bloomTexture';
        if (i === 0) {
            bloomUpSamplePass.addComputeView(`dsBloomPassDownSampleColor${cameraName}${bloomData.iterations - 1}`, computeView);
        } else {
            bloomUpSamplePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - i}`, computeView);
        }
        const upSamplePassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            bloomClearColor);
        bloomUpSamplePass.addRasterView(bloomPassUpSampleRTName, upSamplePassView);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
        bloomUpSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, bloomData.bloomMaterial, BLOOM_UPSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom Combine Pass ===
    const bloomPassCombineRTName = `dsBloomPassCombineColor${cameraName}`;
    const bloomPassCombineDSName = `dsBloomPassCombineDS${cameraName}`;

    width = area.width;
    height = area.height;
    if (!ppl.containsResource(bloomPassCombineRTName)) {
        ppl.addRenderTarget(bloomPassCombineRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassCombineDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    const bloomCombinePass = ppl.addRasterPass(width, height, 'Bloom_Combine');
    bloomCombinePass.name = `CameraBloomCombinePass${cameraID}`;
    bloomCombinePass.setViewport(new Viewport(area.x, area.y, width, height));
    const computeViewOut = new ComputeView();
    computeViewOut.name = 'outputResultMap';
    bloomCombinePass.addComputeView(inputRT, computeViewOut);
    const computeViewBt = new ComputeView();
    computeViewBt.name = 'bloomTexture';
    bloomCombinePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${0}`, computeViewBt);
    const combinePassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        bloomClearColor);
    bloomCombinePass.addRasterView(bloomPassCombineRTName, combinePassView);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, 0, bloomData.intensity), BLOOM_COMBINEPASS_INDEX);
    bloomCombinePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, bloomData.bloomMaterial, BLOOM_COMBINEPASS_INDEX,
        SceneFlags.NONE,
    );
    return { rtName: bloomPassCombineRTName, dsName: bloomPassCombineDSName };
}

class PostInfo {
    declare postMaterial: Material;
    antiAliasing: AntiAliasing = AntiAliasing.NONE;
    private _init () {
        this.postMaterial = new Material();
        this.postMaterial.name = 'builtin-post-process-material';
        if (macro.ENABLE_ANTIALIAS_FXAA) {
            this.antiAliasing = AntiAliasing.FXAA;
        }
        this.postMaterial.initialize({
            effectName: 'pipeline/post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this.antiAliasing,
            },
        });
        for (let i = 0; i < this.postMaterial.passes.length; ++i) {
            this.postMaterial.passes[i].tryCompile();
        }
    }
    constructor (antiAliasing: AntiAliasing = AntiAliasing.NONE) {
        this.antiAliasing = antiAliasing;
        this._init();
    }
}

let postInfo: PostInfo | null = null;

export function buildPostprocessPass (camera: Camera,
    ppl: Pipeline,
    inputTex: string,
    antiAliasing: AntiAliasing = AntiAliasing.NONE) {
    if (!postInfo || (postInfo && postInfo.antiAliasing !== antiAliasing)) {
        postInfo = new PostInfo(antiAliasing);
    }
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    if (!ppl.containsResource(postprocessPassRTName)) {
        ppl.addRenderTexture(postprocessPassRTName, Format.RGBA8, width, height, camera.window);
        ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(postprocessPassRTName, camera.window);
    const postprocessPass = ppl.addRasterPass(width, height, 'Postprocess');
    postprocessPass.name = `CameraPostprocessPass${cameraID}`;
    postprocessPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    if (ppl.containsResource(inputTex)) {
        const computeView = new ComputeView();
        computeView.name = 'outputResultMap';
        postprocessPass.addComputeView(inputTex, computeView);
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
    postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(
        postInfo.postMaterial, 0, SceneFlags.NONE,
    );
    postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
        SceneFlags.UI | SceneFlags.PROFILER);
    return { rtName: postprocessPassRTName, dsName: postprocessPassDS };
}

export function buildForwardPass (camera: Camera,
    ppl: Pipeline,
    isOffScreen: boolean) {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const forwardPassRTName = `dsForwardPassColor${cameraName}`;
    const forwardPassDSName = `dsForwardPassDS${cameraName}`;
    if (!ppl.containsResource(forwardPassRTName)) {
        if (!isOffScreen) {
            ppl.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
        } else {
            ppl.addRenderTarget(forwardPassRTName, Format.RGBA16F, width, height, ResourceResidency.MANAGED);
        }
        ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    if (!isOffScreen) {
        ppl.updateRenderWindow(forwardPassRTName, camera.window);
    }
    const forwardPass = ppl.addRasterPass(width, height, 'default');
    forwardPass.name = `CameraForwardPass${cameraID}`;
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));
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
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
    const passDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0));
    forwardPass.addRasterView(forwardPassRTName, passView);
    forwardPass.addRasterView(forwardPassDSName, passDSView);
    forwardPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(),
            SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
             | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING);
    let sceneFlags = SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY;
    if (!isOffScreen) {
        sceneFlags |= SceneFlags.UI | SceneFlags.PROFILER;
    }
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    return { rtName: forwardPassRTName, dsName: forwardPassDSName };
}

export function buildShadowPass (passName: Readonly<string>,
    ppl: Pipeline,
    camera: Camera, light: Light, level: number,
    width: Readonly<number>, height: Readonly<number>) {
    const area = getRenderArea(camera, width, height, light, level);
    width = area.width;
    height = area.height;
    const device = ppl.device;
    const shadowMapName = passName;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(`${shadowMapName}Depth`, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    const pass = ppl.addRasterPass(width, height, 'default');
    pass.name = passName;
    pass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
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
    validPunctualLightsCulling(ppl, camera);
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

export class GBufferInfo {
    color!: string;
    normal!: string;
    emissive!: string;
    ds!: string;
}
// deferred passes
export function buildGBufferPass (camera: Camera,
    ppl: Pipeline) {
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = `gBufferPassColorCamera`;
    const gBufferPassNormal = `gBufferPassNormal`;
    const gBufferPassEmissive = `gBufferPassEmissive`;
    const gBufferPassDSName = `gBufferPassDSCamera`;
    if (!ppl.containsResource(gBufferPassRTName)) {
        const colFormat = Format.RGBA16F;
        ppl.addRenderTarget(gBufferPassRTName, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassNormal, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassEmissive, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(gBufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    // gbuffer pass
    const gBufferPass = ppl.addRasterPass(width, height, 'Geometry');
    gBufferPass.name = `CameraGBufferPass${cameraID}`;
    gBufferPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
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
    gBufferPass.addRasterView(gBufferPassRTName, passColorView);
    gBufferPass.addRasterView(gBufferPassNormal, passNormalView);
    gBufferPass.addRasterView(gBufferPassEmissive, passEmissiveView);
    gBufferPass.addRasterView(gBufferPassDSName, passDSView);
    gBufferPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
    const gBufferInfo = new GBufferInfo();
    gBufferInfo.color = gBufferPassRTName;
    gBufferInfo.normal = gBufferPassNormal;
    gBufferInfo.emissive = gBufferPassEmissive;
    gBufferInfo.ds = gBufferPassDSName;
    return gBufferInfo;
}

class LightingInfo {
    declare deferredLightingMaterial: Material;
    private _init () {
        this.deferredLightingMaterial = new Material();
        this.deferredLightingMaterial.name = 'builtin-deferred-material';
        this.deferredLightingMaterial.initialize({
            effectName: 'pipeline/deferred-lighting',
            defines: { CC_RECEIVE_SHADOW: 1 },
        });
        for (let i = 0; i < this.deferredLightingMaterial.passes.length; ++i) {
            this.deferredLightingMaterial.passes[i].tryCompile();
        }
    }
    constructor () {
        this._init();
    }
}

let lightingInfo: LightingInfo | null = null;

// deferred lighting pass
export function buildLightingPass (camera: Camera, ppl: Pipeline, gBuffer: GBufferInfo) {
    if (!lightingInfo) {
        lightingInfo = new LightingInfo();
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const deferredLightingPassRTName = `deferredLightingPassRTName`;
    const deferredLightingPassDS = `deferredLightingPassDS`;
    if (!ppl.containsResource(deferredLightingPassRTName)) {
        ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(deferredLightingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    // lighting pass
    const lightingPass = ppl.addRasterPass(width, height, 'Lighting');
    lightingPass.name = `CameraLightingPass${cameraID}`;
    lightingPass.setViewport(new Viewport(area.x, area.y, width, height));
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
    if (ppl.containsResource(gBuffer.color)) {
        const computeView = new ComputeView();
        computeView.name = 'gbuffer_albedoMap';
        lightingPass.addComputeView(gBuffer.color, computeView);

        const computeNormalView = new ComputeView();
        computeNormalView.name = 'gbuffer_normalMap';
        lightingPass.addComputeView(gBuffer.normal, computeNormalView);

        const computeEmissiveView = new ComputeView();
        computeEmissiveView.name = 'gbuffer_emissiveMap';
        lightingPass.addComputeView(gBuffer.emissive, computeEmissiveView);

        const computeDepthView = new ComputeView();
        computeDepthView.name = 'depth_stencil';
        lightingPass.addComputeView(gBuffer.ds, computeDepthView);
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
        camera, lightingInfo.deferredLightingMaterial, 0,
        SceneFlags.VOLUMETRIC_LIGHTING,
    );
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
        SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
    return { rtName: deferredLightingPassRTName, dsName: deferredLightingPassDS };
}

export function buildNativeForwardPass (camera: Camera, ppl: Pipeline) {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    // Resources
    const forwardPassRTName = `dsForwardPassColor${cameraName}`;
    const forwardPassDSName = `dsForwardPassDS${cameraName}`;
    if (!ppl.containsResource(forwardPassRTName)) {
        ppl.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
        ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }

    // Passes
    const forwardPass = ppl.addRasterPass(width, height, 'default');
    forwardPass.name = `CameraForwardPass${cameraID}`;
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));

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
             | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING);
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY);
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.UI | SceneFlags.PROFILER);
    return { rtName: forwardPassRTName, dsName: forwardPassDSName };
}
