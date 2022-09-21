import { Material } from '../../asset/assets';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp } from '../../gfx/base/define';
import { Camera } from '../../render-scene/scene';
import { Vec4 } from '../../core/math';
import { macro } from '../../core/platform/macro';
import { AntiAliasing, buildShadowPasses, getCameraUniqueID, getLoadOpOfClearFlag, validPunctualLightsCulling } from './define';
import { Pipeline, PipelineBuilder } from './pipeline';
import { AccessType, AttachmentType, ComputeView, LightInfo, QueueHint, RasterView, ResourceResidency, SceneFlags } from './types';

export const MAX_BLOOM_FILTER_PASS_NUM = 6;
export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export class CustomPipelineBuilder extends PipelineBuilder {
    protected declare _bloomMaterial: Material;
    protected declare _postMaterial: Material;
    private _threshold = 1.0;
    private _iterations = 2;
    private _intensity = 0.8;
    _antiAliasing: AntiAliasing = AntiAliasing.NONE;
    private _updateBloomPass () {
        if (!this._bloomMaterial) return;

        const prefilterPass = this._bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        prefilterPass.beginChangeStatesSilently();
        prefilterPass.tryCompile();
        prefilterPass.endChangeStatesSilently();

        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            const downsamplePass = this._bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            downsamplePass.beginChangeStatesSilently();
            downsamplePass.tryCompile();
            downsamplePass.endChangeStatesSilently();

            const upsamplePass = this._bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            upsamplePass.beginChangeStatesSilently();
            upsamplePass.tryCompile();
            upsamplePass.endChangeStatesSilently();
        }

        const combinePass = this._bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init () {
        if (this._bloomMaterial) return;
        this._bloomMaterial = new Material();
        this._bloomMaterial._uuid = 'builtin-bloom-material';
        this._bloomMaterial.initialize({ effectName: 'pipeline/bloom' });
        for (let i = 0; i < this._bloomMaterial.passes.length; ++i) {
            this._bloomMaterial.passes[i].tryCompile();
        }
        this._postMaterial = new Material();
        this._postMaterial.name = 'builtin-post-process-material';
        if (macro.ENABLE_ANTIALIAS_FXAA) {
            this._antiAliasing = AntiAliasing.FXAA;
        }
        this._postMaterial.initialize({
            effectName: 'pipeline/post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this._antiAliasing,
            },
        });
        for (let i = 0; i < this._postMaterial.passes.length; ++i) {
            this._postMaterial.passes[i].tryCompile();
        }
        this._updateBloomPass();
    }

    public setup (cameras: Camera[], ppl: Pipeline): void {
        this._init();
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene === null) {
                continue;
            }
            validPunctualLightsCulling(ppl, camera);
            const cameraID = getCameraUniqueID(camera);
            const cameraName = `Camera${cameraID}`;
            const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
            let width = camera.window.width;
            let height = camera.window.height;

            const forwardPassRTName = `dsForwardPassColor${cameraName}`;
            const forwardPassDSName = `dsForwardPassDS${cameraName}`;
            if (!ppl.containsResource(forwardPassRTName)) {
                ppl.addRenderTarget(forwardPassRTName, Format.RGBA16F, width, height, ResourceResidency.MANAGED);
                // ppl.addRenderTexture(forwardPassRTName, Format.RGBA8, width, height, camera.window);
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
                LoadOp.CLEAR,
                StoreOp.STORE,
                camera.clearFlag,
                new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, 0));
            const passDSView = new RasterView('_',
                AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                LoadOp.CLEAR,
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
                .addSceneOfCamera(camera, new LightInfo(), SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY);
            // Start bloom
            const bloomClearColor = new Color(0, 0, 0, 1);
            if (camera.clearFlag & ClearFlagBit.COLOR) {
                bloomClearColor.x = camera.clearColor.x;
                bloomClearColor.y = camera.clearColor.y;
                bloomClearColor.z = camera.clearColor.z;
            }
            bloomClearColor.w = 0;
            // ==== Bloom prefilter ===
            const bloomPassPrefilterRTName = `dsBloomPassPrefilterColor${cameraName}`;
            const bloomPassPrefilterDSName = `dsBloomPassPrefilterDS${cameraName}`;

            width >>= 1;
            height >>= 1;
            if (!ppl.containsResource(bloomPassPrefilterRTName)) {
                ppl.addRenderTarget(bloomPassPrefilterRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
                ppl.addDepthStencil(bloomPassPrefilterDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            const bloomPrefilterPass = ppl.addRasterPass(width, height, 'Bloom_Prefilter', `CameraBloomPrefilterPass${cameraID}`);
            if (ppl.containsResource(forwardPassRTName)) {
                const computeView = new ComputeView();
                computeView.name = 'outputResultMap';
                bloomPrefilterPass.addComputeView(forwardPassRTName, computeView);
            }
            const prefilterPassView = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                bloomClearColor);
            bloomPrefilterPass.addRasterView(bloomPassPrefilterRTName, prefilterPassView);
            this._bloomMaterial.setProperty('texSize', new Vec4(0, 0, this._threshold, 0), 0);
            bloomPrefilterPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
                camera, this._bloomMaterial, 0,
                SceneFlags.NONE,
            );
            // === Bloom downSampler ===
            for (let i = 0; i < this._iterations; ++i) {
                const texSize = new Vec4(width, height, 0, 0);
                const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
                const bloomPassDownSampleDSName = `dsBloomPassDownSampleDS${cameraName}${i}`;
                width >>= 1;
                height >>= 1;
                if (!ppl.containsResource(bloomPassDownSampleRTName)) {
                    ppl.addRenderTarget(bloomPassDownSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
                    ppl.addDepthStencil(bloomPassDownSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
                }
                const bloomDownSamplePass = ppl.addRasterPass(width, height, 'Bloom_Downsample', `CameraBloomDownSamplePass${cameraID}${i}`);
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
                this._bloomMaterial.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
                bloomDownSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
                    camera, this._bloomMaterial, BLOOM_DOWNSAMPLEPASS_INDEX + i,
                    SceneFlags.NONE,
                );
            }
            // === Bloom upSampler ===
            for (let i = 0; i < this._iterations; ++i) {
                const texSize = new Vec4(width, height, 0, 0);
                const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${i}`;
                const bloomPassUpSampleDSName = `dsBloomPassUpSampleDS${cameraName}${i}`;
                width <<= 1;
                height <<= 1;
                if (!ppl.containsResource(bloomPassUpSampleRTName)) {
                    ppl.addRenderTarget(bloomPassUpSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
                    ppl.addDepthStencil(bloomPassUpSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
                }
                const bloomUpSamplePass = ppl.addRasterPass(width, height, 'Bloom_Upsample', `CameraBloomUpSamplePass${cameraID}${i}`);
                const computeView = new ComputeView();
                computeView.name = 'bloomTexture';
                if (i === 0) {
                    bloomUpSamplePass.addComputeView(`dsBloomPassDownSampleColor${cameraName}${this._iterations - 1}`, computeView);
                } else {
                    bloomUpSamplePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${this._iterations - i}`, computeView);
                }
                const upSamplePassView = new RasterView('_',
                    AccessType.WRITE, AttachmentType.RENDER_TARGET,
                    LoadOp.CLEAR, StoreOp.STORE,
                    camera.clearFlag,
                    bloomClearColor);
                bloomUpSamplePass.addRasterView(bloomPassUpSampleRTName, upSamplePassView);
                this._bloomMaterial.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
                bloomUpSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
                    camera, this._bloomMaterial, BLOOM_UPSAMPLEPASS_INDEX + i,
                    SceneFlags.NONE,
                );
            }
            // === Bloom Combine Pass ===
            const bloomPassCombineRTName = `dsBloomPassCombineColor${cameraName}`;
            const bloomPassCombineDSName = `dsBloomPassCombineDS${cameraName}`;

            width = camera.window.width;
            height = camera.window.height;
            if (!ppl.containsResource(bloomPassCombineRTName)) {
                ppl.addRenderTarget(bloomPassCombineRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
                ppl.addDepthStencil(bloomPassCombineDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            const bloomCombinePass = ppl.addRasterPass(width, height, 'Bloom_Combine', `CameraBloomCombinePass${cameraID}`);
            const computeViewOut = new ComputeView();
            computeViewOut.name = 'outputResultMap';
            bloomCombinePass.addComputeView(forwardPassRTName, computeViewOut);
            const computeViewBt = new ComputeView();
            computeViewBt.name = 'bloomTexture';
            bloomCombinePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${0}`, computeViewBt);
            const combinePassView = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                LoadOp.CLEAR, StoreOp.STORE,
                camera.clearFlag,
                bloomClearColor);
            bloomCombinePass.addRasterView(bloomPassCombineRTName, combinePassView);
            this._bloomMaterial.setProperty('texSize', new Vec4(0, 0, 0, this._intensity), BLOOM_COMBINEPASS_INDEX);
            bloomCombinePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
                camera, this._bloomMaterial, BLOOM_COMBINEPASS_INDEX,
                SceneFlags.NONE,
            );
            // === Present Pass ===
            const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
            const postprocessPassDS = `postprocessPassDS${cameraID}`;
            if (!ppl.containsResource(postprocessPassRTName)) {
                ppl.addRenderTexture(postprocessPassRTName, Format.RGBA8, width, height, camera.window);
                ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
            }
            const postprocessPass = ppl.addRasterPass(width, height, 'Postprocess', `CameraPostprocessPass${cameraID}`);
            if (ppl.containsResource(bloomPassCombineRTName)) {
                const computeView = new ComputeView();
                computeView.name = 'outputResultMap';
                postprocessPass.addComputeView(bloomPassCombineRTName, computeView);
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
                this._postMaterial, 0, SceneFlags.NONE,
            );
            postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
                SceneFlags.UI | SceneFlags.PROFILER);
        }
    }
}
