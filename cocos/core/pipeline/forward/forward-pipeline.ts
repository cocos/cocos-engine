/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { ForwardFlow } from './forward-flow';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { IRenderObject, UBOGlobal, UBOShadow } from '../define';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXClearFlag } from '../../gfx/define';
import { GFXColorAttachment, GFXDepthStencilAttachment, GFXRenderPass, GFXLoadOp, GFXTextureLayout, GFXRenderPassInfo, GFXBufferInfo, GFXFeature } from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { legacyCC } from '../../global-exports';
import { RenderView } from '../render-view';
import { Mat4, Vec3, Vec4} from '../../math';
import { Fog } from '../../renderer/scene/fog';
import { Ambient } from '../../renderer/scene/ambient';
import { Skybox } from '../../renderer/scene/skybox';
import { Shadows, ShadowType } from '../../renderer/scene/shadows';
import { sceneCulling, getShadowWorldMatrix } from './scene-culling';
import { UIFlow } from '../ui/ui-flow';

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

    /**
     * @en Get shadow UBO.
     * @zh 获取阴影UBO。
     */
    get shadowUBO (): Float32Array {
        return this._shadowUBO;
    }

    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    @type([MaterialConfig])
    @serializable
    @displayOrder(3)
    protected materials: MaterialConfig[] = [];

    public fog: Fog = new Fog();
    public ambient: Ambient = new Ambient();
    public skybox: Skybox = new Skybox();
    public shadows: Shadows = new Shadows();
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

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const forwardFlow = new ForwardFlow();
            forwardFlow.initialize(ForwardFlow.initInfo);
            this._flows.push(forwardFlow);

            const uiFlow = new UIFlow();
            uiFlow.initialize(UIFlow.initInfo);
            this._flows.push(uiFlow);
            uiFlow.activate(this);
        }

        return true;
    }

    public activate (): boolean {
        this._macros = {};

        if (!super.activate()) {
            return false;
        }

        if (!this._activeRenderer()) {
            console.error('ForwardPipeline startup failed!');
            return false;
        }

        return true;
    }

    public render (views: RenderView[]) {
        this._commandBuffers[0].begin();
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            sceneCulling(this, view);
            for (let j = 0; j < view.flows.length; j++) {
                view.flows[j].render(view);
            }
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
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

        const renderPassInfo = new GFXRenderPassInfo([colorAttachment], depthStencilAttachment);
        renderPass = device.createRenderPass(renderPassInfo);
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
        const shadowInfo = this.shadows;

        if (mainLight && shadowInfo.type === ShadowType.ShadowMap) {
            // light view
            let shadowCameraView: Mat4;

            // light proj
            let x: number = 0;
            let y: number = 0;
            let far: number = 0;
            if (shadowInfo.autoAdapt) {
                shadowCameraView = getShadowWorldMatrix(this, mainLight.node?.getWorldRotation()!, mainLight.direction);
                // if orthoSize is the smallest, auto calculate orthoSize.
                const radius = shadowInfo.sphere.radius;
                x = radius * shadowInfo.aspect;
                y = radius;

                far = Math.min(shadowInfo.receiveSphere.radius * 2.0 * Math.sqrt(2.0), 2000.0);
                if(radius >= 500) { shadowInfo.size.set(2048, 2048); }
                else if (radius < 500 && radius >= 100) { shadowInfo.size.set(1024, 1024); }
            } else {
                shadowCameraView = mainLight.node!.getWorldMatrix();

                x = shadowInfo.orthoSize * shadowInfo.aspect;
                y = shadowInfo.orthoSize;

                far = shadowInfo.far;
            }

            Mat4.invert(matShadowView, shadowCameraView!);

            const projectionSignY = device.screenSpaceSignY * device.UVSpaceSignY; // always offscreen
            Mat4.ortho(matShadowViewProj, -x, x, -y, y, shadowInfo.near, far,
                device.clipSpaceMinZ, projectionSignY);
            Mat4.multiply(matShadowViewProj, matShadowViewProj, matShadowView);
            Mat4.toArray(this._shadowUBO, matShadowViewProj, UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

            this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET]     = shadowInfo.size.x;
            this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 1] = shadowInfo.size.y;
            this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 2] = shadowInfo.pcf;
            this._shadowUBO[UBOShadow.SHADOW_INFO_OFFSET + 3] = shadowInfo.bias;
        }

        // update ubos
        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(UBOGlobal.BINDING), this._globalUBO);
        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(UBOShadow.BINDING), this._shadowUBO);
    }

    private _activeRenderer () {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const globalUBO = device.createBuffer(new GFXBufferInfo(
            GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            UBOGlobal.SIZE,
            UBOGlobal.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOGlobal.BINDING, globalUBO);

        const shadowUBO = device.createBuffer(new GFXBufferInfo(
            GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            UBOShadow.SIZE,
            UBOShadow.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOShadow.BINDING, shadowUBO);

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
        const ambient = this.ambient;
        const fog = this.fog;
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

        const skyColor = ambient.colorArray;
        if (this._isHDR) {
            skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        fv.set(skyColor, UBOGlobal.AMBIENT_SKY_OFFSET);
        fv.set(ambient.albedoArray, UBOGlobal.AMBIENT_GROUND_OFFSET);

        if (fog.enabled) {
            fv.set(fog.colorArray, UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);

            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
            fv[UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
            fv[UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
        }
    }

    private destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
        }
    }

    public destroy () {
        this.destroyUBOs();

        const rpIter = this._renderPasses.values();
        let rpRes = rpIter.next();
        while (!rpRes.done) {
            rpRes.value.destroy();
            rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;

        this.ambient.destroy();
        this.skybox.destroy();
        this.fog.destroy();
        this.shadows.destroy();

        return super.destroy();
    }
}
