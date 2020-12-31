/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { GbufferFlow } from './gbuffer-flow';
import { LightingFlow } from './lighting-flow';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import {
    BufferUsageBit,
    Format,
    MemoryUsageBit,
    ClearFlag, 
    StoreOp,
    Filter,
    Address} from '../../gfx/define';
import { IRenderObject, UBOGlobal, UBOCamera, UBOShadow, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { ColorAttachment, DepthStencilAttachment, RenderPass, LoadOp, TextureLayout, RenderPassInfo, 
         BufferInfo, Texture } from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { legacyCC } from '../../global-exports';
import { Color, Mat4, Vec3, Vec4} from '../../math';
import { Feature } from '../../gfx/define';
import { Fog } from '../../renderer/scene/fog';
import { Ambient } from '../../renderer/scene/ambient';
import { Skybox } from '../../renderer/scene/skybox';
import { Shadows, ShadowType } from '../../renderer/scene/shadows';
import { sceneCulling, getShadowWorldMatrix } from './scene-culling';
import { InputAssembler, InputAssemblerInfo, Attribute } from '../../gfx/input-assembler';
import { Buffer } from '../../gfx/buffer';
import { Camera } from '../../renderer/scene';
import { genSamplerHash, samplerLib } from 'cocos/core/renderer/core/sampler-lib';
import { builtinResMgr } from 'cocos/core/builtin';
import { Texture2D } from 'cocos/core/assets/texture-2d';
import { updatePlanarPROJ } from '../forward/scene-culling';
import { Layers } from '../../scene-graph/layers';

const matShadowView = new Mat4();
const matShadowViewProj = new Mat4();
const vec3_center = new Vec3();

const _samplerInfo = [
    Filter.LINEAR,
    Filter.LINEAR,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
];

/**
 * @en The deferred render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('DeferredPipeline')
export class DeferredPipeline extends RenderPipeline {

    /**
     * @en The list for render objects, only available after the scene culling of the current frame.
     * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
     * @readonly
     */
    public renderObjects: IRenderObject[] = [];
    protected _isHDR: boolean = false;
    protected _shadingScale: number = 1.0;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _renderPasses = new Map<ClearFlag, RenderPass>();
    protected _globalUBO = new Float32Array(UBOGlobal.COUNT);
    protected _cameraUBO = new Float32Array(UBOCamera.COUNT);
    protected _shadowUBO = new Float32Array(UBOShadow.COUNT);
    protected _quadVB: Buffer | null = null;
    protected _quadIB: Buffer | null = null;
    protected _quadIA: InputAssembler | null = null;
    protected _gbufferDepth: Texture|null = null;

    public fog: Fog = new Fog();
    public ambient: Ambient = new Ambient();
    public skybox: Skybox = new Skybox();

    @type([RenderTextureConfig])
    @serializable
    @displayOrder(2)
    protected renderTextures: RenderTextureConfig[] = [];

    @type([MaterialConfig])
    @serializable
    @displayOrder(3)
    protected materials: MaterialConfig[] = [];

    get isHDR () {
        return this._isHDR;
    }

    set isHDR (val) {
        if (this._isHDR === val) {
            return;
        }

        this._isHDR = val;
        const defaultGlobalUBOData = this._cameraUBO;
        defaultGlobalUBOData[UBOCamera.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
    }

    get shadingScale (): number {
        return this._shadingScale;
    }

    get fpScale (): number {
        return this._fpScale;
    }

    /**
     * @zh
     * 四边形输入汇集器。
     */
    public get quadIA (): InputAssembler {
        return this._quadIA!;
    }

    get gbufferDepth () {
        return this._gbufferDepth;
    }

    set gbufferDepth (val) {
        this._gbufferDepth = val;
    }

    /**
     * @en Get shadow UBO.
     * @zh 获取阴影UBO。
     */
    get shadowUBO (): Float32Array {
        return this._shadowUBO;
    }

    public initialize (info: IRenderPipelineInfo): boolean {
        super.initialize(info);

        if (this._flows.length === 0) {
            const shadowFlow = new ShadowFlow();
            shadowFlow.initialize(ShadowFlow.initInfo);
            this._flows.push(shadowFlow);

            const gbufferFlow = new GbufferFlow();
            gbufferFlow.initialize(GbufferFlow.initInfo);
            this._flows.push(gbufferFlow);

            const lightingFlow = new LightingFlow();
            lightingFlow.initialize(LightingFlow.initInfo);
            this._flows.push(lightingFlow);
        }

        return true;
    }

    public activate (): boolean {
        this._macros = {};

        if (!super.activate()) {
            return false;
        }

        if (!this._activeRenderer()) {
            console.error('DeferredPipeline startup failed!');
            return false;
        }

        return true;
    }

    public render (cameras: Camera[]) {
        this._commandBuffers[0].begin();
        this.updateGlobalUBO();
        for (let j = 0; j < this._flows.length; j++) {
            //for (let i = 0; i < cameras.length; i++) {
            //    const camera = cameras[i];
            //    this._flows[j].render(camera);
            //}
            this._flows[j].render(cameras[0]);
        }
        this._commandBuffers[0].end();
        this._device.queue.submit(this._commandBuffers);
    }

    public getRenderPass (clearFlags: ClearFlag): RenderPass {
        let renderPass = this._renderPasses.get(clearFlags);
        if (renderPass) { return renderPass; }

        const device = this.device;
        const colorAttachment = new ColorAttachment();
        const depthStencilAttachment = new DepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;
        depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
        depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;

        if (!(clearFlags & ClearFlag.COLOR)) {
            if (clearFlags & SKYBOX_FLAG) {
                colorAttachment.loadOp = LoadOp.DISCARD;
            } else {
                colorAttachment.loadOp = LoadOp.LOAD;
                colorAttachment.beginLayout = TextureLayout.PRESENT_SRC;
            }
        }

        if ((clearFlags & ClearFlag.DEPTH_STENCIL) !== ClearFlag.DEPTH_STENCIL) {
            if (!(clearFlags & ClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            if (!(clearFlags & ClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = LoadOp.LOAD;
            depthStencilAttachment.beginLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        }

        const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
        renderPass = device.createRenderPass(renderPassInfo);
        this._renderPasses.set(clearFlags, renderPass);

        return renderPass;
    }

    /**
     * @en Update all UBOs
     * @zh 更新全部 UBO。
     */
    public updateGlobalUBO () {
        this._descriptorSet.update();
        const root = legacyCC.director.root;
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
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / device.width;
        fv[UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / device.height;

        fv[UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(UBOGlobal.BINDING), this._globalUBO);
    }

    private _activeRenderer () {
        const device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        const globalUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOGlobal.SIZE,
            UBOGlobal.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOGlobal.BINDING, globalUBO);

        const cameraUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOCamera.SIZE,
            UBOCamera.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOCamera.BINDING, cameraUBO);

        const shadowUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            UBOShadow.SIZE,
            UBOShadow.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOShadow.BINDING, shadowUBO);

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        const shadowMapSampler = samplerLib.getSampler(device, shadowMapSamplerHash);
        this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.bindSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, shadowMapSampler);
        this._descriptorSet.bindTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING, builtinResMgr.get<Texture2D>('default-texture').getGFXTexture()!);
        this._descriptorSet.update();

        // update global defines when all states initialized.
        this.macros.CC_USE_HDR = this._isHDR;
        this.macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(Feature.TEXTURE_FLOAT);
            
        if (!this.createQuadInputAssembler()) {
            return false;
        }

        return true;
    }

    public updateShadowUBO (camera: Camera) {
        this._descriptorSet.update();
        const mainLight = camera.scene!.mainLight;
        const device = this.device;
        const shadowInfo = this.shadows;

        if (shadowInfo.enabled) {
            if (mainLight && shadowInfo.type === ShadowType.ShadowMap) {
                if (this.shadowFrameBufferMap.has(mainLight)) {
                    this._descriptorSet.bindTexture(UNIFORM_SHADOWMAP_BINDING, this.shadowFrameBufferMap.get(mainLight)!.colorTextures[0]!);
                }

                // light view
                let shadowCameraView: Mat4;

                // light proj
                let x = 0;
                let y = 0;
                let far = 0;
                if (shadowInfo.autoAdapt) {
                    shadowCameraView = getShadowWorldMatrix(this, mainLight.node!.getWorldRotation()!, mainLight.direction, vec3_center);
                    // if orthoSize is the smallest, auto calculate orthoSize.
                    const radius = shadowInfo.sphere.radius;
                    x = radius * shadowInfo.aspect;
                    y = radius;

                    const halfFar = Vec3.distance(shadowInfo.sphere.center, vec3_center);
                    far =  Math.min(halfFar * Shadows.COEFFICIENT_OF_EXPANSION, Shadows.MAX_FAR);
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
            } else if (mainLight && shadowInfo.type === ShadowType.Planar) {
                updatePlanarPROJ(shadowInfo, mainLight, this._shadowUBO);
            }

            Color.toArray(this._shadowUBO, shadowInfo.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
            this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(UBOShadow.BINDING), this._shadowUBO);
        }
    }

    public updateCameraUBO (camera: Camera, hasOffScreenAttachments: boolean = false) {
        const device = this.device;
        const scene = camera.scene!;
        const mainLight = scene.mainLight;
        const ambient = this.ambient;
        const fog = this.fog;
        const shadingWidth = Math.floor(device.width);
        const shadingHeight = Math.floor(device.height);
        // update camera ubo
        const cv = this._cameraUBO;
        const exposure = camera.exposure;

        cv[UBOCamera.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * this.shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * this.shadingScale;
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 2] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET];
        cv[UBOCamera.SCREEN_SCALE_OFFSET + 3] = 1.0 / cv[UBOCamera.SCREEN_SCALE_OFFSET + 1];

        cv[UBOCamera.EXPOSURE_OFFSET] = exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        cv[UBOCamera.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        cv[UBOCamera.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
            Vec3.toArray(cv, mainLight.direction, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec3.toArray(cv, mainLight.color, UBOCamera.MAIN_LIT_COLOR_OFFSET);
            if (mainLight.useColorTemperature) {
                const colorTempRGB = mainLight.colorTemperatureRGB;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
            }

            if (this._isHDR) {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
            } else {
                cv[UBOCamera.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
            }
        } else {
            Vec3.toArray(cv, Vec3.UNIT_Z, UBOCamera.MAIN_LIT_DIR_OFFSET);
            Vec4.toArray(cv, Vec4.ZERO, UBOCamera.MAIN_LIT_COLOR_OFFSET);
        }

        const skyColor = ambient.colorArray;
        if (this._isHDR) {
            skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
            skyColor[3] = ambient.skyIllum * exposure;
        }
        cv.set(skyColor, UBOCamera.AMBIENT_SKY_OFFSET);
        cv.set(ambient.albedoArray, UBOCamera.AMBIENT_GROUND_OFFSET);

        if (hasOffScreenAttachments) {
            Mat4.toArray(cv, camera.matProj_offscreen, UBOCamera.MAT_PROJ_OFFSET);
            Mat4.toArray(cv, camera.matProjInv_offscreen, UBOCamera.MAT_PROJ_INV_OFFSET);
            Mat4.toArray(cv, camera.matViewProj_offscreen, UBOCamera.MAT_VIEW_PROJ_OFFSET);
            Mat4.toArray(cv, camera.matViewProjInv_offscreen, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
            cv[UBOCamera.CAMERA_POS_OFFSET + 3] = this._device.screenSpaceSignY * this._device.UVSpaceSignY;
        } else {
            Mat4.toArray(cv, camera.matProj, UBOCamera.MAT_PROJ_OFFSET);
            Mat4.toArray(cv, camera.matProjInv, UBOCamera.MAT_PROJ_INV_OFFSET);
            Mat4.toArray(cv, camera.matViewProj, UBOCamera.MAT_VIEW_PROJ_OFFSET);
            Mat4.toArray(cv, camera.matViewProjInv, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
            cv[UBOCamera.CAMERA_POS_OFFSET + 3] = this._device.screenSpaceSignY;
        }

        Mat4.toArray(cv, camera.matView, UBOCamera.MAT_VIEW_OFFSET);
        Mat4.toArray(cv, camera.node.worldMatrix, UBOCamera.MAT_VIEW_INV_OFFSET);
        Vec3.toArray(cv, camera.position, UBOCamera.CAMERA_POS_OFFSET);

        if (fog.enabled) {
            cv.set(fog.colorArray, UBOCamera.GLOBAL_FOG_COLOR_OFFSET);

            cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
            cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
            cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

            cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
            cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
            cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
        }

        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(UBOCamera.BINDING), this._cameraUBO);
    }

    private destroyUBOs () {
        if (this._descriptorSet) {
            this._descriptorSet.getBuffer(UBOGlobal.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOShadow.BINDING).destroy();
            this._descriptorSet.getBuffer(UBOCamera.BINDING).destroy();
            this._descriptorSet.getSampler(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getSampler(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SHADOWMAP_BINDING).destroy();
            this._descriptorSet.getTexture(UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING).destroy();
        }
    }

    public destroy () {
        this.destroyUBOs();
        this.destroyQuadInputAssembler();

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

    /**
     * @zh
     * 创建四边形输入汇集器。
     */
    protected createQuadInputAssembler (): boolean {

        // create vertex buffer

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        this._quadVB = this._device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            vbSize,
            vbStride,
        ));

        if (!this._quadVB) {
            return false;
        }

        const verts = new Float32Array(4 * 4);
        let n = 0;
        verts[n++] = -1.0; verts[n++] = -1.0; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = 1.0; verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 1.0;
        verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 0.0;

        this._quadVB.update(verts);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this._quadIB = this._device.createBuffer(new BufferInfo( 
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            ibSize,
            ibStride,
        ));

        if (!this._quadIB) {
            return false;
        }

        const indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        this._quadIB.update(indices);

        // create input assembler

        const attributes = new Array<Attribute>(2);
        attributes[0] = new Attribute('a_position', Format.RG32F);
        attributes[1] = new Attribute('a_texCoord', Format.RG32F);

        this._quadIA = this._device.createInputAssembler(new InputAssemblerInfo(
            attributes,
            [this._quadVB],
            this._quadIB,
        ));

        return true;
    }

    /**
     * @zh
     * 销毁四边形输入汇集器。
     */
    protected destroyQuadInputAssembler () {
        if (this._quadVB) {
            this._quadVB.destroy();
            this._quadVB = null;
        }

        if (this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if (this._quadIA) {
            this._quadIA.destroy();
            this._quadIA = null;
        }
    }
}
