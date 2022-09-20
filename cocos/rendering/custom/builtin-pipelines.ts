import { Material } from '../../asset/assets';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp } from '../../gfx';
import { macro } from '../../core/platform';
import { Camera } from '../../render-scene/scene';
import { SRGBToLinear } from '../pipeline-funcs';
import { AccessType, AttachmentType, ComputeView, LightInfo, QueueHint, RasterView, ResourceResidency, SceneFlags } from './types';
import { Pipeline, PipelineBuilder } from './pipeline';
import { AntiAliasing, buildShadowPasses, getCameraUniqueID, getLoadOpOfClearFlag, validPunctualLightsCulling } from './define';

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
                camera, this._deferredData._deferredLightingMaterial, 0,
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
            postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(
                this._deferredData._deferredPostMaterial, 0, SceneFlags.NONE,
            );
            postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
                SceneFlags.UI | SceneFlags.PROFILER);
        }
    }
    readonly _deferredData = new DeferredData();
}
