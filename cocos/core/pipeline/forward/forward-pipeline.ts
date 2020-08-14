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
import { IRenderObject, UBOGlobal, UBOShadow, UBOPCFShadow,
    UNIFORM_SHADOWMAP, globalDescriptorSetLayout, localDescriptorSetLayout} from '../define';
import { GFXBufferUsageBit, GFXMemoryUsageBit,
    GFXClearFlag, GFXFilter, GFXAddress, GFXCommandBufferType } from '../../gfx/define';
import { GFXColorAttachment, GFXDepthStencilAttachment, GFXRenderPass, GFXLoadOp, GFXTextureLayout } from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer';
import { legacyCC } from '../../global-exports';
import { RenderView } from '../render-view';
import { Mat4, Vec3, Vec2, Quat, Vec4 } from '../../math';
import { GFXFeature } from '../../gfx/device';
import { SkyboxInfo } from '../../scene-graph/scene-globals';
import { Fog } from '../../renderer/scene/fog';
import { Ambient } from '../../renderer/scene/ambient';
import { Skybox } from '../../renderer/scene/skybox';
import { PlanarShadows } from '../../renderer/scene/planar-shadows';

const shadowCamera_W_P = new Vec3();
const shadowCamera_W_R = new Quat();
const shadowCamera_W_S = new Vec3();
const shadowCamera_W_T = new Mat4();

const shadowCamera_M_V = new Mat4();
const shadowCamera_M_P = new Mat4();
const shadowCamera_M_V_P = new Mat4();

// Define shadwoMapCamera
const shadowCamera_Near = 0.1;
const shadowCamera_Far = 1000.0;
const shadowCamera_Fov = 45.0;
const shadowCamera_Aspect = 1.0;
const shadowCamera_OrthoSize = 20.0;

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {

    public get isHDR () {
        return this._isHDR;
    }

    public set isHDR (val) {
        if (this._isHDR === val) {
            return
        }

        this._isHDR = val;
        const defaultGlobalUBOData = this._uboGlobal.view;
        defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
    }

    public get shadingScale (): number {
        return this._shadingScale;
    }

    public get fpScale (): number {
        return this._fpScale;
    }

    /**
     * @en Get shadow UBO.
     * @zh 获取阴影UBO。
     */
    public get shadowUBOBuffer () {
        return this._descriptorSet.getBuffer(UBOPCFShadow.BLOCK.binding)!;
    }

    /**
     * @en Get size of shadow map.
     * @zh 获取阴影贴图分辨率
     */
    public get shadowMapSize () {
        return this._shadowMapSize;
    }
    @property({
        type: [RenderTextureConfig],
        displayOrder: 2,
    })
    protected renderTextures: RenderTextureConfig[] = [];

    @property({
        type: [MaterialConfig],
        displayOrder: 3,
    })
    protected materials: MaterialConfig[] = [];

    /**
     * @en Get ambient.
     * @zh 获取环境光照
     */
    @property({
        type: Ambient,
        displayOrder: 4,
    })
    public get ambient () {
        return this._ambient;
    }

    public set ambient (val) {
        if (!val) return;
        this._ambient = val;
    }

    /**
     * @en Skybox related information
     * @zh 天空盒相关信息
     */
    @property({
        type: SkyboxInfo,
        displayOrder: 5,
    })
    get skyboxInfo () {
        return this._skyboxInfo;
    }
    set skyboxInfo (value) {
        this._skyboxInfo = value;
    }

    /**
     * @en Get skybox.
     * @zh 获取天空盒
     */
    public get skybox () {
        return this._skybox;
    }

    public set skybox (val) {
        if (!val) return;
        this._skybox = val;
    }

    /**
     * @en Get planar shadow.
     * @zh 获取平面阴影数据
     */
    @property({
        type: PlanarShadows,
        displayOrder: 6,
    })
    public get planarShadows () {
        return this._planarShadows;
    }

    public set planarShadows (val) {
        if (!val) return;
        this._planarShadows = val;
    }

    /**
     * @en Get fog.
     * @zh 获取全局雾
     */
    @property({
        type: Fog,
        displayOrder: 7,
    })
    public get fog () {
        return this._fog;
    }

    public set fog (val) {
        if (!val) return;
        this._fog = val;
    }

    @property
    protected _fog: Fog = new Fog();
    @property
    protected _ambient: Ambient = new Ambient();
    protected _skybox: Skybox = new Skybox();
    @property
    protected _skyboxInfo: SkyboxInfo = new SkyboxInfo();
    @property
    protected _planarShadows: PlanarShadows = new PlanarShadows();
    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     * @readonly
     */
    public renderObjects: IRenderObject[] = [];
    public shadowObjects: IRenderObject[] = [];
    protected _uboGlobal: UBOGlobal = new UBOGlobal();
    protected _isHDR: boolean = false;
    protected _shadingScale: number = 1.0;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _renderPasses = new Map<GFXClearFlag, GFXRenderPass>();
    protected _uboPCFShadow: UBOPCFShadow = new UBOPCFShadow();
    protected _shadowMapSize: Vec2 = new Vec2(512, 512);

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

        this._skybox.activate();
        this._planarShadows.activate();

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

        if (mainLight) {
            shadowCamera_W_P.set(mainLight!.node!.getWorldPosition());
            shadowCamera_W_R.set(mainLight!.node!.getWorldRotation());
            shadowCamera_W_S.set(mainLight!.node!.getWorldScale());

            // world Transfrom
            Mat4.fromRTS(shadowCamera_W_T, shadowCamera_W_R, shadowCamera_W_P, shadowCamera_W_S);

            // camera view
            Mat4.invert(shadowCamera_M_V, shadowCamera_W_T);

            // camera proj
            // Mat4.perspective(shadowCamera_M_P, shadowCamera_Fov, shadowCamera_Aspect, shadowCamera_Near, shadowCamera_Far);
            const x = shadowCamera_OrthoSize * shadowCamera_Aspect;
            const y = shadowCamera_OrthoSize;
            Mat4.ortho(shadowCamera_M_P, -x, x, -y, y, shadowCamera_Near, shadowCamera_Far,
                 device.clipSpaceMinZ, device.screenSpaceSignY);

            // camera viewProj
            Mat4.multiply(shadowCamera_M_V_P, shadowCamera_M_P, shadowCamera_M_V);

            Mat4.toArray(this._uboGlobal.view, shadowCamera_M_V_P, UBOGlobal.MAIN_SHADOW_MATRIX_OFFSET);
        }

        // update ubos
        this._descriptorSet.getBuffer(UBOGlobal.BLOCK.binding).update(this._uboGlobal.view);

        // Fill Shadow UBO
        // Fill cc_shadowMatViewProj
        Mat4.toArray(this._uboPCFShadow.view, shadowCamera_M_V_P, UBOPCFShadow.MAT_SHADOW_VIEW_PROJ_OFFSET);
        this._descriptorSet.getBuffer(UBOPCFShadow.BLOCK.binding).update(this._uboPCFShadow.view);
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

        const shadowPCFUBO = device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBOPCFShadow.SIZE,
        });
        this._descriptorSet.bindBuffer(UBOPCFShadow.BLOCK.binding, shadowPCFUBO);

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
        const ambient = this._ambient!;
        const fog = this._fog!;
        const uboGlobal = this._uboGlobal;
        const fv = uboGlobal.view;
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
            this._descriptorSet.getBuffer(UBOGlobal.BLOCK.binding).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BLOCK.binding).destroy();
            this._descriptorSet.getBuffer(UBOPCFShadow.BLOCK.binding).destroy();
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

        return super.destroy();
    }
}
