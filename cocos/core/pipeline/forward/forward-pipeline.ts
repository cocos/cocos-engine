/**
 * @category pipeline
 */

import { ccclass, property } from '../../data/class-decorator';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { genSamplerHash, samplerLib } from '../../renderer';
import { IRenderObject, UBOGlobal, UBOShadow,
    UNIFORM_SHADOWMAP, globalDescriptorSetLayout, localDescriptorSetLayout} from '../define';
import { GFXBufferUsageBit, GFXMemoryUsageBit,
    GFXClearFlag, GFXFilter, GFXAddress, GFXCommandBufferType } from '../../gfx/define';
import { GFXColorAttachment, GFXDepthStencilAttachment, GFXRenderPass, GFXLoadOp, GFXTextureLayout } from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer';
import { legacyCC } from '../../global-exports';
import { RenderView } from '../render-view';
import { Mat4, Vec3, Vec2, Vec4 } from '../../math';
import { GFXFeature } from '../../gfx/device';
import { ShadowInfo } from '../../renderer/scene/shadowInfo';

const matShadowView = new Mat4();
const matShadowViewProj = new Mat4();

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {

    get isHDR () {
        return this._isHDR;
    }

    set isHDR (val) {
        if (this._isHDR === val) {
            return
        }

        this._isHDR = val;
        const defaultGlobalUBOData = this._globalUBO;
        defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
    }

    get shadingScale (): number {
        return this._shadingScale;
    }

    get fpScale (): number {
        return this._fpScale;
    }

    get shadowUBO (): Float32Array {
        return this._shadowUBO;
    }

    @property({
        type: [RenderTextureConfig],
    })
    protected renderTextures: RenderTextureConfig[] = [];
    @property({
        type: [MaterialConfig],
    })
    protected materials: MaterialConfig[] = [];

    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     * @readonly
     */
    public renderObjects: IRenderObject[] = [];
    public shadowObjects: IRenderObject[] = [];
    protected _isHDR: boolean = false;
    protected _shadingScale: number = 1.0;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _renderPasses = new Map<GFXClearFlag, GFXRenderPass>();
    protected _globalUBO = new Float32Array(UBOGlobal.COUNT);
    protected _shadowUBO = new Float32Array(UBOShadow.COUNT);

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        const shadowFlow = new ShadowFlow();
        shadowFlow.initialize(ShadowFlow.initInfo);
        this._flows.push(shadowFlow);

        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this._flows.push(forwardFlow);

        return true;
    }

    public activate (): boolean {
        this._globalDescriptorSetLayout = globalDescriptorSetLayout;
        this._localDescriptorSetLayout = localDescriptorSetLayout;

        const uiFlow = new UIFlow();
        uiFlow.initialize(UIFlow.initInfo);
        this._flows.push(uiFlow);

        if (!super.activate()) {
            return false;
        }

        if (!this._activeRenderer()) {
            console.error('ForwardPipeline startup failed!');
            return false;
        }

        return true;
    }

    public getRenderPass (clearFlags: GFXClearFlag): GFXRenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = this.device!;
        const colorAttachment = new GFXColorAttachment();
        const depthStencilAttachment = new GFXDepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;

        if (!(clearFlags & GFXClearFlag.COLOR)) {
            if (clearFlags & SKYBOX_FLAG) {
                colorAttachment.loadOp = GFXLoadOp.DISCARD;
            } else {
                colorAttachment.loadOp = GFXLoadOp.LOAD;
                colorAttachment.beginLayout = GFXTextureLayout.PRESENT_SRC;
            }
        }

        if ((clearFlags & GFXClearFlag.DEPTH_STENCIL) !== GFXClearFlag.DEPTH_STENCIL) {
            if (!(clearFlags & GFXClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = GFXLoadOp.LOAD;
            if (!(clearFlags & GFXClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = GFXLoadOp.LOAD;
            depthStencilAttachment.beginLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        }

        renderPass = device.createRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment,
        });
        this._renderPasses.set(clearFlags, renderPass!);

        return renderPass;
    }

    /**
     * @en Update all UBOs
     * @zh 更新全部 UBO。
     */
    public updateUBOs (view: RenderView) {
        this._updateUBO(view);
        const mainLight = view.camera.scene!.mainLight;
        const device = this.device;
        const shadowInfo = ShadowInfo.shadowInfoInstance;

        if (mainLight) {
            // light view
            Mat4.invert(matShadowView, mainLight!.node!.worldMatrix);

            // light proj
            const x = shadowInfo.shadowCameraOrthoSize * shadowInfo.shadowCameraAspect;
            const y = shadowInfo.shadowCameraOrthoSize;
            const projectionSignY = device.screenSpaceSignY * device.UVSpaceSignY;
            Mat4.ortho(matShadowViewProj, -x, x, -y, y, shadowInfo.shadowCameraNear, shadowInfo.shadowCameraFar,
                device.clipSpaceMinZ, projectionSignY);

            // light viewProj
            Mat4.multiply(matShadowViewProj, matShadowViewProj, matShadowView);

            Mat4.toArray(this._shadowUBO, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);
        }

        // update ubos
        this._descriptorSet.getBuffer(UBOGlobal.BLOCK.binding).update(this._globalUBO);
        this._descriptorSet.getBuffer(UBOShadow.BLOCK.binding).update(this._shadowUBO);
    }

    private _activeRenderer () {
        const device = this.device;

        this._commandBuffers.push(device.createCommandBuffer({
            type: GFXCommandBufferType.PRIMARY,
            queue: this._device.queue,
        }));

        const globalUBO = device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOGlobal.SIZE,
        });
        this._descriptorSet.bindBuffer(UBOGlobal.BLOCK.binding, globalUBO);

        const shadowUBO = device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOShadow.SIZE,
        });
        this._descriptorSet.bindBuffer(UBOShadow.BLOCK.binding, shadowUBO);

        const shadowMapSamplerHash = genSamplerHash([
            GFXFilter.LINEAR,
            GFXFilter.LINEAR,
            GFXFilter.NONE,
            GFXAddress.CLAMP,
            GFXAddress.CLAMP,
            GFXAddress.CLAMP,
        ]);
        const shadowMapSampler = samplerLib.getSampler(device, shadowMapSamplerHash);
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP.binding, shadowMapSampler);

        // update global defines when all states initialized.
        this.macros.CC_USE_HDR = this._isHDR;
        this.macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(GFXFeature.TEXTURE_FLOAT);

        return true;
    }

    private _updateUBO (view: RenderView) {
        this._descriptorSet.update();

        const root = legacyCC.director.root;

        const camera = view.camera;
        const scene = camera.scene!;

        const mainLight = scene.mainLight;
        const ambient = scene.ambient;
        const fog = scene.fog;
        const fv = this._globalUBO;
        const device = this.device;

        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);

        // update UBOGlobal
        fv[UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[UBOGlobal.TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

        fv[UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET];
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SIZE_OFFSET + 1];

        fv[UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * this.shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * this.shadingScale;
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET];
        fv[UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[UBOGlobal.SCREEN_SCALE_OFFSET + 1];

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        Mat4.toArray(fv, camera.matView, UBOGlobal.MAT_VIEW_OFFSET);
        Mat4.toArray(fv, camera.node.worldMatrix, UBOGlobal.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(fv, camera.matProj, UBOGlobal.MAT_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matProjInv, UBOGlobal.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(fv, camera.matViewProj, UBOGlobal.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(fv, camera.matViewProjInv, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(fv, camera.position, UBOGlobal.CAMERA_POS_OFFSET);
        let projectionSignY = device.screenSpaceSignY;
        if (view.window.hasOffScreenAttachments) {
            projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }
        fv[UBOGlobal.CAMERA_POS_OFFSET + 3] = projectionSignY;

        const exposure = camera.exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        fv[UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(fv, mainLight.direction, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(fv, mainLight.color, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (this._isHDR) {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
            } else {
                fv[UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec3.toArray(fv, Vec3.UNIT_Z, UBOGlobal.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(fv, Vec4.ZERO, UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.skyColor;
        if (this._isHDR) {
            skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        fv.set(skyColor, UBOGlobal.AMBIENT_SKY_OFFSET);
        fv.set(ambient.groundAlbedo, UBOGlobal.AMBIENT_GROUND_OFFSET);

        if (fog.enabled) {
            fv.set(fog.fogColor, UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);

            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
        }
    }

    private destroyUBOs () {
        this._descriptorSet.getBuffer(UBOGlobal.BLOCK.binding).destroy();
        this._descriptorSet.getBuffer(UBOShadow.BLOCK.binding).destroy();
    }

    public destroy () {
        this.destroyUBOs();

        this._descriptorSet.destroy();

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        return super.destroy();
    }
}
