/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { ForwardFlow } from './forward-flow';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';
import { ShadowFlow } from '../shadow/shadow-flow';
import { IRenderObject, UBOGlobal, UBOShadow, UBOCamera, UNIFORM_SHADOWMAP_BINDING, UNIFORM_SPOT_LIGHTING_MAP_TEXTURE_BINDING } from '../define';
import { BufferUsageBit, MemoryUsageBit, ClearFlag, Filter, Address, StoreOp } from '../../gfx/define';
import { ColorAttachment, DepthStencilAttachment, RenderPass, LoadOp, TextureLayout,
    RenderPassInfo, BufferInfo, Feature, Framebuffer } from '../../gfx';
import { SKYBOX_FLAG } from '../../renderer/scene/camera';
import { legacyCC } from '../../global-exports';
import { Color, Mat4, Vec3, Vec4 } from '../../math';
import { Fog } from '../../renderer/scene/fog';
import { Ambient } from '../../renderer/scene/ambient';
import { Skybox } from '../../renderer/scene/skybox';
import { Shadows, ShadowType } from '../../renderer/scene/shadows';
import { getShadowWorldMatrix, updatePlanarPROJ } from './scene-culling';
import { Light } from '../../renderer/scene/light';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { builtinResMgr } from '../../builtin';
import { Texture2D } from '../../assets/texture-2d';
import { Camera } from '../../renderer/scene';
import { errorID } from '../../platform/debug';

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
    public shadowFrameBufferMap: Map<Light, Framebuffer> = new Map();
    protected _isHDR = false;
    protected _shadingScale = 1.0;
    protected _fpScale: number = 1.0 / 1024.0;
    protected _renderPasses = new Map<ClearFlag, RenderPass>();
    protected _globalUBO = new Float32Array(UBOGlobal.COUNT);
    protected _cameraUBO = new Float32Array(UBOCamera.COUNT);
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
        }

        return true;
    }

    public activate (): boolean {
        this._macros = {};

        if (!super.activate()) {
            return false;
        }

        if (!this._activeRenderer()) {
            errorID(2402);
            return false;
        }

        return true;
    }

    public render (cameras: Camera[]) {
        this._commandBuffers[0].begin();
        this.updateGlobalUBO();
        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.scene) {
                this.updateCameraUBO(camera);
                for (let j = 0; j < this._flows.length; j++) {
                    this._flows[j].render(camera);
                }
            }
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

    public updateCameraUBO (camera: Camera) {
        const device = this.device;
        const scene = camera.scene ? camera.scene : legacyCC.director.getScene().renderScene;
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

        Mat4.toArray(cv, camera.matView, UBOCamera.MAT_VIEW_OFFSET);
        Mat4.toArray(cv, camera.node.worldMatrix, UBOCamera.MAT_VIEW_INV_OFFSET);
        Mat4.toArray(cv, camera.matProj, UBOCamera.MAT_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matProjInv, UBOCamera.MAT_PROJ_INV_OFFSET);
        Mat4.toArray(cv, camera.matViewProj, UBOCamera.MAT_VIEW_PROJ_OFFSET);
        Mat4.toArray(cv, camera.matViewProjInv, UBOCamera.MAT_VIEW_PROJ_INV_OFFSET);
        Vec3.toArray(cv, camera.position, UBOCamera.CAMERA_POS_OFFSET);
        let projectionSignY = device.screenSpaceSignY;
        if (camera.window!.hasOffScreenAttachments) {
            projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }
        cv[UBOCamera.CAMERA_POS_OFFSET + 3] = projectionSignY;

        cv.set(fog.colorArray, UBOCamera.GLOBAL_FOG_COLOR_OFFSET);

        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
        cv[UBOCamera.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;

        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
        cv[UBOCamera.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;

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
